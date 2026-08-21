import '@wangeditor/editor/dist/css/style.css';
import {
  IDomEditor,
  IEditorConfig,
  IToolbarConfig,
  Boot,
} from '@wangeditor/editor';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import EditorComponent from '@wangeditor/editor-for-react/dist/components/Editor';
import uploadAttachmentModule from '@wangeditor/plugin-upload-attachment';
import classNames from 'classnames';
import { useState, useEffect, CSSProperties, useRef } from 'react';

import { baseUrl } from '@/api/request';
import { modal } from '@/store/module/notification';
import { getToken } from '@/utils/cookie';

import styles from './index.module.less';
import { decodeHTML } from '../utils';

const fileType = [
  '.png',
  '.PNG',
  '.jpg',
  '.JPG',
  '.JPEG',
  '.jpeg',
  '.xls',
  '.xlsx',
  '.XLS',
  '.XLSX',
  '.doc',
  '.DOC',
  '.docx',
  '.DOCX',
  '.pdf',
  '.PDF',
  '.rar',
  '.RAR',
  '.zip',
  '.ZIP',
];

// 注册扩展菜单
Boot.registerModule(uploadAttachmentModule);

type WEditorProps = typeof EditorComponent extends (arg: infer P) => any
  ? P
  : any;

export type EditorProps = {
  onChange?: (value?: string) => void;
  wrapperClass?: string;
  readOnly?: boolean;
  wrapperStyle?: CSSProperties;
} & WEditorProps;

const getSafeHtml = (html?: string) => {
  return html && html.trim() !== '' ? decodeHTML(html) : '<p><br/></p>';
};

export function MyEditor({
  onChange,
  wrapperClass,
  className,
  readOnly,
  wrapperStyle,
  defaultHtml,
  ...props
}: EditorProps) {
  /** 编辑器的实利 */
  const [editor, setEditor] = useState<IDomEditor | null>(null);
  /** 编辑器的内容 */
  const [html, setHtml] = useState('<p><br/></p>');

  const isFirstRender = useRef(true);

  const defaultContent = useRef('');

  /** 工具栏的配置 */
  const toolbarConfig: Partial<IToolbarConfig> = {
    excludeKeys: [
      'insertVideo',
      'insertImage',
      'codeBlock',
      'emotion',
      'editVideoSize',
      'insertLink',
      'editLink',
      'todo',
    ],
    insertKeys: {
      index: 20, // 20是示例，表示插入到第20个位置，可根据实际调整
      keys: ['uploadAttachment'],
    },
  };
  // 图片和视频上传配置（不需要token）
  const uploadImageConfig = {
    server: `${baseUrl}/file/fileapi/upload/randomPath`,
    maxNumberOfFiles: 999,
    allowedFileTypes: [],
    fieldName: 'file',
    headers: {
      authorization: getToken() || '',
    },
  };

  // 附件上传配置（需要token）
  const uploadConfigWithToken = {
    server: `${baseUrl}/file/fileapi/token/upload/randomName`,
    maxNumberOfFiles: 999,
    allowedFileTypes: [],
    fieldName: 'file',
    headers: {
      authorization: getToken() || '',
    },
  };

  /** 编辑器配置 */
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: '请输入...',
    MENU_CONF: {
      uploadImage: {
        ...uploadImageConfig,
        maxFileSize: 10 * 1024 * 1024,
        allowedFileTypes: [
          '.jpg',
          '.JPG',
          '.jpeg',
          '.JPEG',
          '.png',
          '.PNG',
          '.gif',
          '.GIF',
        ],
        // 上传之前触发
        onBeforeUpload(file: File) {
          // TS 语法
          // onBeforeUpload(file) {    // JS 语法
          // file 选中的文件，格式如 { key: file }
          return file;

          // 可以 return
          // 1. return file 或者 new 一个 file ，接下来将上传
          // 2. return false ，不上传这个 file
        },

        // 上传进度的回调函数
        onProgress(progress: number) {
          // TS 语法
          // onProgress(progress) {       // JS 语法
          // progress 是 0-100 的数字
          console.log('progress', progress);
        },

        // 单个文件上传成功之后
        onSuccess(file: File, res: any) {
          // TS 语法
          // onSuccess(file, res) {          // JS 语法
          console.log(`${file.name} 上传成功`, res);
        },

        // 单个文件上传失败
        onFailed(file: File, res: any) {
          // TS 语法
          // onFailed(file, res) {           // JS 语法
          console.log(`${file.name} 上传失败`, res);
        },

        // 上传错误，或者触发 timeout 超时
        onError(file: File, err: any) {
          modal.warning({
            title: '提示',
            content: `${file.name} 上传失败，${err}`,
          });
        },
        // 单个文件上传成功之后
        customInsert(
          res: {
            data: {
              fileName: string;
              url: string;
              fileId: string;
            };
          },
          insertFn: any,
        ) {
          const { url, fileName } = res.data;
          insertFn(url, fileName);
        },
      },
      uploadVideo: {
        ...uploadImageConfig,
        maxFileSize: 100 * 1024 * 1024, // 100M
        allowedFileTypes: ['.mp4', '.mov'],
        onError(file: File, err: any) {
          modal.warning({
            title: '提示',
            content: `${file.name} 上传失败，${err}`,
          });
        },
        customInsert(
          res: {
            data: {
              fileName: string;
              url: string;
            };
          },
          insertFn: any,
        ) {
          const { data } = res;
          insertFn(data.url, '');
        },
      },
      uploadAttachment: {
        // timeout: 5 * 1000, // 5s
        maxFileSize: 100 * 1024 * 1024, // 100M
        metaWithUrl: true, // meta 拼接到 url 上
        ...uploadConfigWithToken, // 服务端地址
        allowedFileTypes: fileType,
        customInsert(
          res: { data: { url: string } },
          file: File,
          insertFn: (arg0: string, arg1: string) => void,
        ) {
          const url: string = res.data?.url || '';
          if (!url) throw new Error(`url is empty`);
          // 插入附件到编辑器
          insertFn(`customInsert-${file.name}`, url);
        },
      },
    },
  };

  useEffect(() => {
    if (!editor) return;
    if (readOnly) {
      editor.disable();
    } else {
      editor.enable();
    }
  }, [editor, readOnly]);

  useEffect(() => {
    const safeHtml = getSafeHtml(defaultHtml);

    if (safeHtml === defaultContent.current) return;
    defaultContent.current = safeHtml;
    if (isFirstRender.current && editor) {
      editor.clear();
      editor.dangerouslyInsertHtml(safeHtml);
      setHtml(safeHtml);
    } else {
      setHtml(safeHtml);
    }
    isFirstRender.current = false;
  }, [defaultHtml, editor]);

  // 及时销毁 editor ，重要！
  useEffect(() => {
    return () => {
      if (editor == null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

  return (
    <div
      className={classNames(styles.wrapper, wrapperClass)}
      style={{ ...wrapperStyle }}
      aria-label='wang-editor'
    >
      {!readOnly && (
        <Toolbar
          editor={editor}
          defaultConfig={toolbarConfig}
          mode='default'
          style={{ borderBottom: '1px solid #ccc' }}
        />
      )}
      <Editor
        defaultConfig={editorConfig}
        className={classNames(styles.editor, className)}
        onCreated={setEditor}
        onChange={editorBack => {
          const html = editorBack.getHtml();
          if (html === defaultContent.current) return;
          const isEmpty = editorBack.isEmpty();
          setHtml(html);
          onChange?.(isEmpty ? '' : html);
        }}
        mode='default'
        {...{ ...props, value: html }}
      />
    </div>
  );
}

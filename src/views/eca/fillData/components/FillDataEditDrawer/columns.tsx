import { QuestionCircleOutlined } from '@ant-design/icons';
import { ProColumns } from '@ant-design/pro-components';
import { Tooltip } from 'antd';
import { compact } from 'lodash-es';

import { UploadFile } from '@/api/type';
import { TableActions } from '@/components/Table/TableActions';
import I18N from '@/lang/I18N';
import { checkAuth } from '@/layout/utills';
import { modal } from '@/store/module/notification';
import { ActionTypeEnum } from '@/utils/actionType';
import { safeParseJson } from '@/views/eca/util/transJson';

import style from './index.module.less';
import { ComputationTemplateResp } from '../../type';

/**
 * 生成数据填报表格列配置
 * @param columns 基础列配置
 * @param isDetail 是否为详情模式
 * @param handelActionType 操作处理函数
 * @param form 表单实例
 * @param editableKeys 正在编辑的行keys
 * @returns 完整的列配置
 */
export const generateFillDataTableColumns = (
  columns: ProColumns<ComputationTemplateResp>[],
  isDetail: boolean,
  handelActionType: (
    type: ActionTypeEnum,
    record: ComputationTemplateResp,
  ) => void,
  form?: any,
  editableKeys?: React.Key[],
): ProColumns<any, 'text'>[] => {
  return compact([
    ...columns,
    columns.length > 0 && {
      title: (
        <div>
          附件{' '}
          <Tooltip title='每行数据最多支持上传5个附件，格式支持pdf、doc、docx、xls、xlsx、png、jpg、jpeg、zip、rar，每个文件不超过50M。'>
            <QuestionCircleOutlined />
          </Tooltip>
        </div>
      ),
      fixed: 'right',
      dataIndex: 'attachmentUrl',
      // 不可编辑
      editable: false,
      width: 200,
      renderText: (_, record) => {
        let attachmentUrl = record?.attachmentUrl;

        // 如果当前行在编辑态，尝试从表单中获取最新的 attachmentUrl
        const isEditing = editableKeys?.includes(record.id);
        if (isEditing && form) {
          const formValue = form.getFieldValue([record.id, 'attachmentUrl']);
          if (formValue) {
            attachmentUrl = formValue;
          }
        }

        const fileList = (safeParseJson(attachmentUrl) as UploadFile[]) || [];

        if (fileList.length === 0) {
          return <div>-</div>;
        }

        return (
          <div>
            {fileList.map(item => (
              <div key={item.name} className={style.fileItem}>
                <a
                  className={style.fileHref}
                  href={item.url}
                  target='_blank'
                  rel='noreferrer'
                >
                  <span className={style.name}>{item.name}</span>
                </a>
              </div>
            ))}
          </div>
        );
      },
    },
    !isDetail &&
      columns.length > 0 && {
        title: I18N.Factors.operation,
        width: 200,
        valueType: 'option',
        fixed: 'right',
        renderText: (_, record: ComputationTemplateResp) => {
          return (
            <TableActions
              menus={compact([
                checkAuth('/fillData/edit/edit', {
                  label: I18N.Factors.edit,
                  key: I18N.Factors.edit,
                  onClick: async () => {
                    handelActionType(ActionTypeEnum.EDIT, record);
                  },
                }),
                checkAuth('/fillData/edit/del', {
                  label: I18N.Factors.delete,
                  key: I18N.Factors.delete,
                  onClick: async () => {
                    modal.confirm({
                      title: I18N.Factors.prompt,
                      content: I18N.dashborad.pleaseConfirmIfItIs2,
                      onOk: async () => {
                        if (!record?.id) return;
                        handelActionType(ActionTypeEnum.DELETE, record);
                      },
                    });
                  },
                }),
                checkAuth('/fillData/edit/edit', {
                  label: '上传附件',
                  key: '上传附件',
                  onClick: async () => {
                    handelActionType(ActionTypeEnum.UPLOAD, record);
                  },
                }),
              ])}
            />
          );
        },
      },
  ]);
};

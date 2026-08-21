/**
 * @description 问题清单
 */
import { PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  EditableProTable,
  ProColumns,
} from '@ant-design/pro-components';
import { Button, Form, Image, Space, Upload } from 'antd';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { compact } from 'lodash-es';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { baseUrl } from '@/api/request';
import { FormActions } from '@/components/FormActions';
import { Page } from '@/components/Page';
import { usePageInfo } from '@/hooks';
import { CarbonVerifyRouteMaps } from '@/router/utils/carbonVerifyEnum';
import { Toast } from '@/utils';
import { UPLOAD_FILES_RANDOM_NAME_URL } from '@/utils/const';
import { getToken } from '@/utils/cookie';
import { commonRequestDownloadFile } from '@/utils/downBlobFile';

import {
  exportIssueTrackingApi,
  getIssueTrackingContentApi,
  getIssueTrackingDetailApi,
  importIssueTrackingExcelApi,
  saveIssueTrackingContentApi,
} from './service';
import {
  FlatTableRow,
  ImageItem,
  IssueTrackingDetail,
  TableContent,
} from './type';

/** 图片上传单元格（编辑模式），用本地 fileList state 维护上传进度 */
const ImageUploadCell: FC<{
  images: ImageItem[];
  onImagesChange: (images: ImageItem[]) => void;
}> = ({ images, onImagesChange }) => {
  const [fileList, setFileList] = useState<UploadFile[]>(() =>
    images.map(img => ({
      uid: img.uid || img.name,
      name: img.name,
      url: img.url,
      status: 'done' as const,
    })),
  );

  const handleChange: UploadProps['onChange'] = ({
    fileList: newList,
    file,
  }) => {
    const updatedList = newList.map(f => {
      if (f.status === 'done' && f.response?.code === 200) {
        const realUrl = f.response.data?.url || '';
        return { ...f, url: realUrl, thumbUrl: realUrl };
      }
      return f;
    });
    setFileList(updatedList);

    if (file.status === 'done' || file.status === 'removed') {
      const newImages: ImageItem[] = updatedList
        .filter(f => f.status === 'done')
        .map(f => ({
          name: f.response?.data?.fileName || f.name,
          uid: f.uid,
          url: f.url || '',
        }));
      onImagesChange(newImages);
    }
  };

  const handlePreview: UploadProps['onPreview'] = file => {
    const url = file.url || file.response?.data?.url;
    if (url) window.open(url, '_blank');
  };

  return (
    <Upload
      listType='picture-card'
      fileList={fileList}
      action={`${baseUrl}${UPLOAD_FILES_RANDOM_NAME_URL}`}
      headers={{ Authorization: getToken() }}
      accept='.png,.jpg,.jpeg,.PNG,.JPG,.JPEG'
      onChange={handleChange}
      onPreview={handlePreview}
    >
      <PlusOutlined />
    </Upload>
  );
};

/** 将接口返回的行数据扁平化，供 EditableProTable 使用 */
const flattenRows = (content: TableContent): FlatTableRow[] => {
  const { headers, rows } = content;
  const textHeaders = headers.slice(0, -1);
  return rows.map((row, rowIdx) => {
    const flat: FlatTableRow = {
      id: `row_${rowIdx}_${Date.now()}`,
      images: row.images || [],
    };
    textHeaders.forEach((_, colIdx) => {
      flat[`cell_${colIdx}`] = row.cells[colIdx] ?? '';
    });
    return flat;
  });
};

/** 将扁平化的表格数据还原为接口需要的格式 */
const unflattenRows = (
  dataSource: FlatTableRow[],
  headerCount: number,
): TableContent['rows'] => {
  return dataSource.map(row => {
    const cells: string[] = [];
    for (let i = 0; i < headerCount; i++) {
      cells.push(row[`cell_${i}`] ?? '');
    }
    return { cells, images: row.images || [] };
  });
};

const VerificationProblemInfo: FC = () => {
  const navigate = useNavigate();
  const { id: paramId } = useParams<{ id: string }>();
  const { isDetail } = usePageInfo();

  const recordId = Number(paramId) || 0;

  const [form] = Form.useForm();
  const actionRef = useRef<ActionType>();

  const [detailInfo, setDetailInfo] = useState<IssueTrackingDetail>();
  const [headers, setHeaders] = useState<string[]>([]);
  const [dataSource, setDataSource] = useState<FlatTableRow[]>([]);
  const [editableKeys, setEditableKeys] = useState<React.Key[]>([]);
  const [exportLoading, setExportLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const fetchDetail = useCallback(async () => {
    if (!recordId) return;
    const { data } = await getIssueTrackingDetailApi(recordId);
    setDetailInfo(data?.data);
  }, [recordId]);

  const fetchContent = useCallback(async () => {
    if (!recordId) return;
    const { data } = await getIssueTrackingContentApi(recordId);
    const content = data?.data;
    if (content) {
      setHeaders(content.headers || []);
      setDataSource(flattenRows(content));
    }
  }, [recordId]);

  useEffect(() => {
    fetchDetail();
    fetchContent();
  }, [fetchDetail, fetchContent]);

  /** 文本列数量（headers 去掉最后一个图片列） */
  const textHeaderCount = useMemo(
    () => (headers.length > 0 ? headers.length - 1 : 0),
    [headers],
  );

  /** 保存整个表格 */
  const handleSaveAll = useCallback(
    async (currentDataSource: FlatTableRow[]) => {
      if (!recordId) return;
      setSaveLoading(true);
      try {
        await saveIssueTrackingContentApi({
          id: recordId,
          content: {
            headers,
            rows: unflattenRows(currentDataSource, textHeaderCount),
          },
        });
        Toast('success', '操作成功');
        await fetchContent();
      } finally {
        setSaveLoading(false);
      }
    },
    [recordId, headers, textHeaderCount, fetchContent],
  );

  /** 删除行 */
  const handleDelete = async (rowKey: React.Key) => {
    const newData = dataSource.filter(item => item.id !== rowKey);
    setDataSource(newData);
    setEditableKeys(prev => prev.filter(k => k !== rowKey));
    await handleSaveAll(newData);
  };

  /** 行保存 */
  const onSave = async (_key: React.Key, record: FlatTableRow) => {
    const idx = dataSource.findIndex(item => item.id === _key);
    const newData = [...dataSource];
    // images 由 ImageUploadCell 直接更新 dataSource，不经过表单，
    // 所以需从 dataSource 中取最新的 images 合并到表单 record 里
    const latestImages = idx >= 0 ? dataSource[idx].images : [];
    const mergedRecord = { ...record, images: latestImages };
    if (idx >= 0) {
      newData[idx] = mergedRecord;
    } else {
      newData.push(mergedRecord);
    }
    setDataSource(newData);
    await handleSaveAll(newData);
  };

  /** 新增行 */
  const handleAdd = () => {
    const newRow: FlatTableRow = {
      id: `row_new_${Date.now()}`,
      images: [],
    };
    for (let i = 0; i < textHeaderCount; i++) {
      newRow[`cell_${i}`] = '';
    }
    setDataSource(prev => [...prev, newRow]);
    setEditableKeys(prev => [...prev, newRow.id]);
  };

  /** 导出清单 */
  const handleExport = async () => {
    if (!recordId) return;
    setExportLoading(true);
    try {
      const { data } = await exportIssueTrackingApi(recordId);
      const url = (data as any)?.data?.url;
      const fileName = (data as any)?.data?.fileName;
      if (url) {
        commonRequestDownloadFile(url, fileName, false);
      }
    } finally {
      setExportLoading(false);
    }
  };

  /** 导入清单（自定义上传） */
  const handleImportBeforeUpload = async (file: RcFile) => {
    setImportLoading(true);
    try {
      await importIssueTrackingExcelApi({ id: recordId, file });
      Toast('success', '导入成功');
      await fetchContent();
    } finally {
      setImportLoading(false);
    }
    return false;
  };

  /** 动态生成列 */
  const columns = useMemo((): ProColumns<FlatTableRow>[] => {
    if (!headers.length) return [];

    const textHeaders = headers.slice(0, -1);
    const imageHeader = headers[headers.length - 1];

    const textCols: ProColumns<FlatTableRow>[] = textHeaders.map(
      (header, idx) => ({
        title: header,
        dataIndex: `cell_${idx}`,
        valueType: 'text',
        fieldProps: {
          maxLength: 500,
          placeholder: `请输入${header}`,
        },
        render: (_: any, record: FlatTableRow) =>
          record[`cell_${idx}`] ? (
            <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
              {record[`cell_${idx}`]}
            </div>
          ) : (
            '-'
          ),
      }),
    );

    const imageCol: ProColumns<FlatTableRow> = {
      title: imageHeader,
      dataIndex: 'images',
      width: 280,
      render: (_, record) => {
        const images = record.images || [];
        if (!images.length) return '-';
        return (
          <Image.PreviewGroup>
            <Space size={4} wrap>
              {images.map((img: ImageItem, i: number) => (
                <Image
                  key={img.uid || i}
                  src={img.url}
                  width={80}
                  height={80}
                  style={{ objectFit: 'cover' }}
                />
              ))}
            </Space>
          </Image.PreviewGroup>
        );
      },
      renderFormItem: (_, { recordKey }) => {
        const currentRow = dataSource.find(r => r.id === recordKey);
        return (
          <ImageUploadCell
            images={currentRow?.images || []}
            onImagesChange={newImages => {
              setDataSource(prev =>
                prev.map(row =>
                  row.id === recordKey ? { ...row, images: newImages } : row,
                ),
              );
            }}
          />
        );
      },
    };

    const actionCol: ProColumns<FlatTableRow> = {
      title: '操作',
      valueType: 'option',
      width: 88,
      fixed: 'right',
      hideInTable: isDetail,
      render: (_, record, _index, action) => (
        <Space>
          <Button
            type='link'
            size='small'
            onClick={() => action?.startEditable?.(record.id)}
          >
            编辑
          </Button>
          <Button
            type='link'
            size='small'
            danger
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    };

    return [...textCols, imageCol, actionCol];
  }, [headers, isDetail, dataSource, handleSaveAll]);

  return (
    <Page title='问题清单' wrapperClass='marginBottomFormActionsHeight'>
      <div style={{ marginBottom: 16 }}>
        <Space style={{ justifyContent: 'space-between', width: '100%' }}>
          <Space size={24}>
            <span>
              核算年度：<strong>{detailInfo?.year ?? '-'}</strong>
            </span>
          </Space>
          {!isDetail && (
            <Space>
              <Upload
                accept='.xlsx,.XLSX'
                showUploadList={false}
                beforeUpload={handleImportBeforeUpload}
              >
                <Button loading={importLoading}>导入清单</Button>
              </Upload>
              <Button
                type='primary'
                onClick={handleExport}
                loading={exportLoading}
                disabled={!dataSource.length}
              >
                导出清单
              </Button>
              <Button
                type='primary'
                icon={<PlusOutlined />}
                onClick={handleAdd}
              >
                新增
              </Button>
            </Space>
          )}
        </Space>
      </div>

      <EditableProTable<FlatTableRow>
        rowKey='id'
        actionRef={actionRef}
        value={dataSource}
        columns={columns}
        size='small'
        search={false}
        pagination={false}
        scroll={{ x: 'max-content' }}
        loading={saveLoading}
        recordCreatorProps={false}
        editable={{
          form,
          editableKeys,
          onChange: setEditableKeys,
          onSave: onSave as any,
          onCancel: async key => {
            if (String(key).startsWith('row_new_')) {
              setDataSource(prev => prev.filter(row => row.id !== key));
              setEditableKeys(prev => prev.filter(k => k !== key));
            }
          },
          actionRender: (_row, _config, dom) => [dom.save, dom.cancel],
        }}
      />

      <FormActions
        place='center'
        buttons={compact([
          {
            title: '返回',
            onClick: async () => {
              navigate(CarbonVerifyRouteMaps.verificationProblem);
            },
          },
        ])}
      />
    </Page>
  );
};

export default VerificationProblemInfo;

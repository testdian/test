/**
 * @description:其他配置-数据管理抽屉
 */

import {
  ActionType,
  EditableProTable,
  EditableProTableProps,
  ProColumns,
} from '@ant-design/pro-components';
import {
  Button,
  Col,
  Form,
  Modal,
  Row,
  Space,
  Typography,
  Upload,
  UploadProps,
} from 'antd';
import { UploadChangeParam, UploadFile } from 'antd/lib/upload';
import { throttle } from 'lodash-es';
import { FC, useEffect, useRef, useState } from 'react';

import { baseUrl } from '@/api/request';
import CustomDrawer from '@/components/CustomDrawer';
import { IconFont } from '@/components/IconFont';
import I18N from '@/lang/I18N';
import { Toast } from '@/utils';
import { ActionTypeEnum } from '@/utils/actionType';
import { UPLOAD_FILES_URL_SALE } from '@/utils/const';
import { getToken } from '@/utils/cookie';
import { commonRequestDownloadFile } from '@/utils/downBlobFile';
import { baseTableConfig } from '@/views/eca/util/tableUtil';

import styles from './index.module.less';
import { TMP_FLAG } from '../constant';
import {
  deleteConfigMappingDataApi,
  editConfigMappingDataApi,
  addConfigMappingDataApi,
  downloadConfigTemplateApi,
  getConfigMappingDataListApi,
  importConfigDataApi,
  getConfigurationDetailApi,
  exportConfigDataApi,
} from '../service';
import { ConfigDataRow, RowConfigDataRequest } from '../type';
import { generateDataTableColumns } from './columns';
import {
  transformDataToCellList,
  transformDataToTableDataSource,
  transformHeaderListToColumns,
} from '../utils';

const maxSize = 5;

const { Text } = Typography;

export type FileType = {
  name: string;
  uid: string;
  url: string;
  suffix: string;
  fileName?: string;
};

interface DataManageDrawerProps {
  /** 数据ID */
  dataId: number;
  visible: boolean;
  /** 保存方法 */
  onOk: () => void;
  /** 取消方法 */
  onClose: () => void;
}

const DataManageDrawer: FC<DataManageDrawerProps> = ({
  dataId,
  visible,
  onClose,
  onOk,
}) => {
  const isDetail = false;

  /** --------------------------------- 上传文件 --------------------------------- */

  /** 上传的文件列表 */
  const [fileParams, setFileParams] = useState<FileType>();

  /** 上传文件的loading */
  const [uploadBtnLoading, setUploadBtnLoading] = useState(false);

  /** 导入文件的loading */
  const [importBtnLoading, setImportBtnLoading] = useState(false);

  /** 下载模版的loading */
  const [downloadBtnLoading, setDownloadBtnLoading] = useState(false);

  /** 导出数据的loading */
  const [exportBtnLoading, setExportBtnLoading] = useState(false);

  // 节流处理 onDownloadTemplate
  const throttledDownloadTemplate = throttle(async () => {
    setDownloadBtnLoading(true); // 开始下载时禁用按钮
    try {
      const { data } = await downloadConfigTemplateApi({
        id: dataId,
      });
      commonRequestDownloadFile(data?.data?.url, data?.data?.fileName, false);
    } catch (error) {
      Toast('error', I18N.components.downloadTemplateLost);
    } finally {
      setDownloadBtnLoading(false); // 下载完成后启用按钮
    }
  }, 2000); // 2 秒内只能执行一次

  const onImportFile = async (
    fileListParams: FileType,
    clearFlag: boolean,
    successCallBack: () => void,
    failCallBack: () => void,
  ) => {
    const { name, url } = fileListParams;

    try {
      await importConfigDataApi({
        fileName: name,
        fileUrl: url,
        paramConfigId: dataId,
        clearFlag,
      });
      successCallBack();
    } catch (error) {
      failCallBack();
    }
  };

  /** 文件上传 */
  const changeFileFn = (info: UploadChangeParam<UploadFile<any>>) => {
    if (info.file.status === 'done') {
      const { url } = info.file.response.data;
      const suffixArr = info.file.name.split('.');
      const data = {
        suffix: suffixArr[suffixArr.length - 1],
        url,
        uid: info.file.uid,
        name: info.file.name,
      };
      setFileParams(data);
      setUploadBtnLoading(false);
    }
  };

  /** 上传文件的参数 */
  const fileProps: UploadProps = {
    showUploadList: false,
    accept: '.xls, .xlsx, .XLS, .XLSX',
    name: 'file',
    onChange: changeFileFn,
    action: `${baseUrl}${UPLOAD_FILES_URL_SALE}`,
    headers: {
      Authorization: `${getToken()}`,
    },
    beforeUpload: file => {
      const { name } = file;
      const typeFile = name.split('.');
      const fileType = ['xls', 'xlsx', 'XLS', 'XLSX'];
      if (!fileType.includes(typeFile[typeFile.length - 1])) {
        Toast(
          'error',
          I18N.template(I18N.components.onlySupportsFi, {
            val1: fileType.join(','),
          }),
        );
        return false;
      }
      if (file.size > maxSize * 1024 * 1024) {
        Toast(
          'error',
          I18N.template(I18N.components.theFileCannotExceed, { val1: maxSize }),
        );
        return Upload.LIST_IGNORE;
      }
      setUploadBtnLoading(true);
      return true;
    },
  };

  /** --------------------------------- 表格区域 --------------------------------- */

  const [form] = Form.useForm();

  const actionRef = useRef<ActionType>();

  /** 设置表头的信息 */
  const [columns, setColumns] = useState<ProColumns<ConfigDataRow>[]>([]);

  /** 编辑行的key */
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);

  /** 设置数据源 */
  const [dataSource, setDataSource] = useState<ConfigDataRow[]>([]);

  const apiMap = {
    add: addConfigMappingDataApi,
    edit: editConfigMappingDataApi,
  };

  /** 数据填报表格保存逻辑 */
  const onSave = async (
    _key: string | number | bigint | React.Key[],
    record: ConfigDataRow,
  ) => {
    // 判断是新增还是编辑
    const isAdd = !record.id || record.id.toString().startsWith(TMP_FLAG);
    const api = isAdd ? apiMap.add : apiMap.edit;
    const cellList = transformDataToCellList(record, columns);

    // 准备提交数据
    const submitData = {
      paramConfigId: dataId,
      valueJson: cellList,
      // 如果是临时ID，移除它，让后端生成真实ID
      id: isAdd ? undefined : record.id,
    } as RowConfigDataRequest;

    // 调用API,保存
    try {
      await api(submitData);
      Toast('success', I18N.Factors.saveSuccessful);
      // 保存成功后清空编辑状态
      setEditableRowKeys([]);
      // 保存成功后操作
      actionRef.current?.reload();
    } catch (error) {
      throw new Error(I18N.eca.saveFailed);
    }
  };

  /** 数据填报表格单行删除、编辑 */
  const handelActionType = async (
    type: ActionTypeEnum,
    record: ConfigDataRow,
  ) => {
    switch (type) {
      case ActionTypeEnum.EDIT:
        actionRef?.current?.startEditable?.(record?.id as React.Key);
        break;
      case ActionTypeEnum.DELETE:
        if (!record?.id) return;
        await deleteConfigMappingDataApi({
          id: record?.id,
        });
        actionRef.current?.reload();
        break;
      default:
    }
  };

  /** 获取表头数据 */
  const getTableColumns = async () => {
    const { data } = await getConfigurationDetailApi({
      id: dataId,
    });
    const headerList = data?.data?.headerList || [];

    const currentColumns = transformHeaderListToColumns(headerList);

    setColumns(currentColumns);
  };

  useEffect(() => {
    if (visible) {
      getTableColumns();
    }

    if (!visible) {
      setEditableRowKeys([]);
      setDataSource([]);
    }
  }, [visible]);

  return (
    <CustomDrawer
      width='80%'
      title='数据管理'
      visible={visible}
      onClose={onClose}
      onSave={onOk}
      saveBtnText='确认'
    >
      <div className={styles.dataManageWrapper}>
        {/* 模版下载导入部分 */}
        <div className={styles.header}>
          <Row gutter={[12, 0]}>
            <Col span={12}>
              <div className={styles.section}>
                {/* 第一步的提示文案 */}
                <p className={styles.fileTips}>Step1：下载模版</p>
                <Button
                  onClick={throttledDownloadTemplate}
                  loading={downloadBtnLoading}
                >
                  {I18N.components.downloadTemplate}
                </Button>
              </div>
            </Col>

            <Col span={12}>
              <div className={styles.section}>
                <p className={styles.fileTips}>
                  Step2：上传文件 不超过5M，xlsx、xls格式
                </p>
                {fileParams ? (
                  <div className={styles.fileListBack}>
                    <div className={styles.fileListBackFile}>
                      <IconFont
                        className={styles.fileIcon}
                        icon='icon-icon-Excel'
                      />
                      <Text
                        className={styles.fileName}
                        ellipsis={{ tooltip: false }}
                      >
                        {fileParams.name}
                      </Text>
                    </div>
                    <div className={styles.uploadWrapper}>
                      <Upload className={styles.upload} {...fileProps}>
                        <Button loading={uploadBtnLoading}>
                          {I18N.carbonFootPrint.reUpload}
                        </Button>
                      </Upload>
                      <Button
                        loading={importBtnLoading}
                        onClick={async () => {
                          setImportBtnLoading(true);
                          const modalInstance = Modal.confirm({
                            title: I18N.Factors.prompt,
                            content:
                              '是否删除现有全部数据，如不删除则为新增数据。',
                            okText: '删除',
                            cancelText: '取消',
                            okButtonProps: { danger: true },
                            footer: (_, { OkBtn, CancelBtn }) => [
                              <CancelBtn key='cancel' />,
                              <Button
                                key='not-delete'
                                onClick={() => {
                                  modalInstance.destroy();
                                  onImportFile(
                                    fileParams,
                                    false,
                                    () => {
                                      setImportBtnLoading(false);
                                      setFileParams(undefined);
                                      Toast('success', '导入成功');
                                      actionRef.current?.reload();
                                    },
                                    () => {
                                      setImportBtnLoading(false);
                                      Toast('error', '导入失败');
                                    },
                                  );
                                }}
                              >
                                不删除
                              </Button>,
                              <OkBtn key='ok' />,
                            ],
                            onOk: () => {
                              onImportFile(
                                fileParams,
                                true,
                                () => {
                                  setImportBtnLoading(false);
                                  setFileParams(undefined);
                                  Toast('success', '导入成功');
                                  actionRef.current?.reload();
                                },
                                () => {
                                  setImportBtnLoading(false);
                                  Toast('error', '导入失败');
                                },
                              );
                            },
                            onCancel: () => {
                              setImportBtnLoading(false);
                            },
                          });
                        }}
                        type='primary'
                      >
                        {I18N.carbonFootPrint.import}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Upload {...fileProps}>
                    <Button loading={uploadBtnLoading}>
                      {I18N.carbonFootPrint.uploadFiles}
                    </Button>
                  </Upload>
                )}
              </div>
            </Col>
          </Row>
        </div>

        {/* 可编辑表格区域 */}
        <div className={styles.fillTable}>
          <div className={styles.fillTableHeader}>
            <Space>
              <Button
                loading={exportBtnLoading}
                onClick={async () => {
                  setExportBtnLoading(true);
                  try {
                    const { data } = await exportConfigDataApi({ id: dataId });
                    commonRequestDownloadFile(
                      data?.data?.url,
                      data?.data?.fileName,
                      false,
                    );
                  } finally {
                    setExportBtnLoading(false);
                  }
                }}
              >
                导出
              </Button>
              <Button
                type='primary'
                onClick={() => {
                  const tempId = `${TMP_FLAG}${Date.now()}`;
                  actionRef.current?.addEditRecord?.({
                    id: tempId,
                    key: tempId,
                  });
                  setEditableRowKeys(prev => [...prev, tempId]);
                }}
              >
                新增
              </Button>
            </Space>
          </div>
          <EditableProTable<ConfigDataRow>
            {...(baseTableConfig as EditableProTableProps<ConfigDataRow, any>)}
            rowKey='id'
            value={dataSource}
            actionRef={actionRef}
            rowClassName={record => {
              return record.repeatFlag ? styles.lightBlueRow : '';
            }}
            className={styles.fillDataDrawerTableContent}
            onChange={(value: readonly ConfigDataRow[]) => {
              setDataSource(value as ConfigDataRow[]);
            }}
            columns={generateDataTableColumns(
              columns,
              isDetail,
              handelActionType,
            )}
            params={{
              id: dataId,
              columns,
            }}
            request={async args => {
              if (!args.id || !columns.length) return [];
              const { data } = await getConfigMappingDataListApi({
                id: args.id,
              });

              const dataList = data?.data || [];

              // 转换数据格式
              const transformedData = transformDataToTableDataSource(dataList);

              return {
                data: transformedData || [],
                total: transformedData?.length || 0,
                success: true,
              };
            }}
            editable={{
              form,
              editableKeys,
              onSave,
              onCancel: async rowKey => {
                /** 如果是临时数据、点击取消清空当条数据 */
                if (rowKey.toString().startsWith(TMP_FLAG)) {
                  setEditableRowKeys(prev =>
                    prev.filter(key => key !== rowKey),
                  );
                  setDataSource(dataSource.filter(item => item.id !== rowKey));
                }
              },
              onChange: setEditableRowKeys,
              actionRender: (row, config, dom) => [dom.save, dom.cancel],
            }}
          />
        </div>
      </div>
    </CustomDrawer>
  );
};

export default DataManageDrawer;

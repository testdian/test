import {
  ActionType,
  EditableProTable,
  EditableProTableProps,
  ProColumns,
} from '@ant-design/pro-components';
import I18N from '@src/lang/I18N';
import { Button, Form, message, Space, TableProps } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import CustomDrawer from '@/components/CustomDrawer';
import { ModalFooter } from '@/components/ModalFooter';
import { checkAuth } from '@/layout/utills';
import { PageTypeInfo, RouteMaps } from '@/router/utils/enums';
import { modal } from '@/store/module/notification';
import { Toast } from '@/utils';
import { ActionTypeEnum } from '@/utils/actionType';
import { COMMON_PARAM_TYPE, TEMPLATE_CODE } from '@/views/eca/util/constant';
import {
  renderFormComponent,
  renderFieldProps,
  generateFormRules,
  extractAndFetchDictData,
} from '@/views/eca/util/paramsUtil/valueTypeColumns';
import {
  baseTableConfig,
  generateParamsSummary,
} from '@/views/eca/util/tableUtil';
import { safeParseJson } from '@/views/eca/util/transJson';

import styles from './index.module.less';
import {
  addComputationDataFillRowApi,
  batchDeleteComputationDataFillRowApi,
  checkComputationDataFillRowApi,
  downloadComputationDataFillRowDataAttachmentApi,
  editComputationDataFillRowApi,
  getComputationDataFillDataPageApi,
  getComputationDataFillTemplateListApi,
  updateComputationDataFillRowAttachmentApi,
  updateComputationDataFillRowDataAttachmentApi,
} from '../../service';
import {
  ComputationSourceResp,
  ComputationTemplateResp,
  EmissionSourceParam,
  FillDataRow,
} from '../../type';
import {
  transformDataToCellList,
  transformDataToTableDataSource,
} from '../../utils/transFromData';
import ImportModal from '../ImportModal';
import UploadFileDrawer from '../UploadFileDrawer';
import FillDataHeaderButtons from './FillDataHeaderButtons';
import { generateFillDataTableColumns } from './columns';
import ListUploadFileDrawer from '../UploadFileDrawer/ListUploadFileDrawer';

interface CustomDrawerProps {
  computationDetail: ComputationSourceResp;
  actionType: PageTypeInfo;
  visible: boolean;
  onClose: () => void;
  onSuccessSave?: () => void;
}

const { edit, show } = PageTypeInfo;

const { SELECT, NUMBER, ADDRESS } = COMMON_PARAM_TYPE;

const TMP_FLAG = 'temp_';

const TEMP_INIT = `${TEMPLATE_CODE}1_`;

const FillDataEditDrawer: React.FC<CustomDrawerProps> = ({
  computationDetail,
  actionType,
  visible,
  onClose,
  onSuccessSave,
}) => {
  const isDetail = actionType === show;

  /** 抽屉标题 */
  const titleMap = {
    [edit]: I18N.eca.editDataFilling,
    [show]: I18N.eca.dataFillingDetails,
  };

  const title = titleMap[actionType as keyof typeof titleMap];

  const actionRef = useRef<ActionType>();

  const navigate = useNavigate();

  /** 核算排放源关系id */
  const computationSourceId = computationDetail?.id;

  /** 核算id */
  const computationId = computationDetail?.computationId || 0;

  const apiMap = {
    add: addComputationDataFillRowApi,
    edit: editComputationDataFillRowApi,
  };

  const [form] = Form.useForm();

  /** 设置选中的模板id 值 */
  const [activeTemplateId, setActiveTemplateId] = useState<string>();

  const emissionSourceTemplateId = activeTemplateId?.split('_')?.[1];

  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);

  const [dataSource, setDataSource] = useState<ComputationTemplateResp[]>([]);

  /** 设置模板list */
  const [templateList, setTemplateList] = useState<ComputationTemplateResp[]>(
    [],
  );
  /** 设置当前模版的参数数据，为了渲染summary 的参数配置信息 */
  const [currentTemplateParamsList, setCurrentTemplateParamsList] = useState<
    EmissionSourceParam[]
  >([]);

  /** 设置文件上传个数 */
  const [fileCount, setFileCount] = useState<
    {
      name: string;
      url: string;
      uid: string;
    }[]
  >([]);

  /** 设置表头的信息 */
  const [columns, setColumns] = useState<ProColumns<ComputationTemplateResp>[]>(
    [],
  );

  /** 导入弹窗 */
  const [importModalVisible, setImportModalVisible] = useState(false);

  /** 上传文件弹窗 */
  const [uploadFileVisible, setUploadFileVisible] = useState(false);

  /** 行列表处的附件上传抽屉 */
  const [rowUploadFileVisible, setRowUploadFileVisible] = useState(false);

  /** 当前行的数据 */
  const [currentRowData, setCurrentRowData] = useState<FillDataRow>();

  /** 当前行的文件列表 */
  const [currentRowFileList, setCurrentRowFileList] = useState<
    {
      name: string;
      url: string;
      uid: string;
    }[]
  >([]);

  /** 批量删除 */
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  /** 临时数据源标识（用于触发使用本地数据而非请求接口） */
  const [useTempData, setUseTempData] = useState<number>(0);

  /** 用 ref 存储临时数据源 */
  const tempDataSourceRef = useRef<ComputationTemplateResp[]>([]);

  /** 一键下载全部附件的loading状态 */
  const [loadingDownloadAllFiles, setLoadingDownloadAllFiles] =
    useState<boolean>(false);

  /** 当前激活的模板信息 */
  const [currentTemplateDetail, setCurrentTemplateDetail] =
    useState<ComputationTemplateResp | null>(null);

  /** 数据填报表格多选配置 */
  const rowSelection = columns.length > 0 &&
    !isDetail && {
      type: 'checkbox',
      fixed: 'left',
      selectedRowKeys,
      onChange: (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys);
      },
      getCheckboxProps: (record: ComputationSourceResp) => ({
        disabled: record.id?.toString().startsWith(TMP_FLAG) || false,
      }),
    };

  /** 数据填报表格保存逻辑 */
  const onSave = async (
    key: string | number | bigint | React.Key[],
    record: FillDataRow,
  ) => {
    // 判断是新增还是编辑
    const isAdd = !record.id || record.id.toString().startsWith(TMP_FLAG);
    const api = isAdd ? apiMap.add : apiMap.edit;

    // 获取 attachmentUrl：优先从 record，否则从 dataSource 中获取
    let attachmentUrl = record.attachmentUrl || '';
    if (!attachmentUrl) {
      const currentRowInDataSource = dataSource.find(
        item => item.id === record.id,
      );
      attachmentUrl = currentRowInDataSource?.attachmentUrl || '';
    }

    const cellList = transformDataToCellList(record, columns);
    // 准备提交数据
    const submitData = {
      cellList,
      computationSourceId,
      emissionSourceTemplateId,
      attachmentUrl, // 添加附件URL
      // 如果是临时ID，移除它，让后端生成真实ID
      id: isAdd ? undefined : record.id,
    } as FillDataRow;
    // 调用API
    try {
      // 保存前进行数据校验 返回true是校验通过，则进行保存操作，否则弹窗二次确认
      const { data } = await checkComputationDataFillRowApi(submitData);

      const checkFlag = !!data?.data;

      /** 保存数据 */
      const onSaveFn = async () => {
        try {
          // 调用API
          await api(submitData);
          Toast('success', I18N.Factors.saveSuccessful);
          // 保存成功后清空编辑状态
          setEditableRowKeys([]);
          // 重置临时数据标识，让后续刷新重新请求接口
          setUseTempData(0);
          // 保存成功后操作
          actionRef.current?.reload();
        } catch (error) {
          // API 调用失败时，保持编辑状态
          // 使用 setTimeout 确保在 EditableProTable 处理完后再设置编辑状态
          setTimeout(() => {
            const currentKey = Array.isArray(key) ? key[0] : key;
            setEditableRowKeys([currentKey]);
          }, 0);
          // 不抛出错误，避免 EditableProTable 自动清除编辑态
        }
      };

      if (checkFlag) {
        await onSaveFn();
      } else {
        // 如果校验不通过，弹窗提示
        modal.confirm({
          title: I18N.Factors.prompt,
          content: I18N.eca.theDataAlreadyExists,
          onOk: onSaveFn,
          onCancel: () => {
            // 确保当前行保持编辑状态
            const currentKey = Array.isArray(key) ? key[0] : key;
            setEditableRowKeys([currentKey]);
          },
        });
      }
    } catch (error) {
      // 如果有其他未捕获的错误，也保持编辑状态
      setTimeout(() => {
        const currentKey = Array.isArray(key) ? key[0] : key;
        setEditableRowKeys([currentKey]);
      }, 0);
    }
  };

  /** 数据填报表格单行删除、编辑 */
  const handelActionType = async (
    type: ActionTypeEnum,
    record: ComputationTemplateResp,
  ) => {
    switch (type) {
      case ActionTypeEnum.EDIT:
        actionRef?.current?.startEditable?.(record?.id as React.Key);
        break;
      case ActionTypeEnum.DELETE:
        await batchDeleteComputationDataFillRowApi({
          computationId,
          idList: [record?.id],
        });
        actionRef.current?.reload();
        break;
      case ActionTypeEnum.UPLOAD:
        setRowUploadFileVisible(true);
        setCurrentRowData(record);
        setCurrentRowFileList(safeParseJson(record?.attachmentUrl));
        break;
      default:
        break;
    }
  };

  /** 数据填报表格批量删除 */
  const tableAlertOptionRender = ({
    selectedRowKeys: currentSelectedRowKeys,
    onCleanSelected,
  }: {
    selectedRowKeys: (string | number)[];
    onCleanSelected: () => void;
  }) => {
    return (
      <Space size={16}>
        <Button type='link' onClick={onCleanSelected}>
          {I18N.eca.deselect}
        </Button>
        {checkAuth(
          '/fillDataInfo/allDel',
          <Button
            type='primary'
            onClick={() => {
              modal.confirm({
                title: I18N.Factors.prompt,
                content: I18N.eca.pleaseConfirmIfItIs,
                onOk: async () => {
                  /**
                   * 移除未保存到后端的行数据，过滤掉currentSelectedRowKeys中temp_开头的数据
                   */
                  const idList = currentSelectedRowKeys.filter(
                    key => !key.toString().startsWith(TMP_FLAG),
                  );
                  if (idList.length) {
                    await batchDeleteComputationDataFillRowApi({
                      computationId,
                      idList: idList as number[],
                    });
                  }
                  onCleanSelected();
                  setSelectedRowKeys([]);
                  actionRef.current?.reload();
                },
              });
            }}
          >
            {I18N.eca.batchDeletion}
          </Button>,
        )}
      </Space>
    );
  };

  /** 处理模板参数，生成表头 */
  const processTemplateParams = async (paramList: EmissionSourceParam[]) => {
    /** 查出所有字典 调用接口请求 */
    const options = await extractAndFetchDictData(paramList);
    // 构建列定义，同时处理下拉框选项
    const currentColumns: ProColumns<ComputationTemplateResp>[] =
      paramList.map(item => {
        const {
          paramName,
          unit1Name,
          unit2Name,
          defaultFlag,
          defaultValue,
          requiredFlag,
        } = item || {};

        /** 是否是必填项 */
        const isRequired = requiredFlag === 1;

        const columnTitleText = unit1Name
          ? `${paramName}(${unit1Name}${unit2Name ? `/${unit2Name}` : ''})`
          : paramName;

        // 如果是必填项，在标题前添加必填符号
        const columnTitle = isRequired ? (
          <>
            <span className={styles.requiredSymbol}>*</span>
            {columnTitleText}
          </>
        ) : (
          columnTitleText
        );

        const column: ProColumns<ComputationTemplateResp> = {
          width: 200,
          title: columnTitle,
          dataIndex: `${item?.paramCode}`,
          ellipsis: true,
          valueType: renderFormComponent(Number(item?.paramType)),
          fieldProps: renderFieldProps(item),
          formItemProps: () => ({
            rules: generateFormRules(item), // 使用生成的校验规则
            initialValue: defaultFlag ? defaultValue : undefined,
          }),
        } as ProColumns<ComputationTemplateResp>;

        // 如果是选项/地址类型，并且有对应的选项数据
        if (
          (item?.paramType === SELECT || item?.paramType === ADDRESS) &&
          item?.dictEnum &&
          options[item.dictEnum]
        ) {
          column.valueType = 'select';
          column.fieldProps = {
            ...column.fieldProps,
            options: options[item.dictEnum]?.map?.(option => ({
              label: option.dictLabel,
              value: option.dictValue,
            })),
          };
        }

        // 数值类型阅读态处理（组件默认只展示3位小数，改成显示实际值）
        if (item?.paramType === NUMBER) {
          column.render = (_, row) => {
            const value = item?.paramCode ? row?.[item?.paramCode] ?? '-' : '-';
            const warningFlag = item?.paramCode
              ? row?.[`${item?.paramCode}_warningFlag`]
              : false;

            // 如果warningFlag字段为真，则设置其父级元素的背景色为黄色，宽高占满整个单元格，文本上下居中
            if (warningFlag) {
              return (
                <div
                  style={{
                    backgroundColor: '#ffe238',
                    height: '33px',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 10px',
                  }}
                >
                  {`${value}`}
                </div>
              );
            }
            return `${value}`;
          };
        }

        return column;
      }) || [];
    setCurrentTemplateParamsList(paramList || []);
    setColumns(currentColumns);
  };

  /** 处理模板切换 */
  const handleTemplateChange = (value: string) => {
    // 检测是否有未保存的新增行（临时ID以temp_开头）
    const hasUnsaved = editableKeys.some(
      key => typeof key === 'string' && key.startsWith(TMP_FLAG),
    );
    if (hasUnsaved) {
      // 提示用户保存或取消编辑
      Toast('warning', I18N.eca.pleaseSaveOr);
      form.validateFields();
    } else {
      // 重置编辑状态
      setEditableRowKeys([]);
      // 重置临时数据源（防止切换模版时显示上一个模版的数据）
      setUseTempData(0);
      tempDataSourceRef.current = [];
      // 清空选中状态
      setSelectedRowKeys([]);
      // 找到对应模板的表头信息
      const templateId = value.split('_')?.[1];
      const template = templateList.find(
        t => t.emissionSourceTemplateId === Number(templateId),
      );
      if (template) {
        setActiveTemplateId(value);
        setFileCount(safeParseJson(template?.attachmentUrl));
        // 设置当前模板信息
        setCurrentTemplateDetail(template);
        // 这里不需要重新调用API，直接从templateList中获取参数列表
        processTemplateParams(template.paramList || []);
      }
    }
  };

  /** 初始化加载第一个模板数据 */
  const loadTemplateList = async () => {
    if (!computationId || !computationSourceId) return;
    const { data } = await getComputationDataFillTemplateListApi(
      computationId,
      computationSourceId,
    );
    const templates = data.data;
    setTemplateList(templates);
    // 设置第一个模板为当前激活模板
    const firstTemplate = templates[0];

    const firstTemplateId = `${TEMP_INIT}${firstTemplate.emissionSourceTemplateId}`;
    setActiveTemplateId(firstTemplateId);
    setFileCount(safeParseJson(firstTemplate?.attachmentUrl));
    // 设置当前模板信息
    setCurrentTemplateDetail(firstTemplate);

    // 处理第一个模板的参数列表
    processTemplateParams(firstTemplate.paramList || []);
  };

  // 组件初始化时加载模板列表和第一个模板的表头
  useEffect(() => {
    if (!visible) {
      // 重置所有状态，包括临时数据源
      setEditableRowKeys([]);
      setDataSource([]);
      setActiveTemplateId('');
      setTemplateList([]);
      setColumns([]);
      setFileCount([]);
      setSelectedRowKeys([]);
      setCurrentTemplateParamsList([]);
      setUseTempData(0); // 重置临时数据标识
      tempDataSourceRef.current = []; // 清空临时数据源
      return; // 抽屉关闭时不执行后续逻辑
    }

    // 抽屉打开时加载模板列表
    loadTemplateList();
  }, [visible, computationId, computationSourceId]);

  return (
    <CustomDrawer
      width='100%'
      title={title}
      visible={visible}
      onClose={() => {
        onClose();
      }}
      footer={
        <ModalFooter
          isView={isDetail}
          onCancel={onClose}
          onOk={() => {
            onSuccessSave?.();
          }}
        />
      }
    >
      {/* 使用提取的按钮组件 */}
      <FillDataHeaderButtons
        isDetail={isDetail}
        columns={columns}
        activeTemplateId={activeTemplateId || ''}
        templateList={templateList}
        onTemplateChange={handleTemplateChange}
        onUploadClick={() => setUploadFileVisible(true)}
        onImportClick={() => setImportModalVisible(true)}
        onAddNew={() => {
          const tempId = `${TMP_FLAG}${Date.now()}`;
          actionRef.current?.addEditRecord?.({ id: tempId, key: tempId });
          setEditableRowKeys(prev => [...prev, tempId]);
        }}
      />
      <div>{I18N.eca.labelTheEntireBankInBlue}</div>
      <div className={styles.fillDataDrawerTips}>
        数据来源及提交佐证材料字段，非必填，如有请填写佐证材料名称。佐证材料请点击上传佐证附件按钮进行上传。
      </div>
      <div className={styles.fillDataDrawerTips}>
        {currentTemplateDetail?.fillDesc || ''}
      </div>
      {/* 可编辑表格区域 */}
      <div className={styles.fillDataDrawerTable}>
        <EditableProTable<ComputationSourceResp>
          {...(baseTableConfig as EditableProTableProps<
            ComputationSourceResp,
            any
          >)}
          key={`${computationSourceId}_${activeTemplateId}`}
          rowKey='id'
          actionRef={actionRef}
          rowSelection={
            rowSelection as TableProps<ComputationSourceResp>['rowSelection']
          }
          rowClassName={record => {
            return record.repeatFlag ? styles.lightBlueRow : '';
          }}
          className={styles.fillDataDrawerTableContent}
          tableAlertOptionRender={tableAlertOptionRender}
          params={{
            emissionSourceTemplateId,
            columns,
            useTempData, // 使用版本号触发刷新
          }}
          onChange={(value: readonly ComputationSourceResp[]) => {
            setDataSource(value as ComputationTemplateResp[]);
          }}
          columns={generateFillDataTableColumns(
            columns,
            isDetail,
            handelActionType,
            form,
            editableKeys,
          )}
          request={async args => {
            if (!activeTemplateId || !columns.length) return [];
            // 如果需要使用临时数据源（新增数据上传附件后），使用临时数据源
            if (useTempData > 0 && tempDataSourceRef.current.length > 0) {
              return {
                data: tempDataSourceRef.current,
                total: tempDataSourceRef.current.length,
              };
            }

            const { data } = await getComputationDataFillDataPageApi({
              pageNum: args.current,
              pageSize: args.pageSize,
              emissionSourceTemplateId: Number(emissionSourceTemplateId),
              computationId,
              computationSourceId,
            });
            // 转换数据格式
            const transformedData = transformDataToTableDataSource(
              data?.data?.list || [],
              columns,
            );
            return {
              data: transformedData || [],
              total: data?.data?.total || 0,
            };
          }}
          editable={{
            form,
            editableKeys,
            onSave,
            onCancel: async rowKey => {
              /** 如果是临时数据、点击取消清空当条数据 */
              if (rowKey.toString().startsWith(TMP_FLAG)) {
                setEditableRowKeys(prev => prev.filter(key => key !== rowKey));

                const newList = dataSource.filter(item => item.id !== rowKey);
                setDataSource(newList);
                // 更新临时数据源并触发刷新
                tempDataSourceRef.current = newList;
                setUseTempData(prev => prev + 1);
              }
            },
            onChange: setEditableRowKeys,
            actionRender: (row, config, dom) => {
              const rowKey = row.id;
              if (!rowKey) return [dom.save, dom.cancel];
              return [
                dom.save,
                dom.cancel,
                <Button
                  key='upload'
                  type='link'
                  size='small'
                  onClick={() => {
                    setCurrentRowData(row);
                    setCurrentRowFileList(safeParseJson(row?.attachmentUrl));
                    setRowUploadFileVisible(true);
                  }}
                >
                  上传附件
                </Button>,
              ];
            },
          }}
          summary={() =>
            generateParamsSummary(currentTemplateParamsList, {
              showFactor: false,
              showCheckbox: !isDetail,
              showOperation: !isDetail,
              showAttachment: true,
            })
          }
        />
      </div>
      {/* 批量导入 */}
      <ImportModal
        isView={isDetail}
        visible={importModalVisible}
        onOk={() => {
          setImportModalVisible(false);
          actionRef?.current?.reload();
        }}
        onCancel={() => {
          setImportModalVisible(false);
          actionRef?.current?.reload();
        }}
        computationId={computationId as number}
        computationSourceId={computationSourceId as number}
        emissionSourceTemplateId={Number(emissionSourceTemplateId)}
      />
      {/* 附件上传 */}
      <UploadFileDrawer
        filesList={fileCount}
        visible={uploadFileVisible}
        onClose={() => {
          setUploadFileVisible(false);
        }}
        onSave={async files => {
          if (
            !computationId ||
            !computationSourceId ||
            !emissionSourceTemplateId
          )
            return;
          await updateComputationDataFillRowAttachmentApi({
            computationId,
            computationSourceId,
            emissionSourceTemplateId: Number(emissionSourceTemplateId),
            attachmentUrl: JSON.stringify(files),
          });
          message.success(I18N.eca.uploadSuccessful);
          loadTemplateList();
          setUploadFileVisible(false);
        }}
        handleDownloadAllFiles={async () => {
          if (!computationSourceId || !emissionSourceTemplateId) return;

          try {
            setLoadingDownloadAllFiles(true);
            await downloadComputationDataFillRowDataAttachmentApi({
              computationSourceId,
              emissionSourceTemplateId: Number(emissionSourceTemplateId),
            });

            // 弹窗跳转下载管理
            modal.confirm({
              title: '提示',
              content: (
                <div
                  style={{
                    marginBottom: '24px',
                  }}
                >
                  下载任务已创建，点击“确定”跳转到“下载管理”中下载
                </div>
              ),
              okText: I18N.eca.jumpToDownloadManager,
              cancelText: '返回',
              width: 500,
              onOk: async () => {
                navigate(RouteMaps.systemDownload);
              },
              // onCancel: () => {
              // 关闭抽屉，回到列表页
              //   onClose?.();
              // },
            });
          } catch (error) {
            Toast('error', '下载失败，请重试');
          } finally {
            setLoadingDownloadAllFiles(false);
          }
        }}
        loadingDownloadAllFiles={loadingDownloadAllFiles}
      />

      {/* 列表操作栏的附件上传 */}
      <ListUploadFileDrawer
        filesList={currentRowFileList}
        visible={rowUploadFileVisible}
        onClose={() => {
          setRowUploadFileVisible(false);
        }}
        onSave={async files => {
          const { id: rowId } = currentRowData || {};
          if (!rowId || !computationSourceId || !emissionSourceTemplateId)
            return;

          const attachmentUrlStr = JSON.stringify(files);

          // 判断当前行是否处于编辑态
          const isEditing = editableKeys.includes(rowId);

          if (isEditing) {
            // 编辑态：只更新表单数据，不调用接口
            form.setFieldValue([rowId, 'attachmentUrl'], attachmentUrlStr);

            // 更新当前行数据（用于下次打开附件抽屉时显示已上传的文件）
            setCurrentRowData(prev =>
              prev
                ? {
                    ...prev,
                    attachmentUrl: attachmentUrlStr,
                  }
                : prev,
            );
            setRowUploadFileVisible(false);
          } else {
            // 非编辑态：调用接口保存
            await updateComputationDataFillRowDataAttachmentApi({
              id: rowId,
              computationSourceId,
              emissionSourceTemplateId: Number(emissionSourceTemplateId),
              attachmentUrl: attachmentUrlStr,
            });
            message.success(I18N.eca.uploadSuccessful);
            actionRef.current?.reload();
            setRowUploadFileVisible(false);
          }
        }}
      />
    </CustomDrawer>
  );
};

export default FillDataEditDrawer;

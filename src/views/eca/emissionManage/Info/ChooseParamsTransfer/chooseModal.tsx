/**
 * 排放源库/模板详情/参数管理弹窗
 */
import {
  LeftOutlined,
  QuestionCircleOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { DragSortTable } from '@ant-design/pro-components';
import I18N from '@src/lang/I18N';
import {
  Input,
  Button,
  Modal,
  Table,
  Form,
  Tooltip,
  Select,
  message,
} from 'antd';
import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useLayoutEffect,
} from 'react';

import { EllipsisTextRender } from '@/components/TypographyText';
import { REPONSE_CODE } from '@/config';
import { PageTypeInfo } from '@/router/utils/enums';
import { modal } from '@/store/module/notification';
import { getEmissionSourceParameterAllListAPi } from '@/views/eca/Parameter/service';
import { Param } from '@/views/eca/Parameter/type';
import { COMMON_PARAM_TYPE } from '@/views/eca/util/constant';
import {
  INPUT_TYPE_OPTIONS,
  PARAMETER_TYPE,
} from '@/views/eca/util/paramsUtil/paramsSchema/constant';

import { ParamsDrawerInfo } from './ParamsDrawerInfo';
import { paramsRightColumns } from './chooseParamsColumns';
import style from './index.module.less';
import {
  getEmissionSourceParamValueListApi,
  saveEmissionSourceParamValueListApi,
  saveEmissionSourceTemplateApi,
} from '../../service';
import { EmissionSourceParam, EmissionSourceTemplateResp } from '../../type';

const { Search } = Input;

const { TEXT, SELECT } = COMMON_PARAM_TYPE;

const { PARAMS_CODE } = REPONSE_CODE;

const getParameterAllList = async () => {
  const { data } = await getEmissionSourceParameterAllListAPi({
    likeParamName: undefined,
    notGlobal: 1,
  });
  return data?.data || [];
};

const getEmissionSourceParamValueList = async (
  emissionSourceId: number,
  emissionSourceTemplateId: number,
) => {
  const { data } = await getEmissionSourceParamValueListApi(
    emissionSourceId,
    emissionSourceTemplateId,
  );
  return data?.data || [];
};

const { GLOBAL_PARAMETER } = PARAMETER_TYPE;

const ParameterManagement: React.FC<{
  visible: boolean;
  /** 排放源id */
  emissionSourceId: number;
  /** 模板id值 */
  emissionSourceTemplateId: number;
  /** 当前模板详情 需要合并纬度、模板描述字段数据 */
  currentTemplateDetail: EmissionSourceTemplateResp;
  /** 关闭弹窗 */
  onCancel: () => void;
  /** 保存修改参数成功 */
  onSuccess: () => void;
}> = ({
  visible,
  onCancel,
  onSuccess,
  emissionSourceId,
  emissionSourceTemplateId,
  currentTemplateDetail,
}) => {
  const [form] = Form.useForm();
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  const [leftListData, setLeftListData] = useState<EmissionSourceParam[]>([]);
  const [rightTableData, setRightTableData] = useState<EmissionSourceParam[]>(
    [],
  );
  const [selectedRightKeys, setSelectedRightKeys] = useState<string[]>([]);
  const [selectedRightRows, setSelectedRightRows] = useState<
    EmissionSourceParam[]
  >([]);
  const [editData, setEditData] = useState<Param>();

  const [selectedLeftRows, setSelectedLeftRows] = useState<
    EmissionSourceParam[]
  >([]);

  const [loading, setLoading] = useState(false);

  /** 设置参数编辑弹窗 */
  const [paramsOpen, setParamsOpen] = useState(false);

  const [actionBtnType, setActionBtnType] = useState<PageTypeInfo>();

  /** 保存滚动位置的 ref */
  const scrollPositionRef = useRef<{ scrollLeft: number; scrollTop: number }>({
    scrollLeft: 0,
    scrollTop: 0,
  });

  /** 拖拽容器的 ref */
  const dragContainerRef = useRef<HTMLDivElement>(null);

  /** 标记是否正在拖拽（拖拽需要特殊样式处理） */
  const isDraggingRef = useRef(false);

  /** 获取表格容器的辅助函数 */
  const getRightTableContainer = () => {
    return document.querySelector(
      `.${style.paramsRight} .ant-table-body`,
    ) as HTMLElement;
  };

  /** 保存当前滚动位置 */
  const saveScrollPosition = () => {
    const container = getRightTableContainer();
    if (container) {
      scrollPositionRef.current = {
        scrollLeft: container.scrollLeft,
        scrollTop: container.scrollTop,
      };
    }
  };

  /** 监听滚动事件，实时保存滚动位置 */
  useEffect(() => {
    if (!visible) return;

    const container = getRightTableContainer();
    if (!container) return;

    const handleScroll = () => {
      saveScrollPosition();
    };

    container.addEventListener('scroll', handleScroll, { passive: true });

    // eslint-disable-next-line consistent-return
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [visible]);

  /** 自动恢复滚动位置 - 监听数据变化 */
  useLayoutEffect(() => {
    const container = getRightTableContainer();
    if (container && scrollPositionRef.current) {
      container.scrollLeft = scrollPositionRef.current.scrollLeft;
      container.scrollTop = scrollPositionRef.current.scrollTop;

      // 拖拽操作的特殊处理：恢复样式
      if (isDraggingRef.current && dragContainerRef.current) {
        dragContainerRef.current.style.opacity = '1';
        dragContainerRef.current.style.pointerEvents = 'auto';
        isDraggingRef.current = false;
      }
    }
  }, [rightTableData, selectedRightKeys, paramsOpen]);

  /** 拖拽排序 */
  const handleDragSortEnd = (newDataSource: EmissionSourceParam[]) => {
    saveScrollPosition();

    // 标记拖拽状态并添加拖拽中的样式
    isDraggingRef.current = true;
    if (dragContainerRef.current) {
      dragContainerRef.current.style.opacity = '0.6';
      dragContainerRef.current.style.pointerEvents = 'none';
    }

    setRightTableData(newDataSource);
  };

  /** 修改是否必填 */
  const handleRequiredFlagChange = (
    record: EmissionSourceParam,
    value: boolean,
  ) => {
    saveScrollPosition();

    /** 0 否；1 是 */
    const newData = rightTableData.map(item =>
      item?.paramCode === record?.paramCode
        ? { ...item, requiredFlag: value ? 1 : 0 }
        : item,
    );
    setRightTableData(newData);
  };

  /** 修改是否显示 */
  const handleDisplayFlagChange = (
    record: EmissionSourceParam,
    value: boolean,
  ) => {
    saveScrollPosition();

    /** 0 否；1 是 */
    const newData = rightTableData.map(item =>
      item?.paramCode === record?.paramCode
        ? { ...item, displayFlag: value ? 1 : 0 }
        : item,
    );
    setRightTableData(newData);
  };

  /** 编辑右侧参数列表弹窗数据 */
  const handleEdit = (record: Param) => {
    saveScrollPosition();

    setEditData(record);
    setActionBtnType(PageTypeInfo.edit);
    setParamsOpen(true);
  };

  const handleRightSelectChange = (
    selectedRowKeys: any[],
    selectedRows: any[],
  ) => {
    saveScrollPosition();

    setSelectedRightKeys(selectedRowKeys);
    setSelectedRightRows(selectedRows);
  };

  /** 将左侧选中的数据复制到右侧后，左侧的选中勾选状态为禁用 */
  const handleMoveToRight = () => {
    // 获取右侧所有 paramCode
    const rightParamCodes = new Set(rightTableData.map(item => item.paramCode));

    // 筛选出左侧选中且未在右侧出现的数据
    const newRightData = selectedLeftRows.filter(
      row => !rightParamCodes.has(row.paramCode),
    );

    if (newRightData.length === 0) {
      return;
    }

    saveScrollPosition();

    // 设置新增数据的默认必填和默认展示
    const processedNewRightData = newRightData.map(item => ({
      ...item,
      requiredFlag: 1,
      displayFlag: 1,
    }));

    // 更新右侧数据
    setRightTableData([...rightTableData, ...processedNewRightData]);

    setSelectedRightRows([]);
    setSelectedRightKeys([]);
    // 更新左侧数据，将已选中的数据的 disabled 属性设为 true
    const newLeftListData = leftListData.map(item => {
      if (
        selectedLeftRows.some(
          selectedRow => selectedRow.paramCode === item.paramCode,
        )
      ) {
        return { ...item, disabled: true };
      }
      return item;
    });
    setLeftListData(newLeftListData);
    // 清空右侧选中行
  };

  const handleLeftSelectChange = (
    selectedRowKeys: any[],
    selectedRows: any[],
  ) => {
    setSelectedLeftRows(selectedRows);
  };

  /** 取消初始化操作 */
  const handleCancel = () => {
    setSearchKeyword('');
    setLeftListData([]);
    setRightTableData([]);
    setSelectedRightKeys([]);
    setSelectedRightRows([]);
    setEditData(undefined);
    setSelectedLeftRows([]);
    form?.resetFields();
    // 重置滚动位置和拖拽标记
    scrollPositionRef.current = { scrollLeft: 0, scrollTop: 0 };
    isDraggingRef.current = false;
    onCancel();
  };

  useEffect(() => {
    if (visible) {
      // 重置滚动位置和拖拽标记
      scrollPositionRef.current = { scrollLeft: 0, scrollTop: 0 };
      isDraggingRef.current = false;

      const fetchData = async () => {
        const leftData = await getParameterAllList();
        const rightData = await getEmissionSourceParamValueList(
          emissionSourceId,
          emissionSourceTemplateId,
        );
        // 获取右侧所有paramCode
        const rightParamCodes = new Set(rightData.map(item => item.paramCode));
        // 处理左侧数据，添加禁用状态
        const processedLeftData = leftData.map(item => ({
          ...item,
          disabled: rightParamCodes.has(item.paramCode),
        }));
        setLeftListData(processedLeftData);
        setRightTableData(
          rightData?.map?.(item => {
            return {
              ...item,
              key: item?.paramCode,
            };
          }) || [],
        );
        // 更新 selectedLeftRows 状态，将已禁用的行视为已选中
        const initialSelectedLeftRows = processedLeftData.filter(
          item => item.disabled,
        );
        setSelectedLeftRows(initialSelectedLeftRows);
        form.setFieldsValue({
          mergeDimension: currentTemplateDetail?.mergeDimension?.split(','),
        });
      };
      fetchData();
    } else {
      handleCancel();
    }
  }, [
    visible,
    currentTemplateDetail,
    emissionSourceId,
    emissionSourceTemplateId,
  ]);

  /** 向左移动数据逻辑 */
  const handleMoveToLeft = () => {
    if (selectedRightRows.length === 0) {
      return;
    }

    saveScrollPosition();

    // 获取右侧选中行的 paramCode
    const selectedRightParamCodes = new Set(
      selectedRightRows.map(item => item.paramCode),
    );

    // 从右侧表格数据中移除选中的行
    const newRightTableData = rightTableData.filter(
      item => !selectedRightParamCodes.has(item.paramCode),
    );
    setRightTableData(newRightTableData);

    // 更新左侧列表数据，将移除的行对应的 disabled 属性设为 false
    const newLeftListData = leftListData.map(item => {
      if (selectedRightParamCodes.has(item.paramCode)) {
        return { ...item, disabled: false };
      }
      return item;
    });
    setLeftListData(newLeftListData);

    // 清空右侧选中行
    setSelectedRightRows([]);
    setSelectedRightKeys([]);

    // 清除无效的合并维度选中值
    const validMergeDimensionOptions = newRightTableData
      .filter(item => item.paramType === TEXT || item.paramType === SELECT)
      .map(item => item.paramCode);
    form
      .getFieldValue('mergeDimension')
      ?.forEach((value: string | undefined) => {
        if (!validMergeDimensionOptions.includes(value)) {
          form.setFieldsValue({
            mergeDimension: form
              .getFieldValue('mergeDimension')
              .filter((v: string | undefined) => v !== value),
          });
        }
      });
  };

  const getValidSelectedLeftRows = () => {
    const rightParamCodes = new Set(rightTableData.map(item => item.paramCode));
    return selectedLeftRows.filter(row => !rightParamCodes.has(row.paramCode));
  };

  const handleSave = async () => {
    /** 确定合并纬度是否选择 */
    const mergeDimensionValue: { mergeDimension: string[] } =
      await form?.validateFields();
    if (!mergeDimensionValue?.mergeDimension?.length) {
      message.error(I18N.eca.pleaseChooseToMerge);
      return;
    }
    /** 提交的数据 */
    const submitValues = {
      paramList: rightTableData,
      mergeDimension: mergeDimensionValue?.mergeDimension?.toString(),
      emissionSourceId,
      id: emissionSourceTemplateId,
    };
    try {
      setLoading(true);
      /** 先校验数据 */
      const { data } = await saveEmissionSourceParamValueListApi(submitValues);
      if (data?.code === 200) {
        /** 校验通过保存参数 */
        await saveEmissionSourceTemplateApi({
          ...submitValues,
          fillTips: currentTemplateDetail?.fillTips,
          fillDesc: currentTemplateDetail?.fillDesc,
        }).finally(() => {
          setLoading(false);
        });
        onSuccess();
      }
    } catch (error: any) {
      if (error?.data?.code === PARAMS_CODE) {
        modal.confirm({
          title: I18N.Factors.prompt,
          content: (
            <div>
              <span>{error?.data?.msg}</span>
              <span style={{ color: '#002855' }}>
                {I18N.eca.parameter2}
                {error?.data?.data}
              </span>
            </div>
          ),
          onOk: async () => {
            setLoading(true);
            await saveEmissionSourceTemplateApi({
              ...submitValues,
              fillTips: currentTemplateDetail?.fillTips,
              fillDesc: currentTemplateDetail?.fillDesc,
            }).finally(() => {
              setLoading(false);
            });
            onCancel();
            onSuccess();
          },
        });
      }
      setLoading(false);
    }
  };
  // 处理搜索参数
  const handleSearch = (value: string) => {
    setSearchKeyword(value.trim().toLowerCase());
  };

  // 获取过滤后的左侧数据
  const filteredLeftData = useMemo(() => {
    return leftListData.filter(item =>
      item?.paramNameText?.toLowerCase().includes(searchKeyword),
    );
  }, [leftListData, searchKeyword]);

  return (
    <Modal
      title={I18N.eca.parameterManagement}
      open={visible}
      width='90%'
      centered
      destroyOnClose
      maskClosable={false}
      onCancel={handleCancel}
      footer={
        <div className={style.buttonGroup}>
          <Button onClick={handleCancel}>{I18N.Factors.cancel}</Button>
          <Button
            loading={loading}
            type='primary'
            onClick={() => {
              handleSave();
            }}
          >
            {I18N.Factors.preserve}
          </Button>
        </div>
      }
    >
      <div className={style.paramsWrapper}>
        {/* 左侧固定参数列表 */}
        <div className={style.paramsLeft}>
          <Search
            placeholder={I18N.eca.parameter}
            onSearch={handleSearch}
            onChange={e => handleSearch(e.target.value)} // 实时搜索
            style={{ width: '100%' }}
          />
          <div>
            <Table
              rowKey='paramCode'
              rowSelection={{
                type: 'checkbox',
                selectedRowKeys: selectedLeftRows?.map?.(
                  row => row.paramCode as string,
                ),
                onChange: handleLeftSelectChange,
                getCheckboxProps: item => ({
                  /** disabled不可选择 */
                  disabled: item.disabled,
                }),
              }}
              columns={[
                {
                  title: I18N.supplyChainCarbonManagement.selectAll,
                  dataIndex: 'paramNameText',
                  render: (value, record) => {
                    return (
                      <div
                        onClick={() => {
                          if (record.id) {
                            setEditData(record as Param);
                            setActionBtnType(PageTypeInfo.show);
                            setParamsOpen(true);
                          }
                        }}
                      >
                        <EllipsisTextRender value={value} link />
                      </div>
                    );
                  },
                },
              ]}
              dataSource={filteredLeftData}
              pagination={false}
              size='small'
              scroll={{ y: 55 * 8 }}
            />
          </div>
        </div>
        <div className={style.centerButton}>
          {/* 向右传递数据 */}
          <Button
            type='primary'
            onClick={handleMoveToRight}
            icon={<RightOutlined />}
            size='small'
            disabled={getValidSelectedLeftRows().length === 0}
          />
          {/* 向左取消左侧参数数据已选择的状态，同时右侧对应paramsCode相同的数据被过滤掉 */}
          <Button
            type='primary'
            onClick={handleMoveToLeft}
            icon={<LeftOutlined />}
            size='small'
            disabled={selectedRightRows.length === 0}
          />
        </div>
        {/* 右侧参数查询模板id和排放源id对应的参数列表 */}
        <div className={style.paramsRight}>
          <div
            ref={dragContainerRef}
            style={{ transition: 'opacity 0.2s ease' }}
          >
            <DragSortTable
              rowKey='paramCode'
              size='small'
              dataSource={rightTableData}
              columns={paramsRightColumns(
                handleRequiredFlagChange,
                handleDisplayFlagChange,
                handleEdit,
              )}
              rowSelection={{
                onChange: handleRightSelectChange,
                selectedRowKeys: selectedRightKeys,
                getCheckboxProps: item => ({
                  /** 全局参数不可选择 */
                  disabled: item.paramScope === GLOBAL_PARAMETER,
                }),
              }}
              search={false}
              toolBarRender={false}
              pagination={false}
              scroll={{ y: 55 * 7 }}
              dragSortKey='id'
              onDragSortEnd={handleDragSortEnd}
            />
          </div>
          <div className={style.mergeDimension}>
            <Form form={form}>
              <Form.Item
                label={
                  <Tooltip title={I18N.eca.inNumericalCalculations}>
                    <span className='mr-5'>{I18N.eca.mergeLatitude}</span>
                    <QuestionCircleOutlined />
                  </Tooltip>
                }
                name='mergeDimension'
                required
              >
                <Select
                  style={{ width: '100%' }}
                  mode='multiple'
                  optionFilterProp='label'
                  /** 只要文本、选项类型的数据 */
                  options={rightTableData
                    ?.filter(
                      item =>
                        item.paramType === TEXT || item.paramType === SELECT,
                    )
                    ?.map?.(item => {
                      return {
                        label: item.paramNameText,
                        value: item.paramCode,
                      };
                    })}
                />
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
      {/* 编辑参数 */}
      <ParamsDrawerInfo
        disabledFields={['paramName']}
        actionBtnType={actionBtnType}
        open={paramsOpen}
        onOk={currentData => {
          saveScrollPosition();

          setParamsOpen(false);
          setEditData(undefined);
          const newRightTableData = rightTableData.map(item =>
            item.paramCode === currentData?.paramCode
              ? {
                  ...currentData,
                  paramType_name: INPUT_TYPE_OPTIONS?.filter(
                    item => item.value === currentData?.paramType,
                  )?.[0]?.label,
                }
              : item,
          );
          setRightTableData(newRightTableData);
        }}
        onClose={() => {
          setParamsOpen(false);
          setEditData(undefined);
          setActionBtnType(undefined);
        }}
        currentInfo={editData}
      />
    </Modal>
  );
};

export default ParameterManagement;

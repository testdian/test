/**
 * @file 碳排放核算/任务样式/匹配因子操作弹窗
 */
import { SearchOutlined } from '@ant-design/icons';
import I18N from '@src/lang/I18N';
import {
  Button,
  Cascader,
  Form,
  InputNumber,
  Modal,
  Select,
  Spin,
  Table,
  Typography,
} from 'antd';
import { ColumnType } from 'antd/es/table';
import classNames from 'classnames';
import { isArray } from 'lodash-es';
import { useEffect, useMemo, useState } from 'react';

import { getUnitConvert } from '@/api/compution';
import { ModalFooter } from '@/components/ModalFooter';
import { useAllEnumsBatch } from '@/hooks/dict';
import { Factor } from '@/sdks/systemV2ApiDocs';
import { Toast, changeFactorM2cascaderOptions } from '@/utils';
import { FullPageDetail } from '@/views/Factors/FullPageDetail';
import ChooseParamsFactor from '@/views/eca/emissionManage/Info/ChooseParamsFactor';
import { EmissionSourceFactorSelectReqRequest } from '@/views/eca/emissionManage/type';

import styles from './index.module.less';
import { editEmissionSourceFactorFactorApi } from './service';
import { getUnMatchFactorListApi } from '../../service';
import {
  ComputationSourceReqResponse,
  ComputationSourceRequest,
  FactorList,
  MainParamList,
} from '../../type';

const { Text } = Typography;

// 提取因子分母单位（从 kgCO₂e/㎡ 中提取 ㎡）
const extractDenominatorUnit = (unit: string) => {
  if (!unit) return '';
  const parts = unit.split('/');
  return parts.length > 1 ? parts[1] : unit;
};

/**
 * 根据指定值匹配出对应的级联选项
 * @param selectedPaths 指定值数组，如 ['1,2', '2,16']
 * @param cascaderOptions 完整的级联选项
 * @returns 匹配后的级联选项
 */
const filterCascaderOptions = (
  selectedPaths: string[],
  cascaderOptions: any[],
): any[] => {
  if (!selectedPaths || selectedPaths.length === 0 || !cascaderOptions) {
    return [];
  }

  // 将所有选中的路径解析成结构化数据
  const pathMap = new Map<string, Set<string>>();

  selectedPaths.forEach(path => {
    const parts = path.split(',');
    if (parts.length > 0) {
      const parentValue = parts[0];
      const childValue = parts.length > 1 ? parts[1] : null;

      if (!pathMap.has(parentValue)) {
        pathMap.set(parentValue, new Set());
      }
      if (childValue) {
        pathMap.get(parentValue)?.add(childValue);
      }
    }
  });

  // 过滤级联选项
  const filteredOptions: any[] = [];

  cascaderOptions.forEach(parentOption => {
    const parentValue = String(parentOption.value);

    if (pathMap.has(parentValue)) {
      const childValues = pathMap.get(parentValue);

      // 如果有子节点
      if (parentOption.children && childValues && childValues.size > 0) {
        const filteredChildren = parentOption.children.filter((child: any) =>
          childValues.has(String(child.value)),
        );

        if (filteredChildren.length > 0) {
          filteredOptions.push({
            ...parentOption,
            children: filteredChildren,
          });
        }
      } else {
        // 如果没有指定子节点，保留整个父节点
        filteredOptions.push(parentOption);
      }
    }
  });

  return filteredOptions;
};

// 行标识类型
type RowKey = {
  mainParamIndex: number;
  factorIndex: number;
};

interface MatchFactorModalProps {
  okText?: string;
  tipsText?: string;
  matchFactorId: number;
  visible: boolean;
  emissionSourceDetail?: ComputationSourceRequest;
  onCancel: () => void;
  onSave: () => void;
}

const MatchFactorModal = ({
  okText = I18N.carbonFootPrintLCA.confirm,
  tipsText = I18N.eca.thereIsAMismatch,
  matchFactorId,
  visible,
  emissionSourceDetail,
  onCancel,
  onSave,
}: MatchFactorModalProps) => {
  /** 单位枚举 */
  const unitOption = useAllEnumsBatch('factorUnitM')?.factorUnitM;
  /** 单位枚举级联option */
  const unitOptionCascader = useMemo(() => {
    return changeFactorM2cascaderOptions(unitOption || []);
  }, [unitOption]);

  const [mainParamsList, setMainParamsList] = useState<
    ComputationSourceReqResponse[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [factorModalOpen, setFactorModalOpen] = useState(false);
  const [currentRowKeys, setCurrentRowKeys] = useState<RowKey>({
    mainParamIndex: -1,
    factorIndex: -1,
  });

  /** 设置查看因子详情全屏页面展示 */
  const [factorDetailModalOpen, setFactorDetailModalOpen] = useState(false);

  /** 设置点击因子弹窗中的查看详情id值 */
  const [checkFactorId, setCheckFactorId] = useState<string>();

  // 使用单独的状态管理选中的因子，结构为 { [rowKey]: Factor }
  const [selectedFactors, setSelectedFactors] = useState<{
    [key: string]: Factor;
  }>({});

  // 创建表单实例
  const [form] = Form.useForm();

  // 生成行键
  const getRowKey = (mainParamIndex: number, factorIndex: number) =>
    `${mainParamIndex}-${factorIndex}`;

  // 获取表单字段名
  const getFieldName = (rowKey: string, paramCode: string) =>
    `row-${rowKey}-${paramCode}`;

  /** 查询单位换算并自动填充 */
  const fetchUnitConvert = async (
    activityUnit: string,
    factorUnit: string,
  ): Promise<number | null> => {
    if (!activityUnit || !factorUnit) return null;

    try {
      const { data } = await getUnitConvert({
        unitFrom: activityUnit,
        unitTo: factorUnit,
      });

      const convertRatio = data?.data;
      if (convertRatio !== undefined && convertRatio !== null) {
        return Number(convertRatio);
      }
      return null;
    } catch (error) {
      // 查询失败，返回 null
      return null;
    }
  };

  /** 获取所有参数列表 */
  const getAllParamsTable = async () => {
    if (!matchFactorId) return;
    setLoading(true);
    try {
      const { data } = await getUnMatchFactorListApi({
        computationSourceId: matchFactorId,
      });

      const dataList = data?.data || [];

      const result = dataList?.[0]?.mainParamList || [];
      // 初始化表单值和选中的因子
      const initialValues: any = {};
      const initialSelectedFactors: { [key: string]: Factor } = {};

      result?.forEach((mainParam, mainParamIndex) => {
        mainParam.factorList?.forEach((factor, factorIndex) => {
          const rowKey = getRowKey(mainParamIndex, factorIndex);
          // 设置因子ID
          initialValues[getFieldName(rowKey, 'factorId')] = factor.factorId;

          // 设置参数值
          factor.paramValueList?.forEach(param => {
            initialValues[getFieldName(rowKey, param.paramCode)] = param.value;
          });

          // 初始化活动数据单位和换算比率
          initialValues[getFieldName(rowKey, 'activityDataUnit')] = (
            factor as any
          )?.activityDataUnit
            ? (factor as any).activityDataUnit.split(',')
            : undefined;
          initialValues[getFieldName(rowKey, 'convertRatio')] =
            (factor as any)?.convertRatio || undefined;
          // 保存因子分母单位
          initialValues[getFieldName(rowKey, 'factorDenominatorUnit')] =
            extractDenominatorUnit(factor?.unit || '');

          // 初始化选中的因子（用于显示"选择因子"按钮的文本）
          if (factor.factorId) {
            initialSelectedFactors[rowKey] = {
              id: factor.factorId,
              name: factor.factorName,
              factorValue: factor.factorValue,
              unit: factor.unit,
            } as Factor;
          }
        });
      });
      form.setFieldsValue(initialValues);
      setSelectedFactors(initialSelectedFactors);
      setMainParamsList(dataList || []);
    } catch (error) {
      // 获取参数列表失败
    } finally {
      setLoading(false);
    }
  };

  // 处理失去焦点事件，保存行数据
  const handleBlurSave = async (
    rowKey: string,
    /** 因子id */
    factorId: number,
    /**
     * 因子值id
     */
    id: number,
    /**  因子表id */
    emissionSourceFactorId: number,
    /** 排放源id */
    emissionSourceId: number,
    /** 模板id */
    emissionSourceTemplateId: number,
  ) => {
    // 获取当前行的所有字段
    const rowFields = Object.keys(form.getFieldsValue()).filter(field =>
      field.startsWith(`row-${rowKey}-`),
    );

    // 验证当前行的所有字段
    await form.validateFields(rowFields);

    // 准备保存数据
    const values = form.getFieldsValue(rowFields);
    const valueList = rowFields
      .filter(
        field =>
          !field.endsWith('-factorId') &&
          !field.endsWith('-activityDataUnit') &&
          !field.endsWith('-convertRatio') &&
          !field.endsWith('-factorDenominatorUnit'),
      )
      .filter(
        field =>
          values[field] !== undefined &&
          values[field] !== null &&
          values[field] !== '',
      )
      .map(field => {
        const paramCode = field.split('-').pop() || '';
        return { paramCode, value: values[field] };
      });

    // 获取活动数据单位和换算比率
    const activityDataUnitField = getFieldName(rowKey, 'activityDataUnit');
    const convertRatioField = getFieldName(rowKey, 'convertRatio');
    const activityDataUnitValue = values[activityDataUnitField];
    const convertRatioValue = values[convertRatioField];

    const saveData: EmissionSourceFactorSelectReqRequest = {
      emissionSourceFactorId,
      emissionSourceId,
      emissionSourceTemplateId,
      computationSourceId: emissionSourceDetail?.id,
      factorId,
      id,
      valueList: valueList?.map(item => item.value),
      activityDataUnit: isArray(activityDataUnitValue)
        ? activityDataUnitValue.join(',')
        : activityDataUnitValue,
      convertRatio: convertRatioValue,
    };

    // 调用保存API
    await editEmissionSourceFactorFactorApi(saveData);

    Toast('success', I18N.supplyChainCarbonManagement.operationSuccessful);
  };

  /** 根据所有参数列表的每个mainParamList的factorList的第一个的paramValueList的paramName作为表头 */
  const renderColumns = (record: MainParamList, mainParamsIndex: number) => {
    const paramValueList = record?.factorList?.[0]?.paramValueList || [];
    // 获取活动数据单位列表（从 record 层级获取）
    const activityDataUnitList = (record as any)?.activityDataUnitList || [];
    const activityDataUnitOptions = filterCascaderOptions(
      activityDataUnitList,
      unitOptionCascader,
    );

    // 动态生成参数列
    const currentColumns: ColumnType<FactorList>[] =
      paramValueList?.map?.(item => {
        const column: ColumnType<FactorList> = {
          width: 200,
          title: item?.paramName,
          dataIndex: `${item?.paramCode}`,
          ellipsis: true,
          render: (_, factorRecord, index: number) => {
            const rowKey = getRowKey(mainParamsIndex, index);
            const fieldName = getFieldName(rowKey, item.paramCode);

            // 从当前行的factorRecord中找到对应的参数值
            const currentParam = factorRecord?.paramValueList?.find(
              param => param.paramCode === item.paramCode,
            );

            return (
              <Form.Item name={fieldName} style={{ marginBottom: 0 }}>
                {/* <Input style={{ width: '100%' }} disabled /> */}
                <Select
                  options={[
                    {
                      label: currentParam?.valueName,
                      value: currentParam?.value,
                    },
                  ]}
                  style={{ width: '100%' }}
                  disabled
                />
              </Form.Item>
            );
          },
        } as ColumnType<FactorList>;
        return column;
      }) || [];

    const baseColumns: ColumnType<FactorList>[] = [
      // 固定列 - 选择因子
      {
        title: I18N.carbonFootPrintLCA.selectionFactor,
        dataIndex: 'factorList',
        width: 200,
        render: (_, factorRecord, index) => {
          const rowKey = getRowKey(mainParamsIndex, index);
          const currentFactor = selectedFactors[rowKey] || {};
          const fieldName = getFieldName(rowKey, 'factorId');
          return (
            <Form.Item name={fieldName} style={{ marginBottom: 0 }}>
              <Button
                type='link'
                icon={<SearchOutlined />}
                onClick={() => {
                  setCurrentRowKeys({
                    mainParamIndex: mainParamsIndex,
                    factorIndex: index,
                  });
                  setFactorModalOpen(true);
                }}
              >
                <Text
                  style={{ width: 200, textAlign: 'left' }}
                  ellipsis={{
                    tooltip: `${currentFactor?.name} ${currentFactor?.factorValue} ${currentFactor?.unit}`,
                  }}
                >
                  {currentFactor.name
                    ? `${currentFactor?.name}  ${currentFactor?.factorValue} ${currentFactor?.unit}`
                    : I18N.carbonFootPrintLCA.selectionFactor}
                </Text>
              </Button>
            </Form.Item>
          );
        },
      },
      // 因子单位换算列
      {
        title: '因子单位换算（活动数据单位/因子分母单位）',
        dataIndex: 'factorUnitConversion',
        key: 'factorUnitConversion',
        width: 400,
        render: (_, factorRecord, index) => {
          const rowKey = getRowKey(mainParamsIndex, index);
          const activityDataUnitField = getFieldName(
            rowKey,
            'activityDataUnit',
          );
          const convertRatioField = getFieldName(rowKey, 'convertRatio');
          const factorDenominatorUnitField = getFieldName(
            rowKey,
            'factorDenominatorUnit',
          );

          // 获取因子分母单位
          const factorDenominatorUnit =
            form.getFieldValue(factorDenominatorUnitField) || '因子分母单位';

          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>1</span>
              <Form.Item
                name={activityDataUnitField}
                style={{ marginBottom: 0 }}
              >
                <Cascader
                  style={{ width: '150px' }}
                  options={
                    activityDataUnitOptions.length > 0
                      ? activityDataUnitOptions
                      : unitOptionCascader
                  }
                  onChange={async value => {
                    // 获取活动数据单位的完整路径（如 '1,2'）
                    const activityUnit =
                      value && value.length > 0 ? value.join(',') : '';
                    const factorUnit = form.getFieldValue(
                      factorDenominatorUnitField,
                    );

                    // 如果两个单位都有值，查询换算比率
                    if (activityUnit && factorUnit) {
                      const convertRatio = await fetchUnitConvert(
                        activityUnit,
                        factorUnit,
                      );
                      if (convertRatio !== null) {
                        // 自动填充换算比率
                        form.setFieldsValue({
                          [convertRatioField]: convertRatio,
                        });
                      }
                    }

                    // 保存数据
                    if (
                      mainParamsList[0]?.mainParamList?.[mainParamsIndex]
                        ?.factorList?.[index]?.id
                    ) {
                      const mainParam =
                        mainParamsList?.[0]?.mainParamList?.[mainParamsIndex];
                      const {
                        emissionSourceFactorId = 0,
                        emissionSourceId = 0,
                        emissionSourceTemplateId = 0,
                      } = mainParam || {};

                      // 从表单中获取最新的factorId，而不是使用factorRecord.factorId
                      const factorIdField = getFieldName(rowKey, 'factorId');
                      const currentFactorId = form.getFieldValue(factorIdField);

                      await handleBlurSave(
                        rowKey,
                        currentFactorId,
                        mainParamsList[0]?.mainParamList?.[mainParamsIndex]
                          ?.factorList?.[index]?.id || 0,
                        emissionSourceFactorId,
                        emissionSourceId,
                        emissionSourceTemplateId,
                      );
                    }
                  }}
                  placeholder='选择单位'
                  displayRender={label => {
                    if (!label || label.length === 0) return '';
                    return label[label.length - 1];
                  }}
                  showSearch
                />
              </Form.Item>
              <span>=</span>
              <Form.Item name={convertRatioField} style={{ marginBottom: 0 }}>
                <InputNumber
                  style={{ width: '150px' }}
                  onChange={() => {
                    // 失去焦点时保存
                  }}
                  onBlur={async () => {
                    // 保存数据
                    if (
                      mainParamsList[0]?.mainParamList?.[mainParamsIndex]
                        ?.factorList?.[index]?.id
                    ) {
                      const mainParam =
                        mainParamsList?.[0]?.mainParamList?.[mainParamsIndex];
                      const {
                        emissionSourceFactorId = 0,
                        emissionSourceId = 0,
                        emissionSourceTemplateId = 0,
                      } = mainParam || {};

                      // 从表单中获取最新的factorId，而不是使用factorRecord.factorId
                      const factorIdField = getFieldName(rowKey, 'factorId');
                      const currentFactorId = form.getFieldValue(factorIdField);

                      await handleBlurSave(
                        rowKey,
                        currentFactorId,
                        mainParamsList[0]?.mainParamList?.[mainParamsIndex]
                          ?.factorList?.[index]?.id || 0,
                        emissionSourceFactorId,
                        emissionSourceId,
                        emissionSourceTemplateId,
                      );
                    }
                  }}
                />
              </Form.Item>
              <span>{factorDenominatorUnit}</span>
            </div>
          );
        },
      },
    ];
    return [...currentColumns, ...baseColumns];
  };

  // 更新选中的因子
  const handleFactorSelected = async (data: Factor) => {
    setFactorModalOpen(false);

    if (
      currentRowKeys.mainParamIndex !== -1 &&
      currentRowKeys.factorIndex !== -1
    ) {
      const rowKey = getRowKey(
        currentRowKeys.mainParamIndex,
        currentRowKeys.factorIndex,
      );

      setSelectedFactors(prev => ({
        ...prev,
        [rowKey]: data,
      }));

      // 提取因子分母单位并保存到表单
      const factorDenominatorUnit = extractDenominatorUnit(data.unit || '');
      const factorDenominatorUnitField = getFieldName(
        rowKey,
        'factorDenominatorUnit',
      );

      // 更新表单中的因子ID和因子分母单位
      form.setFieldsValue({
        [getFieldName(rowKey, 'factorId')]: data.id,
        [factorDenominatorUnitField]: factorDenominatorUnit,
      });

      // 获取活动数据单位，如果有则查询换算比率
      const activityDataUnitField = getFieldName(rowKey, 'activityDataUnit');
      const convertRatioField = getFieldName(rowKey, 'convertRatio');
      const activityDataUnitValue = form.getFieldValue(activityDataUnitField);
      const activityUnit =
        activityDataUnitValue && activityDataUnitValue.length > 0
          ? activityDataUnitValue.join(',')
          : '';

      // 如果两个单位都有值，查询换算比率并更新
      if (activityUnit && factorDenominatorUnit) {
        const convertRatio = await fetchUnitConvert(
          activityUnit,
          factorDenominatorUnit,
        );
        if (convertRatio !== null) {
          // 自动填充换算比率到表单
          form.setFieldsValue({
            [convertRatioField]: convertRatio,
          });
        }
      }

      // 选中因子后自动保存
      if (
        data.id &&
        mainParamsList[0]?.mainParamList?.[currentRowKeys.mainParamIndex]
          ?.factorList?.[currentRowKeys.factorIndex]?.id
      ) {
        const mainParam =
          mainParamsList?.[0]?.mainParamList?.[currentRowKeys.mainParamIndex];
        const {
          emissionSourceFactorId = 0,
          emissionSourceId = 0,
          emissionSourceTemplateId = 0,
        } = mainParam || {};

        await handleBlurSave(
          rowKey,
          data.id,
          mainParamsList[0]?.mainParamList?.[currentRowKeys.mainParamIndex]
            ?.factorList?.[currentRowKeys.factorIndex]?.id || 0,
          emissionSourceFactorId,
          emissionSourceId,
          emissionSourceTemplateId,
        );
      }
    }
  };

  useEffect(() => {
    if (visible) {
      getAllParamsTable();
    } else {
      // 弹窗关闭时重置状态
      setCurrentRowKeys({
        mainParamIndex: -1,
        factorIndex: -1,
      });
      setSelectedFactors({});
      setMainParamsList([]);
      setLoading(false);
      form.resetFields();
    }
  }, [visible, matchFactorId]);

  const currentSelectedFactor =
    currentRowKeys.mainParamIndex !== -1 && currentRowKeys.factorIndex !== -1
      ? selectedFactors[
          getRowKey(currentRowKeys.mainParamIndex, currentRowKeys.factorIndex)
        ]
      : undefined;

  return (
    <div>
      <Modal
        key='matchFactor'
        title={I18N.eca.emissionFactorMatching}
        open={visible}
        maskClosable={false}
        width='70%'
        onCancel={() => {
          onCancel();
        }}
        footer={
          <ModalFooter
            isView={false}
            onCancel={onCancel}
            onOk={() => {
              onSave();
            }}
            okText={okText}
          />
        }
      >
        <div className={classNames(styles.tips, 'baseText16Color666')}>
          {tipsText}
        </div>
        <Spin spinning={loading}>
          <Form form={form}>
            {mainParamsList?.[0]?.mainParamList?.map?.((item, index) => {
              return (
                <div
                  style={{ marginBottom: 20 }}
                  key={item.associatedParamName}
                >
                  <h4 style={{ marginBottom: 10 }}>{item?.mainParamName}</h4>
                  <Table<any>
                    size='small'
                    pagination={false}
                    dataSource={item?.factorList}
                    columns={renderColumns(item, index)}
                  />
                </div>
              );
            })}
          </Form>
        </Spin>
      </Modal>
      {/* 选择排放因子弹窗 */}
      <Modal
        key='chooseFactor'
        width='80%'
        open={factorModalOpen}
        footer={null}
        onCancel={() => {
          setFactorModalOpen(false);
        }}
        destroyOnHidden
      >
        <ChooseParamsFactor
          selectedFactor={currentSelectedFactor}
          onDetailClick={row => {
            /** 查看因子详情 */
            setCheckFactorId(row.id?.toString());
            setFactorDetailModalOpen(true);
          }}
          onConfirmClick={handleFactorSelected}
          onCancelClick={() => {
            setFactorModalOpen(false);
          }}
        />
      </Modal>
      {/* 查看因子详情Modal */}
      <FullPageDetail
        open={factorDetailModalOpen}
        onClose={() => {
          setFactorDetailModalOpen(false);
        }}
        initFactorId={checkFactorId || ''}
      />
    </div>
  );
};

export default MatchFactorModal;

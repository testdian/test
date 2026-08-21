import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import I18N from '@src/lang/I18N';
import {
  Table,
  Input,
  Select,
  DatePicker,
  Button,
  Popconfirm,
  message,
  InputNumber,
  Modal,
  Divider,
  Space,
  InputRef,
  Cascader,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import { compact, isArray, isString } from 'lodash-es';
import React, { useState, useEffect, useRef, useMemo } from 'react';

import { getUnitConvert } from '@/api/compution';
import { Dicts, useAllEnumsBatch } from '@/hooks/dict';
import { modal } from '@/store/module/notification';
import { changeFactorM2cascaderOptions } from '@/utils';
import { FullPageDetail } from '@/views/Factors/FullPageDetail';
import { COMMON_PARAM_TYPE } from '@/views/eca/util/constant';
import { fetchParamsSelectOptions } from '@/views/eca/util/paramsUtil/valueTypeColumns';

import style from './index.module.less';
import { EditableTableProps } from './type';
import {
  deleteEmissionSourceFactorApi,
  deleteEmissionSourceFactorFactorApi,
  editEmissionSourceFactorApi,
  selectEmissionSourceFactorFactorApi,
  matchEmissionSourceFactorApi,
} from '../../../service';
import {
  EmissionSourceFactorResp,
  EmissionSourceFactorSelectReqRequest,
  EmissionSourceFactorValueResp,
  EmissionSourceParam,
  MatchEmissionSourceFactorResp,
} from '../../../type';
import ChooseParamsFactor, {
  ChooseParamsFactorSelectedFactor,
} from '../../ChooseParamsFactor';

const { Text } = Typography;

const { NUMBER, SELECT, TIME } = COMMON_PARAM_TYPE;

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

// 接口保存函数
const saveRowData = async (
  currentRow: EmissionSourceFactorSelectReqRequest,
  computationSourceId?: number,
) => {
  /** 如果是新增用selectEmissionSourceFactorFactorApi接口 新增无id值 */
  const { data } = await selectEmissionSourceFactorFactorApi({
    /** 选择的因子id */
    factorId: currentRow.factorId,
    /** 主要参数id */
    emissionSourceFactorId: currentRow?.emissionSourceFactorId,
    emissionSourceId: currentRow?.emissionSourceId,
    emissionSourceTemplateId: currentRow?.emissionSourceTemplateId,
    computationSourceId,
    valueList: currentRow?.subParams?.every(
      (item: string) => typeof item === 'string' && item?.trim() !== '',
    )
      ? currentRow?.subParams
      : undefined,
    activityDataUnit: isArray(currentRow?.activityDataUnit)
      ? currentRow?.activityDataUnit.join(',')
      : currentRow?.activityDataUnit,
    convertRatio: currentRow?.convertRatio,
  });
  return { id: data?.data as unknown as string };
};

/** 编辑接口 */
const editRowData = async (
  data: EmissionSourceFactorSelectReqRequest,
  computationSourceId?: number,
) => {
  /** 如果是修改，用editEmissionSourceFactorApi接口 编辑有id值 */
  await editEmissionSourceFactorApi({
    id: data.id,
    /** 选择的因子id */
    factorId: data.factorId,
    /** 主要参数id */
    emissionSourceFactorId: data?.emissionSourceFactorId,
    emissionSourceId: data?.emissionSourceId,
    emissionSourceTemplateId: data?.emissionSourceTemplateId,
    computationSourceId,
    valueList: data?.subParams?.every(
      (item: string) => typeof item === 'string' && item?.trim() !== '',
    )
      ? data?.subParams
      : undefined,
    activityDataUnit: isArray(data?.activityDataUnit)
      ? data?.activityDataUnit.join(',')
      : data?.activityDataUnit,
    convertRatio: data?.convertRatio,
  });
};

// 提取因子分母单位（从 kgCO₂e/㎡ 中提取 ㎡）
const extractDenominatorUnit = (unit: string) => {
  if (!unit) return '';
  const parts = unit.split('/');
  return parts.length > 1 ? parts[1] : unit;
};

const parseEmissionFactorName = (emissionFactor?: string) => {
  if (!emissionFactor) return undefined;
  return emissionFactor.replace(/\s*\([^)]*\)\s*$/, '') || undefined;
};

const isSameFactorId = (
  left?: string | number | null,
  right?: string | number | null,
) =>
  left !== undefined &&
  left !== null &&
  left !== '' &&
  right !== undefined &&
  right !== null &&
  right !== '' &&
  String(left) === String(right);

const getSelectedFactorFromRow = (
  row?: Record<string, any>,
  rowFactor?: EmissionSourceFactorValueResp,
): ChooseParamsFactorSelectedFactor | undefined => {
  const sourceRow = row || {};

  if (
    !sourceRow.factorId &&
    !sourceRow.factorValueId &&
    !sourceRow.emissionFactor &&
    !rowFactor?.factorId &&
    !rowFactor?.factorName
  ) {
    return undefined;
  }

  const matchedFactor =
    rowFactor ||
    sourceRow.factorList?.find(
      (factor: EmissionSourceFactorValueResp) =>
        isSameFactorId(factor.factorId, sourceRow.factorId) ||
        isSameFactorId(factor.id, sourceRow.factorValueId) ||
        isSameFactorId(factor.factorValueId, sourceRow.factorValueId),
    );

  return {
    ...matchedFactor,
    id: sourceRow.factorId ?? matchedFactor?.factorId,
    factorId: sourceRow.factorId ?? matchedFactor?.factorId,
    factorName:
      sourceRow.factorName ??
      matchedFactor?.factorName ??
      parseEmissionFactorName(sourceRow.emissionFactor),
    factorValue: sourceRow.factorValue ?? matchedFactor?.factorValue,
    factorValueId: sourceRow.factorValueId ?? matchedFactor?.factorValueId,
    name:
      sourceRow.factorName ??
      matchedFactor?.factorName ??
      parseEmissionFactorName(sourceRow.emissionFactor),
    unit: sourceRow.unit ?? matchedFactor?.unit,
  };
};

// 辅助校验函数：检查值是否有效（不能是 undefined、null 或空字符串）
const isValidString = (value: any): boolean => {
  return value !== undefined && value !== null && String(value).trim() !== '';
};

// 辅助校验函数：检查数组是否有效（长度大于0）
const isValidArray = (arr: any): boolean => {
  return Array.isArray(arr) && arr.length > 0;
};

// 校验函数
const validateRow = (row: any, associatedParamCodesLength: boolean) => {
  // 检查必填字段是否有效
  const isEmissionFactorValid = isValidString(row.emissionFactor);
  const isConvertRatioValid = isValidString(row.convertRatio);
  const isActivityDataUnitValid = isValidArray(row.activityDataUnit);

  // 如果没有副参数，只需要必填字段有效
  if (
    isEmissionFactorValid &&
    isConvertRatioValid &&
    isActivityDataUnitValid &&
    !associatedParamCodesLength
  ) {
    return true;
  }

  // 如果有副参数，需要所有副参数和必填字段都有效
  return (
    row.subParams.every((param: string) => isValidString(param)) &&
    isEmissionFactorValid &&
    isConvertRatioValid &&
    isActivityDataUnitValid
  );
};

// 转换数据格式
const convertData = (
  mainParamsList: EmissionSourceFactorResp[],
  templateList: EmissionSourceParam[],
  options: { [key: string]: Dicts[] },
) => {
  return mainParamsList?.map?.(column => {
    const associatedParams = column?.associatedParamCodes?.split(',');
    const subParams = associatedParams?.map?.(code => {
      const template = templateList.find(t => t.paramCode === code);
      if (template && template.dictEnum) {
        return {
          ...template,
          options: options[template.dictEnum] || [],
        };
      }
      return template || null;
    });

    const rows = column.factorList?.map(factor => {
      const paramValueMap = new Map();
      factor?.paramValueList?.forEach(paramValue => {
        paramValueMap.set(paramValue.paramCode, paramValue.value);
      });

      const showEmissionFactor =
        factor.factorName || factor.name || factor.factorValue
          ? `${factor.factorName || factor.name} (${factor.factorValue} ${
              factor.unit
            })`
          : '';

      return {
        subParams: subParams?.map?.(subParam => {
          if (subParam) {
            return paramValueMap.get(subParam.paramCode) || '';
          }
          return '';
        }),
        emissionFactor: showEmissionFactor,
        emissionSourceFactorId: column?.emissionSourceFactorId,
        emissionSourceId: column?.emissionSourceId,
        emissionSourceTemplateId: column?.emissionSourceTemplateId,
        factorId: factor?.factorId,
        factorName: factor?.factorName || factor?.name,
        factorValue: factor?.factorValue,
        unit: factor?.unit,
        id: column?.id,
        factorValueId: factor?.factorValueId,
        // 只保存因子分母单位（从 kgCO₂e/㎡ 中提取 ㎡）
        factorDenominatorUnit: extractDenominatorUnit(factor?.unit || ''),
        // 活动数据单位
        activityDataUnit: isString(factor?.activityDataUnit)
          ? factor?.activityDataUnit.split(',')
          : [],
        convertRatio: factor?.convertRatio,
      };
    }) || [
      {
        subParams: subParams?.map?.(() => ''),
        emissionFactor: '',
        emissionSourceFactorId: column?.emissionSourceFactorId,
        emissionSourceId: column?.emissionSourceId,
        emissionSourceTemplateId: column?.emissionSourceTemplateId,
        factorId: '',
        factorName: undefined,
        factorValue: undefined,
        unit: undefined,
        id: column?.id,
        factorValueId: column?.factorValueId,
        factorDenominatorUnit: undefined,
        activityDataUnit: undefined,
        convertRatio: undefined,
      },
    ];

    return {
      ...column,
      subParams,
      rows,
    };
  });
};

const EditableTable: React.FC<EditableTableProps> = ({
  computationSourceId,
  activeKeyTemplateId,
  mainParamsList,
  templateList,
  onSaveFactorSuccess,
  onDeleteAllFactorSuccess,
}) => {
  /** 单位枚举 */
  const unitOption = useAllEnumsBatch('factorUnitM')?.factorUnitM;
  /** 单位枚举级联option */
  const unitOptionCascader = useMemo(() => {
    return changeFactorM2cascaderOptions(unitOption || []);
  }, [unitOption]);

  const inputRef = useRef<InputRef>(null);
  const [optionsName, setOptionsName] = useState('');
  const [dataSource, setDataSource] = useState<
    {
      subParams: (EmissionSourceParam | null)[] | undefined;
      rows: { [key: string]: any }[];
      mainParamName?: string;
      factorList: EmissionSourceFactorValueResp[];
      associatedParamCodes?: string;
      emissionSourceFactorId?: number;
      emissionSourceId?: number;
      emissionSourceTemplateId?: number;
      id?: number;
      activityDataUnitList?: string[];
    }[]
  >([]);

  const [currentRow, setCurrentRow] = useState<any>(null);

  /** 设置排放因子弹窗展示 */
  const [factorModalOpen, setFactorModalOpen] = useState(false);

  /** 设置查看因子详情全屏页面展示 */
  const [factorDetailModalOpen, setFactorDetailModalOpen] = useState(false);

  /** 设置点击因子弹窗中的查看详情id值 */
  const [checkFactorId, setCheckFactorId] = useState<string>();

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

  const handleInputChange = (
    tableIndex: number,
    rowIndex: number,
    subIndex: number,
    value: any,
  ) => {
    const newDataSource = [...dataSource];
    // @ts-ignore
    newDataSource[tableIndex].rows[rowIndex].subParams[subIndex] = value;
    setDataSource(newDataSource);
  };

  /** 自动匹配因子（有副参数场景） */
  const autoMatchFactorWithSubParams = async (
    tableIndex: number,
    rowIndex: number,
    currentValue: string,
    currentSubIndex: number,
  ) => {
    try {
      const currentRowData = dataSource[tableIndex].rows[rowIndex];
      const subParams = currentRowData.subParams || [];

      // 收集所有有值的副参数，并将当前修改的值放在第一位
      const matchKeys: string[] = [currentValue];

      // 添加其他有值的副参数（排除当前修改的）
      subParams.forEach((param: string, index: number) => {
        if (
          index !== currentSubIndex &&
          param &&
          typeof param === 'string' &&
          param.trim() !== ''
        ) {
          matchKeys.push(param);
        }
      });

      // 如果没有有效的参数值，不进行匹配
      if (
        (matchKeys.length === 1 && matchKeys[0] === '') ||
        matchKeys.length === 0
      ) {
        return;
      }

      // 构建匹配接口参数，动态生成 key1, key2, key3...
      // const matchParams: any = matchKeys.reduce((acc, key, index) => {
      //   acc[`key${index + 1}`] = key || '';
      //   return acc;
      // }, {} as Record<string, string>);

      const params = {
        key1List: matchKeys,
      };

      // 调用匹配因子接口
      const { data } = await matchEmissionSourceFactorApi(params);

      // 接口返回的数据可能是数组或单个对象
      const factorList = Array.isArray(data?.data)
        ? data?.data
        : data?.data
        ? [data?.data]
        : [];

      // 如果匹配到因子列表且长度大于等于1
      if (factorList.length >= 1) {
        const selectedFactor = factorList[0] as MatchEmissionSourceFactorResp;

        // 更新 dataSource，将匹配到的第一个因子赋值给当前行
        setDataSource(prev => {
          const newDataSource = [...prev];
          if (
            newDataSource[tableIndex] &&
            newDataSource[tableIndex].rows[rowIndex]
          ) {
            const targetRow = newDataSource[tableIndex].rows[rowIndex];

            // 按照手动选择因子的逻辑赋值
            newDataSource[tableIndex].rows[rowIndex] = {
              ...targetRow,
              emissionFactor: `${selectedFactor.name} (${selectedFactor.factorValue} ${selectedFactor.unit})`,
              factorId: selectedFactor.id,
              factorName: selectedFactor.name,
              factorValue: selectedFactor.factorValue,
              unit: selectedFactor.unit,
              // 只保存因子分母单位（从 kgCO₂e/㎡ 中提取 ㎡）
              factorDenominatorUnit: extractDenominatorUnit(
                selectedFactor.unit || '',
              ),
            };
          }
          return newDataSource;
        });
      }
    } catch (error) {
      // 匹配失败或接口报错，不做处理，保持原样
      // eslint-disable-next-line no-console
      console.log('自动匹配因子失败（副参数场景）:', error);
    }
  };

  /** 基本输入框填写 */
  const handleBaseInputChange = async (
    tableIndex: number,
    rowIndex: number,
    subIndex: number,
    value: any,
  ) => {
    const newDataSource = [...dataSource];
    // @ts-ignore
    newDataSource[tableIndex].rows[rowIndex].subParams[subIndex] = value;
    setDataSource(newDataSource);

    // 获取副参数信息
    const associatedParamCodes =
      newDataSource[tableIndex]?.associatedParamCodes || '';

    // 如果有副参数，则触发自动匹配因子
    // 注意：这里会在每次输入时都触发，如果性能有问题，建议改为在失去焦点时触发
    if (associatedParamCodes && associatedParamCodes.trim().length > 0) {
      await autoMatchFactorWithSubParams(tableIndex, rowIndex, value, subIndex);
    }
  };

  /** 下拉框修改时保存 */
  const handleSelectChange = async (
    tableIndex: number,
    rowIndex: number,
    subIndex: number,
    value: any,
  ) => {
    const newDataSource = [...dataSource];
    // @ts-ignore
    newDataSource[tableIndex].rows[rowIndex].subParams[subIndex] = value;
    setDataSource(newDataSource);
    const currentRowData = newDataSource[tableIndex].rows[rowIndex];
    /** 是否有副参数 */
    const associatedParamCodes =
      newDataSource[tableIndex]?.associatedParamCodes || '';

    // 如果有副参数，在下拉框选择后自动匹配因子
    if (associatedParamCodes && associatedParamCodes.trim().length > 0) {
      // 获取选中值对应的 label
      const options =
        newDataSource[tableIndex]?.subParams?.[subIndex]?.options || [];
      const selectedOption = options.find(
        (opt: any) => opt.dictValue === value,
      );
      const selectedLabel = selectedOption?.dictLabel || value;
      await autoMatchFactorWithSubParams(
        tableIndex,
        rowIndex,
        selectedLabel,
        subIndex,
      );
    }

    if (validateRow(currentRowData, associatedParamCodes?.trim()?.length > 0)) {
      const factorListItemId =
        newDataSource[tableIndex].factorList?.[rowIndex]?.id;
      /** 如果有因子列表对应索引的id值 走编辑接口 */
      if (factorListItemId) {
        await editRowData(
          {
            ...(currentRowData as unknown as EmissionSourceFactorSelectReqRequest),
            id: factorListItemId,
          },
          computationSourceId,
        );
      } else {
        /** 走新增接口 */
        const saveResponse = await saveRowData(
          currentRowData as unknown as EmissionSourceFactorSelectReqRequest,
          computationSourceId,
        );
        const newId = saveResponse?.id;
        if (newId) {
          onSaveFactorSuccess?.();
        }
        // // 新增成功后，为该行数据添加接口返回的 id
        // const newDataSource = [...dataSource];
        // if (!newDataSource[tableIndex]?.factorList) {
        //   newDataSource[tableIndex].factorList = [];
        // }
        // newDataSource[tableIndex].factorList?.push({
        //   id: Number(newId),
        // });
        // setDataSource(newDataSource);
      }
    }
  };

  /** 失去焦点数据并保存 */
  const handleBlur = async (tableIndex: number, rowIndex: number) => {
    const currentRowData = dataSource[tableIndex].rows[rowIndex];
    /** 是否有副参数 */
    const associatedParamCodes =
      dataSource[tableIndex]?.associatedParamCodes || '';
    if (validateRow(currentRowData, associatedParamCodes?.trim()?.length > 0)) {
      const factorListItemId =
        dataSource[tableIndex].factorList?.[rowIndex]?.id;
      if (factorListItemId) {
        await editRowData(
          {
            ...(currentRowData as unknown as EmissionSourceFactorSelectReqRequest),
            id: Number(factorListItemId),
          },
          computationSourceId,
        );
      } else {
        const response = await saveRowData(
          currentRowData as unknown as EmissionSourceFactorSelectReqRequest,
          computationSourceId,
        );
        const newId = response?.id;
        if (newId) {
          onSaveFactorSuccess?.();
        }
        // const newDataSource = [...dataSource];
        // if (!newDataSource[tableIndex].factorList) {
        //   newDataSource[tableIndex].factorList = [];
        // }
        // newDataSource[tableIndex].factorList?.push({
        //   id: Number(response?.id),
        // });
        // setDataSource(newDataSource);
      }
    }
  };

  /** 删除公共方法 */
  const removeRowFromDataSource = (tableIndex: number, rowIndex: number) => {
    setDataSource(prev => {
      const newData = [...prev];
      newData[tableIndex].rows.splice(rowIndex, 1);
      return newData;
    });
  };
  /** 删除因子方法 */
  const handleDelete = async (
    tableIndex: number,
    rowIndex: number,
    record: { factorValueId: string },
  ) => {
    if (record?.factorValueId) {
      await deleteEmissionSourceFactorFactorApi(record.factorValueId);
    }
    removeRowFromDataSource(tableIndex, rowIndex);
  };

  const handleEmissionFactorClick = (
    tableIndex: number,
    row: any,
    rowIndex: number,
  ) => {
    const factorList = dataSource[tableIndex].factorList || [];
    const selectedFactor = getSelectedFactorFromRow(row, factorList[rowIndex]);
    setCurrentRow({ tableIndex, rowIndex, ...row, factorList, selectedFactor });
    setFactorModalOpen(true);
  };

  /** 选择排放因子弹窗确定按钮 */
  const handleSelectedFactorOk = async (selectedFactor: any) => {
    const newDataSource = dataSource.map((item, tableIndex) => {
      if (tableIndex === currentRow.tableIndex) {
        const newRows = item.rows.map((row: any, rowIndex: number) => {
          if (rowIndex === currentRow.rowIndex) {
            return {
              ...row,
              emissionFactor: `${
                selectedFactor.factorName || selectedFactor?.name
              } (${selectedFactor.factorValue} ${selectedFactor.unit})`,
              factorId: selectedFactor.id,
              factorName: selectedFactor.factorName || selectedFactor.name,
              factorValue: selectedFactor.factorValue,
              unit: selectedFactor.unit,
              // 只保存因子分母单位（从 kgCO₂e/㎡ 中提取 ㎡）
              factorDenominatorUnit: extractDenominatorUnit(
                selectedFactor.unit || '',
              ),
            };
          }
          return row;
        });
        return { ...item, rows: newRows };
      }
      return item;
    });

    // 获取当前行数据
    const currentRowData =
      newDataSource[currentRow.tableIndex].rows[currentRow.rowIndex];

    // 获取活动数据单位和因子分母单位，查询换算比率
    const activityUnit =
      currentRowData.activityDataUnit &&
      currentRowData.activityDataUnit.length > 0
        ? currentRowData.activityDataUnit.join(',')
        : '';
    const factorUnit = extractDenominatorUnit(selectedFactor.unit || '');

    // 如果两个单位都有值，查询换算比率并更新到 newDataSource
    if (activityUnit && factorUnit) {
      const convertRatio = await fetchUnitConvert(activityUnit, factorUnit);
      if (convertRatio !== null) {
        // 自动填充换算比率到 newDataSource
        newDataSource[currentRow.tableIndex].rows[
          currentRow.rowIndex
        ].convertRatio = convertRatio;
      }
    }

    // 统一更新数据源
    setDataSource(newDataSource);
    setFactorModalOpen(false);

    // 获取更新后的当前行数据（包含 convertRatio）
    const updatedCurrentRowData =
      newDataSource[currentRow.tableIndex].rows[currentRow.rowIndex];

    /** 是否有副参数 */
    const associatedParamCodes =
      newDataSource[currentRow.tableIndex]?.associatedParamCodes || '';
    /** 判断 字符串 */
    if (
      validateRow(
        updatedCurrentRowData,
        associatedParamCodes?.trim()?.length > 0,
      )
    ) {
      const factorListItemId =
        newDataSource[currentRow.tableIndex].factorList?.[currentRow.rowIndex]
          ?.id;
      /** 如果有因子列表对应索引的id值 走编辑接口 */
      if (factorListItemId) {
        await editRowData(
          {
            ...updatedCurrentRowData,
            id: factorListItemId,
          },
          computationSourceId,
        );
      } else {
        /** 走新增接口 */
        const saveResponse = await saveRowData(
          updatedCurrentRowData,
          computationSourceId,
        );
        const newId = saveResponse?.id;
        if (newId) {
          onSaveFactorSuccess?.();
        }
        // const newId = saveResponse?.id;
        // // 新增成功后，为该行数据添加接口返回的 id
        // const newDataSource = [...dataSource];
        // if (!newDataSource[currentRow.tableIndex]?.factorList) {
        //   newDataSource[currentRow.tableIndex].factorList = [];
        // }
        // newDataSource[currentRow.tableIndex].factorList?.push({
        //   // @ts-ignore
        //   id: newId,
        // });
        // setDataSource(newDataSource);
      }
      message.success(I18N.eca.dataRetention);
    }
  };

  const handleCancel = () => {
    setFactorModalOpen(false);
  };

  const handleAddRow = (tableIndex: number) => {
    const newDataSource = [...dataSource];
    const newRow = {
      subParams: newDataSource?.[tableIndex]?.subParams?.map?.(() => ''),
      /** 主要参数id */
      emissionSourceFactorId: (
        dataSource?.[tableIndex] as unknown as {
          emissionSourceFactorId: number;
        }
      )?.emissionSourceFactorId,
      emissionFactor: '',
      /** 排放源的id，当前url的id值 */
      emissionSourceId: newDataSource?.[tableIndex]?.emissionSourceId,
      /** 当前选中的模板id */
      emissionSourceTemplateId:
        newDataSource?.[tableIndex]?.emissionSourceTemplateId,
      factorId: undefined,
      factorName: undefined,
      factorValue: undefined,
      unit: undefined,
      id: undefined,
      factorDenominatorUnit: undefined,
      activityDataUnit: undefined,
      convertRatio: undefined,
    };
    newDataSource[tableIndex].rows.push(newRow as any);
    setDataSource(newDataSource);
  };

  /** 自动匹配因子并填充到第一行 */
  const autoMatchFactor = async (tableIndex: number, mainParamName: string) => {
    try {
      // 调用匹配因子接口，传入主参数名称作为 key1List
      const { data } = await matchEmissionSourceFactorApi({
        key1List: mainParamName ? [mainParamName] : [],
      });

      // 接口返回的数据可能是数组或单个对象
      const factorList = Array.isArray(data?.data)
        ? data?.data
        : data?.data
        ? [data?.data]
        : [];

      // 如果匹配到因子列表且长度大于等于1
      if (factorList.length >= 1) {
        const selectedFactor = factorList[0] as MatchEmissionSourceFactorResp;

        // 更新 dataSource，将匹配到的第一个因子赋值给第一行
        setDataSource(prev => {
          const newDataSource = [...prev];
          if (
            newDataSource[tableIndex] &&
            newDataSource[tableIndex].rows.length > 0
          ) {
            const firstRow = newDataSource[tableIndex].rows[0];

            // 按照手动选择因子的逻辑赋值
            newDataSource[tableIndex].rows[0] = {
              ...firstRow,
              emissionFactor: `${selectedFactor.name} (${selectedFactor.factorValue} ${selectedFactor.unit})`,
              factorId: selectedFactor.id,
              factorName: selectedFactor.name,
              factorValue: selectedFactor.factorValue,
              unit: selectedFactor.unit,
              // 只保存因子分母单位（从 kgCO₂e/㎡ 中提取 ㎡）
              factorDenominatorUnit: extractDenominatorUnit(
                selectedFactor.unit || '',
              ),
            };
          }
          return newDataSource;
        });
      }
    } catch (error) {
      // 匹配失败或接口报错，不做处理，保持原样
      // eslint-disable-next-line no-console
      console.log('自动匹配因子失败:', error);
    }
  };

  useEffect(() => {
    const fetchAllOptions = async () => {
      const dictEnumsSet = new Set<string>();
      // 收集所有需要请求的 dictEnum 值
      mainParamsList.forEach(column => {
        const associatedParams = column?.associatedParamCodes?.split(',');
        associatedParams?.forEach(code => {
          const template = templateList.find(t => t.paramCode === code);
          if (template && template.dictEnum) {
            dictEnumsSet.add(template.dictEnum);
          }
        });
      });
      const dictEnums = Array.from(dictEnumsSet).join(',');
      const options = dictEnums
        ? await fetchParamsSelectOptions(dictEnums)
        : {};
      // 确保始终执行数据转换
      const mainParamsData = convertData(mainParamsList, templateList, options);

      setDataSource(mainParamsData as any);

      // 自动匹配因子逻辑：当新增主参数且没有副参数时
      mainParamsData?.forEach?.(async (tableData, tableIndex) => {
        const associatedParamCodes = tableData?.associatedParamCodes || '';
        // 只有主参数没有副参数时（associatedParamCodes 为空）
        const hasNoSubParams =
          !associatedParamCodes || associatedParamCodes.trim().length === 0;

        // 检查第一行是否没有排放因子（说明是新增的）
        const firstRowHasNoFactor =
          tableData?.rows?.[0] &&
          (!tableData.rows[0].emissionFactor ||
            tableData.rows[0].emissionFactor.trim() === '');

        if (hasNoSubParams && firstRowHasNoFactor && tableData?.mainParamName) {
          // 自动匹配因子
          await autoMatchFactor(tableIndex, tableData.mainParamName);
        }
      });
    };

    fetchAllOptions();
  }, [activeKeyTemplateId, mainParamsList, templateList]);

  return (
    <>
      {dataSource?.map?.((tableData, tableIndex) => {
        /** 活动数据单位对应的选项值 */
        const activityDataUnitOptions = filterCascaderOptions(
          tableData?.activityDataUnitList || [],
          unitOptionCascader,
        );

        /** 是否有副参数 处理新增按钮、删除按钮置灰 */
        const associatedParamCodes = tableData?.associatedParamCodes || '';
        const disabled = associatedParamCodes?.length > 0;
        const columns = compact([
          // eslint-disable-next-line no-unsafe-optional-chaining
          ...(tableData?.subParams || [])?.map?.((subParam, subIndex) => {
            if (!subParam) return null;
            return {
              title: subParam?.paramName || '',
              dataIndex: `subParams.${subIndex}`,
              key: `subParams.${subIndex}`,
              width: '300px',
              render: (text: any, record: any, rowIndex: number) => {
                if (!subParam) return null;
                const paramsItemValue =
                  tableData?.rows?.[rowIndex]?.subParams?.[subIndex];
                switch (subParam.paramType) {
                  case SELECT: {
                    const options = subParam.options || [];
                    return (
                      <Select
                        allowClear
                        showSearch
                        filterOption={(input, option) => {
                          return option?.key?.includes?.(input);
                        }}
                        style={{ width: '100%' }}
                        value={
                          tableData?.rows?.[rowIndex]?.subParams?.[subIndex]
                        }
                        onChange={value =>
                          handleSelectChange(
                            tableIndex,
                            rowIndex,
                            subIndex,
                            value,
                          )
                        }
                        // eslint-disable-next-line react/no-unstable-nested-components
                        dropdownRender={menu => (
                          <>
                            {menu}
                            <Divider style={{ margin: '8px 0' }} />
                            <Space style={{ padding: '0 8px 4px' }}>
                              <Input
                                placeholder={I18N.eca.pleaseEnterToAdd}
                                ref={inputRef}
                                value={optionsName}
                                onChange={e => {
                                  setOptionsName(e.target.value);
                                }}
                                onKeyDown={e => e.stopPropagation()}
                              />
                              <Button
                                type='text'
                                icon={<PlusOutlined />}
                                onClick={e => {
                                  e.preventDefault();
                                  if (!optionsName) {
                                    message.warning(I18N.eca.pleaseEnterToAdd);
                                    return;
                                  }
                                  const newOption = {
                                    dictValue: optionsName,
                                    dictLabel: optionsName,
                                  };
                                  const newDataSource = [...dataSource];
                                  // @ts-ignore
                                  newDataSource[tableIndex].subParams[
                                    subIndex
                                  ].options = [
                                    // eslint-disable-next-line no-unsafe-optional-chaining
                                    ...newDataSource?.[tableIndex]?.subParams?.[
                                      subIndex
                                    ]?.options,
                                    newOption,
                                  ];
                                  setDataSource(newDataSource);
                                  setOptionsName('');
                                }}
                              >
                                {I18N.carbonAccount.add}
                              </Button>
                            </Space>
                          </>
                        )}
                      >
                        {(options as Dicts[])?.map?.((option: Dicts) => (
                          <Select.Option
                            key={option?.dictValue}
                            value={option?.dictValue}
                          >
                            {option?.dictLabel}
                          </Select.Option>
                        ))}
                      </Select>
                    );
                  }
                  case NUMBER:
                    return (
                      <InputNumber
                        style={{ width: '100%' }}
                        value={parseFloat(paramsItemValue) || undefined}
                        onChange={value =>
                          handleInputChange(
                            tableIndex,
                            rowIndex,
                            subIndex,
                            String(value),
                          )
                        }
                        onBlur={() => handleBlur(tableIndex, rowIndex)}
                      />
                    );
                  case TIME:
                    return (
                      <DatePicker
                        style={{ width: '100%' }}
                        value={
                          paramsItemValue ? dayjs(paramsItemValue) : undefined
                        }
                        onChange={date =>
                          handleInputChange(
                            tableIndex,
                            rowIndex,
                            subIndex,
                            date ? date.format('YYYY-MM-DD') : '',
                          )
                        }
                        onBlur={() => handleBlur(tableIndex, rowIndex)}
                      />
                    );
                  default:
                    return (
                      <Input
                        value={paramsItemValue}
                        onChange={e =>
                          handleBaseInputChange(
                            tableIndex,
                            rowIndex,
                            subIndex,
                            e.target.value,
                          )
                        }
                        onBlur={() => handleBlur(tableIndex, rowIndex)}
                      />
                    );
                }
              },
            };
          }),
          {
            title: I18N.Factors.emissionFactors,
            dataIndex: 'emissionFactor',
            key: 'emissionFactor',
            render: (text: any, record: any, rowIndex: number) => (
              <Button
                type='link'
                onClick={() =>
                  handleEmissionFactorClick(tableIndex, record, rowIndex)
                }
                icon={<SearchOutlined />}
              >
                <Text
                  ellipsis={{ tooltip: text }}
                  style={{ width: '350px', textAlign: 'left' }}
                >
                  {text || I18N.carbonFootPrintLCA.selectionFactor}
                </Text>
              </Button>
            ),
          },
          {
            title: '因子单位换算（活动数据单位/因子分母单位）',
            dataIndex: 'factorUnitConversion',
            key: 'factorUnitConversion',
            render: (_text, _record, rowIndex: number) => {
              const paramsItemValue = tableData?.rows?.[rowIndex]?.convertRatio;
              const factorDenominatorUnit =
                tableData?.rows?.[rowIndex]?.factorDenominatorUnit ||
                '因子分母单位';
              const activityDataUnitValue =
                tableData?.rows?.[rowIndex]?.activityDataUnit;
              // 当两个单位的换算已经在单位换算里维护时，自动代入，禁止编辑。未维护则用户手动填写
              return (
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <span>1</span>
                  <Cascader
                    style={{ width: '150px' }}
                    options={activityDataUnitOptions}
                    value={activityDataUnitValue}
                    onChange={async value => {
                      const newDataSource = [...dataSource];
                      newDataSource[tableIndex].rows[
                        rowIndex
                      ].activityDataUnit = value;

                      // 获取活动数据单位的完整路径（如 '1,2'）
                      const activityUnit =
                        value && value.length > 0 ? value.join(',') : '';
                      const factorUnit =
                        tableData?.rows?.[rowIndex]?.factorDenominatorUnit;

                      // 如果两个单位都有值，查询换算比率
                      if (activityUnit && factorUnit) {
                        const convertRatio = await fetchUnitConvert(
                          activityUnit,
                          factorUnit,
                        );
                        if (convertRatio !== null) {
                          // 自动填充换算比率
                          newDataSource[tableIndex].rows[
                            rowIndex
                          ].convertRatio = convertRatio;
                        }
                      }

                      // 统一更新数据源
                      setDataSource(newDataSource);
                    }}
                    placeholder='选择单位'
                    displayRender={label => {
                      if (!label || label.length === 0) return '';
                      return label[label.length - 1];
                    }}
                    showSearch
                    onBlur={() => handleBlur(tableIndex, rowIndex)}
                  />
                  <span>=</span>
                  <InputNumber
                    style={{ width: '150px' }}
                    value={parseFloat(paramsItemValue) || undefined}
                    onChange={value => {
                      const newDataSource = [...dataSource];
                      newDataSource[tableIndex].rows[rowIndex].convertRatio =
                        value;
                      setDataSource(newDataSource);
                    }}
                    onBlur={() => handleBlur(tableIndex, rowIndex)}
                  />
                  <span>{factorDenominatorUnit}</span>
                </div>
              );
            },
          },
          {
            title: I18N.Factors.operation,
            key: 'delete',
            width: 100,
            render: (_: any, record: any, rowIndex: number) => (
              <Popconfirm
                title={I18N.eca.confirmToDelete}
                onConfirm={() => handleDelete(tableIndex, rowIndex, record)}
                okText={I18N.carbonFootPrintLCA.confirm}
                cancelText={I18N.Factors.cancel}
              >
                <Button disabled={!disabled} type='link'>
                  {I18N.Factors.delete}
                </Button>
              </Popconfirm>
            ),
          },
        ]);
        const scrollX = (columns?.length || 0) * 300 || '';

        return (
          <div key={`${tableData?.mainParamName}`} style={{ margin: '0 12px' }}>
            <div className={style.tableTitle}>
              <div className={style.tableTitleHeader}>
                {tableData?.mainParamName || ''}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button
                  size='middle'
                  color='default'
                  variant='outlined'
                  onClick={() => {
                    modal.confirm({
                      title: I18N.eca.confirmToDelete,
                      okText: I18N.carbonFootPrintLCA.confirm,
                      cancelText: I18N.Factors.cancel,
                      onOk: async () => {
                        await deleteEmissionSourceFactorApi(
                          Number(tableData?.id),
                        );
                        onDeleteAllFactorSuccess();
                        // handleDeleteMainParam(tableIndex);
                        // message.success('删除成功');
                      },
                    });
                  }}
                >
                  {I18N.eca.deleteAll}
                </Button>
                <Button
                  size='middle'
                  variant='outlined'
                  type='primary'
                  disabled={!disabled}
                  onClick={() => handleAddRow(tableIndex)}
                >
                  <PlusOutlined /> {I18N.Factors.newAddition}
                </Button>
              </div>
            </div>
            <Table
              size='small'
              dataSource={tableData.rows}
              columns={columns}
              pagination={false}
              scroll={{ x: scrollX, y: 'calc(100vh - 420px)' }}
            />
          </div>
        );
      })}
      {/* 选择排放因子弹窗 */}
      <Modal
        width='80%'
        open={factorModalOpen}
        footer={null}
        onCancel={handleCancel}
        destroyOnHidden
      >
        <ChooseParamsFactor
          selectedFactor={currentRow?.selectedFactor}
          onDetailClick={row => {
            /** 查看因子详情 */
            setCheckFactorId(row.id?.toString());
            setFactorDetailModalOpen(true);
          }}
          onConfirmClick={data => {
            /** 确定选择因子后的数据 */
            handleSelectedFactorOk(data);
          }}
          onCancelClick={() => {
            handleCancel();
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
    </>
  );
};

export default EditableTable;

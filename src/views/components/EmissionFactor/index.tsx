/*
 * @@description: 产品碳足迹-排放因子详情
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-06-15 18:10:32
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-06-21 15:24:24
 */
import {
  NumberPicker,
  Space,
  Form,
  FormGrid,
  FormItem,
  FormLayout,
  Input,
  Select,
  DatePicker,
  Radio,
  Cascader,
} from '@formily/antd-v5';
import { createForm, onFieldValueChange, Field, FormPath } from '@formily/core';
import { createSchemaField, FormConsumer } from '@formily/react';
import I18N from '@src/lang/I18N';
import { Button } from 'antd';
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import {
  compact,
  isArray,
  omit,
  uniqBy,
  differenceWith,
  isEqual,
} from 'lodash-es';
import { useEffect, useMemo, useState } from 'react';

import CommonHeader from '@/components/CommonHeader';
import { FormActions } from '@/components/FormActions';
import { ProductionMaterials } from '@/sdks/footprintV2ApiDocs';
import { getSystemLibUnitUnitConvert } from '@/sdks/systemV2ApiDocs';
import {
  ProductionMaterialsDto,
  FootprintProcess,
} from '@/sdks_v2/new/supplychainV2ApiDocs';
import { getSearchParams } from '@/utils';
import { changeFactorM2cascaderOptions } from '@/views/Factors/Info/utils';
import { publishYear } from '@/views/Factors/utils';
import { FileListType } from '@/views/components/utils/types';
import { useAllEnumsBatch } from '@/views/dashborad/Dicts/hooks';
import Report from '@/views/supplyChainCarbonManagement/components/Report';

import style from './index.module.less';
import SelectButton from '../SelectButton';
import { materialsTypeList, emissionDataFieldState } from './utils/index';
import {
  basicSchema,
  emissionTypeSchema,
  emissionDataSchema,
} from './utils/schemas';
import {
  EmissionSourceData,
  UnitValueBackProps,
  UnitItemProps,
} from './utils/types';

type TypeEmissionFactor = ProductionMaterials & EmissionSourceData;

function EmissionFactor({
  isAdd,
  isDetail,
  stage,
  basicInfo,
  cathRecord,
  onSelectFactorNavigate,
  onSelectSupplierNavigate,
  onSave,
  onCancel,
}: {
  /** 是否为新增 */
  isAdd: boolean;
  /** 是否为详情 */
  isDetail: boolean;
  /** 生命周期阶段 */
  stage?: string;
  /** 页面顶部展示的信息 */
  basicInfo?: { label: string; value: string | number | undefined }[];
  /** 排放因子详情 */
  cathRecord?: ProductionMaterials | ProductionMaterialsDto | FootprintProcess;
  /** 选择排放因子按钮事件 */
  onSelectFactorNavigate?: (emissionDataParams: {
    /** 排放数据 */
    emissionData: ProductionMaterials;
    /** 支撑文件 */
    fileList: FileListType[];
    /** 默认带过去的名称 */
    likeName: string;
  }) => void;
  /** 选择供应商数据按钮事件 */
  onSelectSupplierNavigate?: (emissionDataParams: {
    /** 排放数据 */
    emissionData: ProductionMaterials;
    /** 支撑文件 */
    fileList: FileListType[];
    /** 默认带过去的名称 */
    likeProductName: string;
  }) => void;
  /** 保存按钮事件 */
  onSave?: (data: ProductionMaterials) => void;
  /** 取消按钮事件 */
  onCancel?: () => void;
}) {
  const SchemaField = createSchemaField({
    components: {
      NumberPicker,
      Space,
      Input,
      Select,
      DatePicker,
      Radio,
      Cascader,
      SelectButton,
      Form,
      FormItem,
      FormGrid,
      FormLayout,
    },
  });

  /** 核算数量单位以及分子单位的枚举值 */
  const accountsUnitsEnum = useAllEnumsBatch('factorUnitM,cequivalentUnitZ');
  const { factorUnitM, cequivalentUnitZ } = accountsUnitsEnum || {};

  /** 提示是否选择排放因子或供应商数据的标识 */
  const [flag, changeFlag] = useState(false);

  /** 路由上携带的参数 */
  const search = { ...getSearchParams()[0] };

  /** 排放源信息 */
  const emissionData = JSON.parse(search.emissionData || '{}');

  /** 支撑文件 */
  const fileListBack = JSON.parse(search.fileList || '[]');

  /** 运输类型时-计算方式 */
  const [formulaType, setFormulaType] = useState<number>();

  /** 按里程-产品重量的单位值 */
  const [productWeightValue, setProductWeightValue] = useState<string>();

  /** 按能耗以及非运输类型的单位值 */
  const [maMeasureValue, setMaMeasureValue] = useState<string[]>();

  /** 数量单位 */
  const [quantityUnit, setQuantityUnit] = useState<string>();

  /** 分母单位 */
  const [factorUnitMUnit, setFactorUnitMUnit] = useState<string>();

  /** 单位换算比例 */
  const [factorPercentMeasure, setFactorPercentMeasure] = useState<string>();

  /** 上传文件列表 */
  const [fileList, setFileList] = useState<FileListType[]>([]);

  /** 详情返回文件列表 */
  const [fileListDetail, setFileListDetail] = useState<FileListType[]>([]);

  /** 删除的文件列表 */
  const [delFileList, setDelFileList] = useState<FileListType[]>([]);

  const form = useMemo(
    () =>
      createForm({
        readPretty: isDetail,
      }),
    [],
  );

  /** 设置表单字段的状态 path: 路径， fieldFlag:布尔值 字段是否禁用，是否展示必填符 */
  const setFormFieldState = (path: string, title: string) => {
    form.setFieldState(FormPath.parse(path), {
      title,
    });
  };

  /** 监听表单值的更改 */
  const onAddFormListenFn = () => {
    /** 切换排放数据的选项值时 表单重置 0: 选择排放因子 1:新建排放因子 2: 供应商数据  */
    form.addEffects('factorType', () => {
      onFieldValueChange('.factorType', () => {
        form.reset('factorInfoObj');
      });
    });

    /** 获取数量单位以及分母单位的输入值 */
    form.addEffects('factorInfoObj.factorUnitM', () => {
      /** 当类型为运输时-计算方式 */
      onFieldValueChange('materialsTypeFormula', (field: Field) => {
        setFormulaType(field.value);
      });

      /** 按里程-产品重量 单位值 */
      onFieldValueChange('maMeasure2', (field: Field) => {
        setProductWeightValue(field.value);
        setFactorPercentMeasure(undefined);
      });

      /** 按能耗 以及 非运输类型 单位值 */
      onFieldValueChange('maMeasure', (field: Field) => {
        setMaMeasureValue(field.value);
        setFactorPercentMeasure(undefined);
      });

      /** 当选项类型为新建因子时 分母单位 */
      onFieldValueChange('factorInfoObj.factorUnitM', (field: Field) => {
        setFactorUnitMUnit(field?.value?.[1]);
        setFactorPercentMeasure(undefined);
      });
    });
  };

  /** 根据计算方式的不同，设置数量单位值 */
  useEffect(() => {
    switch (Number(formulaType)) {
      /** 产品重量 单位后面加km */
      case 1:
        setQuantityUnit(
          factorUnitM.find(v => v.dictLabel === `${productWeightValue}km`)
            ?.dictValue,
        );
        break;
      /** 载重比 单位默认为km */
      case 2:
        setQuantityUnit(factorUnitM.find(v => v.dictLabel === 'km')?.dictValue);
        break;
      /** 能耗以及非运输类型 */
      default:
        setQuantityUnit(maMeasureValue?.[1]);
        break;
    }
  }, [formulaType, productWeightValue, maMeasureValue]);

  /** 设置单位换算比例 */
  useEffect(() => {
    /** 单位换算比例有值，不调用接口 */
    if (factorPercentMeasure) {
      form.setFieldState('factorInfoObj.percentMeasure', {
        value: factorPercentMeasure,
      });
      return;
    }
    if (quantityUnit && factorUnitMUnit) {
      const params = {
        unitFrom: Number(quantityUnit),
        unitTo: Number(factorUnitMUnit),
      };
      getSystemLibUnitUnitConvert(params).then(({ data }) => {
        if (data.code === 200) {
          form.setFieldState('factorInfoObj.percentMeasure', {
            value: data.data,
          });
        }
      });
    }
  }, [quantityUnit, factorUnitMUnit, factorPercentMeasure]);

  /** 选择后返回的数据 */
  const selectFormValues = () => {
    /** 支撑文件 */
    if (fileListBack) {
      setFileList([...fileListBack]);
    }
    /** 排放数据 */
    if (emissionData) {
      let { factorInfoObj } = emissionData;

      if (!factorInfoObj) return;

      const { factorType, materialsTypeFormula, maMeasure2, maMeasure } =
        emissionData;

      /** 排放因子数据 */
      if (Number(factorType) === 0) {
        const unit =
          factorInfoObj?.unitCode?.split('/') || factorInfoObj.factorUnitM;
        const unitMItem = factorUnitM?.find(v => v.dictLabel === unit?.[1]);
        const unitZItem = cequivalentUnitZ?.find(
          v => v.dictLabel === unit?.[0],
        );
        factorInfoObj = {
          ...factorInfoObj,
          factorUnitM: unitMItem
            ? [unitMItem.sourceType, unitMItem.dictValue]
            : factorInfoObj.factorUnitM,
          factorUnitZ: unitZItem?.dictValue || factorInfoObj.factorUnitZ,
        };

        /** 设置排放因子的分母单位 */
        setFactorUnitMUnit(unitMItem?.dictValue);
      }
      /** 供应商数据 */
      if (Number(factorType) === 2) {
        const unit = factorInfoObj.factorUnitM;

        /** 设置供应商的分母单位 */
        setFactorUnitMUnit(unit?.[1]);
      }
      emissionData.factorInfoObj = factorInfoObj;

      /** 赋值表单  */
      form.setValues({
        ...emissionData,
      });

      /** 设置计算方式 */
      setFormulaType(materialsTypeFormula);
      /** 设置产品重量-单位值 */
      setProductWeightValue(maMeasure2);
      /** 设置能耗以及非运输类型-单位值 */
      setMaMeasureValue(maMeasure);

      /** 监听表单 */
      onAddFormListenFn();
    }
  };

  /** 排放源详情 */
  useEffect(() => {
    if (!isAdd && accountsUnitsEnum) {
      /** 路由存在排放数据不走详情的处理 */
      if (search.emissionData && search.emissionData !== '{}') {
        selectFormValues();
        return;
      }
      const result = cathRecord;
      const {
        formula,
        weight,
        maMeasure,
        measureCode,
        unitCode,
        backingMaterial = '',
        factorUnit,
        materialsType,
        factorName,
        factorValue,
        percentMeasure,
        factorSource,
        factorYear,
        factorId,
      } = result || {};
      /** 支撑材料 */
      const newFileList = backingMaterial
        ? backingMaterial
            ?.split(',')
            .filter(v => v)
            .map((v, index) => {
              const nameArr = v.split('/');
              const suffix = nameArr[nameArr.length - 1].split('.');
              return {
                url: v,
                name: nameArr[nameArr.length - 1],
                suffix: suffix[suffix.length - 1],
                uid: `${new Date().getTime()}-${index + 1}`,
              };
            })
        : [];

      /** 支撑文件列表 */
      setFileList([...newFileList] as FileListType[]);
      setFileListDetail([...newFileList] as FileListType[]);

      /** 计算方式 如果是运输取返回的值，非运输 无值 */
      const formulaBack =
        materialsType === I18N.carbonFootPrintLCA.transport
          ? formula
          : undefined;
      setFormulaType(Number(formulaBack));

      let params = {};
      switch (Number(formulaBack)) {
        /** 按里程-产品重量  */
        case 1:
          params = {
            weight2: weight,
            maMeasure2: maMeasure,
          };
          setProductWeightValue(maMeasure);
          break;
        /** 按里程-载重比 */
        case 2:
          params = {
            weight3: weight,
          };
          break;
        /** 按能耗以及非运输类型 */
        default:
          const maMeasureBack = measureCode?.split(',');
          params = {
            weight,
            maMeasure: maMeasureBack,
          };
          setMaMeasureValue(maMeasureBack);
          break;
      }
      /** 是否为导入排放源 获取的单位 */
      const isImportUnitCode = unitCode?.includes('/');

      /** 分母单位 */
      const unitM = isImportUnitCode
        ? unitCode?.split('/')[1].split(',')
        : unitCode?.split(',');

      /** 分子单位 */
      const unitZ = isImportUnitCode
        ? unitCode?.split('/')[0]
        : cequivalentUnitZ.find(v => v.dictLabel === factorUnit?.split('/')[0])
            ?.dictValue;
      form.setValues({
        ...result,
        ...params,
        factorInfoObj: {
          factorName,
          factorValue,
          factorUnitZ: unitZ,
          factorUnitM: unitM,
          percentMeasure,
          factorSource,
          factorYear,
          factorId,
        },
        materialsTypeFormula: formula ? Number(formula) : 1,
      });
      /** 单位换算比例 */
      setFactorPercentMeasure(result?.percentMeasure);

      /** 分母单位 */
      setFactorUnitMUnit(
        isImportUnitCode
          ? unitCode?.split('/')[1].split(',')[1]
          : unitCode?.split(',')[1],
      );
      /** 监听表单值的变化 */
      onAddFormListenFn();
    }
  }, [cathRecord, isAdd, accountsUnitsEnum]);

  /** 新增时 */
  useEffect(() => {
    if (isAdd && accountsUnitsEnum) {
      if (search.emissionData && search.emissionData !== '{}') {
        selectFormValues();
        return;
      }
      onAddFormListenFn();
    }
  }, [isAdd, accountsUnitsEnum]);

  /** 文件上传 */
  const changeFileChange = (info: UploadChangeParam<UploadFile<any>>) => {
    const newArr: FileListType[] = [];
    info.fileList.forEach(item => {
      if (item.status === 'done' && item.originFileObj) {
        if (item.response?.code === 200) {
          const nameArr = item.name.split('.');
          newArr.push({
            suffix: nameArr[nameArr.length - 1],
            name: item.name,
            url: item.response.data.url,
            uid: item.uid,
          });
        }
      }
    });

    /** 全部文件（上传、详情返回，删除的文件） */
    /** 选择后回显支撑文件 */
    const list = fileListBack ? [...fileListBack] : [];
    const allList = [
      ...uniqBy([...newArr, ...fileListDetail, ...list, ...delFileList], 'uid'),
    ];

    /** 全部文件与删除文件取差集 */
    setFileList([
      ...differenceWith(allList, delFileList, isEqual),
    ] as FileListType[]);
  };

  /** 文件删除 */
  const onRemoveList = (item: FileListType) => {
    const arr = fileList.filter(v => v.uid !== item.uid);
    setDelFileList([...delFileList, item]);
    setFileList([...arr]);
  };

  /** 单位传值处理  */
  const onGetUnitValueFn = (item: string, componentType: string) => {
    if (!item) return undefined;
    let params: UnitValueBackProps = {
      value: '',
    };
    switch (componentType) {
      /** 级联选择器 */
      case 'cascader':
        const unitItem = isArray(item)
          ? factorUnitM?.find(v => v.dictValue === item[1])
          : factorUnitM?.find(v => v.dictLabel === item);
        params = {
          value: item,
          ...unitItem,
        };
        break;
      default:
        /** 下拉选择器 */
        params = {
          value: item,
          ...cequivalentUnitZ?.find(v => v.dictValue === item),
        };
        break;
    }
    return params;
  };

  /** 下拉列表的枚举值 */
  useEffect(() => {
    /** 类型 */
    if (stage) {
      form.setFieldState('materialsType', {
        dataSource: materialsTypeList(stage).map(item => ({
          label: item,
          value: item,
        })),
      });
    }

    if (accountsUnitsEnum) {
      /** 数量单位 */
      form.setFieldState('.maMeasure', {
        dataSource: changeFactorM2cascaderOptions(factorUnitM),
      });

      /** 分子单位 */
      form.setFieldState('factorInfoObj.factorUnitZ', {
        dataSource: cequivalentUnitZ.map(item => ({
          label: item.dictLabel,
          value: item.dictValue,
        })),
      });

      /** 分母单位 */
      form.setFieldState('factorInfoObj.factorUnitM', {
        dataSource: changeFactorM2cascaderOptions(factorUnitM),
      });

      /** 发布年份 */
      form.setFieldState('factorInfoObj.factorYear', {
        dataSource: publishYear().map(v => ({ label: v, value: v })),
      });
    }
  }, [accountsUnitsEnum, stage]);

  return (
    <main className={style.emissionSourceWrapper}>
      <div className={style.emissionSourceHeader}>
        <CommonHeader basicInfo={basicInfo} />
      </div>
      <div className={style.emissionSourceMain}>
        <Form form={form} previewTextPlaceholder='-'>
          <div className={`${style.emissionSourceCard} ${style.basicInfoCard}`}>
            <h3 className={style.title}>{I18N.Factors.basicInformation}</h3>
            <SchemaField schema={basicSchema()} />
          </div>
          <div className={style.empty} />
          <div
            className={`${style.emissionSourceCard} ${style.emissionDataCard}`}
          >
            <h3 className={style.title}>{I18N.eca.emissionData}</h3>
            <div className={style.btnWrapper}>
              <div className={style.factorRadioBtn}>
                <SchemaField schema={emissionTypeSchema(isDetail)} />
              </div>
              <FormConsumer>
                {currentForm => {
                  /** 获取当前点击的【排放因子选择类型】0: 排放因子 1:新建因子 2: 供应商数据 */
                  const factorType = currentForm.getValuesIn('factorType');

                  /** 获取当前排放源名称 */
                  const materialName = currentForm.getValuesIn('materialName');

                  /** 排放因子名称 */
                  const factorName = currentForm.getValuesIn(
                    'factorInfoObj.factorName',
                  );

                  /** 查看不展示按钮 */
                  if (isDetail) return '';

                  /** 传递过去的参数 */
                  const emissionDataParams = {
                    emissionData: currentForm.values,
                    fileList,
                  };

                  emissionDataFieldState.forEach((value, key) => {
                    setFormFieldState(
                      `factorInfoObj.${key}`,
                      [0, 1].includes(Number(factorType))
                        ? value.factor
                        : value.supplier,
                    );
                  });
                  switch (Number(factorType)) {
                    /** 排放因子 */
                    case 0:
                      return (
                        <div className={style.selectorFactorBtn}>
                          <Button
                            type='primary'
                            onClick={() => {
                              onSelectFactorNavigate?.({
                                ...emissionDataParams,
                                likeName: materialName,
                              });
                            }}
                          >
                            {I18N.components.chooseEmissionFactors}
                          </Button>
                          {!factorName && flag ? (
                            <p className={style.requireTips}>
                              {I18N.components.pleaseSelectEmissions}
                            </p>
                          ) : (
                            ''
                          )}
                        </div>
                      );
                    /** 新建因子 不展示按钮 */
                    case 1:
                      return '';
                    /** 供应商数据 */
                    case 2:
                      return (
                        <div className={style.selectorFactorBtn}>
                          <Button
                            type='primary'
                            onClick={() => {
                              onSelectSupplierNavigate?.({
                                ...emissionDataParams,
                                likeProductName: materialName,
                              });
                            }}
                          >
                            {I18N.components.selectSupplier}
                          </Button>
                          {!factorName && flag ? (
                            <p className={style.requireTips}>
                              {I18N.components.pleaseSelectSupply}
                            </p>
                          ) : (
                            ''
                          )}
                        </div>
                      );
                    default:
                      return '';
                  }
                }}
              </FormConsumer>
            </div>
            <SchemaField schema={emissionDataSchema()} />
          </div>
          <div className={style.empty} />
        </Form>
      </div>

      <div className={style.fileWrapper}>
        <div className={style.title}>
          {I18N.carbonFootPrintLCA.supportingMaterials}
        </div>
        {!isDetail && (
          <div className={style.tips}>{I18N.components.supportPdf}</div>
        )}
        <Report
          fileList={fileList}
          fileType='.png,.jpg,.jpeg,.xls,.xlsx,.doc,.docx,.pdf,.rar,.zip'
          maxCount={10}
          maxSize={10 * 1024 * 1024}
          errorTip={I18N.components.fileSizeNotAppropriate}
          disabled={isDetail}
          changeFileChange={changeFileChange}
          removeList={onRemoveList}
        />
      </div>

      <FormActions
        place='center'
        buttons={compact([
          !isDetail && {
            title: I18N.Factors.preserve,
            type: 'primary',
            onClick: async () => {
              changeFlag(true);
              form.submit((values: TypeEmissionFactor) => {
                const { factorType, factorInfoObj } = values;
                /** 因子选择类型为选择因子和选择排放源，且为选择时提示 */
                if (factorType !== 1 && !factorInfoObj?.factorName) {
                  return Promise.reject();
                }
                const unitPropertiesArr = [
                  /** 排放因子-分子单位 */
                  ['factorInfoObj.factorUnitZ', 'select'],
                  /** 排放因子-分母单位 */
                  ['factorInfoObj.factorUnitM', 'cascader'],
                ];
                let params: UnitItemProps = {};
                switch (values.materialsTypeFormula) {
                  /** 计算方式-产品重量 */
                  case 1:
                    params = {
                      weight: values.weight2,
                      maMeasure: values.maMeasure2,
                    };
                    break;
                  /** 计算方式-载重比 */
                  case 2:
                    params = {
                      weight: values.weight3,
                    };
                    break;
                  /** 计算方式-按能耗 */
                  default:
                    /** 基本信息-数量单位 */
                    unitPropertiesArr.unshift(['maMeasure', 'cascader']);
                    break;
                }
                unitPropertiesArr.forEach(item => {
                  const { dictLabel, dictValue, sourceType, value } =
                    onGetUnitValueFn(
                      form.getFieldState(item[0])?.value,
                      item[1],
                    ) || {};
                  switch (item[0]) {
                    /** 数量单位 */
                    case 'maMeasure':
                      params = {
                        maMeasure: dictLabel,
                        measureCode: isArray(value)
                          ? String(value)
                          : String([sourceType, dictValue]),
                      };
                      break;
                    /** 分子单位 */
                    case 'factorInfoObj.factorUnitZ':
                      params = {
                        ...params,
                        factorUnit: dictLabel,
                        unitCode: value,
                      };
                      break;
                    default:
                      /** 分母单位 */
                      params = {
                        ...params,
                        factorUnit: `${params?.factorUnit}/${dictLabel}`,
                        unitCode: `${params?.unitCode}/${sourceType},${dictValue}`,
                      };
                      break;
                  }
                });

                const result = omit(
                  {
                    ...values,
                    ...values.factorInfoObj,
                    ...params,
                    formula: values.materialsTypeFormula,
                    backingMaterial:
                      fileList.length > 0
                        ? String(fileList.map(item => item.url).join(','))
                        : '',
                    /** 因子ID：选择因子:选择的因子ID，自建因子:无因子ID，供应商数据:因子ID为-1 */
                    factorId:
                      factorType === 2
                        ? -1
                        : factorType === 0
                        ? factorInfoObj?.factorId
                        : null,
                  },
                  [
                    'materialsTypeFormula',
                    'factorInfoObj',
                    'factorUnitM',
                    'factorUnitZ',
                    'weight2',
                    'maMeasure2',
                    'weight3',
                  ],
                );

                return onSave?.(result as unknown as ProductionMaterials);
              });
            },
          },
          {
            title: isDetail ? I18N.Factors.return : I18N.Factors.cancel,
            onClick: async () => {
              if (isDetail) {
                history.back();
              } else {
                onCancel?.();
              }
            },
          },
        ])}
      />
    </main>
  );
}
export default EmissionFactor;

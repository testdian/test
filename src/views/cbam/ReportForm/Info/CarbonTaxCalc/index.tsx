/**
 * @description 碳税计算
 */

import { ActionType, EditableProTable } from '@ant-design/pro-components';
import { Button, Select } from 'antd';
import classNames from 'classnames';
import { compact } from 'lodash-es';
import { useEffect, useRef, useState } from 'react';

import { FormActions } from '@/components/FormActions';
import { InfoTitle } from '@/components/InfoTitle';
import { usePageInfo } from '@/hooks';
import I18N from '@/lang/I18N';
import { modal } from '@/store/module/notification';
import { modelFooterBtnStyle, Toast } from '@/utils';
import { useCbamEnums } from '@/views/cbam/hook';
import { useAllEnumsBatch } from '@/views/dashborad/Dicts/hooks';

import { columns } from './columns';
import style from './index.module.less';
import {
  getCarbonTaxCalc,
  getCarbonTaxListApi,
  getCarbonTaxStatus,
  putCarbonTaxEdit,
} from '../../service';
import { CarbonTaxResp } from '../../type';
import { CARBON_TAX_CALC_STATUS } from '../constant';

const { NOT_CALC, CALC_ING, CALC_END, VERSION_NOT_SAME } =
  CARBON_TAX_CALC_STATUS;

interface CarbonTaxCalcProps {
  /** 返回上一步 */
  onClickPreStep: ({ reportId }: { reportId?: number }) => void;
  /** 下一步方法 */
  onClickNextStep: ({ reportId }: { reportId?: number }) => void;
  /** 返回方法 */
  onClickBack: () => void;
  /** 是否是CBAM跳转 */
  isCbamInfo?: boolean;
}

const CarbonTaxCalc = ({
  onClickPreStep,
  onClickNextStep,
  onClickBack,
  isCbamInfo,
}: CarbonTaxCalcProps) => {
  const { isDetail, id: cbamId } = usePageInfo();

  const actionRef = useRef<ActionType>();

  /** 碳税类型枚举 */
  const taxTypeEnum = useCbamEnums('TaxType');

  /** 碳税折抵方式枚举 */
  const offsetMethodEnum = useCbamEnums('OffsetMethod');

  const enumOptions = useAllEnumsBatch('CBAMCurrency');
  /** 货币类型枚举 */
  const currencyTypeEnum = enumOptions?.CBAMCurrency || [];

  /** 当前选择的货币类型 */
  const [currentCurrencyType, setCurrentCurrencyType] = useState<string>();

  /** 当前计算状态 */
  const [calcStatus, setCalcStatus] = useState<number>();

  /** 提示文案 */
  const [tips, setTips] = useState('');

  /** 表格loading */
  const [loading, setLoading] = useState(false);

  /** 是否是编辑态 */
  const [isEdit, setIsEdit] = useState(false);

  /** 表格数据 */
  const [dataSource, setDataSource] = useState<CarbonTaxResp[]>([]);

  /** 表格编辑态key */
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);

  /** 获取表格数据 */
  const getDataSource = async () => {
    if (!cbamId) return;
    setLoading(true);
    try {
      const { data } = await getCarbonTaxListApi({
        cbamId,
      });
      setDataSource(data?.data || []);

      /** 货币类型 */
      const apiCurrencyType = data?.data?.[0]?.currencyType;
      setCurrentCurrencyType(apiCurrencyType);

      setLoading(false);
    } catch (error) {
      setDataSource([]);
      setLoading(false);
    }
  };

  /** 获取碳税计算当前状态 */
  const getCalcStatus = async () => {
    const { data } = await getCarbonTaxStatus({ cbamId });
    setCalcStatus(data?.data);
  };

  useEffect(() => {
    /** 获取碳税计算当前状态 */
    getCalcStatus();
  }, [cbamId]);

  /** 定时器 */
  let timer: string | number | NodeJS.Timeout | undefined;

  useEffect(() => {
    switch (calcStatus) {
      case CALC_ING:
        setTips(I18N.cbam.emissionResultCalculation2);
        timer = setInterval(async () => {
          /** 刷新碳税计算当前状态 */
          await getCalcStatus();
        }, 5000);
        break;
      case CALC_END:
        setTips(I18N.cbam.emissionResultCalculation);
        break;
      case NOT_CALC:
      case VERSION_NOT_SAME:
        setTips('');
        if (!isDetail) {
          // 弹窗提示版本不一致
          modal.confirm({
            title: I18N.Factors.prompt,
            icon: '',
            content: <span>{I18N.cbam.reportDetected}</span>,
            ...modelFooterBtnStyle,
            okText: I18N.base.confirm,
            cancelText: I18N.Factors.cancel,
            onOk: async () => {
              /** 计算 */
              const { data } = await getCarbonTaxCalc({ cbamId });
              if (data?.data) {
                Toast('success', I18N.carbonFootPrintLCA.calculationCompleted);
              }

              /** 刷新碳税计算当前状态 */
              await getCalcStatus();
            },
            onCancel: () => {
              onClickPreStep?.({ reportId: cbamId });
            },
          });
        }
        break;
      default:
        setTips('');
        break;
    }

    /** 刷新表格数据 */
    getDataSource();

    if (calcStatus !== CALC_ING) {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [calcStatus]);

  useEffect(() => {
    // 选择货币类型前，下方列表内容均置灰不可编辑，选择后，可以编辑列表内容
    if (isEdit && currentCurrencyType) {
      // 赋值表格的货币类型
      const newData = dataSource?.map(item => ({
        ...item,
        currencyType: currentCurrencyType,
      }));
      setDataSource(newData);

      setEditableRowKeys(() => compact(dataSource.map(item => item.id)));
    } else {
      setEditableRowKeys([]);
    }
  }, [isEdit, currentCurrencyType]);

  return (
    <div>
      <InfoTitle
        title={I18N.cbam.carbonTaxCalculation}
        rightRender={
          !isDetail && (
            <Button
              disabled={calcStatus === CALC_ING}
              loading={isEdit && loading}
              type='primary'
              key='save'
              onClick={async () => {
                // 编辑保存按钮切换
                if (isEdit) {
                  setLoading(true);
                  setEditableRowKeys([]);
                  try {
                    await putCarbonTaxEdit(dataSource);
                    Toast('success', I18N.Factors.saveSuccessful);
                    /** 获取表格数据 */
                    getDataSource();
                  } finally {
                    setLoading(false);
                  }
                }
                setIsEdit(!isEdit);
              }}
            >
              {isEdit ? I18N.Factors.preserve : I18N.Factors.edit}
            </Button>
          )
        }
      />
      <div
        className={classNames(style.tips, {
          [style.calcEnd]: calcStatus === CALC_END,
          primaryColor: calcStatus === CALC_ING,
        })}
      >
        {tips}
      </div>
      <div className={style.currencyWrapper}>
        {I18N.cbam.currencyType2}
        <Select
          disabled={!isEdit}
          options={currencyTypeEnum}
          fieldNames={{
            label: 'dictLabel',
            value: 'dictValue',
          }}
          placeholder={I18N.Factors.pleaseSelect}
          style={{ width: 180 }}
          value={currentCurrencyType}
          onChange={setCurrentCurrencyType}
          showSearch
          optionFilterProp='dictLabel'
        />
      </div>
      <EditableProTable<CarbonTaxResp>
        loading={loading}
        actionRef={actionRef}
        key={`carbonTaxTable${cbamId}`}
        columns={columns({ taxTypeEnum, currencyTypeEnum, offsetMethodEnum })}
        rowKey='id'
        scroll={{
          x: 1600,
        }}
        value={dataSource}
        recordCreatorProps={false}
        toolBarRender={false}
        editable={{
          type: 'multiple',
          editableKeys,
          onValuesChange: (_record, recordList) => {
            setDataSource(recordList);
          },
        }}
      />

      <FormActions
        place='center'
        buttons={compact([
          !isDetail && {
            title: I18N.carbonFootPrintLCA.nextStep,
            type: 'primary',
            onClick: async () => {
              onClickNextStep({ reportId: cbamId });
            },
          },
          (!isDetail || isCbamInfo) && {
            title: I18N.Factors.return,
            onClick: async () => {
              onClickBack();
            },
          },
        ])}
      />
    </div>
  );
};

export default CarbonTaxCalc;

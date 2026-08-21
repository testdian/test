/**
 * @description 碳税计算
 */

import { ActionType, EditableProTable } from '@ant-design/pro-components';
import { Button, Select } from 'antd';
import { compact } from 'lodash-es';
import { useEffect, useRef, useState } from 'react';

import { FormActions } from '@/components/FormActions';
import { InfoTitle } from '@/components/InfoTitle';
import { usePageInfo } from '@/hooks';
import { useAllEnumsBatch } from '@/hooks/dict';
import I18N from '@/lang/I18N';
import { getSearchParams, Toast } from '@/utils';
import { useCbamEnums } from '@/views/certificationReviewCenter/cbam/hook';

import { columns } from './columns';
import style from './index.module.less';
import { getCarbonTaxListApi, putCarbonTaxEdit } from '../../service';
import { CarbonTaxResp } from '../../type';

interface CarbonTaxCalcProps {
  /** 下一步方法 */
  onClickNextStep: ({ reportId }: { reportId?: number }) => void;
  /** 返回方法 */
  onClickBack: () => void;
}

const CarbonTaxCalc = ({
  onClickNextStep,
  onClickBack,
}: CarbonTaxCalcProps) => {
  const { id: cbamId } = usePageInfo();

  const isDetail = true;

  /** URL 携带的参数 */
  const search = { ...getSearchParams()[0] };
  const authNo = search?.authNo;

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
    if (!authNo) return;
    setLoading(true);
    try {
      const { data } = await getCarbonTaxListApi({
        authNo,
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

  useEffect(() => {
    /** 获取表格数据 */
    getDataSource();
  }, [cbamId]);

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
          {
            title: I18N.Factors.return,
            hidden: true,
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

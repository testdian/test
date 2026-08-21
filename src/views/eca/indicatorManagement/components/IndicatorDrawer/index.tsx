import {
  ArrayTable,
  Checkbox,
  DatePicker,
  Form,
  FormGrid,
  FormItem,
  FormLayout,
  Input,
  Radio,
  Select,
  Cascader,
} from '@formily/antd-v5';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import I18N from '@src/lang/I18N';
import dayjs from 'dayjs';
import React, { useEffect, useMemo } from 'react';

import CustomDrawer from '@/components/CustomDrawer';
import { useAllEnumsBatch } from '@/hooks/dict';
import { PageTypeInfo } from '@/router/utils/enums';
import { changeFactorM2cascaderOptions } from '@/utils';
import { getButtonText } from '@/utils/buttonText';
import { handleUnitCode } from '@/utils/unit';

import { indexFormSchema } from './schema';
import {
  addIndicatorApi,
  getIndicatorDetailApi,
  updateIndicatorApi,
} from '../../service';
import { AddIndicatorInfoType } from '../../type';

interface IndicatorDrawerProps {
  /** 核算信息 */
  dataId: number;
  /** 列表操作按钮的类型 */
  actionType: PageTypeInfo;
  visible: boolean;
  onClose: () => void;
  /** 保存成功回调 */
  onSuccessSave: () => void;
}
const SchemaField = createSchemaField({
  components: {
    FormItem,
    Input,
    FormGrid,
    FormLayout,
    Checkbox,
    Radio,
    DatePicker,
    Select,
    ArrayTable,
    Cascader,
  },
});

const { add, edit, show } = PageTypeInfo;
const IndicatorDrawer: React.FC<IndicatorDrawerProps> = ({
  visible,
  dataId,
  actionType,
  onClose,
  onSuccessSave,
}) => {
  //   const isAdd = actionType === add;
  const isDetail = actionType === show;

  const titleMap = {
    [add]: I18N.eca.newIndicatorsAdded,
    [edit]: I18N.eca.editIndicators,
    [show]: I18N.eca.indicatorDetails,
  };

  const title = titleMap[actionType as keyof typeof titleMap];

  const apiMap = {
    [add]: addIndicatorApi,
    [edit]: updateIndicatorApi,
  };

  const form = useMemo(
    () =>
      createForm({
        readPretty: isDetail,
      }),
    [visible],
  );

  /** 单位枚举 */
  const unitOption = useAllEnumsBatch('factorUnitM')?.factorUnitM;

  // const { enumData } = useComputationEnum({
  //   enumType: 'ScopeType',
  //   enabled: visible,
  // });

  /** 提交数据 */
  const handelSubmit = async () => {
    const values = await form.submit<AddIndicatorInfoType>();
    const api = apiMap[actionType as keyof typeof apiMap];
    await api({
      ...values,
      unit: handleUnitCode(values.unit),
    });
    onSuccessSave();
    form.reset();
  };

  /** 查看详情 */
  const getIndicatorDetail = async () => {
    const { data } = await getIndicatorDetailApi(dataId);
    const { unit, year } = data?.data || {};
    form.setValues({
      ...data?.data,
      year: dayjs(`${year}`).format('YYYY'),
      unit: unit ? unit.split(',') : undefined,
    });
    form.setFieldState(
      '*(indexDimension,indexDataPeriod,indexStatistical)',
      state => {
        state.disabled = true;
      },
    );
  };

  /** 设置表单枚举值 */
  useEffect(() => {
    /** 单位 */
    if (unitOption) {
      form.setFieldState('*(unit)', {
        dataSource: changeFactorM2cascaderOptions(unitOption),
      });
    }
    /** 涉及类别 */
    // if (enumData) {
    //   form.setFieldState('*(scopeType)', {
    //     dataSource: enumData,
    //   });
    // }
    if (dataId) {
      getIndicatorDetail();
    }
  }, [unitOption, dataId, visible]);

  useEffect(() => {
    if (!visible) {
      form.reset();
    }
  }, [visible]);

  return (
    <CustomDrawer
      title={title}
      onClose={onClose}
      visible={visible}
      width='50%'
      onSave={handelSubmit}
      isDetail={isDetail}
      saveBtnText={getButtonText(actionType)}
    >
      <Form form={form} previewTextPlaceholder='-'>
        <SchemaField schema={indexFormSchema} />
      </Form>
    </CustomDrawer>
  );
};

export default IndicatorDrawer;

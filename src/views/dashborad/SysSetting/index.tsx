/*
 * @@description: 系统设置
 */
import {
  Form,
  FormGrid,
  FormItem,
  FormLayout,
  NumberPicker,
  Radio,
} from '@formily/antd-v5';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import I18N from '@src/lang/I18N';
import classNames from 'classnames';
import { useEffect, useMemo, useState } from 'react';

import {
  getSystemAppConfigGetAndSave,
  postSystemAppConfigEdit,
} from '@/sdks_v2/new/systemV2ApiDocs';
import { H4Compont } from '@/views/eca/component/Division';

import { TABS, TYPES } from './constant';
import { ecaSchema, FooterSchema } from './schemas';
import style from './style.module.less';
import { TabsType } from './type';

const SysSetting = () => {
  const { ENTERPRISE_CARBON_ACCOUNTING, CARBON_ACCOUNTING_INDUSTRY_EDITION } =
    TYPES;
  const [currentTab, changeCurrentTab] = useState<TabsType>({
    id: 1,
    modelName: I18N.dashborad.enterpriseCarbonAccounting,
  });
  const SchemaField = createSchemaField({
    components: {
      Radio,
      Form,
      FormItem,
      FormGrid,
      FormLayout,
      NumberPicker,
    },
  });
  /** 企业碳核算 */
  const form = useMemo(() => {
    return createForm();
  }, []);

  /** 碳核算行业版 */
  const formCAIE = useMemo(() => {
    return createForm();
  }, []);
  const formFooter = useMemo(() => {
    return createForm();
  }, []);

  /** 系统设置修改方法 */
  const onSysSetRadioChange = async (
    value: number,
    type: number,
    reqName: string,
  ) => {
    let result = {
      [reqName]: value,
      type,
    };

    /** 如果是企业碳核算，得全传 */
    if (type === ENTERPRISE_CARBON_ACCOUNTING) {
      result = {
        dataAuditRollback: form.getValuesIn('dataAuditRollback'),
        emissionStandardEdit: form.getValuesIn('emissionStandardEdit'),
        lcaWeightBalance: formFooter.getValuesIn('lcaWeightBalance') || 0,
        type,
      };
    }
    await postSystemAppConfigEdit({
      req: result,
    });
  };

  /** 获取详情 */
  const getDetailFn = async () => {
    const { data } = await getSystemAppConfigGetAndSave({
      type: ENTERPRISE_CARBON_ACCOUNTING,
    });
    const allData = data.data;
    allData.forEach(item => {
      if (item.type === ENTERPRISE_CARBON_ACCOUNTING) {
        form.setValues({
          dataAuditRollback: item.dataAuditRollback || 0,
          emissionStandardEdit: item.emissionStandardEdit || 0,
        });
        formFooter.setValues({
          ...item,
        });
      }
      if (item.type === CARBON_ACCOUNTING_INDUSTRY_EDITION) {
        formCAIE.setValues({
          dataAuditRollback: item.dataAuditRollback || 0,
        });
      }
    });
  };
  useEffect(() => {
    getDetailFn();
  }, []);

  return (
    <div className={style.accountsModelMain}>
      <div className={style.accountsModelLeft}>
        <div className={style.accountsModelMenu}>
          {TABS.map(item => (
            <div
              className={classNames(style.accountsModelMenuItem, {
                [style.menuItemSelected]: currentTab?.id === item.id,
              })}
              key={item.id}
              onClick={() => {
                if (item.id !== currentTab.id) {
                  changeCurrentTab(item);
                }
              }}
            >
              {item.modelName}
            </div>
          ))}
        </div>
      </div>
      <div className={style.accountsModelRight}>
        <H4Compont>{I18N.dashborad.enterpriseCarbonAccounting}</H4Compont>
        <Form form={form} previewTextPlaceholder='-'>
          <SchemaField schema={ecaSchema(onSysSetRadioChange)} />
        </Form>
        {/* <H4Compont>{I18N.dashborad.carbonAccountingIndustry}</H4Compont>
        <Form form={formCAIE} previewTextPlaceholder='-'>
          <SchemaField schema={caieSchema(onSysSetRadioChange)} />
        </Form> */}
        <H4Compont>{I18N.router.theProductEnvironmentIsSufficient}</H4Compont>
        <Form form={formFooter} previewTextPlaceholder='-'>
          <SchemaField schema={FooterSchema(onSysSetRadioChange)} />
        </Form>
      </div>
    </div>
  );
};
export default SysSetting;

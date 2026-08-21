import I18N from '@src/lang/I18N';
import { RadioChangeEvent } from 'antd';

import {
  renderFormItemSchema,
  renderSchemaWithLayout,
  renderFromGridSchema,
} from '@/components/formily/utils';
import { Toast } from '@/utils';

import { EDIT_ENUM, REQ_ENUM, TYPES, WITHDRAW_ENUM } from './constant';
import { OnSysSetRadioChangeType } from './type';

/** 类型标识 */
const { ENTERPRISE_CARBON_ACCOUNTING, CARBON_ACCOUNTING_INDUSTRY_EDITION } =
  TYPES;
/** 修改的接口字段 */
const { DATAAUDIOLLBACK, EMISSIONSTANDARDEDIT, LCAWEIGHT } = REQ_ENUM;

/** 企业碳核算 */
export const ecaSchema = (onSysSetRadioChange: OnSysSetRadioChangeType) =>
  renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema({ columns: 1 }),
        properties: {
          dataAuditRollback: renderFormItemSchema({
            title: I18N.dashborad.emissionDataReview,
            required: false,
            'x-decorator-props': {
              gridSpan: 2,
              colon: false,
            },
            enum: WITHDRAW_ENUM,
            'x-component': 'Radio.Group',
            'x-component-props': {
              onChange: ({ target: { value } }: RadioChangeEvent) => {
                onSysSetRadioChange(
                  value,
                  ENTERPRISE_CARBON_ACCOUNTING,
                  DATAAUDIOLLBACK,
                );
              },
            },
          }),
          emissionStandardEdit: renderFormItemSchema({
            title: I18N.dashborad.benchmarkYearSetting,
            required: false,
            'x-decorator-props': {
              gridSpan: 2,
              colon: false,
            },
            enum: EDIT_ENUM,
            'x-component': 'Radio.Group',
            'x-component-props': {
              onChange: ({ target: { value } }: RadioChangeEvent) => {
                onSysSetRadioChange(
                  value,
                  ENTERPRISE_CARBON_ACCOUNTING,
                  EMISSIONSTANDARDEDIT,
                );
              },
            },
          }),
        },
      },
    },
  );

/** 碳核算行业版 */
export const caieSchema = (onSysSetRadioChange: OnSysSetRadioChangeType) =>
  renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema({ columns: 1 }),
        properties: {
          dataAuditRollback: renderFormItemSchema({
            title: I18N.dashborad.emissionDataReview,
            required: false,
            'x-decorator-props': {
              gridSpan: 2,
              colon: false,
            },
            enum: WITHDRAW_ENUM,
            'x-component': 'Radio.Group',
            'x-component-props': {
              onChange: ({ target: { value } }: RadioChangeEvent) => {
                onSysSetRadioChange(
                  value,
                  CARBON_ACCOUNTING_INDUSTRY_EDITION,
                  DATAAUDIOLLBACK,
                );
              },
            },
          }),
        },
      },
    },
  );
export const FooterSchema = (onSysSetRadioChange: OnSysSetRadioChangeType) =>
  renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema({ columns: 1 }),
        properties: {
          lcaWeightBalance: renderFormItemSchema({
            title: I18N.dashborad.processQualityLevel,
            required: false,
            'x-validator': [
              // 使用 x-rules 或 rules 根据你的系统配置
              {
                validator: (text: number) => {
                  console.log(text, 'text');
                  if (text < 0 || text > 100) {
                    return Promise.reject(
                      new Error(I18N.dashborad.theValueMustBeBetweenAnd),
                    );
                  }
                  if (!/^\d+(\.\d{1,2})?$/.test(text.toString())) {
                    return Promise.reject(
                      new Error(I18N.dashborad.keepUpToTwo),
                    );
                  }
                  return Promise.resolve();
                },
                message: I18N.dashborad.theInputValueMustBe,
              },
            ],
            'x-decorator-props': {
              gridSpan: 1,
              colon: false,
            },
            enum: WITHDRAW_ENUM,
            'x-component': 'NumberPicker',
            'x-component-props': {
              onChange: (value: number) => {
                console.log(value, 'value-value');
                if (value < 0) {
                  return;
                }
                if (value < 0 || value > 100) {
                  // debugger;
                  // return Promise.reject(new Error('值必须在0到100之间'));
                  Toast('error', I18N.dashborad.theValueMustBeBetweenAnd);
                  return;
                }
                if (!/^\d+(\.\d{1,2})?$/.test(value.toString())) {
                  Toast('error', I18N.dashborad.keepUpToTwo);
                  return;
                }
                onSysSetRadioChange(
                  value,
                  ENTERPRISE_CARBON_ACCOUNTING,
                  LCAWEIGHT,
                );
              },
              min: 0,
              max: 100,
              style: { width: '20%' },
            },
          }),
        },
      },
    },
  );

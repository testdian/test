import {
  ProForm,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import I18N from '@src/lang/I18N';
import { FC } from 'react';

import {
  feasibilityOptions,
  measureTypeOptions,
  scopeTypeOptions,
} from '../utils';

const width = 180;
export const QueryFilterForm: FC<{
  onFinish: (values: Record<string, unknown>) => Promise<void>;
  onReset: () => void;
}> = ({ onFinish, onReset }) => {
  return (
    <div>
      <ProForm
        initialValues={{ scopeType: 1 }}
        onFinish={onFinish}
        onReset={onReset}
        layout='inline'
        submitter={{
          searchConfig: { submitText: I18N.prodManagement.query },
        }}
        autoFocusFirstInput={false}
      >
        <ProFormSelect
          style={{ width }}
          name='measureType'
          label={false}
          placeholder={I18N.eca.typeOfMeasures}
          options={measureTypeOptions}
          required={false}
        />
        <ProFormText
          style={{ width }}
          name='likeMeasureName'
          label={false}
          placeholder={I18N.eca.measureName}
          required={false}
        />
        <ProFormSelect
          style={{ width }}
          name='feasibilityType'
          label={false}
          placeholder={I18N.eca.feasibility}
          options={feasibilityOptions}
          required={false}
        />
        <ProFormSelect
          style={{ width }}
          name='scopeType'
          label={false}
          placeholder={I18N.eca.reach}
          options={scopeTypeOptions}
          required={false}
        />
      </ProForm>
    </div>
  );
};

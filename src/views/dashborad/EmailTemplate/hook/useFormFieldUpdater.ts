// useFormFieldUpdater.js
import { Form } from '@formily/core';
import { useEffect } from 'react';

export const useFormFieldUpdater = (
  form: Form,
  visible: boolean,
  config: { field: any; valueKey: string; dependency: any }[],
) => {
  useEffect(() => {
    if (visible) {
      config.forEach(({ field, valueKey, dependency }) => {
        if (dependency) {
          form.setFieldState(field, {
            [valueKey]: dependency || [],
          });
        }
      });
    }
  }, [visible, ...config.map(item => item.dependency)]);
};

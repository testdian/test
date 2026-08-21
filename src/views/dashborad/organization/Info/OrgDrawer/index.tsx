/**
 * @description: 组织详情抽屉
 */
import {
  FormGrid,
  FormItem,
  FormLayout,
  Input,
  Select,
  Form,
  NumberPicker,
  TreeSelect,
} from '@formily/antd-v5';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { Spin } from 'antd';
import { FC, PropsWithChildren, useEffect, useMemo, useState } from 'react';

import CustomDrawer from '@/components/CustomDrawer';
import { Toast } from '@/utils';

import { addOrgApi } from '../../services';
import { OrgResp, OrgTree } from '../../type';
import { schema } from '../schema';

interface OrgDrawerProps {
  open: boolean;
  onClose: () => void;
  refresh: () => void;
  initPid: string;
  treeData: OrgTree[];
}

const SchemaField = createSchemaField({
  components: {
    Form,
    FormItem,
    FormGrid,
    FormLayout,
    Input,
    Select,
    NumberPicker,
    TreeSelect,
  },
});

export const OrgDrawer: FC<PropsWithChildren<OrgDrawerProps>> = props => {
  const { open, onClose, refresh, initPid, treeData } = props;

  const [loading, setLoading] = useState(false);

  const form = useMemo(() => {
    return createForm({
      readPretty: false,
      initialValues: {
        pcode: initPid,
      },
    });
  }, []);

  const onSave = async () => {
    setLoading(true);
    try {
      const values = await form.submit<OrgResp>();
      await addOrgApi(values);
      Toast('success', '保存成功');
      onClose();
      refresh();
    } finally {
      setLoading(false);
    }
  };

  /** 设置枚举值 */
  useEffect(() => {
    if (!open) return;

    if (treeData) {
      form.setFieldState('pcode', {
        dataSource: treeData,
      });
    }
  }, [open, treeData, form]);

  return (
    <CustomDrawer
      title='新增组织'
      isDetail={false}
      width={708}
      visible={open}
      destroyOnHidden
      onSave={onSave}
      onClose={onClose}
    >
      <Spin spinning={loading}>
        <Form form={form} previewTextPlaceholder='-'>
          <SchemaField schema={schema()} />
        </Form>
      </Spin>
    </CustomDrawer>
  );
};

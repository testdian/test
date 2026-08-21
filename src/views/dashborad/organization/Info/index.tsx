/**
 * @description: 组织详情
 */

import {
  Form,
  FormItem,
  FormGrid,
  FormLayout,
  Input,
  Select,
  NumberPicker,
  TreeSelect,
} from '@formily/antd-v5';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { Button, Spin } from 'antd';
import { FC, PropsWithChildren, useEffect, useMemo, useState } from 'react';

import { Toast } from '@/utils';
import { ORG_TYPE } from '@/utils/const';

import styles from './index.module.less';
import { schema } from './schema';
import { editOrgApi, getOrgInfoApi } from '../services';
import { OrgResp, OrgTree } from '../type';

interface OrgInfoProps {
  id: number;
  refresh: () => void;
  treeData: OrgTree[];
  selectedNode: OrgTree;
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

export const OrgInfo: FC<PropsWithChildren<OrgInfoProps>> = props => {
  const { treeData, refresh, id, selectedNode } = props;

  const { realVirtual } = selectedNode;

  /** 是否是虚拟组织 */
  const isVirtual = realVirtual === ORG_TYPE.VIRTUAL;

  const [originInfo, setOriginInfo] = useState<OrgResp>();

  const [readPretty, setReadPretty] = useState(false);

  const [loading, setLoading] = useState(false);

  const [submitLoading, setSubmitLoading] = useState(false);

  const form = useMemo(
    () =>
      createForm({
        readPretty,
      }),
    [],
  );

  useMemo(() => {
    form.setFieldState('*(pcode,prate)', {
      hidden: isVirtual,
    });
  }, [isVirtual, form]);

  /** 获取组织信息 */
  const getInfo = async () => {
    setLoading(true);
    try {
      const { data } = await getOrgInfoApi({ id });
      const values = data.data || {};
      setOriginInfo(values);
      form.setValues({
        ...values,
      });
    } finally {
      setLoading(false);
    }
  };

  /** 保存组织信息 */
  const onSubmit = async () => {
    setSubmitLoading(true);
    try {
      const values = await form.submit<OrgResp>();
      await editOrgApi(values);
      Toast('success', '保存成功');
      setReadPretty(true);
      refresh();
    } finally {
      setSubmitLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    /** 组织ID不能编辑 */
    form.setFieldState('orgCode', {
      disabled: true,
      required: false,
    });
    setReadPretty(true);
    getInfo();
  }, [id]);

  useEffect(() => {
    form.setFormState({
      readPretty,
    });
  }, [readPretty, form]);

  /** 设置枚举值 */
  useEffect(() => {
    if (treeData) {
      form.setFieldState('pcode', {
        dataSource: treeData,
      });
    }
  }, [treeData, form]);

  return (
    <div>
      <Spin spinning={loading}>
        <div className={styles.inoTitleWrapper}>
          <div className={styles.infoTitle}>
            <div className={styles.title}>{originInfo?.orgName}</div>
          </div>
          <div className={styles.btnWrapper}>
            {readPretty && (
              <Button onClick={() => setReadPretty(false)}>编辑</Button>
            )}
            {!readPretty && (
              <>
                <Button
                  onClick={() => onSubmit()}
                  type='primary'
                  loading={submitLoading}
                >
                  保存
                </Button>
                <Button
                  onClick={() => {
                    form.setValues(originInfo);
                    setReadPretty(true);
                  }}
                >
                  取消
                </Button>
              </>
            )}
          </div>
        </div>

        <Form form={form} previewTextPlaceholder='-'>
          <SchemaField schema={schema()} />
        </Form>

        <div>
          温馨提示：同一主体的历史与当前数据将无缝关联，改名后不影响历史数据的查询与使用。若您编辑组织的目的是更换主体（而非保留原主体），请点击左侧加号选择「新增核算组织」操作。
        </div>
      </Spin>
    </div>
  );
};

/**
 * @description: 核算模型/填写基本信息
 */
import {
  Form,
  FormGrid,
  FormItem,
  FormLayout,
  Input,
  Select,
  TreeSelect,
} from '@formily/antd-v5';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import I18N from '@src/lang/I18N';
import { Spin } from 'antd';
import { compact } from 'lodash-es';
import { FC, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { FormActions } from '@/components/FormActions';
import { usePageInfo } from '@/hooks';
import { useOrgTreeData } from '@/hooks/useOrgTreeData';
import { Toast } from '@/utils';

import style from './index.module.less';
import { schema } from './schema';
import {
  addAccountModelApi,
  editAccountModelApi,
  getAccountModelDetailApi,
} from '../service';
import { AccountModelInfoReqRequest } from '../type';

type SelectDataInfoProps = {
  /** 如果是在抽屉中查看 */
  drawerOptions?: {
    isDrawer: boolean;
    isDetail: boolean;
    isNoFooter?: boolean;
    drawerAccountModelId?: number;
  };
  onSaveStepClick?: (id: number) => void;
};

const SchemaField = createSchemaField({
  components: {
    Input,
    Select,
    Form,
    FormItem,
    FormGrid,
    FormLayout,
    TreeSelect,
  },
});

const SelectDataInfo: FC<SelectDataInfoProps> = ({
  drawerOptions,
  onSaveStepClick,
}) => {
  /** 组织树数据 */
  const [orgTreeData] = useOrgTreeData();

  /** 这里需要增加 如果外层传入id和查看状态的参数， */
  const [btnLoading, setBtnLoading] = useState(false);
  /** 页面详情状态 */
  const { isDetail: pageIsDetail, isAdd, isEdit } = usePageInfo();

  const isDrawerDetail = drawerOptions?.isDetail || false;

  /** 页面详情状态 */
  const isDetail = drawerOptions ? isDrawerDetail : pageIsDetail;

  /** 页面Loading状态 */
  const [pageLoading] = useState(false);

  /** 获取页面的url的分析模型id和页面状态 */
  const { id } = useParams();

  const form = useMemo(
    () =>
      createForm({
        readPretty: isDetail,
      }),
    [],
  );

  /** 优先使用抽屉传入的ID */
  const modelId = useMemo(
    () => drawerOptions?.drawerAccountModelId || id,
    [drawerOptions, id],
  );

  /** 获取模型信息详情 */
  const getDataAnalysisModelInfo = async () => {
    const { data: detailData } = await getAccountModelDetailApi(
      Number(modelId),
    );
    form.setValues({
      ...detailData?.data,
    });
  };

  /** 保存下一步 */
  const onSaveStep = () => {
    form.submit<AccountModelInfoReqRequest>().then(async values => {
      if (isEdit) {
        setBtnLoading(true);
        await editAccountModelApi({
          ...values,
          id: Number(modelId),
        });
        setBtnLoading(false);
        if (!modelId) return Toast('error', I18N.eca.currentUrl);
        return onSaveStepClick?.(Number(modelId));
      }
      const { data: saveData } = await addAccountModelApi(values);
      setBtnLoading(false);
      if (!saveData?.data) return Toast('error', I18N.eca.currentlyAdded);
      return onSaveStepClick?.(saveData?.data);
    });
  };

  useEffect(() => {
    /** 编辑和查看请求详情 */
    if (!isAdd && modelId) {
      getDataAnalysisModelInfo();
    }
  }, [modelId, isAdd]);

  useEffect(() => {
    /** 核算组织 */
    if (orgTreeData?.length) {
      form.setFieldState('orgCode', {
        dataSource: orgTreeData,
      });
    }
  }, [orgTreeData]);

  return (
    <div className={style.wrapper}>
      <Spin spinning={pageLoading}>
        <div className={style.container}>
          <Form form={form} previewTextPlaceholder='-'>
            <SchemaField schema={schema()} />
          </Form>
        </div>
      </Spin>
      {!drawerOptions?.isNoFooter && (
        <FormActions
          className='footWrapper'
          place='center'
          buttons={compact([
            !isDetail && {
              title: I18N.Factors.saveNextStep,
              type: 'primary',
              loading: btnLoading,
              onClick: async () => {
                onSaveStep();
              },
            },
            {
              title: I18N.Factors.return,
              onClick: async () => {
                history.back();
              },
            },
          ])}
        />
      )}
    </div>
  );
};

export default SelectDataInfo;

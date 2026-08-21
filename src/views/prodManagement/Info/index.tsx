/*
 * @@description: 生产运营数据 - 新增 编辑 查看
 */
import { Form, FormGrid, FormItem, FormLayout, Select } from '@formily/antd-v5';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import I18N from '@src/lang/I18N';
import { compact, has, isNull } from 'lodash-es';
import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { FormActions } from '@/components/FormActions';
import { PageTypeInfo } from '@/router/utils/enums';
import { ProRouteMaps } from '@/router/utils/prodEmums';
import {
  getComputationOperationDataId,
  getComputationOperationMetricsOptions,
  postComputationOperationDataAdd,
  postComputationOperationDataEdit,
} from '@/sdks_v2/new/computationV2ApiDocs';
import { Toast } from '@/utils';
import { ORG_STATUS } from '@/utils/const';
import { publishYear } from '@/views/Factors/utils';
import { UseOrgs } from '@/views/eca/hooks';

import { ComTable } from './component/ComTable';
import style from './index.module.less';
import { initalProData } from './type';
import { Schema } from './utils/schemas';

const SchemaField = createSchemaField({
  components: {
    FormItem,
    FormGrid,
    FormLayout,
    ComTable,
    Select,
  },
});
const OrgInfo = () => {
  const { id, pageTypeInfo } = useParams<{
    id: string;
    pageTypeInfo: PageTypeInfo;
  }>();

  const useOrgArr = UseOrgs();
  const navigator = useNavigate();

  const publishYearArr = publishYear(2000);
  // 可选指标项
  const getMetricsOptionFn = async (orgId: number, metricsIds: number[]) => {
    const { data } = await getComputationOperationMetricsOptions({
      metricsIds,
    });
    form.setFieldState('metricsList', {
      value: [
        ...data.data.map(item => {
          return {
            ...item,
            ...initalProData,
          };
        }),
      ],
    });
  };
  const form = useMemo(() => {
    return createForm({
      readPretty: pageTypeInfo === PageTypeInfo.show,
    });
  }, [id, pageTypeInfo]);
  /**
   * 监听组织 - 获取该组织下的未禁用指标
   * **/
  const onFieldChangeFn = () => {
    /**
     * TODO - 接口不需要组织id
     */
    getMetricsOptionFn(0, []);
  };
  // 获取运营数据-详情
  const getOperationDateFn = async () => {
    const { data } = await getComputationOperationDataId({
      id: Number(id),
    });
    const newmetricsList = data.data.metricsList?.map(item => {
      return {
        ...item,
        isEdit: true,
      };
    });
    form.setValues({ ...data.data, metricsList: newmetricsList });
  };
  // 给下拉框 添加数据
  const getFormOptionFn = () => {
    form.setFieldState('orgId', {
      dataSource: useOrgArr?.map(item => {
        return {
          label: item.orgName,
          value: item.id,
          disabled: item.orgStatus === ORG_STATUS.DISABLE,
        };
      }),
    });
    form.setFieldState('year', {
      dataSource: publishYearArr?.map(item => {
        return {
          label: item,
          value: item,
        };
      }),
    });
  };
  useEffect(() => {
    // 新增时 添加formAddEffect
    if (pageTypeInfo === PageTypeInfo.add) {
      onFieldChangeFn();
    }
    // 详情 编辑 - 获取运营数据详情
    if (
      pageTypeInfo === PageTypeInfo.edit ||
      pageTypeInfo === PageTypeInfo.show
    ) {
      getOperationDateFn();
    }
  }, [form]);
  useEffect(() => {
    getFormOptionFn();
  }, [form, useOrgArr, publishYearArr]);

  const historyFn = () => {
    if (pageTypeInfo === PageTypeInfo.add) {
      // 如果是新增 返回列表第一页
      navigator(ProRouteMaps.prodManagement);
    } else {
      // 编辑 查看 取消或保存后，返回列表页，从第几页来的，就回到第几页去
      history.go(-1);
    }
  };

  return (
    <div className={style.wrapper}>
      <Form form={form} previewTextPlaceholder='-'>
        <SchemaField schema={Schema(pageTypeInfo)} />
      </Form>
      <FormActions
        place='center'
        buttons={compact([
          pageTypeInfo !== PageTypeInfo.show && {
            title: I18N.Factors.preserve,
            type: 'primary',
            onClick: async () => {
              return form.submit(async values => {
                const newValue = {
                  ...values,
                };
                if (newValue.metricsList.length === 0) {
                  Toast('error', '请先填写运营指标数据');
                  return;
                }
                // 运营指标 或者 数值 是否为空   false: {metricsValue: null,}  {metricsValue: 1,} true: {metricsValue: 1,metricsId: 12,}
                // 判断对象metricsId是否存在
                if (
                  newValue.metricsList?.some((item: { metricsId: number }) => {
                    return !has(item, 'metricsId');
                  })
                ) {
                  Toast(
                    'error',
                    I18N.prodManagement.operationalIndicatorsAreNotApplicable,
                  );
                  return;
                }
                // 如果存在 metricsValue的值是否为null
                if (
                  newValue.metricsList?.some(
                    (item: { metricsValue: number }) => {
                      return isNull(item.metricsValue);
                    },
                  )
                ) {
                  Toast(
                    'error',
                    I18N.prodManagement.operationalDataNotAvailable,
                  );
                  return;
                }

                const { data } =
                  pageTypeInfo === PageTypeInfo.edit
                    ? await postComputationOperationDataEdit({
                        req: { ...newValue, id: Number(id) },
                      })
                    : await postComputationOperationDataAdd({
                        req: { ...newValue },
                      });
                if (data.code === 200) {
                  historyFn();
                }
              });
            },
          },
          {
            title:
              PageTypeInfo.show !== pageTypeInfo
                ? I18N.Factors.cancel
                : I18N.Factors.return,
            onClick: async () => {
              historyFn();
            },
          },
        ])}
      />
    </div>
  );
};

export default OrgInfo;

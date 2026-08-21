/*
 * @@description: 添加、编辑、查看组织
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2023-01-13 17:16:36
 * @LastEditors: lichunxiao 1359758885@aa.com
 * @LastEditTime: 2023-04-27 14:53:06
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
import { compact } from 'lodash-es';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import { FormActions } from '@/components/FormActions';
import { useLanguage, usePageInfo } from '@/hooks';
import { PageTypeInfo } from '@/router/utils/enums';
import { getAuthTokenRefresh } from '@/sdks/authV2ApiDocs';
import {
  OrgTree,
  getSystemOrgId,
  getSystemOrgTree,
  postSystemOrgAdd,
  postSystemOrgEdit,
} from '@/sdks/systemV2ApiDocs';
import { userInfoActions } from '@/store/module/user';
import { Toast, processData } from '@/utils';
import { ORG_STATUS } from '@/utils/const';

import style from './index.module.less';
import { schema } from './utils/schemas';
// import { OrgTypes } from '../OrgManage/utils/columns';

/** 根据启用禁用字段添加 disabled 字段 */
function addDisabledField(obj: OrgTree) {
  // 为当前对象添加 disabled 字段
  obj.disabled = obj.orgStatus === ORG_STATUS.DISABLE;

  // 如果有 children，则递归处理
  if (obj.children && obj.children.length > 0) {
    obj.children.forEach(child => addDisabledField(child));
  }
}

const SchemaField = createSchemaField({
  components: {
    FormItem,
    Input,
    FormGrid,
    Select,
    FormLayout,
    TreeSelect,
  },
});
const OrgInfo = () => {
  const { isAdd, isDetail } = usePageInfo();

  const { upOrgId: id, pageTypeInfo } = useParams<{
    upOrgId: string;
    pageTypeInfo: PageTypeInfo;
  }>();
  const dispatch = useDispatch();
  const gasEnums = useLanguage();
  const [langIdObj, setLangIdObj] = useState<{ [key: string]: number }>({});

  const form = useMemo(() => {
    return createForm({
      readPretty: pageTypeInfo === PageTypeInfo.show,
    });
  }, [pageTypeInfo]);

  const defaultOrgType = '0';
  /** 获取组织信息 */
  useEffect(() => {
    // fixme 目前后端接口最多支持一次反200条  -  组织列表
    getSystemOrgTree({ userId: null }).then(({ data }) => {
      const apiOrgList = data?.data?.tree || [];
      apiOrgList.forEach(org => addDisabledField(org));
      form.setFieldState('pid', {
        dataSource: apiOrgList,
      });
    });

    // 查询当前组织信息
    if (id && PageTypeInfo.add !== pageTypeInfo) {
      getSystemOrgId({ id: +id }).then(({ data }) => {
        const result = data?.data;
        const langUageObj: { [ket: string]: any } = {};
        const langUageIdObj: { [ket: string]: any } = {};
        ((data?.data?.languageSourceList || []) as any[])?.forEach(
          (item: {
            sourceType_name: any;
            langType_name: any;
            sourceValue: any;
            id: any;
          }) => {
            langUageObj[`${item.sourceType_name}En`] = item.sourceValue;
            langUageIdObj[`${item.sourceType_name}`] = item.id;
          },
        );
        setLangIdObj(langUageIdObj);
        form.setValues({
          ...result,
          orgType: `${result?.orgType || 0}` || defaultOrgType,
          ...langUageObj,
          pid: Number(result?.pid),
        });

        if (isDetail) {
          //  查询上级节点信息
          const pCode = Number(result?.pid);
          if (pCode) {
            getSystemOrgId({ id: pCode }).then(({ data: pData }) => {
              form.setValuesIn('pid', pData?.data?.orgName);
            });
          }
        }
      });
    }

    if (isAdd) {
      /** 新增则 组织类型默认为自组织 上级组织为带过来的当前组织且禁用*/
      form.setValues({
        orgType: defaultOrgType,
        pid: Number(id),
      });

      form.setFieldState('pid', {
        disabled: true,
      });
    }
  }, []);

  const refreshTokenAndBack = () => {
    getAuthTokenRefresh({}).then(({ data }) => {
      if (data.data) dispatch(userInfoActions.setUserInfo({ ...data.data }));
      history.back();
    });
  };

  return (
    <div className={style.wrapper}>
      <Form form={form} previewTextPlaceholder='-'>
        <SchemaField schema={schema()} />
      </Form>
      <FormActions
        place='center'
        buttons={compact([
          pageTypeInfo !== PageTypeInfo.show && {
            title: I18N.Factors.preserve,
            type: 'primary',
            onClick: async () => {
              return form.submit(values => {
                const processResult = processData(
                  values || {},
                  gasEnums || {},
                  langIdObj,
                );
                if (PageTypeInfo.add === pageTypeInfo) {
                  return postSystemOrgAdd({
                    req: {
                      ...values,
                      pid: Number(id),
                      languageSourceList: [...(processResult || [])],
                    },
                  }).then(({ data }) => {
                    if (data.code === 200) {
                      Toast('success', I18N.Factors.newSuccessfullyAdded);
                      refreshTokenAndBack();
                    }
                  });
                }
                return postSystemOrgEdit({
                  req: {
                    ...values,
                    pid: Number(values?.pid) || 0,
                    languageSourceList: [...(processResult || [])],
                  },
                }).then(({ data }) => {
                  if (data.code === 200) {
                    Toast('success', I18N.dashborad.modifiedSuccessfully);
                    refreshTokenAndBack();
                  }
                });
              });
            },
          },
          {
            title:
              PageTypeInfo.show !== pageTypeInfo
                ? I18N.Factors.cancel
                : I18N.Factors.return,
            onClick: async () => {
              history.go(-1);
            },
          },
        ])}
      />
    </div>
  );
};

export default OrgInfo;

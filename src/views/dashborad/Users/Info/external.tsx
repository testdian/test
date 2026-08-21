/**
 * @description 用户信息详情-外部用户
 */
import {
  Checkbox,
  Form,
  FormGrid,
  FormItem,
  FormLayout,
  Input,
  Password,
  Select,
  TreeSelect,
} from '@formily/antd-v5';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import I18N from '@src/lang/I18N';
import { Modal } from 'antd';
import { compact, map } from 'lodash-es';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { matchPath, useParams } from 'react-router-dom';

import { AntProvider } from '@/components/AntdProvider';
import { Button } from '@/components/Form/Button';
import { FormActions } from '@/components/FormActions';
import { useDelOrgList } from '@/hooks/useDelOrgList';
import { useOrgTreeData } from '@/hooks/useOrgTreeData';
import { PageTypeInfo, RouteMaps } from '@/router/utils/enums';
import { getAuthTokenRefresh } from '@/sdks/authV2ApiDocs';
import {
  getSystemRolePage,
  postSystemUserPasswordModify,
  postSystemUserPasswordReset,
} from '@/sdks/systemV2ApiDocs';
import { modal } from '@/store/module/notification';
import { userInfoActions } from '@/store/module/user';
import { Toast, returnNoIconModalStyle } from '@/utils';
import { PassWordText } from '@/views/base/ChangePWD/components/PassWordText';

import style from './index.module.less';
import { externalSchema, changePwdSchema } from './schema';
import { USER_TYPE } from '../constant';
import { getUserInfoApi, updateUserApi, addUserApi } from '../service';
import { UserReq } from '../type';

const SchemaField = createSchemaField({
  components: {
    FormItem,
    Input,
    FormGrid,
    Select,
    FormLayout,
    Button,
    TreeSelect,
    Checkbox,
    Password,
  },
});

const { add, edit } = PageTypeInfo;

function UserInfo() {
  const dispatch = useDispatch();

  /** 组织树数据 */
  const [orgTreeData] = useOrgTreeData({ filterVirtualOrg: true });

  /** 已删除的组织列表 */
  const [delOrgListData] = useDelOrgList();

  const [changePwdModalVisible, setChangePwdModalVisible] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const { id, pageTypeInfo } = useParams<{
    id: string;
    pageTypeInfo: PageTypeInfo;
  }>();

  const isUserProfilePage = !!matchPath(
    { caseSensitive: true, path: RouteMaps.profile },
    location.pathname,
  );
  const isReadPretty = pageTypeInfo === PageTypeInfo.show || isUserProfilePage;
  const isAdd = pageTypeInfo === PageTypeInfo.add;

  /** 保存时的api接口 */
  const postApi = {
    [add]: addUserApi,
    [edit]: updateUserApi,
  };

  /** 保存时的文案 */
  const saveToastText = {
    [add]: I18N.Factors.newSuccessfullyAdded,
    [edit]: I18N.dashborad.modifiedSuccessfully,
  };

  const changePwdForm = createForm();

  const form = useMemo(
    () =>
      createForm({
        readPretty: isReadPretty,
      }),
    [isReadPretty],
  );

  useEffect(() => {
    if (!isAdd) {
      // 供应商全称和供应商编码不可编辑
      form.setFieldState('*(supplierName,supplierCode,username)', {
        disabled: true,
        required: false,
      });
    }

    // fixme 目前后端接口最多支持一次反200条  -  角色列表
    getSystemRolePage({
      pageNum: 1,
      pageSize: 200,
      likeRoleName: '',
    }).then(({ data }) => {
      form.setFieldState('roles', {
        dataSource:
          data?.data?.list?.map(role => ({
            label: role.roleName,
            value: role.id,
          })) || [],
      });
    });
    if (!Number.isNaN(Number(id))) {
      getUserInfoApi(id || '').then(({ data }) => {
        const {
          orgCodeList = [],
          deletedOrgCodeList = [],
          roleList = [],
        } = data?.data || {};
        form.setValues({
          ...data?.data,
          roles: map(roleList, 'id'),
          orgCodeList,
          deletedOrgCodeList,
        });
      });
    }
  }, [id]);

  useEffect(() => {
    /** 核算组织 */
    if (orgTreeData?.length) {
      form.setFieldState('orgCodeList', {
        dataSource: orgTreeData,
      });
    }

    /** 历史版本的组织 */
    if (delOrgListData?.length) {
      form.setFieldState('deletedOrgCodeList', {
        dataSource: delOrgListData,
      });
    }
  }, [orgTreeData, delOrgListData]);

  const refreshFn = async () => {
    await getAuthTokenRefresh({}).then(({ data }) => {
      if (data.code === 200) {
        dispatch(userInfoActions.setUserInfo(data?.data || {}));
      }
    });
  };

  const saveDataAcForm = async () => {
    try {
      setSaveLoading(true);
      const values = await form.submit<UserReq>();

      const roles = values?.roles?.join(',');
      const api = postApi[pageTypeInfo as keyof typeof postApi];
      await api({
        ...values,
        roles,
        userType: USER_TYPE.EXTERNAL,
      });
      Toast(
        'success',
        saveToastText[pageTypeInfo as keyof typeof saveToastText],
      );
      refreshFn();
      history.back();
    } finally {
      setSaveLoading(false);
    }
  };
  return (
    <AntProvider>
      <div className={style.wrapper}>
        {/* 这里的key 是为了切换 个人中心页面和用户详情页面时dom不会重置问题 */}
        <Form
          form={form}
          key={`${pageTypeInfo}${isUserProfilePage}`}
          previewTextPlaceholder='-'
        >
          <SchemaField
            schema={externalSchema({
              onChangePwd: async () => {
                if (isUserProfilePage) setChangePwdModalVisible(true);
                else {
                  modal.confirm({
                    title: I18N.Factors.prompt,
                    content: I18N.dashborad.confirmResetTo,
                    ...returnNoIconModalStyle,
                    onOk: () => {
                      if (id)
                        postSystemUserPasswordReset({
                          req: { id: Number(id) },
                        }).then(({ data }) => {
                          if (data?.code === 200)
                            Toast('success', I18N.dashborad.passwordResetTo);
                        });
                    },
                    okText: I18N.base.confirm,
                    cancelText: I18N.Factors.cancel,
                  });
                }
              },
              showChangePwd:
                PageTypeInfo.show === pageTypeInfo || isUserProfilePage,
              isUserProfilePage,
            })}
          />
        </Form>
        <Modal
          open={changePwdModalVisible}
          onCancel={() => {
            setChangePwdModalVisible(false);
          }}
          maskClosable={false}
          onOk={() => {
            return changePwdForm.submit(values => {
              return postSystemUserPasswordModify({ req: values }).then(
                ({ data }) => {
                  if (data.code === 200) {
                    Toast('success', I18N.dashborad.changePasswordTo);
                    setChangePwdModalVisible(false);
                  }
                },
              );
            });
          }}
          title={I18N.base.changePassword}
          okText={I18N.base.confirm}
          cancelText={I18N.Factors.cancel}
        >
          <Form form={changePwdForm}>
            <SchemaField
              schema={changePwdSchema()}
              scope={{ validatePwdTip: I18N.base.self }}
            />
          </Form>
          <PassWordText />
        </Modal>
        <FormActions
          place='center'
          buttons={compact([
            !isReadPretty && {
              title: I18N.Factors.preserve,
              type: 'primary',
              loading: saveLoading,
              onClick: async () => {
                saveDataAcForm();
              },
            },
            {
              title:
                PageTypeInfo.show !== pageTypeInfo
                  ? I18N.Factors.cancel
                  : I18N.Factors.return,
              type: 'default',
              onClick: async () => {
                history.back();
              },
            },
          ])}
        />
      </div>
    </AntProvider>
  );
}

export default UserInfo;

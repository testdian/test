/**
 * @description 用户信息详情-内部用户
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
} from '@/sdks/systemV2ApiDocs';
import { userInfoActions } from '@/store/module/user';
import { Toast } from '@/utils';
import { PassWordText } from '@/views/base/ChangePWD/components/PassWordText';

import style from './index.module.less';
import { internalSchema, changePwdSchema } from './schema';
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

  /** 是否为手动添加的用户 */
  const [isManualUser, setIsManualUser] = useState(false);

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

  // 判断字段是否可编辑：新增页面 或 手动添加的用户在编辑页面
  const isEditable = isAdd || (isManualUser && !isReadPretty);

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
    // 角色列表
    getSystemRolePage({
      pageNum: 1,
      pageSize: 99999,
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
    if (!isAdd && !Number.isNaN(Number(id))) {
      getUserInfoApi(id || '').then(({ data }) => {
        const {
          orgCodeList = [],
          deletedOrgCodeList = [],
          roleList = [],
          userSource,
        } = data?.data || {};
        // 判断是否为手动添加的用户
        setIsManualUser(userSource === 1);
        form.setValues({
          ...data?.data,
          roles: map(roleList, 'id'),
          orgCodeList,
          deletedOrgCodeList,
        });
      });
    }

    if (isAdd) {
      // 处理字段编辑态
      form.setValues({
        userSource_name: '手动新增用户',
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

  // 根据 isEditable 动态设置字段的可编辑状态
  useEffect(() => {
    const editableFields = [
      'realName',
      'a0190',
      'leadera0190v',
      'leadera0101v',
      'deptpath',
      'gscompany',
      'dingdingid',
    ];

    editableFields.forEach(fieldName => {
      form.setFieldState(fieldName, state => {
        state.disabled = !isEditable;
        // 姓名和工号在可编辑时必填
        if ((fieldName === 'realName' || fieldName === 'a0190') && isEditable) {
          state.required = true;
        }
      });
    });
  }, [isEditable, form]);

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
      await api({ ...values, roles, userType: USER_TYPE.INTERNAL });
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
        {isAdd && (
          <>
            <p className={style.tip}>
              1、手动新增用户前，需与技术同事联系，确认其在GBS上已创建账号。
            </p>
            <p className={style.tip}>
              2、如不填写钉钉ID，则系统无法通过钉钉通知该用户消息（但用户可正常登录系统进行填报），建议填写。
            </p>
          </>
        )}
        <Form
          form={form}
          key={`${pageTypeInfo}${isUserProfilePage}`}
          previewTextPlaceholder='-'
        >
          <SchemaField schema={internalSchema()} />
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

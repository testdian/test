import {
  Checkbox,
  DatePicker,
  Form,
  FormGrid,
  FormItem,
  FormLayout,
  Input,
  Radio,
  Select,
  ArrayTable,
} from '@formily/antd-v5';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import I18N from '@src/lang/I18N';
import { FC, useEffect, useMemo, useState } from 'react';

import CustomDrawer from '@/components/CustomDrawer';
import FormilyCalendar from '@/components/formily/FormilyCalendar';
import { FormilyFileUpload } from '@/components/formily/FormilyFileUpload';
import { PageTypeInfo } from '@/router/utils/enums';
import { getButtonText } from '@/utils/buttonText';
import { safeParseJson } from '@/views/eca/util/transJson';

import { CcConfigType, ToConfigType } from './config';
import { emailSchema } from './schema';
import { useFormFieldUpdater } from '../../hook/useFormFieldUpdater';
import {
  addEmailTemplateApi,
  getEmailTemplateDetailApi,
  updateEmailTemplateApi,
} from '../../service';
import { EmailInfoListType, UserInfoListType } from '../../type';
import {
  createTypeChangeHandler,
  createUserRemover,
  fetchRolesSelectListOrUserSelectList,
  fetchTableByUserOrByRoleId,
  getNonNullIds,
  getUsersListByRoleId,
  processAttachments,
  processSelectionWithFakeData,
  transformRecipients,
} from '../../utils';
import { FormilyUserSelect } from '../CustomUserSelect';

interface EmailManageDrawerProps {
  visible: boolean;
  actionType: PageTypeInfo;
  emailTemplateDetailId: number;
  onClose: () => void;
  onSuccessSave: () => void;
}

const SchemaField = createSchemaField({
  components: {
    FormItem,
    Input,
    FormGrid,
    FormLayout,
    Checkbox,
    Radio,
    FormilyFileUpload,
    DatePicker,
    Select,
    FormilyCalendar,
    ArrayTable,
    FormilyUserSelect,
  },
});

const { add, edit, show } = PageTypeInfo;

const EmailManageDrawer: FC<EmailManageDrawerProps> = ({
  visible,
  actionType,
  emailTemplateDetailId,
  onSuccessSave,
  onClose,
}) => {
  //   const isAdd = actionType === add;
  const isDetail = actionType === show;

  /** 抽屉标题 */
  const titleMap = {
    [add]: I18N.dashborad.addEmail,
    [edit]: I18N.dashborad.editEmail,
    [show]: I18N.dashborad.emailDetails,
  };
  const title = titleMap[actionType as keyof typeof titleMap];

  /** 设置抄送人的类型 */
  const [ccConfigType, setCcConfigType] = useState<number>();

  /** 设置收件人的类型 */
  const [toConfigType, setToConfigType] = useState<number>();

  /** 设置选择抄送人的角色后，查用户数据 */
  const [ccTableList, setTableCcList] = useState<
    UserInfoListType[] | undefined
  >(undefined);

  /** 设置选择收件人的角色后，查用户数据 */
  const [toTableList, setTableToList] = useState<
    UserInfoListType[] | undefined
  >(undefined);

  /** 设置收件人的用户 or 角色下拉框数据 */
  const [toConfigSelectList, setToConfigSelectList] = useState<any>([]);

  /** 设置抄送人的用户 or 角色下拉框数据 */
  const [toCcConfigSelectList, setToCcConfigSelectList] = useState<any>([]);

  /** 设置表单详情数据 */
  const [formData, setFormData] = useState<EmailInfoListType>();

  const form = useMemo(
    () =>
      createForm({
        readPretty: isDetail,
      }),
    [isDetail],
  );

  const apiMap = {
    [add]: addEmailTemplateApi,
    [edit]: updateEmailTemplateApi,
  };

  /** 保存 */
  const handleSubmit = async () => {
    const values = await form.submit<
      EmailInfoListType & { attachments: Record<string, string>[] }
    >();
    const api = apiMap[actionType as keyof typeof apiMap];
    await api({
      ...values,
      /** 抄送人 */
      ccList: transformRecipients(
        values?.ccConfig,
        values?.rolesId,
        values?.ccList,
      ),
      /** 收件人 */
      toList: transformRecipients(
        values?.toConfig,
        values?.copyRolesId,
        values?.toList,
      ),
      attachments: processAttachments(values?.attachments),
    });
    onSuccessSave();
  };

  /** 获取邮件管理详情 */
  const getEmailTemplateDetail = async () => {
    if (!emailTemplateDetailId) return;
    const { data } = await getEmailTemplateDetailApi(emailTemplateDetailId);

    const { ccConfig, toConfig, ccList, toList } = data?.data || {};

    setFormData(data?.data);

    // 并行获取抄送人、收件人下拉框数据
    const [ccConfigRolesIdList, toConfigRolesIdList] = await Promise.all([
      ccConfig
        ? fetchRolesSelectListOrUserSelectList(CcConfigType.ROLE, ccConfig)
        : [],
      toConfig
        ? fetchRolesSelectListOrUserSelectList(ToConfigType.ROLE, toConfig)
        : [],
    ]);

    // 并行获取角色对应的用户列表
    const [ccRoleUsers, toRoleUsers] = await Promise.all([
      ccConfig === CcConfigType.ROLE
        ? getUsersListByRoleId(ccList?.map(item => item.id))
        : [],
      toConfig === ToConfigType.ROLE
        ? getUsersListByRoleId(toList?.map(item => item.id))
        : [],
    ]);

    // 更新状态
    setCcConfigType(ccConfig);
    setToConfigType(toConfig);
    setToConfigSelectList(toConfigRolesIdList);
    setToCcConfigSelectList(ccConfigRolesIdList);

    // 根据类型设置列表数据
    setTableCcList(
      (ccConfig === CcConfigType.PERSON
        ? ccList
        : ccRoleUsers) as UserInfoListType[],
    );
    setTableToList(
      (toConfig === ToConfigType.PERSON
        ? toList
        : toRoleUsers) as UserInfoListType[],
    );
    // 设置表单数据
    // setFormData(data?.data);
  };

  /** 抄送人删除用户并更新收件人rolesId选中的值 */
  const onUpdateRemovedUser = createUserRemover('rolesId', form);

  /** 收件人删除用户并更新收件人copyRolesId选中的值 */
  const onToConfigUpdateRemovedUser = createUserRemover('copyRolesId', form);

  /** 抄送人下拉框选择修改，设置抄送人的用户表格或者角色表格 */
  const onRolesIdChange = async (value: number[] | string[]) => {
    /** 抄送人类型是否是用户 */
    const isCcConfigPerson =
      form.getFieldState('ccConfig')?.value === CcConfigType.PERSON;

    /** 当前用户表格列表数据 */
    const currentTableList = isCcConfigPerson ? form.getValuesIn('ccList') : [];

    const ccData = await processSelectionWithFakeData(
      value,
      currentTableList,
      async ids => {
        return fetchTableByUserOrByRoleId(
          CcConfigType.ROLE,
          form.getFieldState('ccConfig')?.value as number,
          ids,
        );
      },
    );
    setTableCcList(ccData as unknown as UserInfoListType[]);
  };

  /** 收件人下拉框修改，设置收件人的用户表格或者角色表格 */
  const onToConfigRolesIdChange = async (value: number[] | string[]) => {
    /** 收件人类型是否是用户 */
    const isToConfigPerson =
      form.getFieldState('toConfig')?.value === ToConfigType.PERSON;

    /** 当前用户表格列表数据 */
    const currentTableList = isToConfigPerson ? form.getValuesIn('toList') : [];

    const toData = await processSelectionWithFakeData(
      value,
      currentTableList,
      async ids => {
        return fetchTableByUserOrByRoleId(
          ToConfigType.ROLE,
          form.getFieldState('toConfig')?.value as number,
          ids,
        );
      },
    );
    setTableToList(toData as UserInfoListType[]);
  };

  /** 抄送人类型切换 */
  const onCconfigChange = createTypeChangeHandler(
    setCcConfigType,
    'rolesId',
    CcConfigType.ROLE,
    setToCcConfigSelectList,
    setTableCcList,
    form,
  );

  /** 收件人类型切换 */
  const onToConfigChange = createTypeChangeHandler(
    setToConfigType,
    'copyRolesId',
    ToConfigType.ROLE,
    setToConfigSelectList,
    setTableToList,
    form,
  );

  /** 收件人添加用户 */
  const onCreateUserOptionsChange = (userOptions: UserInfoListType[]) => {
    setToConfigSelectList(userOptions);
  };

  /** 抄送人添加用户 */
  const onCreateCcConfigUserOptionsChange = (
    userOptions: UserInfoListType[],
  ) => {
    setToCcConfigSelectList(userOptions);
  };

  /** 更新抄送人/收件人下拉框和表格数据 */
  const formFieldConfig = [
    { field: 'ccList', valueKey: 'value', dependency: ccTableList },
    {
      field: 'rolesId',
      valueKey: 'dataSource',
      dependency: toCcConfigSelectList,
    },
    { field: 'toList', valueKey: 'value', dependency: toTableList },
    {
      field: 'copyRolesId',
      valueKey: 'dataSource',
      dependency: toConfigSelectList,
    },
  ];
  /** 更新抄送人/收件人下拉框和表格数据 */
  useFormFieldUpdater(form, visible, formFieldConfig);

  /** 过滤掉收件人 id 为 null 的情况 */
  const rolesIdData = useMemo(
    () => getNonNullIds(formData?.ccList),
    [formData?.ccList],
  );
  /** 过滤掉抄送人 id 为 null 的情况 */
  const copyRolesIdCcData = useMemo(
    () => getNonNullIds(formData?.toList),
    [formData?.toList],
  );

  useEffect(() => {
    if (!formData) return;
    form.setValues({
      ...formData,
      attachments: safeParseJson(formData?.attachments),
      rolesId: rolesIdData,
      copyRolesId: copyRolesIdCcData,
    });
  }, [formData, rolesIdData, rolesIdData]);

  useEffect(() => {
    if (visible) {
      if (actionType !== add) {
        getEmailTemplateDetail();
      }
    } else {
      setFormData(undefined);
      setTableCcList(undefined);
      setTableToList(undefined);
      setCcConfigType(undefined);
      setToConfigType(undefined);
      setToCcConfigSelectList([]);
      setToConfigSelectList([]);
      form.reset();
    }
  }, [visible]);

  return (
    <CustomDrawer
      title={title}
      isDetail={isDetail}
      onClose={onClose}
      width={800}
      visible={visible}
      onSave={handleSubmit}
      saveBtnText={getButtonText(actionType)}
    >
      <Form form={form} previewTextPlaceholder='-'>
        <SchemaField
          schema={emailSchema({
            isDetail,
            ccConfigType: ccConfigType as CcConfigType,
            toConfigType: toConfigType as ToConfigType,
            onToConfigRolesIdChange,
            onRolesIdChange,
            onCconfigChange,
            onToConfigChange,
            onUpdateRemovedUser,
            onToConfigUpdateRemovedUser,
            onCreateUserOptionsChange,
            onCreateCcConfigUserOptionsChange,
          })}
        />
      </Form>
    </CustomDrawer>
  );
};
export default EmailManageDrawer;

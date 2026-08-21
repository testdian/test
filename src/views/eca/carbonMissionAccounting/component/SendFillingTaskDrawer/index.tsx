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
import dayjs from 'dayjs';
import { FC, useEffect, useMemo, useState } from 'react';

import CustomDrawer from '@/components/CustomDrawer';
import FormilyCalendar from '@/components/formily/FormilyCalendar';
import { FormilyFileUpload } from '@/components/formily/FormilyFileUpload';
import { PageTypeInfo } from '@/router/utils/enums';
import { getButtonText } from '@/utils/buttonText';
import {
  editEmailSendingRecordApi,
  editEmailSendingRecordDetailApi,
} from '@/views/dashborad/EmailSendingRecord/service';
import {
  EmailTemplateListType,
  SendEmailInfoListType,
} from '@/views/dashborad/EmailSendingRecord/type';
import { FormilyUserSelect } from '@/views/dashborad/EmailTemplate/components/CustomUserSelect';
import { useFormFieldUpdater } from '@/views/dashborad/EmailTemplate/hook/useFormFieldUpdater';
import {
  getEmailTemplateDetailApi,
  getEmailTemplateListApi,
} from '@/views/dashborad/EmailTemplate/service';
import {
  EmailListType,
  UserInfoListType,
} from '@/views/dashborad/EmailTemplate/type';
import {
  createTypeChangeHandler,
  createUserRemover,
  fetchTableByUserOrByRoleId,
  getUsersListByCConfig,
  getUsersListByRoleId,
  processAttachments,
  processSelectionWithFakeData,
  transformRecipients,
} from '@/views/dashborad/EmailTemplate/utils';
import { sendComputationDataFillTaskApi } from '@/views/eca/fillData/service';
import { safeParseJson } from '@/views/eca/util/transJson';

import { CcConfigType, ToConfigType } from './config';
import { sendEmailSchema } from './schema';
import { getSendEmailTaskAllRoleListApi } from '../../service';

interface EmailManageDrawerProps {
  currentYear: string;
  visible: boolean;
  actionType: PageTypeInfo;
  emailTemplateDetail: EmailTemplateListType;
  /** 核算id */
  computationId: number;
  onClose: () => void;
  onSuccessSave: () => void;
  orgCode: string;
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

const SendFillingTaskDrawer: FC<EmailManageDrawerProps> = ({
  visible,
  actionType,
  currentYear,
  emailTemplateDetail,
  computationId,
  onSuccessSave,
  onClose,
  orgCode,
}) => {
  const isDetail = actionType === show;
  const isAdd = actionType === add;

  const childrenFlag = emailTemplateDetail?.childrenFlag || 0;

  /** 抽屉标题 */
  const titleMap = {
    [add]: I18N.eca.addEmailCommunication,
    [edit]: I18N.eca.editEmailCommunication,
    [show]: I18N.eca.emailNotificationDetails,
  };
  const title = titleMap[actionType as keyof typeof titleMap];

  /** 设置抄送人的类型 */
  const [ccConfigType, setCcConfigType] = useState<number>();

  /** 设置收件人的类型 */
  const [toConfigType, setToConfigType] = useState<number>(ToConfigType.ROLE);

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
  const [formData, setFormData] = useState<SendEmailInfoListType>();

  /** 设置模板下拉框数据 */
  const [emailTemplateList, setEmailTemplateList] = useState<EmailListType[]>(
    [],
  );

  const form = useMemo(
    () =>
      createForm({
        readPretty: isDetail,
      }),
    [isDetail],
  );

  const apiMap = {
    [add]: sendComputationDataFillTaskApi,
    [edit]:
      childrenFlag === 0
        ? editEmailSendingRecordApi
        : editEmailSendingRecordDetailApi,
  };

  /** 获取邮件模板下拉框数据 */
  const getEmailTemplateList = async () => {
    const { data } = await getEmailTemplateListApi({
      pageNum: 1,
      pageSize: 1000000,
    });
    /** 筛选出toConfig等于角色的数据 */
    const filterData = data?.data?.list?.filter(
      item => item.toConfig === ToConfigType.ROLE,
    );
    setEmailTemplateList(filterData || []);
  };

  /** 获取核算任务下的角色列表 */
  const getAllRolesSelectList = async (
    computationIdValue: number,
    year: string,
  ) => {
    if (!computationIdValue || !year) return [];
    const { data } = await getSendEmailTaskAllRoleListApi({
      computationIdValue,
      year,
    });
    return data?.data?.map(item => {
      return {
        label: item.roleName,
        value: item.id,
      };
    });
  };

  /** 收件人类型为角色的下拉框数据获取 */
  const getToConfigSelect = async (
    computationIdValue: number,
    year: string,
  ) => {
    const selectData = await getAllRolesSelectList(computationIdValue, year);
    setToConfigSelectList(selectData);
    setTableCcList([]);
  };

  const fetchSendEmailTaskRolesSelectListOrUserSelectList = async (
    /** 收件人/抄送人是否是角色类型 */
    caseRoleType: number,
    /** 收件人/抄送人类型值 */
    recipientTypeValue: number,
  ) => {
    const selectData =
      recipientTypeValue === caseRoleType
        ? await getAllRolesSelectList(computationId, currentYear)
        : await getUsersListByCConfig();
    return selectData;
  };

  /** 获取切换邮件管理详情 */
  const checkEmailTemplateDetail = async (
    emailTemplateDetailIdValue: number,
  ) => {
    if (!emailTemplateDetailIdValue) return;
    const { data } = await getEmailTemplateDetailApi(
      emailTemplateDetailIdValue,
    );
    const { ccConfig, toConfig, ccList, toList } = data?.data || {};

    setFormData(data?.data);

    // 并行获取抄送人、收件人下拉框数据
    const [ccConfigRolesIdList, toConfigRolesIdList] = await Promise.all([
      ccConfig
        ? fetchSendEmailTaskRolesSelectListOrUserSelectList(
            CcConfigType.ROLE,
            ccConfig,
          )
        : [],
      toConfig
        ? fetchSendEmailTaskRolesSelectListOrUserSelectList(
            ToConfigType.ROLE,
            toConfig,
          )
        : [],
    ]);

    // 并行获取角色对应的用户邮箱列表数据
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
  };

  /** 切换邮件模板下拉框数据 */
  const onMailTemplateIdChange = async (value: number) => {
    checkEmailTemplateDetail(value);
  };

  /** 初始化需要重置的内容 */
  const initResetContent = () => {
    setTableCcList(undefined);
    setFormData(undefined);
    setTableToList(undefined);
    setCcConfigType(undefined);
    setToConfigType(ToConfigType.ROLE);
    setToCcConfigSelectList([]);
    setToConfigSelectList([]);
    setEmailTemplateList([]);
    form.reset();
  };

  /** 保存 */
  const handleSubmit = async () => {
    const values = await form.submit<
      SendEmailInfoListType & { attachments: Record<string, string>[] }
    >();
    const api = apiMap[actionType as keyof typeof apiMap];
    /** 是否是子级 */
    const isChildrenValue =
      childrenFlag === 1
        ? {
            ...values,
            mailTaskId: values?.mailTemplateId,
            sendTime: values?.sendTimeList?.map(item =>
              dayjs(item).format('YYYY-MM-DD HH:mm:ss'),
            )?.[0],
          }
        : { ...values };
    await api({
      ...isChildrenValue,
      computationId,
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
      sendTimeList: values?.sendTimeList?.map(item =>
        dayjs(item).format('YYYY-MM-DD HH:mm:ss'),
      ),
      orgCode,
    });
    onSuccessSave();
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

  useEffect(() => {
    if (visible) {
      getEmailTemplateList();
      getToConfigSelect(computationId, currentYear);
    } else {
      initResetContent();
    }
  }, [visible]);

  useEffect(() => {
    form.setValues({
      ...formData,
      attachments: safeParseJson(formData?.attachments),
      rolesId: formData?.ccList?.map(item => Number(item.id)),
      copyRolesId: formData?.toList?.map(item => Number(item.id)),
    });
    form.setFieldState('mailTemplateId', {
      disabled: !isAdd,
    });
  }, [formData]);

  useEffect(() => {
    if (emailTemplateList)
      form.setFieldState('mailTemplateId', {
        dataSource: emailTemplateList?.map(item => ({
          label: item?.templateName,
          value: item?.id,
        })),
      });
  }, [emailTemplateList]);

  return (
    <CustomDrawer
      title={title}
      isDetail={isDetail}
      onClose={() => {
        onClose();
      }}
      width={800}
      visible={visible}
      onSave={handleSubmit}
      saveBtnText={getButtonText(actionType)}
      destroyOnClose
    >
      <Form form={form} previewTextPlaceholder='-'>
        <SchemaField
          schema={sendEmailSchema({
            actionType,
            isDetail,
            ccConfigType: ccConfigType as CcConfigType,
            toConfigType: toConfigType as ToConfigType,
            onMailTemplateIdChange,
            onUpdateRemovedUser,
            onRolesIdChange,
            onCconfigChange,
            onToConfigRolesIdChange,
            onToConfigChange,
            onToConfigUpdateRemovedUser,
            onCreateUserOptionsChange,
            onCreateCcConfigUserOptionsChange,
          })}
        />
      </Form>
    </CustomDrawer>
  );
};

export default SendFillingTaskDrawer;

import { Form } from '@formily/core';

import { getSystemRolePage } from '@/sdks/systemV2ApiDocs';

import {
  CcConfigType,
  ToConfigType,
} from './components/EmailManageDrawer/config';
import { EMAIL_FLAG } from './const';
import {
  getAllUserListApi,
  getRoleUserApi,
  getSelectUserInfoApi,
} from './service';
import { CcList, UserInfoListType } from './type';

export const getNonNullIds = <T extends { id?: number | null }>(
  list: T[] | undefined,
) => {
  return list?.filter(item => item.id !== null).map(item => item.id!) || [];
};

/** 获取选择角色后的用户列表数据 */
export const getUsersListByRoleId = async (ids: number[]) => {
  if (!ids || ids.length === 0) return [];
  const { data } = await getRoleUserApi(ids);
  return data?.data;
};

/** 获取选择用户后的角色列表数据 */
export const getRolesListByUserId = async (ids: number[]) => {
  const { data } = await getSelectUserInfoApi(ids);
  return data?.data;
};

/** 获取角色列表数据 */
export const getRolesListByCConfig = async () => {
  const { data } = await getSystemRolePage({
    pageNum: 1,
    pageSize: 100000,
    likeRoleName: '',
  });
  return data?.data?.list?.map(item => {
    return {
      label: item.roleName,
      value: item.id,
    };
  });
};

/** 获取用户列表数据 */
export const getUsersListByCConfig = async () => {
  const { data } = await getAllUserListApi();
  return data?.data?.map(item => {
    return {
      label: `${item.username}`,
      value: item.id,
    };
  });
};

/** 获取选择用户或者角色后的表格数据 */
export const fetchTableByUserOrByRoleId = async (
  /** 收件人/抄送人是否是角色类型 */
  caseRoleType: number,
  /** 收件人/抄送人类型值 */
  recipientTypeValue: number,
  ids: number[],
) => {
  const tableData =
    recipientTypeValue === caseRoleType
      ? await getUsersListByRoleId(ids)
      : await getRolesListByUserId(ids);
  return tableData;
};

/** 获取用户/角色表单下拉框数据 */
export const fetchRolesSelectListOrUserSelectList = async (
  /** 收件人/抄送人是否是角色类型 */
  caseRoleType: number,
  /** 收件人/抄送人类型值 */
  recipientTypeValue: number,
) => {
  const selectData =
    recipientTypeValue === caseRoleType
      ? await getRolesListByCConfig()
      : await getUsersListByCConfig();
  return selectData;
};

/**
 * 通用的删除用户并更新表单字段值的函数
 * @param fieldName 表单字段名
 * @param formInfo 表单信息
 * @returns
 */
export const createUserRemover = (fieldName: string, formInfo: Form) => {
  return (row: UserInfoListType) => {
    const fieldValue =
      (formInfo.getFieldState(fieldName)?.value as number[]) || [];
    formInfo.setFieldState(fieldName, {
      value: fieldValue.filter(item => item !== row.id),
    });
  };
};

/**
 * 处理选择的用户数据，支持正常数据和假数据（new_* 字段）
 * @param value 选择的值，可以是数字数组或字符串数组
 * @param currentTableList 当前表格列表数据
 * @param fetchFunction 获取用户信息的函数
 * @returns 返回合并后的用户信息列表
 */
export const processSelectionWithFakeData = async (
  value: number[] | string[],
  currentTableList: UserInfoListType[],
  fetchFunction: (ids: number[]) => Promise<UserInfoListType[]>,
) => {
  // 字符串中存在EMAIL_FLAG的值，则认为是新增的自定义数据
  const newFields = (value as string[]).filter(
    v => typeof v === 'string' && v.includes(EMAIL_FLAG),
  );
  const normalFields = (value as string[]).filter(
    v => typeof v !== 'string' || !v.includes(EMAIL_FLAG),
  );

  // 获取正常数据=有ID的数据
  const tableData =
    (await fetchFunction(normalFields as unknown as number[])) || [];

  // 新增的自定义数据=生成 Date.now().toString()_* 字段对应的假数据
  const fakeData = newFields?.map(field => ({
    id: null,
    username: (field as string).split(EMAIL_FLAG)[1],
    email: '',
    customId: (field as string).split(EMAIL_FLAG)[0],
  }));

  // 接口返回来的自定义数据=id为null的数据
  const nullIdData = currentTableList?.filter(item => item.id === null);

  // 合并数据
  const mergedData = [...tableData, ...nullIdData, ...fakeData].reduce(
    (acc, curr) => {
      // 如果id为null，customId有值，根据customId去重
      if (curr.id === null && curr.customId) {
        const existingIndex = acc.findIndex(
          item => item.customId === curr.customId,
        );
        if (existingIndex === -1) {
          acc.push(curr);
        }
        return acc;
      }

      // 如果id为null，customId没有值，直接添加到结果中
      if (curr.id === null && !curr.customId) {
        acc.push(curr);
        return acc;
      }

      // 如果id有值，检查是否已存在
      const existingIndex = acc.findIndex(item => item.id === curr.id);
      if (existingIndex === -1) {
        acc.push(curr);
      }

      return acc;
    },
    [] as UserInfoListType[],
  );

  return mergedData;
};

/**
 *
 * @param configSetter 设置收件人/抄送人的类型
 * @param formField 表单字段名
 * @param fetchType 抄送人/收件人类型
 * @param selectListSetter 设置下拉框数据
 * @param listSetter 设置表格数据
 * @param formInfo 表单实例
 * @returns 返回类型切换处理器
 */
export const createTypeChangeHandler = <TConfig extends number>(
  /** 设置收件人/抄送人的类型 */
  configSetter: (value: TConfig) => void,
  /** 表单字段名 */
  formField: string,
  /** 抄送人/收件人类型 */
  fetchType: CcConfigType | ToConfigType,
  /** 设置下拉框数据 */
  selectListSetter: (data: any[]) => void,
  /** 设置表格数据 */
  listSetter: (data: any[]) => void,
  /** 表单实例 */
  formInfo: Form,
) => {
  return async (e: { target: { value: TConfig } }) => {
    configSetter(e.target.value);
    const selectData = await fetchRolesSelectListOrUserSelectList(
      fetchType,
      e.target.value,
    );
    formInfo.reset(formField);
    selectListSetter(selectData || []);
    listSetter([]);
  };
};

/**
 * 处理表格数据
 * @param configType  抄送人/收件人类型
 * @param roleIds 角色ID数组
 * @param userList 用户列表
 * @returns 返回表格数据处理器
 */
export const transformRecipients = (
  configType: CcConfigType | ToConfigType,
  roleIds: number[],
  userList: CcList[],
) => {
  return configType === CcConfigType.ROLE || configType === ToConfigType.ROLE
    ? roleIds?.map(id => ({ id })) || []
    : userList?.map(item => ({
        id: item?.id,
        username: item?.username,
        email: item?.email,
        customId: item?.customId,
      })) || [];
};

/**
 * 处理附件数组，转换为JSON字符串或返回undefined
 * @param {Array} attachments - 附件数组
 * @returns {string|undefined} - JSON字符串或undefined
 */
export const processAttachments = (attachments: Record<string, string>[]) => {
  return attachments && attachments.length > 0
    ? JSON.stringify(attachments)
    : undefined;
};

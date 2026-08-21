/**
 * @description:审批抽屉-模型
 */

import {
  FormItem,
  FormGrid,
  FormLayout,
  Form,
  Input,
  Select,
  Checkbox,
  Radio,
  ArrayTable,
} from '@formily/antd-v5';
import { createForm, onFieldValueChange } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { FC, useEffect } from 'react';

import CustomDrawer from '@/components/CustomDrawer';
import { useAsyncEnums } from '@/hooks';
import { useOrgsType } from '@/hooks/eca';
import I18N from '@/lang/I18N';
import { PageTypeInfo } from '@/router/utils/enums';
import { Toast } from '@/utils';
import { getButtonText } from '@/utils/buttonText';
import { useRoles } from '@/views/dashborad/Role/hooks';
import { useUsers } from '@/views/dashborad/Users/hooks';

import { ADUDIT_REQUIRED_TYPE, AUDIT_CONFIG_TYPE } from './constant';
import { approvalSchema } from './schemas';
import {
  getAuditSetDetail,
  postAuditSetAdd,
  postAuditSetEdit,
  getUserLeaderList,
} from './service';
import { FormValueType, AuditReq } from './type';

interface ApprovalInfoDrawerProps {
  /** 是否是批量审批 */
  isBatchApproval: boolean;
  orgCode: string;
  auditType: number;
  emissionSourceIdList: (number | string)[];
  /** 当前抽屉展开的状态类型值：新增、编辑、查看 */
  actionType: PageTypeInfo;
  visible: boolean;
  /** 保存方法 */
  onOk: () => void;
  /** 取消方法 */
  onClose: () => void;
}

const { ROLE, USER } = AUDIT_CONFIG_TYPE;

const { REQUIRED } = ADUDIT_REQUIRED_TYPE;

const SchemaField = createSchemaField({
  components: {
    Input,
    Select,
    Form,
    FormItem,
    FormGrid,
    FormLayout,
    Checkbox,
    Radio,
    ArrayTable,
  },
});

const titleMapping: { [key in PageTypeInfo]?: string } = {
  add: I18N.dashborad.addApprovalSettings,
  edit: I18N.dashborad.editApprovalSettings,
  show: I18N.dashborad.approvalSettingsDetailed,
};

const { add, edit, show } = PageTypeInfo;

const ApprovalInfoDrawer: FC<ApprovalInfoDrawerProps> = ({
  isBatchApproval,
  orgCode,
  auditType,
  emissionSourceIdList,
  actionType,
  visible,
  onClose,
  onOk,
}) => {
  const isAdd = actionType === add;
  const isDetail = actionType === show;

  /** 渲染抽屉标题 */
  const drawerTitle =
    titleMapping[actionType] || I18N.dashborad.approvalSettings;

  const form = createForm({
    readPretty: actionType === show,
    initialValues: {
      nodeList: isBatchApproval ? [{ nodeLevel: 1 }] : [],
    },
    effects(currentForm) {
      /**
       * 获取下一级审批人员（上级领导）
       * @param currentIndex 当前审批级别索引
       */
      const fetchNextLevelLeaders = async (currentIndex: number) => {
        try {
          const nodeList = currentForm.getFieldState('nodeList')?.value || [];
          const currentNode = nodeList[currentIndex];
          const nextNode = nodeList[currentIndex + 1];

          // 如果没有下一级，则不处理
          if (!nextNode) {
            return;
          }

          // 如果下一级明确配置为按角色，则不处理（undefined 时也尝试获取）
          if (nextNode.configType && nextNode.configType !== USER) {
            return;
          }

          // 获取当前级别的配置
          const { configType, targetIds, targetRoleId } = currentNode || {};

          // 如果当前级别没有配置审批人员/角色，则不处理
          if (
            !configType ||
            (configType === USER && !targetIds?.length) ||
            (configType === ROLE && !targetRoleId)
          ) {
            return;
          }

          // 构造请求参数
          const ids =
            configType === ROLE ? String(targetRoleId) : targetIds.join(',');

          // 调用接口获取上级领导列表
          const { data } = await getUserLeaderList({
            configType: String(configType),
            ids,
          });

          const leaderList = data?.data || [];

          if (leaderList.length > 0) {
            // 将获取到的领导ID设置为下一级的 targetIds
            const leaderIds = leaderList
              .map(leader => leader.id)
              .filter(Boolean);

            if (leaderIds.length > 0) {
              currentForm.setFieldState(
                `nodeList.${currentIndex + 1}.targetIds`,
                {
                  value: leaderIds,
                },
              );
            }
          }
        } catch (error) {
          console.error('获取上级领导失败:', error);
        }
      };

      onFieldValueChange('auditRequired', field => {
        const { value, selfModified } = field;
        if (value === REQUIRED && selfModified) {
          // 初始一条数据
          currentForm.setFieldState('nodeList', {
            value: [{ nodeLevel: 1 }],
          });
        }
      });

      onFieldValueChange('nodeList.*.configType', field => {
        // configType 改变时，控制 targetIds 和 targetRoleId 的显示隐藏
        const path = field.path.toString();
        const { value, selfModified } = field;
        const currentIndex = Number(path.split('.')[1]);
        const targetPath = `nodeList.${currentIndex}.configType`;
        const targetIdsPath = targetPath.replace('configType', 'targetIds');
        const targetRoleIdPath = targetPath.replace(
          'configType',
          'targetRoleId',
        );
        // 控制组织 显示隐藏
        // 角色名称
        currentForm.setFieldState(targetRoleIdPath, {
          // 按角色
          visible: value === ROLE,
        });
        currentForm.setFieldState(targetIdsPath, {
          visible: value !== ROLE,
        });

        // 清空targetIds或者targetRoleId不显示的值
        currentForm.reset(value === ROLE ? targetIdsPath : targetRoleIdPath);

        // 如果当前级别配置类型改为按人员，且存在上一级配置，则自动获取上级领导
        if (selfModified && value === USER && currentIndex > 0) {
          // 延迟执行，确保字段状态已更新
          setTimeout(() => {
            fetchNextLevelLeaders(currentIndex - 1);
          }, 100);
        }
      });
    },
  });

  /** 审批内容枚举 */
  const auditTypeEnum = useAsyncEnums('AuditType');
  /** 所属组织枚举 */
  const orgs = useOrgsType();
  /**  审批配置类型 */
  const configTypeEnum = useAsyncEnums('ConfigType');
  /** 审批人枚举 */
  const users = useUsers({
    userStatus: '0',
  });
  /** 审批角色枚举 */
  const roles = useRoles();

  /** 保存时的api接口 */
  const postApi = {
    [add]: postAuditSetAdd,
    [edit]: postAuditSetEdit,
  };

  /** 保存时的文案 */
  const saveToastText = {
    [add]: I18N.Factors.newSuccessfullyAdded,
    [edit]: I18N.dashborad.modifiedSuccessfully,
  };

  /** 修改表格状态 是否显示组织 */
  const changeTableRow = (index: number, value: number) => {
    const path = `nodeList.${index}.configType`;
    // const auditOrgIdPath = path.replace('configType', 'auditOrgId');
    const targetIdsPath = path.replace('configType', 'targetIds');
    const targetRoleIdPath = path.replace('configType', 'targetRoleId');
    // 控制组织 显示隐藏
    // 角色名称
    form.setFieldState(`*(${targetRoleIdPath})`, {
      // 按角色
      visible: value === ROLE,
    });
    form.setFieldState(targetIdsPath, {
      visible: value !== ROLE,
    });
  };

  /** 审批设置详情 */
  useEffect(() => {
    if (!visible) return;

    if (!isAdd && auditType && orgs.length && !isBatchApproval) {
      /** 编辑时：组织和审核内容不允许编辑  */
      form.setFieldState('*(auditType,orgId)', {
        disabled: true,
        required: false,
      });
      getAuditSetDetail({
        auditType,
        dataId: Number(emissionSourceIdList[0]),
      }).then(({ data }) => {
        const { nodeList } = data?.data || {};
        form.setValues({
          ...data?.data,
          nodeList: nodeList?.map((node, index) => {
            const { configType, targetIds } = node || {};
            // 按角色
            if (Number(configType) === ROLE) {
              changeTableRow(index, ROLE);
              // 显示组织 角色
              return {
                ...node,
                // auditOrgId,
                targetRoleId: targetIds?.[0],
                targetIds: [],
              };
            }
            return node;
          }),
        });
      });
    }
  }, [isAdd, auditType, orgs, visible, isBatchApproval]);

  /** 表单枚举 */
  useEffect(() => {
    /** 所属组织 */
    if (orgs.length) {
      form.setFieldState('*(orgId,nodeList.*.auditOrgId)', {
        dataSource: orgs.map(o => ({
          label: o.dictLabel,
          value: o.id,
        })),
      });
    }

    /** 审批内容 */
    if (auditTypeEnum.length)
      form.setFieldState('.auditType', {
        dataSource: auditTypeEnum.map(a => ({ label: a.name, value: a.code })),
      });

    /** 审批配置类型 */
    if (configTypeEnum.length) {
      form.setFieldState('nodeList.*.configType', {
        dataSource: configTypeEnum.map(a => ({ label: a.name, value: a.code })),
      });
    }

    /** 审批人员 */
    if (users.length)
      form.setFieldState('nodeList.*.targetIds', {
        dataSource: users.map(u => ({
          label: `${u.realName} ${u.a0190}`,
          value: u.id,
        })),
      });

    /** 审批角色 */
    if (roles.length)
      form.setFieldState('nodeList.*.targetRoleId', {
        dataSource: roles.map(u => ({
          label: u.roleName,
          value: u.id,
        })),
      });
  }, [orgs, auditTypeEnum, configTypeEnum, users, roles, visible]);

  /** 关闭弹窗初始化 */
  const onCloseInit = () => {
    form.reset();
    onClose();
  };

  const saveDataAcForm = async () => {
    const values = await form.submit<FormValueType>();
    const { nodeList } = values || {};
    const result = {
      ...values,
      orgCode,
      emissionSourceIdList,
      nodeList: nodeList?.map((node, i) => ({
        ...node,
        targetIds: node.targetRoleId ? [node.targetRoleId] : node.targetIds,
        nodeLevel: i + 1,
      })),
    } as AuditReq;
    const api = postApi[actionType as keyof typeof postApi];
    await api(result);
    Toast('success', saveToastText[actionType as keyof typeof saveToastText]);
    onOk();
  };

  return (
    <CustomDrawer
      title={drawerTitle}
      isDetail={actionType === PageTypeInfo.show}
      visible={visible}
      onClose={onCloseInit}
      onSave={saveDataAcForm}
      saveBtnText={getButtonText(actionType)}
    >
      <Form form={form} previewTextPlaceholder='-'>
        <SchemaField schema={approvalSchema(isDetail)} />
      </Form>
    </CustomDrawer>
  );
};

export default ApprovalInfoDrawer;

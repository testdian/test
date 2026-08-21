/**
 * @description 审批设置详情
 */
import {
  Radio,
  ArrayTable,
  Input,
  Select,
  Form,
  FormGrid,
  FormItem,
  FormLayout,
} from '@formily/antd-v5';
import { createForm, onFieldValueChange } from '@formily/core';
import { createSchemaField } from '@formily/react';
import I18N from '@src/lang/I18N';
import { compact } from 'lodash-es';
import { useEffect, useMemo, useState } from 'react';

import { FormActions } from '@/components/FormActions';
import { Page } from '@/components/Page';
import { useAsyncEnums, usePageInfo } from '@/hooks';
import { Toast } from '@/utils';
import { ORG_STATUS } from '@/utils/const';

import { ADUDIT_REQUIRED_TYPE, AUDIT_CONFIG_TYPE } from './constant';
import style from './index.module.less';
import { schema } from './schemas';
import { FormValueType } from './type';
import { useRoles } from '../../Role/hooks';
import { useUsers } from '../../Users/hooks';
import { useOrgs } from '../../organizations/OrgManage/hooks';
import {
  postAuditSetAdd,
  postAuditSetEdit,
  getAuditSetDetail,
} from '../service';
import { AuditReq } from '../type';

const { ROLE } = AUDIT_CONFIG_TYPE;
const SchemaProvider = createSchemaField({
  components: {
    Select,
    Input,
    ArrayTable,
    Radio,
    FormItem,
    FormLayout,
    FormGrid,
  },
});

const Info = () => {
  const { isAdd, isDetail, orgId, auditType } = usePageInfo();

  /** 审批内容枚举 */
  const auditTypeEnum = useAsyncEnums('AuditType');
  /** 所属组织枚举 */
  const orgs = useOrgs();
  /**  审批配置类型 */
  const configTypeEnum = useAsyncEnums('ConfigType');
  /** 审批人枚举 */
  const users = useUsers();
  /** 审批角色枚举 */
  const roles = useRoles();

  /** 保存按钮的loading */
  const [btnLoading, setBtnLoading] = useState(false);

  const api = isAdd ? postAuditSetAdd : postAuditSetEdit;

  const form = useMemo(
    () =>
      createForm<FormValueType>({
        initialValues: {
          nodeList: [{ nodeLevel: 1 }],
          auditRequired: ADUDIT_REQUIRED_TYPE.NOT_REQUIRED,
        },
        readPretty: isDetail,
      }),
    [isDetail],
  );
  /** 修改表格状态 是否显示组织 */
  const changeTableRow = (index: number, value: number) => {
    const path = `nodeList.${index}.configType`;
    const auditOrgIdPath = path.replace('configType', 'auditOrgId');
    const targetIdsPath = path.replace('configType', 'targetIds');
    const targetRoleIdPath = path.replace('configType', 'targetRoleId');
    // 控制组织 显示隐藏
    // 角色名称
    form.setFieldState(`*(${auditOrgIdPath},${targetRoleIdPath})`, {
      // 按角色
      visible: value === ROLE,
    });
    form.setFieldState(targetIdsPath, {
      visible: value !== ROLE,
    });
  };

  /** 审批配置选择	审批配置  联动 */
  useEffect(() => {
    if (configTypeEnum.length) {
      form.addEffects('configTypeEnum', () => {
        onFieldValueChange('nodeList.*.configType', field => {
          const path = field.path.toString();
          changeTableRow(Number(path.split('.')[1]), field.value);
        });
      });
    }
  }, [configTypeEnum]);

  /** 审批设置详情 */
  useEffect(() => {
    if (!isAdd && orgId && auditType && orgs.length) {
      /** 编辑时：组织和审核内容不允许编辑  */
      form.setFieldState('*(auditType,orgId)', {
        disabled: true,
        required: false,
      });
      getAuditSetDetail({
        orgId,
        auditType,
      }).then(({ data }) => {
        const { nodeList } = data?.data || {};
        form.setValues({
          ...data?.data,
          nodeList: nodeList?.map((node, index) => {
            const { configType, auditOrgId, targetIds } = node || {};
            // 按角色
            if (Number(configType) === ROLE) {
              changeTableRow(index, ROLE);
              // 显示组织 角色
              return {
                ...node,
                auditOrgId,
                targetRoleId: targetIds?.[0],
                targetIds: [],
              };
            }
            return node;
          }),
        });
      });
    }
  }, [isAdd, orgId, auditType, orgs]);

  /** 表单枚举 */
  useEffect(() => {
    /** 所属组织 */
    if (orgs.length) {
      form.setFieldState('*(orgId,nodeList.*.auditOrgId)', {
        dataSource: orgs.map(o => ({
          label: o.orgName,
          value: o.id,
          disabled: o.orgStatus === ORG_STATUS.DISABLE,
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
          label: u.realName || u.username,
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
  }, [orgs, auditTypeEnum, configTypeEnum, users, roles]);

  return (
    <Page title={I18N.Factors.basicInformation} wrapperClass={style.wrapper}>
      <Form form={form} previewTextPlaceholder='-'>
        <SchemaProvider schema={schema(isDetail, changeTableRow)} />
      </Form>

      <FormActions
        place='center'
        buttons={compact([
          !isDetail && {
            title: I18N.Factors.preserve,
            loading: btnLoading,
            type: 'primary',
            onClick: async () => {
              const values = await form.submit<FormValueType>();
              const { nodeList } = values || {};
              const result = {
                ...values,
                nodeList: nodeList?.map((node, i) => ({
                  ...node,
                  targetIds: node.targetRoleId
                    ? [node.targetRoleId]
                    : node.targetIds,
                  nodeLevel: i + 1,
                })),
              } as AuditReq;

              try {
                setBtnLoading(true);
                await api(result);
                setBtnLoading(false);
                Toast('success', I18N.Factors.saveSuccessful);
                history.back();
              } catch (e) {
                setBtnLoading(false);
                throw e;
              }
            },
          },
          {
            title: isDetail ? I18N.Factors.cancel : I18N.Factors.return,
            onClick: async () => {
              history.back();
            },
          },
        ])}
      />
    </Page>
  );
};

export default Info;

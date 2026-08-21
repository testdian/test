/**
 * @description 核查计划详情
 */
import {
  ActionType,
  EditableFormInstance,
  EditableProTable,
} from '@ant-design/pro-components';
import { Button, Form, Space } from 'antd';
import { compact } from 'lodash-es';
import { FC, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { FormActions } from '@/components/FormActions';
import { Page } from '@/components/Page';
import { usePageInfo } from '@/hooks';
import { CarbonVerifyRouteMaps } from '@/router/utils/enums';
import { Toast } from '@/utils';
import { commonRequestDownloadFile } from '@/utils/downBlobFile';

import { VerificationPlanItem } from '../type';
import { generateColumns } from './columns';
import {
  addVerificationPlanDetailApi,
  editVerificationPlanDetailApi,
  exportVerificationPlanDetailApi,
  getSourceGroupsApi,
  getUsersByGroupIdsApi,
  getVerificationPlanByIdApi,
  getVerificationPlanDetailListApi,
} from './service';
import { VerificationPlanDetailItem } from './type';

const TMP_FLAG = 'tmp_';

const VerificationPlanInfo: FC = () => {
  const navigate = useNavigate();
  const { id: paramId } = useParams<{ id: string }>();
  const { isDetail } = usePageInfo();

  const planId = Number(paramId) || 0;

  const [form] = Form.useForm();
  const actionRef = useRef<ActionType>();
  const editableFormRef =
    useRef<EditableFormInstance<VerificationPlanDetailItem>>(null);

  const [planInfo, setPlanInfo] = useState<VerificationPlanItem>();
  const [editableKeys, setEditableKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<VerificationPlanDetailItem[]>(
    [],
  );
  const [exportLoading, setExportLoading] = useState(false);
  const [emissionSourceOptions, setEmissionSourceOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [principalOptionsMap, setPrincipalOptionsMap] = useState<
    Record<string, { label: string; value: string }[]>
  >({});

  const fetchOptions = async (info: VerificationPlanItem) => {
    const { orgCodes, year } = info;
    if (!orgCodes || !year) return;

    const { data: groupsRes } = await getSourceGroupsApi({ orgCodes, year });
    const groups = groupsRes?.data || [];

    setEmissionSourceOptions(
      groups.map(g => ({ value: String(g.id), label: g.sourceName })),
    );
  };

  const fetchPrincipalOptions = async (
    rowKey: string,
    selectedIds: string[],
  ) => {
    if (!selectedIds.length) {
      setPrincipalOptionsMap(prev => ({ ...prev, [rowKey]: [] }));
      return;
    }

    const { data: usersRes } = await getUsersByGroupIdsApi({
      groupIds: selectedIds.join(','),
    });
    const users = usersRes?.data || [];
    setPrincipalOptionsMap(prev => ({
      ...prev,
      [rowKey]: users.map(u => ({ value: String(u.id), label: u.username })),
    }));
  };

  const handleEmissionSourceChange = async (
    rowKey: string,
    selectedIds: string[],
  ) => {
    form.setFieldValue([rowKey, 'userIds'], []);
    await fetchPrincipalOptions(rowKey, selectedIds);
  };

  const fetchPlanInfo = async () => {
    if (!planId) return;
    const { data } = await getVerificationPlanByIdApi({ id: planId });
    const info = data?.data;
    setPlanInfo(info);
    if (info) fetchOptions(info);
  };

  useEffect(() => {
    fetchPlanInfo();
  }, [planId]);

  useEffect(() => {
    editableKeys.forEach(key => {
      const rowKey = String(key);
      if (!rowKey.startsWith(TMP_FLAG) && !principalOptionsMap[rowKey]) {
        const row = dataSource.find(item => String(item.id) === rowKey);
        if (row?.groupIds?.length) {
          fetchPrincipalOptions(rowKey, row.groupIds);
        }
      }
    });
  }, [editableKeys]);

  const handleAdd = () => {
    const tempId = `${TMP_FLAG}${Date.now()}`;
    actionRef.current?.addEditRecord?.({
      id: tempId,
      planId,
    });
    setEditableKeys(prev => [...prev, tempId]);
  };

  const handleExport = async () => {
    if (!planId) return;
    setExportLoading(true);
    try {
      const { data } = await exportVerificationPlanDetailApi({
        verificationPlanId: planId,
      });
      const url = (data as any)?.data?.url;
      const fileName = (data as any)?.data?.fileName;
      if (url) {
        commonRequestDownloadFile(url, fileName, false);
      }
    } finally {
      setExportLoading(false);
    }
  };

  const onSave = async (key: React.Key, record: VerificationPlanDetailItem) => {
    const isNew = String(key).startsWith(TMP_FLAG);
    const toCommaString = (val: string | undefined) => {
      if (val == null) return undefined;
      return Array.isArray(val) ? val.join(',') : String(val);
    };

    const commonPayload = {
      verificationPlanId: planId,
      startTime: record.startTime ? `${record.startTime} 00:00:00` : '',
      endTime: record.endTime ? `${record.endTime} 23:59:59` : '',
      content: record.content,
      groupIds: toCommaString(record.groupIds),
      userIds: toCommaString(record.userIds),
      department: record.department,
      auditGroup: record.auditGroup,
    };
    try {
      if (isNew) {
        await addVerificationPlanDetailApi(commonPayload);
      } else {
        await editVerificationPlanDetailApi({
          id: record.id!,
          ...commonPayload,
        });
      }
      Toast('success', '保存成功');
      actionRef.current?.reload();
    } catch {
      throw new Error('保存失败');
    }
  };

  const columns = generateColumns({
    onDeleteSuccess: () => actionRef.current?.reload(),
    emissionSourceOptions,
    principalOptionsMap,
    onEmissionSourceChange: handleEmissionSourceChange,
    isDetail,
  });

  return (
    <Page title='核查计划' wrapperClass='marginBottomFormActionsHeight'>
      <div style={{ marginBottom: 16 }}>
        <Space style={{ justifyContent: 'space-between', width: '100%' }}>
          <Space size={24}>
            <span>
              核算年度：<strong>{planInfo?.year ?? '-'}</strong>
            </span>
            <span>
              核算组织：<strong>{planInfo?.orgNames ?? '-'}</strong>
            </span>
          </Space>
          {!isDetail && (
            <Space>
              <Button onClick={handleExport} loading={exportLoading}>
                导出计划
              </Button>
              <Button type='primary' onClick={handleAdd}>
                新增
              </Button>
            </Space>
          )}
        </Space>
      </div>

      <EditableProTable<VerificationPlanDetailItem>
        rowKey='id'
        actionRef={actionRef}
        editableFormRef={editableFormRef}
        value={dataSource}
        onChange={value => setDataSource(value as VerificationPlanDetailItem[])}
        columns={columns}
        size='small'
        search={false}
        pagination={false}
        scroll={{ x: 1700 }}
        params={{ planId }}
        request={async args => {
          if (!args.planId) return { data: [], total: 0, success: true };
          const { data } = await getVerificationPlanDetailListApi({
            verificationPlanId: args.planId,
          });
          const list = (data?.data || []).map(item => ({
            ...item,
            groupIds: item.groupIds ? item.groupIds.split(',') : [],
            userIds: item.userIds ? item.userIds.split(',') : [],
          }));
          return {
            data: list,
            total: list.length,
            success: true,
          };
        }}
        recordCreatorProps={false}
        editable={{
          form,
          editableKeys,
          onChange: setEditableKeys,
          // @ts-ignore
          onSave,
          onCancel: async rowKey => {
            if (String(rowKey).startsWith(TMP_FLAG)) {
              setEditableKeys(prev => prev.filter(k => k !== rowKey));
              setDataSource(prev => prev.filter(item => item.id !== rowKey));
            }
          },
          actionRender: (_row, _config, dom) => [dom.save, dom.cancel],
        }}
      />

      <FormActions
        place='center'
        buttons={compact([
          {
            title: '返回',
            onClick: async () => {
              navigate(CarbonVerifyRouteMaps.verificationPlan);
            },
          },
        ])}
      />
    </Page>
  );
};

export default VerificationPlanInfo;

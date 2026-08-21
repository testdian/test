import { PlusOutlined } from '@ant-design/icons';
import {
  ProForm,
  ProFormTreeSelect,
  ProFormText,
} from '@ant-design/pro-components';
import I18N from '@src/lang/I18N';
import { List } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Page } from '@/components/Page';
import { useOrgTreeData } from '@/hooks/useOrgTreeData';
import { EcaRouteMaps } from '@/router/utils/ecaEmums';
import {
  PAGE_TYPE_VAR,
  PageTypeInfo,
  virtualLinkTransform,
} from '@/router/utils/enums';
import { Model } from '@/sdks/computation/computationV2ApiDocs';
import { modal } from '@/store/module/notification';
import { Toast } from '@/utils';
import { ActionTypeEnum } from '@/utils/actionType';

import {
  copyAccountModelApi,
  deleteAccountModelApi,
  getAccountModelPageApi,
} from './service';
import { AccountModelRequest, AccountModelResponse } from './type';
import AccountModelItem from '../component/AccountModelItem';

const AccountingModelPage = () => {
  const navigate = useNavigate();

  const [orgTreeData] = useOrgTreeData();

  // 合并分页状态到searchParams
  const [searchParams, setSearchParams] = useState<AccountModelRequest>({
    pageNum: 1,
    pageSize: 10,
    likeModelName: '',
  });

  const [accountDataSource, setAccountDataSource] = useState<
    AccountModelResponse[]
  >([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // 获取核算模型分页信息
  const getAccountModelList = async (params: AccountModelRequest) => {
    setLoading(true);
    const { data } = await getAccountModelPageApi(params).finally(() => {
      setLoading(false);
    });
    setAccountDataSource(data?.data?.list || []);
    setTotal(data?.data?.total || 0);
  };

  // 复制、编辑 查看
  const editFn = (record: Model) => {
    navigate(
      virtualLinkTransform(
        EcaRouteMaps.accountingModelInfo,
        [PAGE_TYPE_VAR, ':id'],
        [PageTypeInfo.edit, record?.id],
      ),
    );
  };

  const copyFn = (record: Model) => {
    modal.confirm({
      centered: true,
      title: I18N.Factors.prompt,
      closable: true,
      okText: I18N.base.confirm,
      cancelText: I18N.Factors.cancel,
      content: (
        <span>
          {I18N.dashborad.pleaseConfirmIfItIs}
          <span className='modal_text'>{record?.modelName}</span>
        </span>
      ),
      onOk: async () => {
        if (!record?.id) return;
        const { data } = await copyAccountModelApi({
          id: Number(record?.id),
        });
        Toast('success', I18N.carbonFootPrintLCA.copySuccessful);
        setTimeout(() => {
          navigate(
            virtualLinkTransform(
              EcaRouteMaps.accountingModelInfo,
              [PAGE_TYPE_VAR, ':id'],
              [PageTypeInfo.edit, data?.data],
            ),
          );
        }, 200);
      },
    });
  };

  const showFn = (record: Model) => {
    navigate(
      virtualLinkTransform(
        EcaRouteMaps.accountingModelInfo,
        [PAGE_TYPE_VAR, ':id'],
        [PageTypeInfo.show, record?.id],
      ),
    );
  };

  const deleteFn = (record: Model) => {
    modal.confirm({
      centered: true,
      title: I18N.Factors.prompt,
      closable: true,
      okText: I18N.base.confirm,
      cancelText: I18N.Factors.cancel,
      content: (
        <span>
          {I18N.dashborad.pleaseConfirmIfItIs2}
          <span className='modal_text'>{record?.modelName}</span>
        </span>
      ),
      onOk: async () => {
        if (!record.id) return;
        await deleteAccountModelApi({ id: Number(record.id) });
        Toast('success', I18N.Factors.deleteSuccessful);
        // 删除成功后，重新获取当前页数据
        getAccountModelList(searchParams);
      },
    });
  };

  const onActionClick = (
    type: PageTypeInfo | ActionTypeEnum,
    record: AccountModelResponse,
  ) => {
    switch (type) {
      case PageTypeInfo.copy:
        copyFn(record);
        break;
      case PageTypeInfo.edit:
        editFn(record);
        break;
      case PageTypeInfo.show:
        showFn(record);
        break;
      case ActionTypeEnum.DELETE:
        deleteFn(record);
        break;
      default:
        break;
    }
  };

  // 处理分页变化
  const handleChange = (page: number, pageSize: number) => {
    setSearchParams(prev => ({
      ...prev,
      pageNum: page,
      pageSize,
    }));
  };

  // 处理表单提交
  const handleFormSubmit = async (values: AccountModelRequest) => {
    // 更新搜索参数并重置页码到第一页
    setSearchParams({
      ...values,
      pageNum: 1,
    });
  };

  // 处理表单重置
  const handleFormReset = () => {
    setSearchParams({
      pageNum: 1,
      pageSize: 10,
      likeModelName: '',
    });
  };

  useEffect(() => {
    getAccountModelList(searchParams);
  }, [searchParams]);

  return (
    <Page
      title={I18N.Factors.accountingModel}
      actionBtnChildArr={[
        {
          button: (
            <div>
              <PlusOutlined /> {I18N.Factors.newAddition}
            </div>
          ),
          click: () => {
            navigate(
              virtualLinkTransform(
                EcaRouteMaps.accountingModelInfo,
                [PAGE_TYPE_VAR, ':id'],
                [PageTypeInfo.add, 0],
              ),
            );
          },
        },
      ]}
    >
      {/* 搜索区域 */}
      <ProForm<AccountModelRequest>
        onFinish={handleFormSubmit}
        onReset={handleFormReset}
        layout='inline'
        submitter={{
          searchConfig: { submitText: I18N.prodManagement.query },
        }}
        autoFocusFirstInput={false}
      >
        {/* 模型名称 */}
        <ProFormText
          name='likeModelName'
          label={false}
          placeholder={I18N.carbonFootPrintLCA.modelName}
          required={false}
          fieldProps={{
            style: { width: 220 },
          }}
        />
        {/* 核算组织 */}
        <ProFormTreeSelect
          name='orgCode'
          label={false}
          placeholder='核算组织'
          required={false}
          fieldProps={{
            style: { width: 220 },
            treeData: orgTreeData,
            treeDefaultExpandAll: true,
            showSearch: true,
            allowClear: true,
            treeNodeFilterProp: 'label',
          }}
        />
      </ProForm>
      {/* 增加父级点击事件 不影响 子级点击事件 */}
      <List
        loading={loading}
        className='mt-24'
        grid={{ gutter: 16, column: 4 }}
        dataSource={accountDataSource}
        renderItem={item => (
          <List.Item>
            <AccountModelItem itemData={item} onActionClick={onActionClick} />
          </List.Item>
        )}
        pagination={{
          size: 'small',
          showSizeChanger: true,
          current: searchParams.pageNum,
          pageSize: searchParams.pageSize,
          total,
          onChange: handleChange,
        }}
      />
    </Page>
  );
};

export default AccountingModelPage;

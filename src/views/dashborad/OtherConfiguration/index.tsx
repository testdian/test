/**
 * @description 其他配置页面
 */
import { PlusOutlined } from '@ant-design/icons';
import I18N from '@src/lang/I18N';
import { compact } from 'lodash-es';
import { useState } from 'react';

import { Page } from '@/components/Page';
import { CustomTableRender } from '@/components/x-render/TableRender';
import { useTableRef as useTable } from '@/components/x-render/TableRender/hook/useTableRef';
import { useDrawer } from '@/hooks/useDrawer';
import { checkAuth } from '@/layout/utills';
import { PageTypeInfo } from '@/router/utils/enums';
import { modal } from '@/store/module/notification';
import { returnDelModalStyle, returnNoIconModalStyle, Toast } from '@/utils';
import { ActionTypeEnum } from '@/utils/const';

import ConfigDrawer from './ConfigDrawer';
import DataManageDrawer from './DataManageDrawer';
import { columns } from './columns';
import { schema } from './schemas';
import {
  copyConfigurationApi,
  deleteConfigurationApi,
  getConfigurationListApi,
} from './service';
import { ConfigurationListType, ConfigurationRequest } from './type';

const { EDIT, COPY, SHOW, DATA_MANAGE, DELETE } = ActionTypeEnum;

const { add, edit, show } = PageTypeInfo;

const OtherConfiguration = () => {
  const { refresh, tableRef } = useTable();

  const { visible, showDrawer, onClose } = useDrawer();

  const [dataManageVisible, setDataManageVisible] = useState(false);

  const [actionBtnType, setActionBtnType] = useState<PageTypeInfo>(add);

  const [recordInfo, setRecordInfo] = useState<ConfigurationListType>();
  const dataId = recordInfo?.id || 0;

  const searchApi = (args: ConfigurationRequest) => {
    return getConfigurationListApi(args).then(({ data }) => {
      return data?.data || {};
    });
  };

  // 操作处理函数（使用类型判断）
  const handleActionClick = async (
    actionType: ActionTypeEnum,
    record: ConfigurationListType,
  ) => {
    switch (actionType) {
      case SHOW:
        // 处理查看逻辑
        setActionBtnType(show);
        setRecordInfo(record);
        showDrawer();
        break;
      case EDIT:
        // 处理编辑逻辑
        setActionBtnType(edit);
        setRecordInfo(record);
        showDrawer();
        break;
      case COPY:
        // 处理复制逻辑
        modal.confirm({
          centered: true,
          title: I18N.Factors.prompt,
          closable: true,
          okText: I18N.base.confirm,
          cancelText: I18N.Factors.cancel,
          content: (
            <span>
              {I18N.dashborad.pleaseConfirmIfItIs}
              {/* <span className='modal_text'>{record?.modelName}</span> */}
            </span>
          ),
          onOk: async () => {
            if (!record?.id) return;
            const { data } = await copyConfigurationApi({
              id: Number(record?.id),
            });
            const newId = data?.data;
            if (!newId) return;
            Toast('success', I18N.carbonFootPrintLCA.copySuccessful);
            setTimeout(() => {
              // 打开编辑抽屉
              setActionBtnType(edit);
              setRecordInfo({ id: newId });
              showDrawer();
            }, 200);
          },
        });
        break;
      case DATA_MANAGE:
        // 处理数据管理逻辑
        setDataManageVisible(true);
        setRecordInfo(record);
        break;
      case DELETE:
        // 处理删除逻辑
        modal.confirm({
          title: I18N.Factors.prompt,
          ...returnNoIconModalStyle,
          ...returnDelModalStyle,
          content: <span>确认删除该配置？</span>,
          onOk: async () => {
            if (!record?.id) return;
            await deleteConfigurationApi({
              id: Number(record?.id),
            });
            Toast('success', I18N.Factors.deleteSuccessful);
            refresh?.({ stay: true, tab: 1 });
          },
          okText: I18N.base.confirm,
          cancelText: I18N.Factors.cancel,
        });
        break;
      default:
    }
  };

  const onInit = () => {
    setRecordInfo(undefined);
    setActionBtnType(add);
    setDataManageVisible(false);
    onClose();
  };

  return (
    <Page
      title={I18N.dashborad.otherConfigurations}
      actionBtnChildArr={compact([
        {
          button: checkAuth(
            '/sys/user/add',
            <div>
              <PlusOutlined /> {I18N.Factors.newAddition}
            </div>,
          ),
          click: () => {
            setActionBtnType(add);
            showDrawer();
          },
        },
      ])}
    >
      <CustomTableRender<ConfigurationListType, ConfigurationRequest>
        tableRef={tableRef}
        searchProps={{
          schema: schema(),
          api: searchApi,
        }}
        tableProps={{
          columns: columns({ handleActionClick }),
        }}
        autoAddIndexColumn
        autoFixNoText
      />

      {/* 其他配置抽屉 */}
      <ConfigDrawer
        dataId={dataId}
        actionType={actionBtnType}
        visible={visible}
        onOk={() => {
          onInit();
          refresh?.({ stay: true, tab: 1 });
        }}
        onClose={() => {
          onInit();
        }}
      />

      {/* 其他配置-数据管理抽屉 */}
      <DataManageDrawer
        dataId={dataId}
        visible={dataManageVisible}
        onOk={() => {
          onInit();
        }}
        onClose={() => {
          onInit();
        }}
      />
    </Page>
  );
};

export default OtherConfiguration;

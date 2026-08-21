import { ProTable } from '@ant-design/pro-components';
import I18N from '@src/lang/I18N';
import { Button } from 'antd';
import { FC, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useAsyncEnums } from '@/hooks';
import { RouteMaps } from '@/router/utils/enums';
import { modal } from '@/store/module/notification';

import {
  exportInterfaceApi,
  getEnergyApi,
  getInterfaceDetailApi,
  getKtmsApi,
  getOaPageApi,
} from '../service';
import { InterFaceList } from '../type';
import {
  energyColumns,
  energyPhotovoltaicColumns,
  ktmsColumns,
  oaColumns,
} from './columns';

type InterfaceTypeKey = 'energyElectric' | 'energyPhotovoltaic' | 'ktms' | 'oa';

type InterfacePageApi =
  | typeof getEnergyApi
  | typeof getKtmsApi
  | typeof getOaPageApi;

type InterfaceColumns =
  | typeof energyColumns
  | typeof energyPhotovoltaicColumns
  | typeof ktmsColumns
  | typeof oaColumns;

type InterfacePageConfig = {
  api: InterfacePageApi;
  columns: InterfaceColumns;
  scroll?: { x: number };
};

const interfacePageConfig: Record<InterfaceTypeKey, InterfacePageConfig> = {
  energyElectric: {
    api: getEnergyApi,
    columns: energyColumns,
  },
  energyPhotovoltaic: {
    api: getEnergyApi,
    columns: energyPhotovoltaicColumns,
  },
  ktms: {
    api: getKtmsApi,
    columns: ktmsColumns,
    scroll: { x: 2000 },
  },
  oa: {
    api: getOaPageApi,
    columns: oaColumns,
    scroll: { x: 2000 },
  },
};

const getInterfaceTypeKey = (params: {
  code?: number | string;
  name?: string;
}) => {
  const typeCode = String(params.code ?? '');
  if (typeCode === '11') return 'energyPhotovoltaic';
  if (typeCode === '10') return 'energyElectric';

  const { name } = params;
  const typeName = name?.toLowerCase() || '';
  if (!typeName) return undefined;

  if (
    typeName.includes('光伏') ||
    typeName.includes('photovoltaic') ||
    typeName.includes('pv')
  )
    return 'energyPhotovoltaic';
  if (
    (typeName.includes('能源') && typeName.includes('电')) ||
    typeName.includes('energy')
  )
    return 'energyElectric';
  if (typeName.includes('ktms')) return 'ktms';
  if (/(^|[^a-z])oa([^a-z]|$)/.test(typeName)) return 'oa';

  return undefined;
};

const InterFaceInfo: FC = () => {
  const { id: searchId } = useParams();
  const navigate = useNavigate();

  const id = Number(searchId) || 0;

  const [interfaceDetail, setInterfaceDetail] = useState<InterFaceList>();

  /** 接口类型枚举 */
  const interfaceTypeList = useAsyncEnums('InterfaceType');

  const currentInterfaceTypeKey = useMemo(() => {
    if (!interfaceDetail) return undefined;

    const currentType = interfaceTypeList.find(
      item => String(item.code) === String(interfaceDetail.interfaceType),
    );

    return getInterfaceTypeKey({
      code: currentType?.code ?? interfaceDetail.interfaceType,
      name: currentType?.name || interfaceDetail.interfaceType_name,
    });
  }, [interfaceDetail, interfaceTypeList]);

  const currentInterfaceConfig = currentInterfaceTypeKey
    ? interfacePageConfig[currentInterfaceTypeKey]
    : undefined;

  useEffect(() => {
    if (!id) return;
    getInterfaceDetailApi(id).then(({ data }) => {
      setInterfaceDetail(data?.data);
    });
  }, [id]);

  return (
    <div className='interface-info'>
      <ProTable
        headerTitle={interfaceDetail?.interfaceType_name}
        columns={currentInterfaceConfig?.columns || []}
        size='small'
        search={false}
        rowKey='id'
        options={false}
        toolBarRender={() => [
          <Button
            key='export'
            type='primary'
            onClick={async () => {
              await exportInterfaceApi({ id });
              modal.confirm({
                title: I18N.dashborad.interfaceExport,
                content: I18N.dashborad.exportAnyInterface,
                okText: I18N.base.confirm,
                cancelText: I18N.Factors.cancel,
                onOk: async () => {
                  navigate(RouteMaps.systemDownload);
                },
              });
            }}
          >
            {I18N.eca.export}
          </Button>,
        ]}
        pagination={{
          showSizeChanger: true,
          showTotal: undefined,
          size: 'small',
        }}
        scroll={currentInterfaceConfig?.scroll}
        params={{
          id,
          interfaceType: currentInterfaceTypeKey,
        }}
        request={async ({ pageSize, current }) => {
          if (!id || !currentInterfaceConfig)
            return { data: [], total: 0, success: true };

          const { data } = await currentInterfaceConfig.api({
            pageNum: Number(current),
            pageSize: Number(pageSize),
            id: Number(id),
          });
          return {
            data: data?.data?.list || [],
            total: data?.data?.total,
            success: true,
          };
        }}
      />
    </div>
  );
};

export default InterFaceInfo;

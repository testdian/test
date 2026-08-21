/*
 * @@description:核算模型
 */
import I18N from '@src/lang/I18N';
import { Button, Descriptions, Space } from 'antd';
import { compact } from 'lodash-es';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SearchProps } from 'table-render/dist/src/types';

import { FormActions } from '@/components/FormActions';
import { CustomTableRender } from '@/components/x-render/TableRender';
import { useTableRef as useTable } from '@/components/x-render/TableRender/hook/useTableRef';
import { EcaRouteMaps } from '@/router/utils/ecaEmums';
import { PageTypeInfo, virtualLinkTransform } from '@/router/utils/enums';
import {
  Computation,
  Model,
  getComputationComputationEmissionSourceList,
  getComputationComputationId,
  getComputationModelEmissionSourceList,
  getComputationModelEmissionSourceListProps,
  getComputationModelId,
  postComputationModelEmissionSourceDelete,
  postComputationComputationEmissionSourceDelete,
} from '@/sdks/computation/computationV2ApiDocs';
import { modal } from '@/store/module/notification';
import {
  Toast,
  changeTableColumnsNoText,
  getSearchParams,
  updateUrl,
} from '@/utils';
import { useIndexColumn } from '@/utils/columns';

import Style from './index.module.less';
import { meissionSourceColumns } from '../emissionManage/utils/columns';
import { culComputation, culHistoryFn } from '../util/util';

const EmissionSource = () => {
  const { id, pageTypeInfo } = useParams<{
    id: string;
    pageTypeInfo: string;
  }>();
  const [model, setModel] = useState<
    Partial<
      Model &
        Computation & { dataPeriod_name?: string; gwpVersion_name?: string }
    >
  >({});
  const [searchParams, setSearchParams] =
    useState<getComputationModelEmissionSourceListProps>(
      getSearchParams<getComputationModelEmissionSourceListProps>()[0],
    );
  const { refresh, tableRef } = useTable();
  const form = tableRef?.current?.form;
  const navigate = useNavigate();

  const indexColumn = useIndexColumn<any>(
    (Number(searchParams?.pageNum) - 1) * Number(searchParams?.pageSize),
  );
  // 用于修正第一次页码无法正常设置问题
  const isFirstLoad = useRef(true);
  const searchApi: SearchProps<getComputationModelEmissionSourceListProps>['api'] =
    ({ current, ...args }: { current: number }) => {
      const pageNum =
        (isFirstLoad.current ? searchParams.pageNum : current) || current;
      let newSearch = {
        ...args,
        ...searchParams,
        pageNum,
      } as getComputationModelEmissionSourceListProps;
      if (!isFirstLoad.current) {
        newSearch = {
          ...args,
          pageNum,
        } as getComputationModelEmissionSourceListProps;
        updateUrl(args);
      } else {
        form?.setValues(newSearch);
      }
      setSearchParams({
        ...newSearch,
      });
      isFirstLoad.current = false;
      if (culComputation()) {
        return getComputationComputationEmissionSourceList({
          ...newSearch,
          computationId: Number(id),
        }).then(({ data }) => {
          return {
            rows: data?.data?.list,
            total: data?.data?.total,
          };
        });
      }
      return getComputationModelEmissionSourceList({
        ...newSearch,
        modelId: Number(id),
      }).then(({ data }) => {
        return {
          rows: data?.data?.list,
          total: data?.data?.total,
        };
      });
    };
  // 核算模型详情
  const modelFn = async () => {
    await getComputationModelId({ id: Number(id) }).then(({ data }) => {
      if (data.code === 200) {
        setModel({ ...data.data });
      }
    });
  };
  // 碳排放详情
  const idsFn = async () => {
    await getComputationComputationId({ id: Number(id) }).then(({ data }) => {
      if (data.code === 200) {
        setModel({ ...data.data });
      }
    });
  };

  useEffect(() => {
    if (culComputation()) {
      idsFn();
      return;
    }
    modelFn();
  }, []);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection: {
    preserveSelectedRowKeys: boolean;
    selectedRowKeys: React.Key[];
    onChange: (newSelectedRowKeys: React.Key[]) => void;
  } = {
    preserveSelectedRowKeys: true,
    selectedRowKeys,
    onChange: onSelectChange,
  };
  return (
    <div className={Style.wrapper}>
      <Descriptions
        bordered
        title={I18N.eca.emissionSourceManagement}
        extra={
          <Space>
            {pageTypeInfo !== PageTypeInfo.show && (
              <Button
                onClick={() => {
                  if (selectedRowKeys.length === 0) {
                    Toast('error', I18N.eca.pleaseSelectData2);
                    return;
                  }
                  modal.confirm({
                    content: I18N.eca.confirmDeletion,
                    onOk: async () => {
                      if (culComputation()) {
                        await postComputationComputationEmissionSourceDelete({
                          req: {
                            emissionSourceIds: selectedRowKeys.join(','),
                            id: Number(id),
                            delType: 2,
                          },
                        });
                      } else {
                        await postComputationModelEmissionSourceDelete({
                          req: {
                            emissionSourceIds: selectedRowKeys.join(','),
                            id: Number(id),
                          },
                        });
                      }

                      Toast('success', I18N.Factors.deleteSuccessful);
                      refresh?.();
                      setSelectedRowKeys([]);
                    },
                    okText: I18N.base.confirm,
                    cancelText: I18N.Factors.cancel,
                  });
                }}
              >
                {I18N.eca.batchDeletion}
              </Button>
            )}
            {pageTypeInfo !== PageTypeInfo.show && (
              <Button
                type='primary'
                onClick={() => {
                  if (culComputation()) {
                    // 碳排放核算
                    navigate(
                      virtualLinkTransform(
                        EcaRouteMaps.carbonMissionAccountingSource,
                        [':pageTypeInfo', ':id', ':SourcefactorId'],
                        [PageTypeInfo.add, id, 0],
                      ),
                    );
                    return;
                  }
                  // 核算模型
                  navigate(
                    virtualLinkTransform(
                      EcaRouteMaps.accountingModelEmissionSourceInfo,
                      [':pageTypeInfo', ':id', ':SourcefactorId'],
                      [PageTypeInfo.add, id, '0'],
                    ),
                  );
                }}
              >
                {I18N.eca.selectingEmissionSources}
              </Button>
            )}
          </Space>
        }
        style={{ marginBottom: 16 }}
      >
        {!culComputation() && (
          <Descriptions.Item label={I18N.carbonFootPrintLCA.modelName}>
            {model?.modelName || '-'}
          </Descriptions.Item>
        )}
        {!culComputation() && (
          <Descriptions.Item label={I18N.carbonData.affiliatedOrganization}>
            {model?.orgName || '-'}
          </Descriptions.Item>
        )}
        {culComputation() && (
          <Descriptions.Item label={I18N.eca.accountingName}>
            {model.computationName || ''}
          </Descriptions.Item>
        )}
        {culComputation() && (
          <Descriptions.Item label={I18N.eca.accountingOrganization}>
            {model?.orgName || '-'}
          </Descriptions.Item>
        )}
        {culComputation() && (
          <Descriptions.Item label={I18N.carbonData.accountingYear}>
            {model?.year || '-'}
          </Descriptions.Item>
        )}
        {culComputation() && (
          <Descriptions.Item label={I18N.eca.accountingCollectionWeek}>
            {model?.dataPeriod_name || '-'}
          </Descriptions.Item>
        )}
        {culComputation() && (
          <Descriptions.Item
            label={I18N.supplyChainCarbonManagement.gwpVersion}
          >
            {model?.gwpVersion_name || '-'}
          </Descriptions.Item>
        )}
      </Descriptions>
      <CustomTableRender
        tableRef={tableRef}
        searchProps={{
          schema: {},
          api: searchApi,
        }}
        tableProps={{
          columns: changeTableColumnsNoText(
            [
              ...indexColumn,
              ...meissionSourceColumns({
                refresh,
                navigate,
                modelId: id,
                nodel: pageTypeInfo === PageTypeInfo.show,
                pageTypeInfo,
              }),
            ],
            '-',
          ),
          pagination: {
            pageSize: searchParams?.pageSize
              ? +searchParams.pageSize
              : undefined,
            current: searchParams?.pageNum ? +searchParams.pageNum : undefined,
            size: 'default',
          },
          scroll: { x: 1200, y: 400 },
          rowSelection,
        }}
      />
      <FormActions
        place='center'
        buttons={compact([
          {
            title: I18N.carbonFootPrintLCA.confirm,
            onClick: async () => {
              navigate(culHistoryFn());
            },
            type: 'primary',
          },
          {
            title: I18N.Factors.return,
            onClick: async () => {
              navigate(culHistoryFn());
            },
          },
        ])}
      />
    </div>
  );
};

export default EmissionSource;

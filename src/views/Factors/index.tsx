/*
 * @@description:排放因子
 */
import { PlusOutlined } from '@ant-design/icons';
import I18N from '@src/lang/I18N';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Page } from '@/components/Page';
import { CustomTableRender } from '@/components/x-render/TableRender';
import { useTableRef as useTable } from '@/components/x-render/TableRender/hook/useTableRef';
import { checkAuth } from '@/layout/utills';
import { EcaRouteMaps } from '@/router/utils/ecaEmums';
import {
  PAGE_TYPE_VAR,
  PageTypeInfo,
  virtualLinkTransform,
} from '@/router/utils/enums';
import {
  getSystemFactorPage,
  getSystemFactorPageProps,
} from '@/sdks/systemV2ApiDocs';

import { FullPageDetail } from './FullPageDetail';
import { columns } from './utils/columns';
import { searchSchema } from './utils/schemas';
import { useAllEnumsBatch } from '../dashborad/Dicts/hooks';

const Factors = () => {
  const navigate = useNavigate();
  // 联动数据过滤
  const [sourceType, setSourceType] = useState('');
  const firstClassify = useAllEnumsBatch<{
    firstClassify: { dictLabel: string; dictValue: string; dictType: string }[];
  }>('firstClassify');
  const secondClassify = useAllEnumsBatch<{
    secondClassify: {
      dictLabel: string;
      dictValue: string;
      dictType: string;
      sourceType: string;
    }[];
  }>('secondClassify');

  const filteredSecondClassify = useMemo(() => {
    if (!secondClassify) return [];
    if (!sourceType) return secondClassify.secondClassify;
    return secondClassify.secondClassify?.filter(
      c => c.sourceType === sourceType,
    );
  }, [sourceType, secondClassify]);

  const { refresh, tableRef } = useTable();

  const [open, setOpen] = useState(false);

  const [selectedFactorId, setSelectedFactorId] = useState('');

  const searchApi = (args: getSystemFactorPageProps) => {
    return getSystemFactorPage(args).then(({ data }) => {
      return data?.data || {};
    });
  };

  const handelCheckDetail = (id: string) => {
    setSelectedFactorId(id);
    setOpen(true);
  };
  return (
    <Page
      title={I18N.router.emissionFactorLibrary}
      actionBtnChild={checkAuth(
        '/factor/add',
        <div>
          <PlusOutlined /> {I18N.Factors.newAddition}
        </div>,
      )}
      onBtnClick={async () => {
        navigate(
          virtualLinkTransform(
            EcaRouteMaps.factorInfo,
            [PAGE_TYPE_VAR, ':id'],
            [PageTypeInfo.add, 'null'],
          ),
        );
      }}
    >
      <CustomTableRender
        tableRef={tableRef}
        searchProps={{
          schema: searchSchema(),
          api: searchApi,
          searchOnMount: false,
          onValuesChange: changedVal => {
            if (changedVal.dataPath === 'firstClassify') {
              const targetFirstClass = firstClassify?.firstClassify?.find(
                c => c.dictValue === changedVal.value,
              );
              setSourceType(targetFirstClass?.dictValue || '');
            }
          },
        }}
        tableProps={{
          columns: columns({
            navigate,
            refresh,
            handelCheckDetail,
            secondClassify: filteredSecondClassify,
            firstClassify: firstClassify?.firstClassify || [],
          }),
        }}
        autoAddIndexColumn
        autoFixNoText
      />
      {/* 查看因子详情Modal */}
      <FullPageDetail
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        initFactorId={selectedFactorId}
      />
    </Page>
  );
};

export default Factors;

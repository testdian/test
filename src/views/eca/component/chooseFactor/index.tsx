/*
 * @description:选择排放因子(用到的模块 排放源库、排放数据填报)
 */

import I18N from '@src/lang/I18N';
import { searchSchema } from '@views/Factors/utils/schemas';
import { columns } from '@views/eca/emissionManage/Info/utils/factorColumns';
import { compact } from 'lodash-es';
import { useEffect, useState } from 'react';

import { FormActions } from '@/components/FormActions';
import { Page } from '@/components/Page';
import { CustomTableRender } from '@/components/x-render/TableRender';
import { useTableRef as useTable } from '@/components/x-render/TableRender/hook/useTableRef';
import type { CustomSearchProps } from '@/components/x-render/TableRender/types';
import {
  Factor,
  getSystemFactorPageProps as SearchApiProps,
  getSystemFactorPage,
} from '@/sdks/systemV2ApiDocs';
import { getSearchParams } from '@/utils';
import { CHOOSE_FACTOR } from '@/views/components/EmissionSource/utils/constant';

import { ParamsProp } from './type';

const ChooseFactor = ({
  onDetailClick,
  onConfirmClick,
  onCancelClick,
}: {
  onDetailClick?: (data: Factor) => void;
  onConfirmClick?: (data: ParamsProp) => void;
  onCancelClick?: (data: ParamsProp) => void;
}) => {
  const { tableRef } = useTable();
  const form = tableRef?.current?.form;
  const search = { ...getSearchParams()[0] };
  const formValues = JSON.parse(search[CHOOSE_FACTOR.FORM_VALUES] || '{}');
  const likeName = search?.likeName;

  // 选择selectKey
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const searchApi: CustomSearchProps<Factor, SearchApiProps> = args => {
    const { ghg, iso } = args;
    return getSystemFactorPage({
      ...args,
      status: '0',
      ghg: ghg ? String(ghg) : undefined,
      iso: iso ? String(iso) : undefined,
    }).then(({ data }) => {
      const result = data?.data || {};
      setSelectedRowKeys([result?.list?.[0]?.id || 0]);
      return result;
    });
  };
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection: {
    selectedRowKeys: React.Key[];
    type: 'radio';
    onChange: (newSelectedRowKeys: React.Key[]) => void;
  } = {
    selectedRowKeys,
    type: 'radio',
    onChange: onSelectChange,
  };
  useEffect(() => {
    form?.setValues({
      likeName,
    });
  }, []);
  return (
    <Page
      title={I18N.Factors.emissionFactors}
      wrapperClass='marginBottomFormActionsHeight'
    >
      <CustomTableRender<Factor, SearchApiProps>
        tableRef={tableRef}
        searchProps={{
          schema: searchSchema(),
          api: searchApi,
          searchOnMount: false,
        }}
        tableProps={{
          columns: columns({ onDetailClick }),
          scroll: { x: 1200, y: 600 },
          rowSelection,
        }}
        autoFixNoText
      />
      <FormActions
        place='center'
        buttons={compact([
          {
            title: I18N.Factors.preserve,
            type: 'primary',
            disabled: selectedRowKeys.length === 0,
            onClick: async () => {
              onConfirmClick?.({
                [CHOOSE_FACTOR.FORM_VALUES]: formValues,
                [CHOOSE_FACTOR.FACTOR_ID]: selectedRowKeys[0],
              });
            },
          },
          {
            title: I18N.Factors.cancel,
            onClick: async () => {
              onCancelClick?.({
                [CHOOSE_FACTOR.FORM_VALUES]: formValues,
              });
            },
          },
        ])}
      />
    </Page>
  );
};

export default ChooseFactor;

/*
 * @description:选择排放因子(用到的模块 排放源库、排放数据填报)
 */

import I18N from '@src/lang/I18N';
import { searchSchema } from '@views/Factors/utils/schemas';
import { columns } from '@views/eca/emissionManage/Info/utils/factorColumns';
import { Button } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';

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

export type ChooseParamsFactorSelectedFactor = Partial<
  Omit<Factor, 'id' | 'name' | 'year'>
> & {
  factorId?: React.Key;
  factorName?: string;
  factorValueId?: React.Key;
  id?: React.Key;
  name?: string;
  year?: string | number;
};

interface ChooseParamsFactorProps {
  onDetailClick?: (data: Factor) => void;
  onConfirmClick?: (data: Factor) => void;
  onCancelClick?: () => void;
  initialSearchValues?: Partial<SearchApiProps>;
  selectedFactor?: ChooseParamsFactorSelectedFactor;
}

const isValidKey = (value?: React.Key | null) =>
  value !== undefined && value !== null && value !== '';

const isSameKey = (left?: React.Key | null, right?: React.Key | null) =>
  isValidKey(left) && isValidKey(right) && String(left) === String(right);

const getSelectedFactorId = (factor?: ChooseParamsFactorSelectedFactor) =>
  factor?.id ?? factor?.factorId ?? factor?.factorValueId;

const getSelectedFactorName = (factor?: ChooseParamsFactorSelectedFactor) =>
  factor?.name || factor?.factorName;

const ChooseParamsFactor = ({
  onDetailClick,
  onConfirmClick,
  onCancelClick,
  initialSearchValues,
  selectedFactor,
}: ChooseParamsFactorProps) => {
  const { tableRef } = useTable();
  const manualSelectedRef = useRef(false);
  const search = { ...getSearchParams()[0] };
  // const formValues = JSON.parse(search[CHOOSE_FACTOR.FORM_VALUES] || '{}');
  const likeName = search?.likeName;
  const selectedFactorId = getSelectedFactorId(selectedFactor);
  const selectedFactorName = getSelectedFactorName(selectedFactor);
  const initialLikeName =
    selectedFactorName || likeName || initialSearchValues?.likeName;
  const shouldApplyInitialLikeNameRef = useRef(Boolean(initialLikeName));
  const mergedInitialSearchValues = useMemo(
    () => ({
      ...initialSearchValues,
      likeName: initialLikeName,
    }),
    [initialSearchValues, initialLikeName],
  );

  // 选择selectKey
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  // 选择selectedRows
  const [selectedRowsValues, setSelectedRowsValues] = useState<Factor[]>([]);

  const setSelectedFactor = (
    factor?: ChooseParamsFactorSelectedFactor | Factor,
  ) => {
    const factorId = getSelectedFactorId(factor);
    if (!isValidKey(factorId)) {
      setSelectedRowKeys([]);
      setSelectedRowsValues([]);
      return;
    }

    setSelectedRowKeys([factorId as React.Key]);
    setSelectedRowsValues([factor as Factor]);
  };

  const searchApi: CustomSearchProps<Factor, SearchApiProps> = args => {
    const { ghg, iso } = args;
    const shouldApplyInitialLikeName =
      shouldApplyInitialLikeNameRef.current &&
      args.likeName === undefined &&
      !!mergedInitialSearchValues.likeName;
    const searchArgs = {
      ...mergedInitialSearchValues,
      ...args,
      likeName: shouldApplyInitialLikeName
        ? mergedInitialSearchValues.likeName
        : args.likeName,
    };
    shouldApplyInitialLikeNameRef.current = false;

    return getSystemFactorPage({
      ...searchArgs,
      status: '0',
      ghg: ghg ? String(ghg) : undefined,
      iso: iso ? String(iso) : undefined,
    }).then(({ data }) => {
      const result = data?.data || {};
      const list = result?.list || [];
      const matchedSelectedFactor = list.find(item =>
        isSameKey(item.id, selectedFactorId),
      );

      if (isValidKey(selectedFactorId) && !manualSelectedRef.current) {
        setSelectedFactor(matchedSelectedFactor || selectedFactor);
      } else {
        setSelectedFactor(list[0]);
      }
      return result;
    });
  };
  const onSelectChange = (
    newSelectedRowKeys: React.Key[],
    selectedRows: Factor[],
  ) => {
    manualSelectedRef.current = true;
    setSelectedRowsValues(selectedRows);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: {
    selectedRowKeys: React.Key[];
    type: 'radio';
    onChange: (newSelectedRowKeys: React.Key[], selectedRows: Factor[]) => void;
  } = {
    selectedRowKeys,
    type: 'radio',
    onChange: onSelectChange,
  };

  useEffect(() => {
    manualSelectedRef.current = false;
    shouldApplyInitialLikeNameRef.current = Boolean(
      mergedInitialSearchValues.likeName,
    );
    if (isValidKey(selectedFactorId)) {
      setSelectedFactor(selectedFactor);
    }
  }, [
    mergedInitialSearchValues.likeName,
    selectedFactorId,
    selectedFactorName,
  ]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      tableRef?.current?.form?.setValues(mergedInitialSearchValues);
    });

    return () => {
      window.clearTimeout(timer);
    };
  }, [mergedInitialSearchValues, tableRef]);

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
          scroll: { x: 1200, y: 300 },
          rowSelection,
          size: 'small',
        }}
        autoFixNoText
      />
      <div
        className='flex justify-end'
        style={{ gap: '10px', marginTop: '10px' }}
      >
        <Button
          onClick={async () => {
            onCancelClick?.();
            setSelectedRowKeys([]);
            setSelectedRowsValues([]);
          }}
        >
          {I18N.Factors.cancel}
        </Button>
        <Button
          disabled={selectedRowKeys.length === 0}
          onClick={() => {
            onConfirmClick?.(selectedRowsValues?.[0] || {});
            setSelectedRowKeys([]);
            setSelectedRowsValues([]);
          }}
          type='primary'
        >
          {I18N.Factors.preserve}
        </Button>
      </div>
    </Page>
  );
};

export default ChooseParamsFactor;

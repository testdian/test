/**
 * @description 进度追踪看板
 */
import { Button, Space } from 'antd';
import { useMemo, useState } from 'react';

import { SearchInputWithNote } from '@/components/ModifyNote/SearchInputWithNote';
import { SelectWithNote } from '@/components/ModifyNote/SelectWithNote';
import { Page } from '@/components/Page';
import { OrgCarbonProgressChart } from '@/views/supplyChainCarbon/progress/OrgCarbonProgressChart';
import { OrgCarbonProgressTables } from '@/views/supplyChainCarbon/progress/OrgCarbonProgressTables';
import { ProductCarbonProgressChart } from '@/views/supplyChainCarbon/progress/ProductCarbonProgressChart';
import { ProductCarbonProgressTable } from '@/views/supplyChainCarbon/progress/ProductCarbonProgressTable';
import { useDemoStore } from '@/views/supplyChainCarbon/hooks/useDemoStore';
import { buildTargetYearOptions } from '@/views/supplyChainCarbon/reductionTargets/reduction-target-form';
import styles from '@/views/supplyChainCarbon/styles.module.less';

type OrgFilters = {
  targetYear: number | 'all';
  supplierName: string;
};

type ProductFilters = {
  targetYear: number | 'all';
  supplierName: string;
  productName: string;
};

const defaultOrgFilters: OrgFilters = {
  targetYear: 'all',
  supplierName: '',
};

const defaultProductFilters: ProductFilters = {
  targetYear: 'all',
  supplierName: '',
  productName: '',
};

const ORG_TARGET_YEAR_NOTE = '组织碳下方增加目标年度搜索项';
const ORG_SUPPLIER_SEARCH_NOTE = '组织碳下方增加供应商名称搜索项';
const PRODUCT_TARGET_YEAR_NOTE = '产品碳下方增加目标年度搜索项';
const PRODUCT_SUPPLIER_SEARCH_NOTE = '产品碳下方增加供应商名称搜索项';
const PRODUCT_NAME_SEARCH_NOTE = '产品碳下方供应商名称右侧增加产品名称搜索项';

export default function ProgressBoardPage() {
  const { data, ready } = useDemoStore();

  const [orgFilters, setOrgFilters] = useState(defaultOrgFilters);
  const [appliedOrgFilters, setAppliedOrgFilters] = useState(defaultOrgFilters);
  const [productFilters, setProductFilters] = useState(defaultProductFilters);
  const [appliedProductFilters, setAppliedProductFilters] =
    useState(defaultProductFilters);

  const targetYearOptions = useMemo(() => {
    const seedYears = buildTargetYearOptions();
    const legacyYears = [
      ...new Set(
        data.reductionTargets
          .map(item => item.baseline_year)
          .filter((year): year is number => year != null),
      ),
    ]
      .filter(year => !seedYears.some(option => option.value === year))
      .sort((a, b) => b - a)
      .map(year => ({ label: String(year), value: year }));
    return [{ label: '全部年度', value: 'all' as const }, ...legacyYears, ...seedYears];
  }, [data.reductionTargets]);

  return (
    <Page title='进度追踪看板'>
      <div className={styles.progressBoardSection}>
        <div className={styles.progressBoardSectionTitle}>组织碳</div>
        <div className={styles.filterBar}>
          <SelectWithNote
            note={ORG_TARGET_YEAR_NOTE}
            className={styles.filterSelect}
            value={orgFilters.targetYear}
            onChange={value =>
              setOrgFilters(prev => ({
                ...prev,
                targetYear: (value ?? 'all') as number | 'all',
              }))
            }
            options={targetYearOptions}
          />
          <div className={styles.filterSearch}>
            <SearchInputWithNote
              note={ORG_SUPPLIER_SEARCH_NOTE}
              placeholder='供应商名称'
              value={orgFilters.supplierName}
              onChange={e =>
                setOrgFilters(prev => ({
                  ...prev,
                  supplierName: e.target.value,
                }))
              }
              style={{ width: '100%' }}
            />
          </div>
          <Space>
            <Button
              type='primary'
              onClick={() => setAppliedOrgFilters(orgFilters)}
            >
              查询
            </Button>
            <Button
              onClick={() => {
                setOrgFilters(defaultOrgFilters);
                setAppliedOrgFilters(defaultOrgFilters);
              }}
            >
              重置
            </Button>
          </Space>
        </div>
        <OrgCarbonProgressChart
          data={data}
          supplierKeyword={appliedOrgFilters.supplierName}
          targetYear={appliedOrgFilters.targetYear}
        />
        <OrgCarbonProgressTables
          data={data}
          loading={!ready}
          supplierKeyword={appliedOrgFilters.supplierName}
          targetYear={appliedOrgFilters.targetYear}
        />
      </div>

      <div className={styles.progressBoardSection}>
        <div className={styles.progressBoardSectionTitle}>产品碳</div>
        <div className={styles.filterBar}>
          <SelectWithNote
            note={PRODUCT_TARGET_YEAR_NOTE}
            className={styles.filterSelect}
            value={productFilters.targetYear}
            onChange={value =>
              setProductFilters(prev => ({
                ...prev,
                targetYear: (value ?? 'all') as number | 'all',
              }))
            }
            options={targetYearOptions}
          />
          <div className={styles.filterSearch}>
            <SearchInputWithNote
              note={PRODUCT_SUPPLIER_SEARCH_NOTE}
              placeholder='供应商名称'
              value={productFilters.supplierName}
              onChange={e =>
                setProductFilters(prev => ({
                  ...prev,
                  supplierName: e.target.value,
                }))
              }
              style={{ width: '100%' }}
            />
          </div>
          <div className={styles.filterSearch}>
            <SearchInputWithNote
              note={PRODUCT_NAME_SEARCH_NOTE}
              placeholder='产品名称'
              value={productFilters.productName}
              onChange={e =>
                setProductFilters(prev => ({
                  ...prev,
                  productName: e.target.value,
                }))
              }
              style={{ width: '100%' }}
            />
          </div>
          <Space>
            <Button
              type='primary'
              onClick={() => setAppliedProductFilters(productFilters)}
            >
              查询
            </Button>
            <Button
              onClick={() => {
                setProductFilters(defaultProductFilters);
                setAppliedProductFilters(defaultProductFilters);
              }}
            >
              重置
            </Button>
          </Space>
        </div>
        <ProductCarbonProgressChart
          data={data}
          supplierKeyword={appliedProductFilters.supplierName}
          productKeyword={appliedProductFilters.productName}
          targetYear={appliedProductFilters.targetYear}
        />
        <ProductCarbonProgressTable
          data={data}
          loading={!ready}
          supplierKeyword={appliedProductFilters.supplierName}
          productKeyword={appliedProductFilters.productName}
          targetYear={appliedProductFilters.targetYear}
        />
      </div>
    </Page>
  );
}

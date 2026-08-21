/**
 * @description 减排措施（由碳减排管理 Tab 独立成页）
 */
import I18N from '@src/lang/I18N';
import { Select } from 'antd';
import { useCallback, useEffect, useState } from 'react';

import { FormLabelWithNote } from '@/components/ModifyNote';
import { Page } from '@/components/Page';
import Measures from '@/views/eca/predictionEmissionReduction/components/Measures';
import { getReductionPlanOrgListApi } from '@/views/eca/predictionEmissionReduction/service';
import type { OrgWithStandardYearResp } from '@/views/eca/predictionEmissionReduction/type';

import styles from './index.module.less';

const PAGE_NOTE =
  '把碳减排管理里减排措施这页复制出来，单独写一个菜单叫：减排措施，放在排放目标菜单下面，和它同级。';

const CHART_TARGET_NOTE =
  '图表去掉BAU、阶段一、二目标，改成目标排放量，用蓝色点';

const SCOPE_OPTIONS_NOTE = '改成范围一、范围二、范围三';

function orgListToSelectOptions(list: OrgWithStandardYearResp[]) {
  return list.reduce<{ label: string; value: string }[]>((acc, item) => {
    const value = item.orgCode?.trim();
    if (!value) return acc;
    acc.push({ label: item.orgName ?? value, value });
    return acc;
  }, []);
}

const ReductionMeasures = () => {
  const [orgCode, setOrgCode] = useState<string>();
  const [orgOptions, setOrgOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [orgListLoading, setOrgListLoading] = useState(false);
  const [pageRefreshKey] = useState(0);

  const loadOrgList = useCallback(async () => {
    const { data: res } = await getReductionPlanOrgListApi();
    const list = res.data ?? [];
    setOrgOptions(orgListToSelectOptions(list));
    return list;
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setOrgListLoading(true);
      try {
        await loadOrgList();
      } finally {
        if (!cancelled) setOrgListLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loadOrgList]);

  useEffect(() => {
    if (orgOptions.length && !orgCode) {
      setOrgCode(orgOptions[0].value);
    }
  }, [orgOptions, orgCode]);

  return (
    <Page title={<FormLabelWithNote label='减排措施' note={PAGE_NOTE} />}>
      <div className={styles.wrapper}>
        <div className={styles.filter}>
          <span className={styles.filterLabel}>
            {I18N.eca.organizationalScope}
          </span>
          <Select
            className={styles.orgSelect}
            value={orgCode}
            onChange={setOrgCode}
            options={orgOptions}
            loading={orgListLoading}
            placeholder={I18N.eca.organizationalScope}
            showSearch
            optionFilterProp='label'
          />
        </div>
        <Measures
          orgCode={orgCode}
          refreshKey={pageRefreshKey}
          chartNote={CHART_TARGET_NOTE}
          scopeOptionsNote={SCOPE_OPTIONS_NOTE}
        />
      </div>
    </Page>
  );
};

export default ReductionMeasures;

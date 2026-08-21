import I18N from '@src/lang/I18N';
import { Button, Checkbox, Empty, Modal, Spin, Tag } from 'antd';
import { useEffect, useMemo, useState } from 'react';

import type {
  Factor,
  getSystemFactorPageProps as SearchApiProps,
} from '@/sdks/systemV2ApiDocs';
import { Toast } from '@/utils';
import { FullPageDetail } from '@/views/Factors/FullPageDetail';
import {
  batchUpdateTaskEmissionSourceFactorApi,
  getBatchUpdateTaskEmissionSourceFactorListApi,
} from '@/views/eca/carbonMissionAccounting/service';
import ChooseParamsFactor from '@/views/eca/emissionManage/Info/ChooseParamsFactor';
import {
  batchUpdateEmissionSourceFactorApi,
  getBatchUpdateEmissionSourceFactorListApi,
} from '@/views/eca/emissionManage/service';

import styles from './index.module.less';
import type {
  BatchUpdateFactorInfo,
  BatchUpdateFactorRecord,
  ComputationSourceGroupFactorUpdateListParams,
  EmissionSourceFactorUpdateListParams,
  FactorUpdateFactorResp,
  FactorUpdateReq,
  FactorUpdateResp,
} from './type';

export type BatchUpdateFactorScene = 'emissionManage' | 'taskEmissionSource';
type BatchUpdateFactorModalParams = Partial<
  EmissionSourceFactorUpdateListParams &
    ComputationSourceGroupFactorUpdateListParams
>;

interface BatchUpdateFactorModalProps {
  open: boolean;
  scene: BatchUpdateFactorScene;
  params?: BatchUpdateFactorModalParams;
  onCancel: () => void;
  onSuccess: () => void;
}

const CURRENT_FACTOR_KEYS = ['currentFactor', 'oldFactor', 'selectedFactor'];
const RECOMMEND_FACTOR_KEYS = [
  'recommendFactor',
  'suggestedFactor',
  'newFactor',
  'targetFactor',
];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const getFirstValue = <T,>(
  record: Record<string, unknown>,
  keys: string[],
): T | undefined => {
  const key = keys.find(item => record[item] !== undefined);
  return key ? (record[key] as T) : undefined;
};

const getNumberValue = (
  record: Record<string, unknown>,
  keys: string[],
): number | undefined => {
  const value = getFirstValue<string | number>(record, keys);
  if (value === undefined || value === null || value === '') return undefined;
  const numberValue = Number(value);
  return Number.isNaN(numberValue) ? undefined : numberValue;
};

const getTextValue = (
  record: Record<string, unknown>,
  keys: string[],
): string => {
  const value = getFirstValue<string | number>(record, keys);
  if (value === undefined || value === null || value === '') return '-';
  return String(value);
};

const normalizeFactor = (
  raw: unknown,
  fallback: Record<string, unknown>,
  isRecommend = false,
): BatchUpdateFactorInfo => {
  const source = isRecord(raw) ? raw : {};
  const prefix = isRecommend
    ? ['recommend', 'suggested', 'new', 'target']
    : ['current', 'old', 'selected'];

  const prefixedKeys = (name: string) =>
    prefix.map(item => `${item}${name[0].toUpperCase()}${name.slice(1)}`);

  return {
    ...source,
    id:
      getNumberValue(source, ['id', 'factorId']) ??
      getNumberValue(fallback, [...prefixedKeys('factorId'), 'factorId']),
    factorId:
      getNumberValue(source, ['factorId', 'id']) ??
      getNumberValue(fallback, [...prefixedKeys('factorId'), 'factorId']),
    factorValueId:
      getNumberValue(source, ['factorValueId']) ??
      getNumberValue(fallback, [
        ...prefixedKeys('factorValueId'),
        'factorValueId',
      ]),
    name:
      getFirstValue<string>(source, ['name', 'factorName']) ||
      getFirstValue<string>(fallback, [
        ...prefixedKeys('factorName'),
        'factorName',
        'name',
      ]),
    institution:
      getFirstValue<string>(source, ['institution', 'factorSource']) ||
      getFirstValue<string>(fallback, [
        ...prefixedKeys('institution'),
        ...prefixedKeys('factorSource'),
        'institution',
        'factorSource',
      ]),
    unit:
      getFirstValue<string>(source, ['unit', 'factorUnit']) ||
      getFirstValue<string>(fallback, [
        ...prefixedKeys('unit'),
        ...prefixedKeys('factorUnit'),
        'unit',
        'factorUnit',
      ]),
    factorValue:
      getFirstValue<string>(source, ['factorValue', 'value']) ||
      getFirstValue<string>(fallback, [
        ...prefixedKeys('factorValue'),
        'factorValue',
      ]),
    year:
      getFirstValue<string | number>(source, ['year', 'factorYear']) ||
      getFirstValue<string | number>(fallback, [
        ...prefixedKeys('year'),
        ...prefixedKeys('factorYear'),
        'year',
        'factorYear',
      ]),
    region:
      getFirstValue<string>(source, ['region', 'area', 'applicableRegion']) ||
      getFirstValue<string>(fallback, [
        ...prefixedKeys('region'),
        'region',
        'area',
      ]),
    emissionType:
      getFirstValue<string>(source, ['emissionType']) ||
      getFirstValue<string>(fallback, ['emissionType']),
    source:
      getFirstValue<string>(source, ['source', 'dataSource']) ||
      getFirstValue<string>(fallback, [...prefixedKeys('source'), 'source']),
    remark:
      getFirstValue<string>(source, ['remark', 'description']) ||
      getFirstValue<string>(fallback, ['remark', 'description']),
  };
};

const getFactorFromRecord = (
  record: BatchUpdateFactorRecord,
  keys: string[],
  isRecommend = false,
) => {
  const factor = keys.map(key => record[key]).find(value => isRecord(value)) as
    | Record<string, unknown>
    | undefined;

  return normalizeFactor(factor, record, isRecommend);
};

const getFactorDetailId = (factor: BatchUpdateFactorInfo) =>
  factor.factorId || factor.id;

const getRecordKey = (record: BatchUpdateFactorRecord, index: number) =>
  String(
    record.recordKey ??
      record.id ??
      record.factorValueId ??
      getFactorFromRecord(record, CURRENT_FACTOR_KEYS).factorValueId ??
      getFactorFromRecord(record, CURRENT_FACTOR_KEYS).factorId ??
      index,
  );

const createSubmitItem = (record: BatchUpdateFactorRecord) => {
  const currentFactor = getFactorFromRecord(record, CURRENT_FACTOR_KEYS);
  const recommendFactor = getFactorFromRecord(
    record,
    RECOMMEND_FACTOR_KEYS,
    true,
  );
  const emissionSourceId = getNumberValue(record, ['emissionSourceId']);
  const currentFactorId = getFactorDetailId(currentFactor);
  const newFactorId = getFactorDetailId(recommendFactor);

  if (!emissionSourceId || !currentFactorId || !newFactorId) {
    return undefined;
  }

  return {
    emissionSourceId,
    currentFactorId,
    newFactorId,
  };
};

const createSubmitData = (
  dataSource: BatchUpdateFactorRecord[],
  checkedKeys: string[],
): FactorUpdateReq[] => {
  const groupMap = new Map<number, FactorUpdateReq>();

  dataSource.forEach((item, index) => {
    if (!checkedKeys.includes(getRecordKey(item, index))) return;

    const submitItem = createSubmitItem(item);
    if (!submitItem) return;

    const target = groupMap.get(submitItem.emissionSourceId) || {
      emissionSourceId: submitItem.emissionSourceId,
      factorList: [],
    };

    target.factorList.push({
      currentFactorId: submitItem.currentFactorId,
      newFactorId: submitItem.newFactorId,
    });
    groupMap.set(submitItem.emissionSourceId, target);
  });

  return Array.from(groupMap.values()).filter(item => item.factorList.length);
};

const formatYear = (year?: string | number) =>
  year || year === 0 ? `${year}年` : '-';

const formatFactorValue = (factor: BatchUpdateFactorInfo) => {
  const value = getTextValue(factor, ['factorValue']);
  return `${value}${factor.unit ? ` ${factor.unit}` : ''}`;
};

const normalizeFactorUpdateFactor = (
  factor?: FactorUpdateFactorResp,
  isRecommend = false,
): BatchUpdateFactorInfo => {
  if (!factor) return {};

  return {
    ...factor,
    id: factor.id,
    factorId: factor.id,
    factorValueId: factor.id,
    name: factor.name,
    institution: factor.institution,
    year: factor.year,
    factorValue: factor.factorValue,
    unit: factor.unit,
    recommended: isRecommend || factor.recommended === true,
  };
};

const transformFactorUpdateList = (
  list: FactorUpdateResp[],
): BatchUpdateFactorRecord[] =>
  list.flatMap((source, sourceIndex) => {
    const factorList = Array.isArray(source.factorList)
      ? source.factorList
      : [];
    const sourceId = source.emissionSourceId ?? source.computationSourceGroupId;

    return factorList.map((item, factorIndex) => {
      const currentFactor = normalizeFactorUpdateFactor(item.currentFactor);
      const recommendFactor = normalizeFactorUpdateFactor(item.newFactor, true);
      const currentFactorId = getFactorDetailId(currentFactor);
      const recommendFactorId = getFactorDetailId(recommendFactor);

      return {
        recordKey: [
          source.emissionSourceId ?? '',
          source.computationSourceGroupId ?? '',
          currentFactorId ?? '',
          recommendFactorId ?? '',
          sourceIndex,
          factorIndex,
        ].join('-'),
        id: sourceId,
        sourceId,
        emissionSourceId: source.emissionSourceId,
        computationSourceGroupId: source.computationSourceGroupId,
        sourceCode: source.sourceCode,
        sourceName: source.sourceName,
        orgCode: source.orgCode,
        orgName: source.orgName,
        currentFactor,
        recommendFactor,
        newFactor: recommendFactor,
      };
    });
  });

const getSubmitApi = (scene: BatchUpdateFactorScene) => {
  if (scene === 'taskEmissionSource') {
    return batchUpdateTaskEmissionSourceFactorApi;
  }

  return batchUpdateEmissionSourceFactorApi;
};

const requestFactorUpdateList = async (
  scene: BatchUpdateFactorScene,
  params?: BatchUpdateFactorModalParams,
) => {
  if (scene === 'taskEmissionSource') {
    const computationId = Number(params?.computationId);
    const orgCode = params?.orgCode ? String(params.orgCode) : '';

    if (!computationId || !orgCode) return [];

    const { data } = await getBatchUpdateTaskEmissionSourceFactorListApi({
      computationId,
      orgCode,
      likeSourceName: params?.likeSourceName,
      fillStatus: params?.fillStatus,
      reviewStatus: params?.reviewStatus,
      emailStatus: params?.emailStatus,
    });

    return transformFactorUpdateList(data?.data || []);
  }

  const { data } = await getBatchUpdateEmissionSourceFactorListApi({
    orgCode: params?.orgCode,
    likeSourceName: params?.likeSourceName,
  });

  return transformFactorUpdateList(data?.data || []);
};

const normalizeRecordList = (list: BatchUpdateFactorRecord[]) => ({ list });

const normalizeSystemFactor = (factor: Factor): BatchUpdateFactorInfo => ({
  ...factor,
  id: factor.id,
  factorId: factor.id,
  factorValueId: factor.id,
  name: factor.name,
  institution: factor.institution,
  year: factor.year,
  factorValue: factor.factorValue,
  unit: factor.unit,
});

const getChooseFactorInitialSearchValues = (
  record?: BatchUpdateFactorRecord,
): Partial<SearchApiProps> => {
  if (!record) return {};

  const sourceName = getTextValue(record, ['sourceName', 'emissionSourceName']);

  return {
    likeEmissionSourceName:
      !sourceName || sourceName === '-' ? undefined : sourceName,
  };
};

const BatchUpdateFactorModal = ({
  open,
  scene,
  params,
  onCancel,
  onSuccess,
}: BatchUpdateFactorModalProps) => {
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [dataSource, setDataSource] = useState<BatchUpdateFactorRecord[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<string[]>([]);
  const [changingRecordKey, setChangingRecordKey] = useState<string>();
  const [factorDetailModalOpen, setFactorDetailModalOpen] = useState(false);
  const [checkFactorId, setCheckFactorId] = useState<string>();

  useEffect(() => {
    let cancelled = false;

    if (!open) {
      setDataSource([]);
      setCheckedKeys([]);
      setChangingRecordKey(undefined);
      setFactorDetailModalOpen(false);
      setCheckFactorId(undefined);
      return undefined;
    }

    setLoading(true);
    requestFactorUpdateList(scene, params)
      .then(list => {
        if (cancelled) return;
        const normalized = normalizeRecordList(list);
        setDataSource(normalized.list);
        setCheckedKeys(
          normalized.list.map((item, index) => getRecordKey(item, index)),
        );
      })
      .catch(() => {
        if (cancelled) return;
        const normalized = normalizeRecordList([]);
        setDataSource(normalized.list);
        setCheckedKeys(
          normalized.list.map((item, index) => getRecordKey(item, index)),
        );
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [
    open,
    scene,
    params?.computationId,
    params?.emailStatus,
    params?.fillStatus,
    params?.likeSourceName,
    params?.orgCode,
    params?.reviewStatus,
  ]);

  const checkedCount = checkedKeys.length;

  const changingRecord = useMemo(
    () =>
      dataSource.find(
        (item, index) => getRecordKey(item, index) === changingRecordKey,
      ),
    [changingRecordKey, dataSource],
  );

  const changingSelectedFactor = useMemo(
    () =>
      changingRecord
        ? getFactorFromRecord(changingRecord, RECOMMEND_FACTOR_KEYS, true)
        : undefined,
    [changingRecord],
  );

  const handleCheckChange = (recordKey: string, checked: boolean) => {
    setCheckedKeys(prev =>
      checked ? [...prev, recordKey] : prev.filter(item => item !== recordKey),
    );
  };

  const handleSubmit = async () => {
    const submitData = createSubmitData(dataSource, checkedKeys);

    if (submitData.length === 0) {
      Toast('error', I18N.eca.pleaseSelectData2);
      return;
    }

    setSubmitLoading(true);
    try {
      await getSubmitApi(scene)(submitData);
      Toast('success', I18N.Factors.updateSuccessful);
      onSuccess();
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleCloseChangeFactor = () => {
    setChangingRecordKey(undefined);
  };

  const handleConfirmChooseFactor = (selectedFactor: Factor) => {
    if (!changingRecordKey) return;

    if (!selectedFactor?.id) {
      Toast('error', I18N.Factors.pleaseSelect);
      return;
    }

    const nextFactor = {
      ...normalizeSystemFactor(selectedFactor),
      recommended: true,
    };

    setDataSource(prev =>
      prev.map((item, index) => {
        if (getRecordKey(item, index) !== changingRecordKey) return item;
        return {
          ...item,
          recommendFactor: nextFactor,
          newFactor: nextFactor,
        };
      }),
    );
    setCheckedKeys(prev =>
      prev.includes(changingRecordKey) ? prev : [...prev, changingRecordKey],
    );
    handleCloseChangeFactor();
  };

  const openFactorDetail = (factor: BatchUpdateFactorInfo) => {
    const factorId = getFactorDetailId(factor);

    if (!factorId) return;
    setCheckFactorId(String(factorId));
    setFactorDetailModalOpen(true);
  };

  const renderFactorCard = (
    title: string,
    factor: BatchUpdateFactorInfo,
    options?: {
      recommend?: boolean;
      onChangeFactor?: () => void;
    },
  ) => {
    const factorId = getFactorDetailId(factor);

    return (
      <div
        className={`${styles.factorCard} ${
          options?.recommend ? styles.recommendCard : ''
        }`}
      >
        <div className={styles.cardHeader}>
          <span>{title}</span>
          <div className={styles.cardActions}>
            <Button
              disabled={!factorId}
              size='small'
              type='link'
              onClick={() => openFactorDetail(factor)}
            >
              查看详情 &gt;
            </Button>
            {options?.onChangeFactor && (
              <Button size='small' type='link' onClick={options.onChangeFactor}>
                更换因子
              </Button>
            )}
          </div>
        </div>
        <div className={styles.factorInfoRow}>
          <span>
            因子名称
            <strong>{factor.name || '-'}</strong>
          </span>
          <span>
            发布机构
            <strong>{factor.institution || '-'}</strong>
          </span>
        </div>
        <div className={styles.factorMeta}>
          <span>
            因子数值
            <strong>{formatFactorValue(factor)}</strong>
          </span>
          <span>
            发布年份
            <strong>{formatYear(factor.year)}</strong>
          </span>
          {options?.recommend && <Tag color='orange'>推荐</Tag>}
        </div>
      </div>
    );
  };

  return (
    <>
      <Modal
        centered
        className={styles.batchModal}
        destroyOnHidden
        footer={
          <div className={styles.footer}>
            <span className={styles.footerText}>
              已勾选 {checkedCount} 项待更新
            </span>
            <div className={styles.footerActions}>
              <Button onClick={onCancel}>{I18N.Factors.cancel}</Button>
              <Button
                disabled={checkedCount === 0}
                loading={submitLoading}
                type='primary'
                onClick={handleSubmit}
              >
                确认更新
              </Button>
            </div>
          </div>
        }
        open={open}
        title='批量更新因子'
        width={1080}
        onCancel={onCancel}
      >
        <Spin spinning={loading}>
          <div className={styles.content}>
            {dataSource.length === 0 && !loading ? (
              <Empty description='暂无可更新因子' />
            ) : (
              dataSource.map((item, index) => {
                const recordKey = getRecordKey(item, index);
                const currentFactor = getFactorFromRecord(
                  item,
                  CURRENT_FACTOR_KEYS,
                );
                const recommendFactor = getFactorFromRecord(
                  item,
                  RECOMMEND_FACTOR_KEYS,
                  true,
                );

                return (
                  <div className={styles.record} key={recordKey}>
                    <div className={styles.metaRow}>
                      <span>
                        排放源名称
                        <span className={styles.metaValue}>
                          {getTextValue(item, [
                            'sourceName',
                            'emissionSourceName',
                          ])}
                        </span>
                      </span>
                      <span>
                        所属组织
                        <span className={styles.metaValue}>
                          {getTextValue(item, ['orgName', 'organizationName'])}
                        </span>
                      </span>
                    </div>
                    <div className={styles.factorRow}>
                      {renderFactorCard('当前已选因子', currentFactor)}
                      {renderFactorCard('建议选用因子', recommendFactor, {
                        recommend: true,
                        onChangeFactor: () => {
                          setChangingRecordKey(recordKey);
                        },
                      })}
                    </div>
                    <div className={styles.checkboxRow}>
                      <Checkbox
                        checked={checkedKeys.includes(recordKey)}
                        onChange={event =>
                          handleCheckChange(recordKey, event.target.checked)
                        }
                      >
                        更新此项（采用建议选用因子）
                      </Checkbox>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Spin>
      </Modal>

      <Modal
        key='chooseFactor'
        destroyOnHidden
        footer={null}
        open={!!changingRecordKey}
        width='80%'
        onCancel={handleCloseChangeFactor}
      >
        <ChooseParamsFactor
          initialSearchValues={getChooseFactorInitialSearchValues(
            changingRecord,
          )}
          selectedFactor={changingSelectedFactor}
          onCancelClick={handleCloseChangeFactor}
          onConfirmClick={handleConfirmChooseFactor}
          onDetailClick={row => {
            if (!row.id) return;
            setCheckFactorId(row.id.toString());
            setFactorDetailModalOpen(true);
          }}
        />
      </Modal>

      <FullPageDetail
        open={factorDetailModalOpen}
        onClose={() => {
          setFactorDetailModalOpen(false);
          setCheckFactorId(undefined);
        }}
        initFactorId={checkFactorId || ''}
      />
    </>
  );
};

export default BatchUpdateFactorModal;

import I18N from '@src/lang/I18N';
import { Modal, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { round } from 'lodash-es';
import { FC, useEffect, useMemo, useState } from 'react';

import { ResponseData } from '@/api/request';
import { useAllEnumsBatch } from '@/hooks/dict';
import { Factor, getSystemFactorId } from '@/sdks/systemV2ApiDocs';

import { listFactorEmissionSources } from '../service';
import type {
  ComputationSourceGroupSimpleDto,
  EmissionSourceSimpleDto,
  FactorUsageDto,
} from '../type';
import backSvg from './back.svg';
import styles from './index.module.less';
import { getComputationFactorId } from './service';
import { getGasEnumLabel } from './utils';
import { gasEnumsMap } from '../Info/utils';

export interface IFullPageDetailProps {
  open: boolean;
  initFactorId: string;
  /** 自定义api */
  defaultApi?: boolean;
  onClose?: () => void;
}

export const FullPageDetail: FC<IFullPageDetailProps> = ({
  defaultApi = false,
  open,
  onClose,
  initFactorId,
}) => {
  const [factorInfo, setFactorInfo] = useState<Factor>();
  const [usage, setUsage] = useState<FactorUsageDto>();
  const [usageLoading, setUsageLoading] = useState(false);

  const enums = useAllEnumsBatch(
    open
      ? `${Object.values(gasEnumsMap).join(
          ',',
        )},factorUnitZ,factorUnitM,firstClassify,secondClassify,PFCseNUM,HFCsEnum,sourceLanguage,sourceLevel,productOrigin`
      : '',
  );

  const factorUnitM = enums?.factorUnitM;
  const sourceLevel = enums?.sourceLevel;

  useEffect(() => {
    if (!initFactorId) return;
    (async () => {
      if (defaultApi) {
        const { data } = await getComputationFactorId({
          id: Number(initFactorId),
        });
        setFactorInfo(data.data);
        return;
      }
      const { data } = await getSystemFactorId({ id: Number(initFactorId) });
      setFactorInfo(data.data);
    })();
  }, [initFactorId, defaultApi]);

  useEffect(() => {
    let cancelled = false;
    if (!open || !initFactorId) {
      setUsage(undefined);
      setUsageLoading(false);
    } else {
      (async () => {
        setUsageLoading(true);
        try {
          const res = await listFactorEmissionSources({
            id: Number(initFactorId),
          });
          const body = res.data as ResponseData<FactorUsageDto>;
          if (!cancelled) {
            setUsage(body?.data);
          }
        } finally {
          if (!cancelled) {
            setUsageLoading(false);
          }
        }
      })();
    }
    return () => {
      cancelled = true;
    };
  }, [open, initFactorId]);

  const emissionLibColumns: ColumnsType<EmissionSourceSimpleDto> = useMemo(
    () => [
      {
        title: I18N.Factors.sourceNameCol,
        dataIndex: 'sourceName',
        key: 'sourceName',
        ellipsis: true,
        render: v => v || '-',
      },
      {
        title: I18N.carbonData.organizationName,
        dataIndex: 'orgName',
        key: 'orgName',
        ellipsis: true,
        render: v => v || '-',
      },
      {
        title: I18N.Factors.year,
        dataIndex: 'year',
        key: 'year',
        width: 88,
        render: v => (v == null ? '-' : v),
      },
      {
        title: `${I18N.Factors.ghgCategoryCol}-${I18N.Factors.ghgClassifyCol}`,
        key: 'ghgCategoryClassify',
        width: 140,
        render: (_, record) => {
          const parts = [
            record.ghgCategory_name,
            record.ghgClassify_name,
          ].filter(v => v != null);
          return parts.length ? parts.join('-') : '-';
        },
      },
    ],
    [],
  );

  const computationColumns: ColumnsType<ComputationSourceGroupSimpleDto> =
    useMemo(
      () => [
        {
          title: I18N.Factors.sourceNameCol,
          dataIndex: 'sourceName',
          key: 'sourceName',
          ellipsis: true,
          render: v => v || '-',
        },
        {
          title: I18N.carbonData.organizationName,
          dataIndex: 'orgName',
          key: 'orgName',
          ellipsis: true,
          render: v => v || '-',
        },
        {
          title: I18N.Factors.year,
          dataIndex: 'year',
          key: 'year',
          width: 88,
          render: v => (v == null ? '-' : v),
        },
        {
          title: `${I18N.Factors.ghgCategoryCol}-${I18N.Factors.ghgClassifyCol}`,
          key: 'ghgCategoryClassify',
          width: 140,
          render: (_, record) => {
            const parts = [
              record?.ghgCategory_name,
              record?.ghgClassify_name,
            ].filter(v => v != null);
            return parts.length ? parts.join('-') : '-';
          },
        },
        {
          title: I18N.Factors.carbonEmissionCol,
          dataIndex: 'carbonEmission',
          key: 'carbonEmission',
          width: 140,
          render: v =>
            v == null || Number.isNaN(Number(v)) ? '-' : round(Number(v), 6),
        },
      ],
      [],
    );

  return (
    <Modal
      destroyOnClose
      open={open}
      style={{ zIndex: 1055 }}
      wrapClassName={styles.wrap}
      className={styles.fullscreenModal}
      width='100%'
      title={undefined}
      footer={null}
      onCancel={() => {
        onClose?.();
      }}
    >
      <div className={styles.wrapper}>
        <div className={styles.header} onClick={() => onClose?.()}>
          <img src={backSvg} alt='' />
          <div className={styles.back}>{I18N.Factors.return}</div>
        </div>
        <div className={styles.contentWrapper}>
          <div className={styles.content}>
            <div className={styles.line1}>
              <div className={styles.card1}>
                <div className={styles.title}>
                  {I18N.Factors.factorInformation}
                </div>
                <div className={styles.card1Content}>
                  <div className={styles.nameWrapper}>
                    <div className={styles.name}>{factorInfo?.name}</div>
                  </div>
                  <div className={styles.info}>
                    <span className={styles.cValue}>
                      <div className={styles.cValue}>
                        {round(Number(factorInfo?.factorValue), 6)}
                      </div>
                    </span>
                    <span className={styles.unit}>{factorInfo?.unit}</span>
                  </div>
                  <div className={styles.detail}>
                    <div className={styles.detailTitle}>
                      {I18N.carbonFootPrintLCA.usageScenarios}
                    </div>
                    <div className={styles.inner}>
                      {factorInfo?.description || '-'}
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.card2}>
                <div className={styles.title}>
                  {I18N.Factors.sourceInformation}
                </div>
                <div className={styles.company}>
                  {factorInfo?.institution || '-'}
                </div>
                <div className={styles.card2detail}>
                  <span className={styles.card2detailLabel}>
                    {I18N.Factors.yearOfPublication}
                  </span>
                  <span className={styles.card2detailValue}>
                    {factorInfo?.year || '-'}
                  </span>
                </div>
                <div className={styles.card2detail}>
                  <span className={styles.card2detailLabel}>
                    {I18N.Factors.sourceCategory}
                  </span>
                  <span className={styles.card2detailValue}>
                    {sourceLevel?.find(
                      u => `${u.dictValue}` === `${factorInfo?.sourceLevel}`,
                    )?.dictLabel || '-'}
                  </span>
                </div>
                <div className={styles.card2detail}>
                  <span className={styles.card2detailLabel}>
                    {I18N.Factors.sourceFiles}
                  </span>
                  <span className={styles.card2detailValue}>
                    {factorInfo?.source || '-'}
                  </span>
                </div>
                <div className={styles.card2detail}>
                  <span className={styles.card2detailLabel}>
                    {I18N.Factors.websiteLink}
                  </span>
                  <span className={styles.card2detailValue}>
                    {factorInfo?.url || '-'}
                  </span>
                </div>
                <div className={styles.card2detail}>
                  <span className={styles.card2detailLabel}>
                    {I18N.Factors.geographicalRepresentativeness}
                  </span>
                  <span className={styles.card2detailValue}>
                    {factorInfo?.areaRepresent || '-'}
                  </span>
                </div>
              </div>
            </div>
            <div className={styles.card3}>
              <div className={styles.title}>{I18N.eca.dataDetails}</div>
              <div className={styles.grid}>
                {factorInfo?.gasList?.map(item => (
                  <div className={styles.card} key={item.id}>
                    <div className={styles.cardTitle}>{item.gasType}</div>
                    <div>
                      <span className={styles.factorValue}>
                        {item.factorValue}
                      </span>
                      <span className={styles.factorUnitM}>
                        {getGasEnumLabel(
                          item?.gasType || '',
                          item?.factorUnitZ || '',
                          enums || {},
                        )}
                        /
                        {
                          factorUnitM?.find(
                            u =>
                              String(u.dictValue) ===
                              item.factorUnitM?.split(',')?.[1],
                          )?.dictLabel
                        }
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.card4}>
              <div className={styles.title}>
                {I18N.Factors.factorRelatedEmissionSources}
              </div>
              <div className={styles.tableBlock}>
                <div className={styles.subTitle}>
                  {I18N.Factors.emissionSourceLibraryTable}
                </div>
                <Table<EmissionSourceSimpleDto>
                  rowKey={(r, i) => `lib-${r.id ?? r.sourceCode ?? i}`}
                  loading={usageLoading}
                  size='small'
                  pagination={false}
                  scroll={{ x: 'max-content' }}
                  columns={emissionLibColumns}
                  dataSource={usage?.emissionSourceList ?? []}
                />
              </div>
              <div className={styles.tableBlock}>
                <div className={styles.subTitle}>
                  {I18N.Factors.computationEmissionSourceTable}
                </div>
                <Table<ComputationSourceGroupSimpleDto>
                  rowKey={(r, i) =>
                    `acct-${r.id ?? r.computationId ?? r.sourceCode ?? i}`
                  }
                  loading={usageLoading}
                  size='small'
                  pagination={false}
                  scroll={{ x: 'max-content' }}
                  columns={computationColumns}
                  dataSource={usage?.computationSourceGroupList ?? []}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

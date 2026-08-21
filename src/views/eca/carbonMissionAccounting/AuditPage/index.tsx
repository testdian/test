import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Empty, Spin } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { FormActions } from '@/components/FormActions';
import { Page } from '@/components/Page';
import I18N from '@/lang/I18N';
import { PageTypeInfo } from '@/router/utils/enums';
import { Toast } from '@/utils';

import {
  AuditOrCheckDetailContent,
  PageAuditType,
} from '../component/AuditDrawer';
import { getTaskEmissionSourceListApi } from '../service';
import { ComputationSourceGroupResp, ComputationSourceRequest } from '../type';
import styles from './index.module.less';

const { show, edit } = PageTypeInfo;

const AuditPage = () => {
  const navigate = useNavigate();
  const { actionType, computationId, orgCode, isGroup, sourceId } = useParams<{
    actionType: PageTypeInfo & PageAuditType;
    computationId: string;
    orgCode: string;
    isGroup: string;
    sourceId: string;
  }>();

  const [loading, setLoading] = useState(false);
  const [emissionSourceDetail, setEmissionSourceDetail] =
    useState<ComputationSourceRequest>();

  const isGroupSource = isGroup === '1';
  const sourceIdValue = Number(sourceId);
  const actionTypeValue = actionType as PageTypeInfo & PageAuditType;
  const orgCodeValue =
    orgCode && orgCode !== '-' ? decodeURIComponent(orgCode) : undefined;

  const title = useMemo(() => {
    const titleMap = {
      [show]: I18N.router.emissionSourceDetails,
      [edit]: I18N.cbam.editEmissionSources,
      [PageAuditType.audit]: I18N.eca.toExamine,
    };
    return titleMap[actionTypeValue as keyof typeof titleMap];
  }, [actionTypeValue]);

  const back = () => {
    navigate(-1);
  };

  const getEmissionSourceDetail = async () => {
    if (!computationId || !sourceIdValue) return;

    setLoading(true);
    try {
      const { data } = await getTaskEmissionSourceListApi({
        computationId: Number(computationId),
        orgCode: orgCodeValue,
        pageNum: 1,
        pageSize: 100000,
      } as ComputationSourceRequest);
      const list = data?.data?.list || [];
      const record = isGroupSource
        ? list.find(item => item.id === sourceIdValue)
        : list
            .flatMap(
              item =>
                item.computationSourceList as ComputationSourceGroupResp[],
            )
            .find(item => item?.id === sourceIdValue);
      setEmissionSourceDetail(record as ComputationSourceRequest);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEmissionSourceDetail();
  }, [computationId, orgCodeValue, isGroupSource, sourceIdValue]);

  return (
    <Page
      wrapperClass={styles.wrapper}
      title={
        <div className={styles.titleWrapper}>
          <Button
            type='link'
            className={styles.back}
            icon={<ArrowLeftOutlined />}
            onClick={back}
          />
          <span>{title}</span>
        </div>
      }
    >
      <Spin spinning={loading}>
        <div className={styles.content}>
          {emissionSourceDetail ? (
            <AuditOrCheckDetailContent
              isGroup={isGroupSource}
              computationSourceIdList={[sourceIdValue]}
              visible
              actionType={actionTypeValue}
              emissionSourceDetail={emissionSourceDetail}
              onClose={back}
              onSuccessSave={() => {
                Toast(
                  'success',
                  I18N.supplyChainCarbonManagement.operationSuccessful,
                );
                back();
              }}
              renderFooter={({
                isAudit: isAuditAction,
                isDetail: isDetailAction,
                onAudit,
                onCancel,
                onOk,
              }) => {
                const buttons = [
                  ...(isAuditAction
                    ? [
                        {
                          title: I18N.eca.toExamine,
                          type: 'primary' as const,
                          onClick: async () => {
                            onAudit();
                          },
                        },
                      ]
                    : []),
                  ...(!isAuditAction && !isDetailAction
                    ? [
                        {
                          title: I18N.base.confirm,
                          type: 'primary' as const,
                          onClick: async () => {
                            onOk();
                          },
                        },
                      ]
                    : []),
                  {
                    title: I18N.Factors.return,
                    onClick: async () => {
                      onCancel();
                    },
                  },
                ];

                return (
                  <FormActions
                    className={styles.footer}
                    place='center'
                    buttons={buttons}
                  />
                );
              }}
            />
          ) : (
            <Empty />
          )}
        </div>
      </Spin>
    </Page>
  );
};

export default AuditPage;

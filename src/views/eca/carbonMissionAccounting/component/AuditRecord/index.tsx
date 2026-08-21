/*
 * @@description: 审批流程信息
 */
import I18N from '@src/lang/I18N';
import { Empty, Spin, Steps } from 'antd';
import { useMemo } from 'react';

import style from './index.module.less';
import { AuditRecordLog } from './type';

const AuditFlow = ({
  flowList = [],
  loading = false,
}: {
  flowList?: AuditRecordLog[];
  loading?: boolean;
}) => {
  const renderItems = useMemo(() => {
    return flowList?.map(item => {
      const {
        auditTime,
        auditByName,
        auditComment,
        auditStatus_name: auditStatusName,
      } = item;

      const newTime = auditTime?.split(' ') || ['', ''];

      return {
        title: newTime[0],
        subTitle: newTime[1],
        description: (
          <div className={style.auditItem}>
            <div>
              <span className={style.auditName}> {auditByName}</span>
              <span className={style.auditResult}> {auditStatusName}</span>
            </div>
            {auditComment && (
              <div className={style.remark}>{auditComment} </div>
            )}
          </div>
        ),
      };
    });
  }, [flowList]);

  return (
    <div className={style.auditFlow}>
      <h3>{I18N.eca.allHistory}</h3>
      <Spin spinning={loading}>
        {flowList.length ? (
          <Steps
            progressDot
            direction='vertical'
            items={[...renderItems]}
            current={flowList.length}
          />
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </Spin>
    </div>
  );
};
export default AuditFlow;

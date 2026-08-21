/**
 * @description: 审批详情
 */
import I18N from '@src/lang/I18N';
import { Table } from 'antd';

import { changeTableColumnsNoText } from '@/utils';

import style from './index.module.less';
import { processColumns, recordColumns } from './utils/columns';
import { CarbonDataPropsType } from '../../utils/type';

function ApproveInfo({
  /** 审批记录数据 */
  approvalRecord,
  /** 审批流程数据 */
  approvalProcess,
}: CarbonDataPropsType) {
  return (
    <div className={style.wrapper}>
      <section className={style.content}>
        <h4>{I18N.components.approvalProcess}</h4>
        <Table
          columns={changeTableColumnsNoText(processColumns(), '-')}
          dataSource={approvalProcess}
          pagination={false}
        />
      </section>
      <section className={style.content}>
        <h4>{I18N.supplyChainCarbonManagement.approvalRecords}</h4>
        <Table
          columns={changeTableColumnsNoText(recordColumns(), '-')}
          dataSource={approvalRecord}
          pagination={false}
        />
      </section>
    </div>
  );
}
export default ApproveInfo;

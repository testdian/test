import { ExclamationCircleOutlined } from '@ant-design/icons';

import I18N from '@/lang/I18N';

import styles from './utils.module.less';

// 新增文案
export const returnReportText = () => {
  const culHistoryFn = () => {
    return [
      '/carbonAccounting/emissionManage/add/',
      '/carbonAccounting/emissionManage/edit/',
      '/carbonAccounting/baseYear/add/',
      '/carbonAccounting/baseYear/edit/',
      'carbonAccounting/reductionScene/add/',
      'carbonAccounting/reductionScene/edit/',
      '/carbonAccounting/dataQualityManage/edit/',
      '/carbonAccounting/accountingReport/add/',
      '/carbonAccounting/accountingReport/edit/',
      /** LVMH的路由：基准年 */
      '/ecaReport/baseYear/add/',
      '/ecaReport/baseYear/edit/',
      /** LVMH的路由：数据质量控制计划 */
      '/ecaReport/dataQualityManage/edit/',
      /** LVMH的路由：减排场景 */
      '/ecaReport/reductionScene/edit/',
      '/ecaReport/reductionScene/add/',
      /** LVMH的路由：核算报告 */
      '/ecaReport/accountingReport/add/',
      '/ecaReport/accountingReport/edit/',
    ].some(item => {
      return window.location.pathname.indexOf(item) >= 0;
    });
  };
  return (
    culHistoryFn() && (
      <div className={styles.reportTextSpan}>
        <ExclamationCircleOutlined /> {I18N.eca.newReportText}
      </div>
    )
  );
};

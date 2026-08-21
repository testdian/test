/**
 * @description 供应链碳管理-采购产品管理-供应商管理
 */
import I18N from '@src/lang/I18N';
import { compact } from 'lodash-es';
import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import CommonHeader from '@/components/CommonHeader';
import { FormActions } from '@/components/FormActions';
import { Page } from '@/components/Page';
import { SccmRouteMaps } from '@/router/utils/sccmEnums';

import style from './index.module.less';

function ManagementPage({
  basicInfo,
  actionBtnChild,
  rightRender,
  children,
  onBtnClick,
}: {
  onBtnClick: () => Promise<void> | void;
  /** 表格上方展示的信息 */
  basicInfo?: { label: string; value: string | number | undefined }[];
  /** 按钮节点 */
  actionBtnChild?: ReactNode;
  /** 额外的dom节点 */
  rightRender?: ReactNode;
  /** 子节点 */
  children?: ReactNode;
}) {
  const navigate = useNavigate();

  return (
    <main className={style.managementListWrapper}>
      <Page
        wrapperClass={style.managementListPageWrapper}
        title={
          <div className={style.headerWrapper}>
            <CommonHeader basicInfo={basicInfo} />
          </div>
        }
        onBtnClick={async () => {
          onBtnClick?.();
        }}
        actionBtnChild={actionBtnChild}
        rightRender={rightRender}
      >
        {children && <div className={style.tableWrapper}>{children}</div>}
      </Page>

      <FormActions
        place='center'
        buttons={compact([
          {
            title: I18N.Factors.return,
            onClick: async () => {
              navigate(SccmRouteMaps.sccmProdct);
            },
          },
        ])}
      />
    </main>
  );
}
export default ManagementPage;

import {
  CopyOutlined,
  DeleteOutlined,
  FormOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import I18N from '@src/lang/I18N';
import { Button } from 'antd';

import { PageTypeInfo } from '@/router/utils/enums';
import { ActionTypeEnum } from '@/utils/actionType';

import styles from './index.module.less';
import { AccountModelResponse } from '../../accountingModel/type';

const AccountModelItem = ({
  itemData,
  onActionClick,
  renderActionButtons,
}: {
  itemData: AccountModelResponse;
  onActionClick?: (
    type: PageTypeInfo | ActionTypeEnum,
    itemData: AccountModelResponse,
  ) => void;
  /** 自定义按钮区域 */
  renderActionButtons?: React.ReactNode;
}) => {
  return (
    <div
      className={styles.accountModelMainContainer}
      onClick={() => {
        onActionClick?.(PageTypeInfo.show, itemData);
      }}
    >
      <div className={styles.box2}>
        <div className={styles.headerWrapper}>
          <div className={styles.orgWrapper}>{itemData.orgName || '-'}</div>
          <div>{itemData.year || '-'}</div>
        </div>
        <div className={styles.wrapper}>
          <div className={styles.pic} />
          <span className={styles.text2}>{itemData.modelName}</span>
        </div>
        <div className={styles.group}>
          <span className={styles.text4}>{itemData?.intro}</span>
        </div>
      </div>
      {renderActionButtons || (
        <div className={styles.box4}>
          <div className={styles.box5}>
            <Button
              type='link'
              icon={<FormOutlined />}
              className={styles.textB}
              onClick={e => {
                e.stopPropagation();
                onActionClick?.(PageTypeInfo.edit, itemData);
              }}
            >
              {I18N.Factors.edit}
            </Button>
            <Button
              type='link'
              icon={<DeleteOutlined />}
              className={styles.textB}
              onClick={e => {
                e.stopPropagation();
                onActionClick?.(ActionTypeEnum.DELETE, itemData);
              }}
            >
              {I18N.Factors.delete}
            </Button>
            <Button
              type='link'
              icon={<CopyOutlined />}
              className={styles.textB}
              onClick={e => {
                e.stopPropagation();
                onActionClick?.(PageTypeInfo.copy, itemData);
              }}
            >
              {I18N.carbonFootPrintLCA.copy}
            </Button>
            <Button
              type='link'
              icon={<InfoCircleOutlined />}
              className={styles.textB}
              onClick={e => {
                e.stopPropagation();
                onActionClick?.(PageTypeInfo.show, itemData);
              }}
            >
              {I18N.Factors.check}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountModelItem;

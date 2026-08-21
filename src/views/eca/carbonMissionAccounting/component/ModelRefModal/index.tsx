/**
 * @description 引用模型弹窗
 */

import { Button, Input, List, Modal, Space } from 'antd';
import { useEffect, useState } from 'react';

import I18N from '@/lang/I18N';
import { EcaRouteMaps } from '@/router/utils/ecaEmums';
import {
  PAGE_TYPE_VAR,
  PageTypeInfo,
  virtualLinkTransform,
} from '@/router/utils/enums';
import { ActionTypeEnum } from '@/utils/actionType';
import { getAllAccountModelApi } from '@/views/eca/accountingModel/service';
import { AccountModelResponse } from '@/views/eca/accountingModel/type';
import AccountModelItem from '@/views/eca/component/AccountModelItem';

import styles from './index.module.less';

interface ModelRefModalProps {
  open: boolean;
  onCancel: () => void;
  onUseModelFn?: (record: AccountModelResponse) => void;
}

const ModelRefModal: React.FC<ModelRefModalProps> = ({
  open,
  onCancel,
  onUseModelFn,
}) => {
  /** 核算模型列表 */
  const [accountDataSource, setAccountDataSource] = useState<
    AccountModelResponse[]
  >([]);
  /** 是否加载中 */
  const [loading, setLoading] = useState(false);

  const showFn = (record: AccountModelResponse) => {
    window.open(
      virtualLinkTransform(
        EcaRouteMaps.accountingModelInfo,
        [PAGE_TYPE_VAR, ':id'],
        [PageTypeInfo.show, record?.id],
      ),
      '_blank',
    );
  };

  const onActionClickFn = (
    type: PageTypeInfo | ActionTypeEnum,
    record: AccountModelResponse,
  ) => {
    switch (type) {
      case PageTypeInfo.edit:
        onUseModelFn?.(record);
        break;
      case PageTypeInfo.show:
        showFn(record);
        break;
      default:
        break;
    }
  };

  /** 获取核算模型列表 */
  const getAccountModelList = async (likeModelName?: string) => {
    setLoading(true);
    try {
      const { data } = await getAllAccountModelApi({
        likeModelName,
      });
      setAccountDataSource(data?.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    getAccountModelList();
  }, [open]);

  return (
    <Modal
      key='modelRef'
      title='引用模型'
      open={open}
      maskClosable={false}
      width='90%'
      onCancel={() => {
        onCancel();
      }}
      footer={null}
    >
      {/* 搜索区域 */}
      <Input
        placeholder={I18N.carbonFootPrintLCA.modelName}
        style={{ width: 220 }}
        onBlur={e => {
          getAccountModelList(e.target.value);
        }}
        onPressEnter={e => {
          const target = e.target as HTMLInputElement;
          getAccountModelList(target.value);
        }}
      />
      <div className={styles.listWrapper}>
        <List
          loading={loading}
          className='mt-24'
          grid={{ gutter: 16, column: 4 }}
          dataSource={accountDataSource}
          renderItem={item => (
            <List.Item>
              <AccountModelItem
                itemData={item}
                onActionClick={onActionClickFn}
                renderActionButtons={
                  <Space
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      width: '100%',
                    }}
                  >
                    <Button
                      onClick={e => {
                        e.stopPropagation();
                        onActionClickFn?.(PageTypeInfo.show, item);
                      }}
                    >
                      预览
                    </Button>
                    <Button
                      type='primary'
                      onClick={e => {
                        e.stopPropagation();
                        onActionClickFn?.(PageTypeInfo.edit, item);
                      }}
                    >
                      使用
                    </Button>
                  </Space>
                }
              />
            </List.Item>
          )}
          pagination={false}
        />
      </div>
    </Modal>
  );
};

export default ModelRefModal;

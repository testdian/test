import { CloseOutlined } from '@ant-design/icons';
import { Button, Modal, Input, List, Space, Empty } from 'antd';
import VirtualList from 'rc-virtual-list';
import React, { useEffect, useState } from 'react';

import LoadingButton from '@/components/LoadingButton';
import I18N from '@/lang/I18N';

import styles from './index.module.less';
import { EmissionSourceList } from '../../accountingModel/Info/type';

const ContainerHeight = 320;

const ChooseEmissionSource: React.FC<{
  currentGhgClassifyName?: {
    name: string;
    childName?: string;
    ghgCategory?: number | undefined;
    ghgClassify?: number | undefined;
  };
  emissionSource: any[];
  visible: boolean;
  /** 模型id */
  modelId: number;
  loading: boolean;
  onCancel: () => void;
  onSaveSuccess: (
    modelId: string,
    emissionSourceCodeList: string[],
    ghgClassify: number,
  ) => void;
  /** 排放源弹窗左侧排放源点击事件 */
  onEmissionItemModalClick: (id: number) => void;
}> = ({
  modelId,
  visible,
  onCancel,
  onSaveSuccess,
  emissionSource,
  currentGhgClassifyName,
  loading,
  onEmissionItemModalClick,
}) => {
  const [searchText, setSearchText] = useState('');
  const [selectedData, setSelectedData] = useState<EmissionSourceList[]>([]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleSelect = (item: EmissionSourceList) => {
    setSelectedData([...selectedData, item]);
  };
  const handleSave = async () => {
    if (!selectedData.length) return;
    onSaveSuccess(
      modelId as unknown as string,
      selectedData.map(item => item?.sourceCode),
      currentGhgClassifyName?.ghgClassify as number,
    );
  };

  const handleDelete = (index: number) => {
    setSelectedData(prev => prev.filter((_, i) => i !== index));
  };

  const filteredData = emissionSource.filter(item =>
    item.sourceName.toLowerCase().includes(searchText.toLowerCase()),
  );

  useEffect(() => {
    if (!visible) {
      setSelectedData([]);
      setSearchText('');
    }
  }, [visible]);

  return (
    <Modal
      centered
      width='800px'
      title={I18N.eca.selectEmissionSource}
      open={visible}
      destroyOnClose
      onCancel={() => {
        setSelectedData([]);
        onCancel();
      }}
      footer={[
        <Button
          key='cancel'
          onClick={() => {
            setSelectedData([]);
            onCancel();
          }}
        >
          {I18N.Factors.cancel}
        </Button>,
        <LoadingButton type='primary' onClick={handleSave}>
          {I18N.Factors.preserve}
        </LoadingButton>,
      ]}
    >
      <Space direction='vertical' className={styles.container}>
        <Input.Search
          placeholder={I18N.eca.searchOptions}
          onChange={handleSearch}
          style={{ width: 300 }}
        />
        <div className={styles.content}>
          <div className={styles.leftSection}>
            <div className={styles.ghgClassify}>
              {currentGhgClassifyName && (
                <span>
                  {currentGhgClassifyName?.name}：
                  {currentGhgClassifyName?.childName}
                </span>
              )}
            </div>
            <div className={styles.leftSectionList}>
              <List size='small' loading={loading} bordered>
                {filteredData?.length ? (
                  <VirtualList
                    data={filteredData}
                    height={ContainerHeight}
                    itemHeight={47}
                    itemKey='selected'
                  >
                    {(item: EmissionSourceList) => {
                      return (
                        <List.Item key={item.id}>
                          <div
                            className={styles.rate}
                            onClick={() => handleSelect(item)}
                          />
                          <div
                            onClick={() => {
                              if (!item.id) return;
                              onEmissionItemModalClick(item.id);
                            }}
                            className={styles.ellipseText}
                          >
                            {item.sourceName}
                          </div>
                        </List.Item>
                      );
                    }}
                  </VirtualList>
                ) : (
                  <div className={styles.empty}>
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description={I18N.utils.noData}
                    />
                  </div>
                )}
              </List>
            </div>
          </div>
          <div className={styles.rightSection}>
            <div className={styles.ghgClassify}>
              {I18N.eca.selectedEmissions}
            </div>
            <List size='small' bordered>
              {selectedData.length ? (
                <VirtualList
                  data={selectedData}
                  height={ContainerHeight}
                  itemHeight={47}
                  itemKey='id'
                >
                  {(item, index) => (
                    <List.Item
                      key={item.id}
                      onClick={() => handleDelete(index)}
                    >
                      <List.Item.Meta
                        title={
                          <div className={styles.ellipseTextAllSelected}>
                            {item.sourceName}
                          </div>
                        }
                      />
                      <div>
                        <Button
                          size='small'
                          color='default'
                          type='link'
                          icon={<CloseOutlined style={{ color: '#333' }} />}
                          style={{ fontSize: 14 }}
                        />
                      </div>
                    </List.Item>
                  )}
                </VirtualList>
              ) : (
                <div className={styles.empty}>
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={I18N.utils.noData}
                  />
                </div>
              )}
            </List>
          </div>
        </div>
      </Space>
    </Modal>
  );
};

export default ChooseEmissionSource;

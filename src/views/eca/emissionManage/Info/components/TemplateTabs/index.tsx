import { TabsProps, Tabs } from 'antd';

import style from './index.module.less';

type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

export const TemplateTabs = ({
  items,
  activeKey,
  onTabChange,
  onEdit,
}: {
  items: TabsProps['items'];
  activeKey: number;
  onTabChange: (key: string) => void;
  onEdit: (targetKey: TargetKey, action: 'add' | 'remove') => void;
}) => (
  <Tabs
    className={style.tabClassName}
    type='editable-card'
    activeKey={`${activeKey}`}
    onChange={onTabChange}
    onEdit={onEdit}
    items={items}
    tabBarGutter={0}
  />
);

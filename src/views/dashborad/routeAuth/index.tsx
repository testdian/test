import I18N from '@src/lang/I18N';
import { Button, Card, Spin } from 'antd';
import { EventDataNode } from 'antd/lib/tree';
import { memo, useEffect, useState } from 'react';

import { AntProvider } from '@/components/AntdProvider';
import { PageTypeInfo } from '@/router/utils/enums';
import {
  getSystemPermissionId,
  getSystemPermissionTree,
  Permission,
  Tree,
} from '@/sdks/systemV2ApiDocs';
import { modal } from '@/store/module/notification';
import { returnDelModalStyle, returnNoIconModalStyle, Toast } from '@/utils';

import TreeAdd from './TreeAddOrEdit';
import TreeRoute from './TreeRotue';
import style from './index.module.less';
import { deletePermission } from './service';
import { PlusOutlined } from '@ant-design/icons';

const MenuButton = memo(
  ({
    onButtonClick,
    className,
    treeInfo,
  }: {
    treeInfo?: Permission;
    className: string;
    onButtonClick: (type: string) => void;
  }) => (
    <div className={className}>
      <Button
        disabled={!treeInfo}
        type='primary'
        style={{ marginRight: '10px' }}
        onClick={() => onButtonClick('remove')}
      >
        {I18N.dashborad.deletePermissions}
      </Button>
      <Button
        disabled={!treeInfo}
        style={{ marginRight: '10px' }}
        onClick={() => onButtonClick('edit')}
        type='primary'
      >
        {I18N.dashborad.editPermissions}
      </Button>
      <Button
        onClick={() => {
          onButtonClick('add');
        }}
        type='primary'
      >
        <PlusOutlined /> {I18N.Factors.newAddition}
      </Button>
    </div>
  ),
);

function RouteAuth() {
  // tree 状态
  const [treeType, setTreeType] = useState(PageTypeInfo.show);

  // 选中的节点
  const [selected, setSelected] = useState<EventDataNode<Tree>>();

  // 全局的loading
  const [loading, setLoading] = useState<boolean>(false);
  // tree的数据
  const [treeList, setTreeList] = useState<Tree[]>();

  const [treeInfo, setTreeInfo] = useState<Permission>();
  /** 获取节点详情 */
  const getTreeInfo = (id: number) => {
    setLoading(true);

    getSystemPermissionId({ id })
      .then(({ data }) => {
        setTreeInfo(data?.data);
      })
      .finally(() => setLoading(false));
  };
  /** 获取tree */
  const initList = async () => {
    setLoading(true);
    return getSystemPermissionTree({ roleId: undefined })
      .then(({ data }) => {
        setTreeList(data?.data?.tree);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const onRemove = () => {
    modal.confirm({
      title: I18N.dashborad.systemPrompt,
      content: treeInfo
        ? I18N.dashborad.thisOperationWillForever2
        : I18N.dashborad.thisOperationWillForever,
      ...returnNoIconModalStyle,
      ...returnDelModalStyle,
      okText: I18N.base.confirm,
      cancelText: I18N.Factors.cancel,
      async onOk() {
        if (treeInfo?.id)
          deletePermission(treeInfo?.id).then(({ data }) => {
            if (data.code === 200) {
              setTreeType(PageTypeInfo.show);
              setTreeInfo(undefined);
              initList();
              Toast('success', I18N.Factors.deleteSuccessful);
            }
          });
      },
    });
  };

  useEffect(() => {
    initList();
  }, []);
  return (
    <AntProvider>
      <div className={style.wrapper}>
        <div className={style.main}>
          <div className={style.left}>
            <MenuButton
              className={style.actions}
              treeInfo={treeInfo}
              onButtonClick={(type: string) => {
                if (type === 'remove') {
                  onRemove();
                  setTreeType(PageTypeInfo.show);
                } else if (type === 'edit') {
                  setTreeType(PageTypeInfo.edit);
                } else {
                  setTreeType(PageTypeInfo.add);
                }
              }}
            />

            <Card className={style.tree}>
              <Spin spinning={loading}>
                <TreeRoute
                  // @ts-ignore
                  selectedKeys={selected?.selectedNodes?.map(item => item.code)}
                  onSelect={(keys, info) => {
                    if (keys.length) getTreeInfo(Number(keys[0]));
                    setSelected(info as unknown as EventDataNode<Tree>);
                  }}
                  treeList={treeList}
                />
              </Spin>
            </Card>
          </div>
          <div className={style.right}>
            <TreeAdd
              onFinish={type => {
                setTreeType(PageTypeInfo.show);
                if (type === 'edit' && treeInfo?.id) {
                  getTreeInfo(treeInfo.id);
                }
                initList();
              }}
              topPid={treeList?.[0]?.pcode}
              checkTreeDetail={treeInfo}
              treeType={treeType}
              addCanCelFn={() => {
                setTreeType(PageTypeInfo.show);
              }}
            />
          </div>
        </div>
      </div>
    </AntProvider>
  );
}
export default RouteAuth;

/**
 * @description 外购前体产品数据
 */
import { ActionType, ProTable } from '@ant-design/pro-components';
import I18N from '@src/lang/I18N';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { InfoTitle } from '@/components/InfoTitle';

import { PrecursorInfo } from './Info';
import { precursorColumns } from './columns';
import style from './index.module.less';
import { getOutsourcedPrecursorListApi } from '../../../service';

interface OutsourcedPrecursorProps {
  /** cbam报表id */
  cbamId: number;
  /** 是否是详情 */
  isDetail: boolean;
  authNo: string;
}

const OutsourcedPrecursor = ({
  cbamId,
  isDetail,
  authNo,
}: OutsourcedPrecursorProps) => {
  const actionRef = useRef<ActionType>();
  const navigate = useNavigate();

  /** 控制前体详情的抽屉 */
  const [open, setOpen] = useState(false);

  /** 前体ID(过程) */
  const [precursorId, setProcessId] = useState<number>();

  /** 列表操作按钮的类型 */
  const [actionBtnType, setActionBtnType] = useState<string>();

  /** 操作按钮 */
  const onActionBtnClick = (type: string, id?: number) => {
    /** 操作按钮的类型 */
    setActionBtnType(type);
    /** 前体ID */
    setProcessId(id);
    /* 打开详情抽屉 */
    setOpen(true);
  };

  /** 初始化抽屉 */
  const onInit = () => {
    setProcessId(undefined);
    setActionBtnType(undefined);
    setOpen(false);
  };

  /** 刷新表格 */
  const reload = () => {
    onInit();
    actionRef.current?.reload();
  };

  return (
    <div className={style.emissionWrapper}>
      <InfoTitle title={I18N.cbam.outsourcedPrecursorProducts2} />

      <ProTable
        actionRef={actionRef}
        key={`processProTable${cbamId}`}
        rowKey='id'
        search={false}
        pagination={false}
        toolBarRender={false}
        columns={precursorColumns({
          navigate,
          isDetail,
          onActionBtnClick,
        })}
        params={{
          authNo,
        }}
        request={async params => {
          if (params?.authNo) {
            return getOutsourcedPrecursorListApi({
              authNo: params?.authNo,
            }).then(({ data }) => {
              return {
                data: data?.data || [],
                success: true,
                total: data?.data?.length || 0,
              };
            });
          }
          return { data: [], success: true };
        }}
      />

      {/* 前体详情抽屉 */}
      <PrecursorInfo
        authNo={authNo}
        open={open}
        precursorId={precursorId}
        cbamId={cbamId}
        actionBtnType={actionBtnType}
        onOk={() => {
          reload();
        }}
        onClose={() => onInit()}
      />
    </div>
  );
};

export default OutsourcedPrecursor;

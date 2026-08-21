/*
 * @@description: 产品碳足迹-核算过程
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-06-02 14:11:18
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-18 23:42:02
 */
import I18N from '@src/lang/I18N';
import { Button } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import classNames from 'classnames';
import { compact } from 'lodash-es';
import { useEffect, useState } from 'react';

import CommonHeader from '@/components/CommonHeader';
import { TableActions } from '@/components/Table/TableActions';
import {
  getSupplychainProcessModelList,
  ProcessModel,
} from '@/sdks_v2/new/supplychainV2ApiDocs';

import style from './index.module.less';
import { columns } from './utils/columns';
import { CarbonDataPropsType, TypeFootprintProcess } from '../../utils/type';
import CarbonFootPrintBasic from '../CarbonFootPrintBasic';
import TableList from '../Table';

function CarbonFootPrintProcess({
  /** 过程列表 */
  footprinProcess,
  /** 基本信息详情 */
  basicCathRecord,
  /** 表格加载loading */
  loading,
  /** 总页数 */
  total,
  /** 页码配置 */
  searchParams,
  /** 切换分页的按钮 */
  onchange,
  /** 切换菜单的按钮 */
  onChangeMenu,
  /** 列表查看按钮事件 */
  onDetailFactorClick,
}: CarbonDataPropsType) {
  /** 表格操作栏 */
  const actionColumns: ColumnsType<TypeFootprintProcess> = [
    {
      title: I18N.Factors.operation,
      dataIndex: 'action',
      width: 100,
      render: (_, row) => {
        return (
          <TableActions
            menus={compact([
              {
                label: I18N.Factors.check,
                key: I18N.Factors.check,
                onClick: async () => {
                  onDetailFactorClick?.(row);
                },
              },
            ])}
          />
        );
      },
    },
  ];

  /** 左侧菜单列表 */
  const [menus, setMenus] = useState<ProcessModel[]>();

  /** 当前生命周期阶段 */
  const [currentMenu, changeCurrentMenu] = useState<ProcessModel>();

  /** 控制基本信息弹窗的显隐 */
  const [open, changeOpen] = useState(false);

  /** 获取左侧菜单 */
  useEffect(() => {
    if (basicCathRecord && basicCathRecord.type) {
      getSupplychainProcessModelList({
        periodType: String(basicCathRecord.type) as unknown as '1' | '2',
      }).then(({ data }) => {
        if (data.code === 200) {
          setMenus(data.data);
          changeCurrentMenu(data.data?.[0]);
          onChangeMenu?.(data.data?.[0]);
        }
      });
    }
  }, [basicCathRecord]);

  return (
    <main className={style.wrapper}>
      <div className={style.header}>
        <CommonHeader
          basicInfo={[
            {
              label: I18N.carbonFootPrintLCA.functionalUnits,
              value: basicCathRecord?.functionalUnit,
            },
            {
              label: I18N.carbonFootPrint.accountingCycle,
              value:
                basicCathRecord?.beginDate && basicCathRecord?.endTime
                  ? I18N.template(I18N.supplyChainCarbonManagement.basic, {
                      val1: basicCathRecord?.beginDate,
                      val2: basicCathRecord?.endTime,
                    })
                  : '-',
            },
          ]}
        />
        <Button
          type='link'
          onClick={() => {
            changeOpen(true);
          }}
        >
          {I18N.supplyChainCarbonManagement.basicInformationDetailed}
        </Button>
      </div>
      <div className={style.main}>
        <div className={style.left}>
          <div className={style.left_content}>
            {menus &&
              menus.map(item => {
                return (
                  <div
                    className={classNames(style.left_content_item, {
                      [style.left_content_item_selected]:
                        currentMenu?.id === item.id,
                    })}
                    key={item.id}
                    onClick={() => {
                      changeCurrentMenu(item);
                      onChangeMenu?.(item);
                    }}
                  >
                    {item.modelName}
                  </div>
                );
              })}
          </div>
        </div>
        <div className={style.right}>
          <TableList
            loading={loading}
            columns={[...columns(), ...actionColumns]}
            dataSource={footprinProcess}
            total={total}
            searchParams={searchParams}
            onchange={(current: number, pageSize: number) => {
              onchange?.(current, pageSize);
            }}
          />
        </div>
      </div>
      <CarbonFootPrintBasic
        open={open}
        basicCathRecord={basicCathRecord}
        handleCancel={() => {
          changeOpen(false);
        }}
      />
    </main>
  );
}
export default CarbonFootPrintProcess;

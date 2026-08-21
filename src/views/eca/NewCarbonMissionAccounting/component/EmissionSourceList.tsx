/*
 * @@description:
 */
/*
 * @@description:核算模型
 */
import { CaretRightOutlined } from '@ant-design/icons';
import I18N from '@src/lang/I18N';
import { carbonMissionShowColumns } from '@views/eca/emissionManage/utils/Newcolumns';
import { Collapse, Descriptions, Menu, Table } from 'antd';
import classNames from 'classnames';
import { compact } from 'lodash-es';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { getSourceTree } from '@/api/authData';
import { getSourceTreeApi } from '@/api/compution';
import { DataItem } from '@/api/type';
import { PageEmpty } from '@/components/PageEmpty';
import { useTableRef as useTable } from '@/components/x-render/TableRender/hook/useTableRef';
import { PageTypeInfo } from '@/router/utils/enums';
import {
  getComputationComputationDataList,
  getComputationDataSourceListProps,
} from '@/sdks/Newcomputation/computationV2ApiDocs';
import { changeSubmitFalseAction } from '@/store/action/fillDataSource';
import { RootState } from '@/store/types';
import {
  addPathToChildren,
  changeTableColumnsNoText,
  getItem,
  getSearchParams,
  mapMostChildrenSetDetaultValue,
} from '@/utils';
import Style from '@/views/eca/carbonMissionAccounting/index.module.less';

import DrawEmissionSourceInfo from '../../emissionManage/Info/drawerInfo';
import { ComputationEnums } from '../../hooks';
import { filterMessionArr } from '../../util/util';

export interface ChildComponentRef {
  getSourceTreeApiFn: () => Promise<void>;
}
const { Panel } = Collapse;
const EmissionSourceList = forwardRef<
  ChildComponentRef,
  {
    isFillData?: any;
    selectedRowKeys?: React.Key[];
    setSelectedRowKeys?: (newSelectedRowKeys: React.Key[]) => void;
    isShow?: boolean;
    fillDataDetail?: any;
    setOutCurrentKey?: (key: string) => void;
  }
>(
  (
    {
      isFillData,
      selectedRowKeys,
      setSelectedRowKeys,
      isShow,
      fillDataDetail,
      setOutCurrentKey,
    },
    ref,
  ) => {
    const {
      id,
      CarbonMissionId,
      CarbonMissionPageTypeInfoType,
      computationDataId,
      dataId,
      approvalId,
      authNo,
    } = useParams<{
      pageTypeInfo?: PageTypeInfo;
      id: string;
      CarbonMissionPageInfo?: string;
      CarbonMissionPageTypeInfoType?: string;
      CarbonMissionId: string;
      authNo: string;
      computationDataId: string;
      dataId?: string;
      approvalId?: string;
      auditStatus?: string;
    }>();
    const [searchParams, setSearchParams] =
      useState<getComputationDataSourceListProps>(
        getSearchParams<getComputationDataSourceListProps>()[0],
      );
    const { refresh } = useTable();
    // 定位左侧栏目
    const [leftIndex, changeLeftIndex] = useState('0');
    const [leftDataSource, getLeftDataSource] = useState<
      {
        label: string;
        key: string;
        carbonEmission?: string;
        dataStatus_name?: string;
      }[]
    >([]);
    const [isActive, setIsActive] = useState<string | string[]>([]);
    const [dataSource, setDataSource] = useState<DataItem[]>([]);
    const getComputationComputationDataListFn = async () => {
      return getComputationComputationDataList({
        computationId: CarbonMissionPageTypeInfoType
          ? Number(computationDataId)
          : Number(dataId) || Number(CarbonMissionId) || Number(id),
      });
    };
    // 获取排放源列表 快照
    useImperativeHandle(ref, () => ({
      getSourceTreeApiFn: async () => {
        await getSourceTreeApiFn();
      },
    }));
    // 左侧列表
    const leftListFn = async () => {
      const { data } = await getComputationComputationDataListFn();

      if (data.code === 200) {
        const newData = data.data as unknown as {
          dateRange: string;
          id: string;
          carbonEmission: string;
          dataStatus_name: string;
        }[];
        const newArr = newData?.map(item => {
          return {
            label: item?.dateRange,
            key: item?.id,
            carbonEmission: item?.carbonEmission,
            dataStatus_name: item?.dataStatus_name,
          };
        });
        if (newArr.length === 1) {
          getLeftDataSource([...(newArr || [])]);
          changeLeftIndex(newArr[0]?.key || '0');
          return;
        }
        getLeftDataSource([...(newArr || [])]);
        changeLeftIndex(newArr[0]?.key || '0');
        setSearchParams({
          ...searchParams,
          pageSize: 10,
          pageNum: 1,
        });
        refresh?.(
          {
            stay: true,
            tab: 0,
          },
          {
            computationDataId: newArr[0]?.key,
            pageSize: 10,
            pageNum: 1,
          },
        );
      }
    };
    const [menuArr, setMenuArr] = useState<any[]>([]);
    // 关联填报表
    const relateEmissionArr = ComputationEnums('relateEmission');
    const [currentKey, setCurrnetKey] = useState<string>();
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
    const [openKeys, setOpenKeys] = useState<string[]>([]);
    const [catchRecord, setCatchRecord] = useState<any>(null);
    const [open, setOpen] = useState(false);
    useEffect(() => {
      // 生成左侧数据
      const newArr = leftDataSource.map((item, key) => {
        return getItem(item.label, item.key, null, [
          ...relateEmissionArr.map((child, index) => {
            if (key === 0 && index === 0) {
              setCurrnetKey(`${item.key}-${child.value}`);
              setOutCurrentKey?.(`${item.key}-${child.value}`);
              setSelectedKeys([item.key, `${item.key}-${child.value}`]);
              setOpenKeys([item.key]);
            }
            changeLeftIndex(item.key);
            return getItem(
              child.label,
              `${item.key}-${child.value}` || 0,
              null,
            );
          }),
        ]);
      });
      setMenuArr([...newArr]);
    }, [leftDataSource]);
    const needSigleLeft = () => {
      // 数据填报  || 排放数据审核
      return (
        window.location.pathname.indexOf('fillData') >= 0 ||
        window.location.pathname.indexOf('approvalManage') >= 0
      );
    };
    const sigleLeftFn = async () => {
      const newArr = [
        {
          key: approvalId || dataId || '0',
          label: fillDataDetail?.dateRange || '-',
        },
      ];
      getLeftDataSource([...(newArr || [])]);
      changeLeftIndex(newArr[0]?.key || '0');
    };
    useEffect(() => {
      if (needSigleLeft()) {
        sigleLeftFn();
      } else {
        leftListFn();
      }
    }, [fillDataDetail]);

    const getSourceTreeApi_fn = async () => {
      return getSourceTreeApi({
        computationDataId: currentKey?.split('-')[0] || '0',
        relateEmission: currentKey?.split('-')[1] || '0',
      });
    };
    const getSourceTreeFn = async () => {
      return getSourceTree({
        authNo,
        computationDataId: currentKey?.split('-')[0] || '0',
        relateEmission: currentKey?.split('-')[1] || '0',
      });
    };
    const getSourceTreeApiFn = async () => {
      if (!currentKey) {
        return;
      }
      const { data } =
        Number(CarbonMissionPageTypeInfoType) === 1
          ? await getSourceTreeFn()
          : await getSourceTreeApi_fn();
      let newData = addPathToChildren(data?.data || []);
      const currentChildKey = Number(currentKey?.split('-')[1]);

      if (currentChildKey === 2) {
        newData = mapMostChildrenSetDetaultValue(newData);
      }
      const newArr = filterMessionArr(newData, currentChildKey);

      setDataSource([...(newArr || [])]);
      changeSubmitFalseAction();
    };
    const selector = useSelector((s: RootState) => s);

    useEffect(() => {
      if (currentKey) {
        getSourceTreeApiFn();
      }
    }, [currentKey]);
    useEffect(() => {
      // if (selector.fillDataSource.isSubmit) {
      getSourceTreeApiFn();
      // }
    }, [selector.fillDataSource.isSubmit]);
    const [isChildActive, setIsChildActive] = useState<string | string[]>([]);
    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys?.(newSelectedRowKeys);
    };

    const rowSelection: {
      selectedRowKeys: React.Key[];
      onChange: (newSelectedRowKeys: React.Key[], row: any) => void;
      getCheckboxProps?: (record: any) => void;
    } = {
      selectedRowKeys: isShow ? [...(selectedRowKeys || [])] : [],
      onChange: onSelectChange,
    };
    const divRef = useRef(null);
    const [culapseActive, setColapseActive] = useState(false);
    useEffect(() => {
      const collapsNode = document.getElementsByClassName('ant-collapse');
      // @ts-ignore
      const divOffsetWidth = divRef?.current?.offsetWidth || 0;
      // @ts-ignore
      const collapsNodeOffsetWidth = collapsNode?.[0]?.offsetWidth || 0;
      if (divOffsetWidth - collapsNodeOffsetWidth > 100) {
        setColapseActive(true);
      } else {
        setColapseActive(false);
        // }
      }
    }, [isActive, isChildActive, currentKey]);

    const openFn = (record: any) => {
      setOpen(true);
      setCatchRecord(record);
    };
    return (
      <div className={Style.wrap}>
        <div
          className={leftDataSource.length > 1 ? Style.flex : Style.flex_data}
        >
          <div className={Style.flex_left}>
            <Menu
              selectedKeys={[...selectedKeys]}
              openKeys={[`${openKeys[0]}`]}
              mode='inline'
              className='custom-menu'
              items={[...menuArr]}
              onClick={async item => {
                setCurrnetKey(item.key);
                setOutCurrentKey?.(`${item.key}`);
                setSelectedKeys([item.key]);
                setIsActive([]);
                setIsChildActive([]);
                setDataSource([]);
              }}
              inlineIndent={24}
              onOpenChange={keys => {
                setOpenKeys([keys[keys.length - 1]]);
              }}
            />
          </div>
          <div className='flex_right' ref={divRef}>
            {!isFillData && (
              <Descriptions
                title=''
                style={{ marginBottom: 16 }}
                size='small'
                bordered={false}
              >
                <Descriptions.Item label={I18N.eca.summaryOfEmissions}>
                  {leftDataSource?.filter(item => item.key === leftIndex)?.[0]
                    ?.carbonEmission || '-'}
                </Descriptions.Item>
                <Descriptions.Item label={I18N.eca.emissionDataFilling}>
                  <span className='modal_text'>
                    {leftDataSource?.filter(item => item.key === leftIndex)?.[0]
                      ?.dataStatus_name || '-'}
                  </span>
                </Descriptions.Item>
              </Descriptions>
            )}
            {/* 范围折叠框  */}
            {dataSource?.length > 0 &&
              dataSource.map(item => {
                return (
                  <Collapse
                    className={classNames(Style.collapse, {
                      [Style.collapseActive]:
                        isActive.length === 0 ||
                        isChildActive.length === 0 ||
                        isChildActive.length === 2,
                      [Style.TablecollapseActive]:
                        isActive.length > 0 &&
                        isChildActive.length > 0 &&
                        isChildActive.length < 2,
                      [Style.culapseActive]: culapseActive,
                    })}
                    // eslint-disable-next-line react/no-unstable-nested-components
                    expandIcon={({ isActive }) => {
                      return <CaretRightOutlined rotate={isActive ? 90 : 0} />;
                    }}
                    activeKey={isActive}
                    onChange={value => {
                      setIsActive([value?.[(value?.length || 0) - 1]]);
                      setIsChildActive([]);
                    }}
                  >
                    <Panel
                      header={
                        <div>
                          {item.ghgCategory_name}
                          <span className={Style.sumDischarge}>
                            {item.sumDischarge}
                          </span>
                          <span className={Style.unit}>tCO₂e</span>
                        </div>
                      }
                      key={`${item.ghgCategory_name}`}
                    >
                      {item.children?.length > 0 &&
                        item.children?.map(child => {
                          return (
                            <Collapse
                              className={Style.collapseChildren}
                              style={{ marginBottom: '.1042rem' }}
                              key={`${child.ghgClassify_name}`}
                              // eslint-disable-next-line react/no-unstable-nested-components
                              expandIcon={({ isActive }) => (
                                <CaretRightOutlined
                                  rotate={isActive ? 90 : 0}
                                />
                              )}
                              activeKey={isChildActive}
                              onChange={value => {
                                setIsChildActive([]);
                                setIsChildActive(value);
                              }}
                            >
                              <Panel
                                header={
                                  <div>
                                    {child.ghgClassify_name}{' '}
                                    <span className={Style.sumDischarge}>
                                      {child.sumDischarge}
                                    </span>
                                    <span className={Style.unit}>tCO₂e</span>
                                    <span className={Style.ISOClassifyStr}>
                                      {I18N.eca.isoClassification2}
                                      {child.isoclassifyStr}
                                    </span>
                                  </div>
                                }
                                key={`${child.ghgClassify_name}`}
                              >
                                <Table
                                  {...{
                                    columns: changeTableColumnsNoText(
                                      [
                                        {
                                          title: I18N.utils.allIndex,
                                          dataIndex: 'pk',
                                          fixed: 'left',
                                          ellipsis: true,
                                          width: 80,
                                          render: (
                                            t: any,
                                            _: unknown,
                                            index: number,
                                          ) => {
                                            return index + 1;
                                          },
                                        },
                                        ...compact(
                                          carbonMissionShowColumns({
                                            currentKey,
                                            openFn,
                                          }),
                                        ),
                                      ],
                                      '-',
                                    ),
                                    pagination: false,
                                    scroll: { x: 600 },
                                    // ...rowSelectionObj,
                                  }}
                                  dataSource={[...child.children]}
                                  // @ts-ignore
                                  rowSelection={
                                    !isShow ? undefined : rowSelection
                                  }
                                  rowKey={
                                    Number(currentKey?.split('-')[1]) < 3
                                      ? 'emissionSourceId'
                                      : 'computationDataSourceId'
                                  }
                                />
                              </Panel>
                            </Collapse>
                          );
                        })}
                      {!item.children && <PageEmpty />}
                    </Panel>
                  </Collapse>
                );
              })}
            {dataSource?.length === 0 && <PageEmpty />}
          </div>
        </div>
        {/* {!open && (
          <FormActions
            place='center'
            buttons={compact([
              pageTypeInfo !== PageTypeInfo.show
                ? {
                    title: I18N.Factors.preserve,
                    type: 'primary',

                    onClick: async () => {
                      getSourceTreeApiFn();
                      changeSubmitTrueAction();
                    },
                  }
                : null,
              {
                title: I18N.Factors.cancel,
                onClick: async () => {
                  if (pageTypeInfo !== PageTypeInfo.show) {
                    modal.confirm({
                      content: I18N.eca.dataNotSaved,
                      onOk: async () => {
                        await navigate(EcaRouteMaps.fillData);
                      },
                      onCancel: () => {},
                      okText: I18N.base.confirm,
                      cancelText: I18N.Factors.cancel,
                    });
                    return;
                  }
                  await navigate(EcaRouteMaps.fillData);
                },
              },
            ])}
          />
        )} */}
        {/* 排放源详情弹窗 */}
        <DrawEmissionSourceInfo
          open={open}
          setOpen={setOpen}
          id={catchRecord?.emissionSourceId}
          computationDataSourceId={catchRecord?.computationDataSourceId}
          CarbonMissionPageTypeInfoType={CarbonMissionPageTypeInfoType}
          authNo={authNo}
        />
      </div>
    );
  },
);

export default EmissionSourceList;

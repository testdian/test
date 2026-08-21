/**
 * @description 数据管理计划
 */
import I18N from '@src/lang/I18N';
import { Radio, Space, Table } from 'antd';
import { ColumnType } from 'antd/es/table';
import { compact } from 'lodash-es';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { TableActions } from '@/components/Table/TableActions';
import { usePageInfo, useTableScrollHeight } from '@/hooks';
import { EcaRouteMaps } from '@/router/utils/ecaEmums';
import {
  PageTypeInfo,
  PAGE_TYPE_VAR,
  virtualLinkTransform,
} from '@/router/utils/enums';
import {
  ControlPlanData,
  ControlPlanResp,
} from '@/sdks/computation/computationV2ApiDocs';
import { changeTableColumnsNoText } from '@/utils';
import { changeDataFn } from '@/views/eca/util/util';

const RADIO_TYPE = {
  GHG: 'GHG',
  ISO: 'ISO',
} as const;

const { GHG, ISO } = RADIO_TYPE;

const RADIO_OPTIONS = [
  {
    label: I18N.carbonData.ghgPr,
    value: GHG,
  },
  {
    label: I18N.eca.isoStandard2,
    value: ISO,
  },
];

export const TableFive = ({
  currentPlanIndex,
  changeHisToryFn,
  formValue,
  currentStandard,
  changeCurrentStandard,
}: {
  currentPlanIndex: number;
  changeHisToryFn: (str: string) => void;
  formValue: ControlPlanResp;
  currentStandard: string;
  changeCurrentStandard: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const { isEdit, id } = usePageInfo();
  const navigate = useNavigate();

  const scrollY = useTableScrollHeight();

  const [ghgDataSource, getGhhDataSource] = useState<
    (ControlPlanData & { rowSpan?: number })[]
  >([]);

  const [isoDataSource, getIsoDataSource] = useState<
    (ControlPlanData & { rowSpan?: number })[]
  >([]);

  useEffect(() => {
    const newGhgList = changeDataFn<ControlPlanData, 'ghgCategory'>(
      formValue?.ghgList?.map(item => {
        return {
          ...item,
          rowSpan: 0,
        };
      }) || [],
      'ghgCategory',
    );
    const newIsoList = changeDataFn<ControlPlanData, 'isoCategory'>(
      formValue?.isoList?.map(item => {
        return {
          ...item,
          rowSpan: 0,
        };
      }) || [],
      'isoCategory',
    );
    getIsoDataSource([...newIsoList]);
    getGhhDataSource([...(newGhgList || [])]);
  }, [formValue, currentPlanIndex]);

  return (
    <>
      <Radio.Group
        value={currentStandard}
        options={RADIO_OPTIONS}
        optionType='button'
        onChange={e => {
          changeCurrentStandard(e.target.value);
          const urlParamsData = `?id=${id}&currentPlanIndex=${currentPlanIndex}&currentStandard=${e.target.value}`;
          changeHisToryFn(urlParamsData);
        }}
        style={{
          marginBottom: '16px',
        }}
      />
      {/* GHG标准 */}
      {currentStandard === GHG && (
        <Table<
          ControlPlanData & {
            rowSpan?: number | undefined;
          }
        >
          pagination={false}
          columns={
            compact(
              changeTableColumnsNoText(
                [
                  {
                    title: I18N.carbonData.emissionClassification,
                    dataIndex: 'ghgCategory_name',
                    onCell: record => ({
                      rowSpan: (record as { rowSpan?: number })?.rowSpan,
                    }),
                    width: 120,
                    ellipsis: false,
                  },
                  {
                    title: I18N.carbonData.emissionCategories,
                    dataIndex: 'ghgClassify_name',
                    width: 120,
                    ellipsis: false,
                  },
                  {
                    title: I18N.eca.categoryDescription,
                    dataIndex: 'categoryDesc',
                    width: 180,
                    ellipsis: true,
                  },
                  {
                    title: I18N.eca.activityDescriptionIs,
                    dataIndex: 'activityDesc',
                  },
                  {
                    title: I18N.Factors.operation,
                    dataIndex: 'id',
                    width: isEdit ? 120 : 80,
                    render: (_, record) => {
                      return (
                        <Space>
                          <TableActions
                            menus={compact([
                              isEdit && {
                                label: I18N.Factors.edit,
                                key: I18N.Factors.edit,
                                onClick: () => {
                                  navigate(
                                    virtualLinkTransform(
                                      EcaRouteMaps.editDataQualityManageEditDetail,
                                      [
                                        PAGE_TYPE_VAR,
                                        ':id',
                                        ':controlPlanId',
                                        ':standardType',
                                      ],
                                      [
                                        isEdit
                                          ? PageTypeInfo.edit
                                          : PageTypeInfo.show,
                                        id,
                                        (record as { id?: number })?.id,
                                        1,
                                      ],
                                    ),
                                  );
                                },
                              },
                              {
                                label: I18N.Factors.check,
                                key: I18N.Factors.check,
                                onClick: () => {
                                  navigate(
                                    virtualLinkTransform(
                                      EcaRouteMaps.editDataQualityManageDetail,
                                      [
                                        PAGE_TYPE_VAR,
                                        ':id',
                                        ':controlPlanId',
                                        ':standardType',
                                      ],
                                      [
                                        isEdit
                                          ? PageTypeInfo.edit
                                          : PageTypeInfo.show,
                                        id,
                                        (record as { id?: number })?.id,
                                        1,
                                      ],
                                    ),
                                  );
                                },
                              },
                            ])}
                          />
                        </Space>
                      );
                    },
                  },
                ],
                '-',
                true,
              ),
            ) as ColumnType<ControlPlanData>[]
          }
          dataSource={[...ghgDataSource]}
          scroll={{ y: scrollY }}
        />
      )}
      {/* ISO标准 */}
      {currentStandard === ISO && (
        <Table<ControlPlanData>
          pagination={false}
          columns={
            compact(
              changeTableColumnsNoText(
                [
                  {
                    title: I18N.carbonData.emissionClassification,
                    dataIndex: 'isoCategory_name',
                    onCell: (record, index) => {
                      const { rowSpan } =
                        record as unknown as ControlPlanData & {
                          rowSpan: number;
                        };
                      if (index === isoDataSource.length - 1) {
                        return {};
                      }
                      return {
                        rowSpan,
                      };
                    },
                    width: 120,
                  },
                  {
                    title: I18N.carbonData.emissionCategories,
                    dataIndex: 'isoClassify_name',
                    width: 120,
                  },
                  {
                    title: I18N.eca.categoryDescription,
                    dataIndex: 'categoryDesc',
                    ellipsis: true,
                    width: 180,
                  },
                  {
                    title: I18N.eca.activityDescriptionIs,
                    dataIndex: 'activityDesc',
                  },
                  {
                    title: I18N.Factors.operation,
                    dataIndex: 'action',
                    width: isEdit ? 120 : 80,
                    render: (_, record) => {
                      const { id, controlPlanId } = record as ControlPlanData;
                      return (
                        <Space>
                          <TableActions
                            menus={compact([
                              isEdit && {
                                label: I18N.Factors.edit,
                                key: I18N.Factors.edit,
                                onClick: () => {
                                  navigate(
                                    virtualLinkTransform(
                                      EcaRouteMaps.editDataQualityManageEditDetail,
                                      [
                                        PAGE_TYPE_VAR,
                                        ':id',
                                        ':controlPlanId',
                                        ':standardType',
                                      ],
                                      [
                                        isEdit
                                          ? PageTypeInfo.edit
                                          : PageTypeInfo.show,
                                        controlPlanId,
                                        id,
                                        2,
                                      ],
                                    ),
                                  );
                                },
                              },
                              {
                                label: I18N.Factors.check,
                                key: I18N.Factors.check,
                                onClick: () => {
                                  navigate(
                                    virtualLinkTransform(
                                      EcaRouteMaps.editDataQualityManageDetail,
                                      [
                                        PAGE_TYPE_VAR,
                                        ':id',
                                        ':controlPlanId',
                                        ':standardType',
                                      ],
                                      [
                                        isEdit
                                          ? PageTypeInfo.edit
                                          : PageTypeInfo.show,
                                        id,
                                        (record as { id?: number })?.id,
                                        2,
                                      ],
                                    ),
                                  );
                                },
                              },
                            ])}
                          />
                        </Space>
                      );
                    },
                  },
                ],
                '-',
                true,
              ),
            ) as ColumnType<ControlPlanData>[]
          }
          dataSource={[...isoDataSource]}
          scroll={{ y: scrollY }}
        />
      )}
    </>
  );
};

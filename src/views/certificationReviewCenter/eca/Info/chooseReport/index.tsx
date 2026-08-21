/*
 * @@description:
 */
import { ModalProps } from 'antd';
import { compact } from 'lodash-es';
import { FC, useState } from 'react';

import { FormActions } from '@/components/FormActions';
import { TableActions } from '@/components/Table/TableActions';
import { CustomTableRender } from '@/components/x-render/TableRender';
import { useTableRef } from '@/components/x-render/TableRender/hook/useTableRef';
import { CustomSearchProps } from '@/components/x-render/TableRender/types';
import I18N from '@/lang/I18N';
import { checkAuth } from '@/layout/utills';
import { LCARouteMaps } from '@/router/utils/lcaEnums';
import { handleAssessmentProposalOptions } from '@/utils';
import LocalStore from '@/utils/store';
import { modelPlanColumns } from '@/views/carbonFootPrintLCA/CarbonFootprintReport/ModelPlanInfo/columns';
import { modelPlanSearchSchema } from '@/views/carbonFootPrintLCA/CarbonFootprintReport/ModelPlanInfo/searchSchema';
import { getReportSchemeAssessmentListApi } from '@/views/carbonFootPrintLCA/CarbonFootprintReport/service';
import {
  AssessmentResp,
  ReportProps,
} from '@/views/carbonFootPrintLCA/CarbonFootprintReport/type';
import { CHOOSE_FACTOR } from '@/views/components/EmissionSource/utils/constant';
import { useAllEnumsBatch } from '@/views/dashborad/Dicts/hooks';
import { useOrgs } from '@/views/dashborad/organizations/OrgManage/hooks';

type ModelPlanInfoProps = {
  /** radio选择数据后的回调 */
  onChangeSelected: (selectedRows: AssessmentResp[]) => void;
} & ModalProps;
const ModelPlanInfo: FC<ModelPlanInfoProps> = () => {
  const { tableRef } = useTableRef();
  /** 设置选择的数据 */
  const [selectedRows, setSelectedRows] = useState<AssessmentResp[]>([]);
  const searchApi: CustomSearchProps<ReportProps, Request> = args =>
    getReportSchemeAssessmentListApi(args).then(({ data }) => {
      return data?.data;
    });
  const enumOptions = useAllEnumsBatch('AssessmentProposal');

  const orgList = useOrgs();
  /** lca评价方法 */
  const assessmentMethodOptions = handleAssessmentProposalOptions(
    enumOptions?.AssessmentProposal || [],
  );
  return (
    <>
      <CustomTableRender
        tableRef={tableRef}
        searchProps={{
          schema: modelPlanSearchSchema({ orgList, assessmentMethodOptions }),
          api: searchApi,
          className: 'chooseReport_search',
        }}
        tableProps={{
          columns: [
            ...modelPlanColumns().filter(item => item.key !== 'action'),
            {
              title: I18N.Factors.operation,
              dataIndex: 'action',
              key: 'action',
              render(_, row) {
                const { modelId } = row || {};
                return (
                  <TableActions
                    menus={compact([
                      checkAuth('/carbonFootprintLCA/report/detail', {
                        label: I18N.Factors.check,
                        key: I18N.Factors.check,
                        onClick: () => {
                          if (modelId) {
                            window.open(
                              `${LCARouteMaps.lcaModelInfo.replace(
                                ':pageTypeInfo',
                                `show`,
                              )}?id=${modelId}`,
                            );
                          }
                        },
                      }),
                    ])}
                  />
                );
              },
            },
          ],
          scroll: { y: 300 },
          rowSelection: {
            type: 'radio',
            onChange: (_, selectedRowsItem) => {
              setSelectedRows(selectedRowsItem);
            },
          },
          rowKey: 'id',
        }}
        autoAddIndexColumn
        autoFixNoText
      />
      <FormActions
        place='center'
        buttons={[
          {
            title: I18N.carbonFootPrintLCA.confirm,
            type: 'primary',
            onClick: async () => {
              // navigator('/home');
              history.go(-1);

              LocalStore.setValue(
                CHOOSE_FACTOR.CHOOSECARBONMISSIONID,
                selectedRows[0].id,
              );
              LocalStore.setValue(
                CHOOSE_FACTOR.CHOOSECARBONMISSIONDATA,
                selectedRows,
              );
            },
          },
          {
            title: I18N.Factors.cancel,
            onClick: async () => {
              // navigator('/home');
              history.go(-1);
            },
          },
        ]}
      />
    </>
  );
};

export default ModelPlanInfo;

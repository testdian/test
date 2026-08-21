import type { ProColumns } from '@ant-design/pro-components';
import I18N from '@src/lang/I18N';
import { InputNumber } from 'antd';
import { compact } from 'lodash-es';
import { NavigateFunction } from 'react-router-dom';

import { TableActions } from '@/components/Table/TableActions';
import { EcaRouteMaps } from '@/router/utils/ecaEmums';
import {
  PAGE_TYPE_VAR,
  PageTypeInfo,
  virtualLinkTransform,
} from '@/router/utils/enums';
import {
  EmissionSource,
  postComputationDataCalcAndSave,
} from '@/sdks_v2/new/computationV2ApiDocs';
import { Toast } from '@/utils';

export type EmissionSourceType = EmissionSource & {
  ghgClassify_name?: string;
  ghgCategory_name?: string;
  isoClassify_name?: string;
  isoCategory_name?: string;
};

export const columns = ({
  id = 0,
  dataId,
  auditStatus,
  isDetail,
  pageTypeInfo,
  navigate,
}: {
  id: number;
  dataId?: number;
  auditStatus?: string;
  isDetail: boolean;
  pageTypeInfo?: PageTypeInfo;
  navigate: NavigateFunction;
}): ProColumns<EmissionSourceType>[] =>
  compact([
    {
      title: I18N.carbonFootPrintLCA.number,
      dataIndex: 'allIndex',
      width: 80,
      fixed: 'left',
    },
    {
      title: I18N.eca.emissionSourceName,
      dataIndex: 'sourceName',
      ellipsis: true,
      width: 140,
      fixed: 'left',
    },
    {
      title: I18N.eca.emissionFacilityActivity,
      dataIndex: 'facility',
      ellipsis: true,
      width: 140,
    },
    {
      title: I18N.eca.activityData,
      dataIndex: 'dataValue',
      ellipsis: true,
      width: 140,
      render: (_, record, __, action) => {
        const { dataValue, id: emissionId } = record || {};
        return !isDetail ? (
          <InputNumber
            controls={false}
            value={dataValue}
            min={0}
            max={999999999999.999}
            placeholder={I18N.base.pleaseEnter}
            onBlur={async e => {
              const RegChectDoit4 = /^-?\d{0,20}(\.\d{1,4})?$|^0(\.\d{1,4})?$/;

              if (!RegChectDoit4.test(e.target.value)) {
                Toast('error', I18N.eca.supportDecimalPoint);
              }
              await postComputationDataCalcAndSave({
                req: {
                  computationDataId: id,
                  dataValue: e.target.value
                    ? `${Number(e.target.value)}`.replace(/(.*\..{4}).*$/, '$1')
                    : e.target.value,
                  emissionSourceId: emissionId,
                },
              }).then(({ data }) => {
                if (data.code === 200) {
                  action?.reload();
                }
              });
            }}
          />
        ) : (
          dataValue || '-'
        );
      },
    },
    {
      title: I18N.eca.activityDataSheet,
      dataIndex: 'activityUnitName',
      ellipsis: true,
      width: 140,
    },
    {
      title: I18N.Factors.emissionFactors,
      dataIndex: 'factorDesc',
      ellipsis: true,
      width: 140,
    },
    {
      title: I18N.carbonData.emissionsTC,
      dataIndex: 'carbonEmission',
      ellipsis: true,

      width: 140,
    },
    {
      title: I18N.eca.ghgClassification,
      dataIndex: 'ghgClassify_name',
      ellipsis: true,
      width: 140,
      render: (_, record) => {
        const { ghgClassify_name, ghgCategory_name } = record || {};
        return ghgClassify_name && ghgCategory_name
          ? `${ghgCategory_name},${ghgClassify_name}`
          : '-';
      },
    },
    {
      title: I18N.eca.isoClassification,
      dataIndex: 'isoClassify_name',
      ellipsis: true,
      width: 170,
      render: (_, record) => {
        const { isoClassify_name, isoCategory_name } = record || {};
        return isoCategory_name && isoClassify_name
          ? `${isoCategory_name},${isoClassify_name}`
          : '';
      },
    },
    {
      title: I18N.eca.emissionSourceId,
      dataIndex: 'sourceCode',
      ellipsis: true,
      width: 160,
    },
    {
      title: I18N.Factors.operation,
      width: 100,
      dataIndex: 'id',
      fixed: 'right',
      render(_, record) {
        const { id: emissionId } = record || {};
        return (
          <TableActions
            menus={compact([
              !isDetail && {
                label: I18N.Factors.edit,
                key: I18N.Factors.edit,
                onClick: async () => {
                  navigate(
                    virtualLinkTransform(
                      EcaRouteMaps.fillDataInfoScreen,
                      [
                        PAGE_TYPE_VAR,
                        ':id',
                        ':sourcePageInfo',
                        ':SourcefactorId',
                      ],
                      [pageTypeInfo, id, PageTypeInfo.edit, emissionId],
                    ),
                  );
                },
              },
              {
                label: I18N.Factors.check,
                key: I18N.Factors.check,
                onClick: async () => {
                  if (dataId) {
                    navigate(
                      virtualLinkTransform(
                        EcaRouteMaps.approvalManageInfoSourceDetail,
                        [
                          PAGE_TYPE_VAR,
                          ':id',
                          ':dataId',
                          ':auditStatus',
                          ':factorPageInfo',
                          ':SourcefactorId',
                        ],
                        [
                          pageTypeInfo,
                          dataId,
                          id,
                          auditStatus,
                          PageTypeInfo.show,
                          emissionId,
                        ],
                      ),
                    );
                    return;
                  }
                  navigate(
                    virtualLinkTransform(
                      EcaRouteMaps.fillDataInfoScreen,
                      [
                        PAGE_TYPE_VAR,
                        ':id',
                        ':sourcePageInfo',
                        ':SourcefactorId',
                      ],
                      [pageTypeInfo, id, PageTypeInfo.show, emissionId],
                    ),
                  );
                },
              },
            ])}
          />
        );
      },
    },
  ]);

/*
 * @@description:
 */
import { ExclamationCircleOutlined } from '@ant-design/icons';
import I18N from '@src/lang/I18N';
import { Tooltip } from 'antd';
import { compact, isNull } from 'lodash-es';
import { TableRenderProps } from 'table-render/dist/src/types';

import { TableActions } from '@/components/Table/TableActions';

// 碳排放核算- 核算详情 - 排放源列表
export const carbonMissionShowColumns = ({
  currentKey,
  openFn,
}: {
  currentKey?: string;
  openFn?: (record: any) => void;
}): TableRenderProps<any>['columns'] => {
  const splitCurrentKey = currentKey?.split('-')[1];
  const oprateObj = {
    title: I18N.Factors.operation,
    width: 140,
    dataIndex: 'id',
    render(_: any, record: any) {
      return (
        <TableActions
          menus={compact([
            {
              label: I18N.Factors.check,
              key: I18N.Factors.check,
              onClick: async () => {
                openFn?.(record);
              },
            },
          ])}
        />
      );
    },
  };
  switch (Number(splitCurrentKey)) {
    case 0:
      return compact([
        {
          title: I18N.eca.ghgClassification,
          dataIndex: 'ghgClassify_name',
          width: 120,
          fixed: 'left',

          render: (text: string, record) => {
            return `${record?.ghgCategory_name},${text}`;
          },
        },
        {
          title: I18N.eca.isoClassification,
          dataIndex: 'isoClassify_name',
          width: 120,
          fixed: 'left',

          render: (text: string, record) => {
            return `${record?.isoCategory_name},${text}`;
          },
        },
        {
          title: I18N.eca.emissionSourceName,
          dataIndex: 'sourceName',
          width: 160,
          fixed: 'left',

          // copyable: true,
        },
        {
          title: I18N.eca.emissionSourceId,
          dataIndex: 'sourceCode',
          width: 160,
        },

        {
          title: I18N.eca.emissionFacilityActivity,
          dataIndex: 'facility',
          width: 190,
        },
        {
          title: I18N.eca.activityDataSheet,
          dataIndex: 'activityUnitName',
          width: 120,
        },
        {
          title: I18N.eca.activityData,
          dataIndex: 'dataValue',
          width: 160,
          render: value => {
            return value || '-';
          },
          // copyable: true,
        },
        {
          title: I18N.Factors.emissionFactors,
          dataIndex: 'factorDesc',
          width: 160,
        },
        {
          title: I18N.carbonData.emissionsTC,
          dataIndex: 'carbonEmission',
          width: 160,
          // copyable: true,
        },
        oprateObj,
      ]);
    case 1:
      return compact([
        {
          title: I18N.eca.ghgClassification,
          dataIndex: 'ghgClassify_name',
          width: 120,
          fixed: 'left',

          render: (text: string, record) => {
            return `${record?.ghgCategory_name},${text}`;
          },
        },
        {
          title: I18N.eca.isoClassification,
          dataIndex: 'isoClassify_name',
          width: 120,
          fixed: 'left',

          render: (text: string, record) => {
            return `${record?.isoCategory_name},${text}`;
          },
        },
        {
          title: I18N.eca.emissionSourceName,
          dataIndex: 'sourceName',
          width: 160,
          fixed: 'left',

          // copyable: true,
        },
        {
          title: I18N.eca.emissionSourceId,
          dataIndex: 'sourceCode',
          width: 160,
        },

        {
          title: I18N.eca.emissionFacilityActivity,
          dataIndex: 'facility',
          width: 190,
        },
        {
          title: I18N.eca.numberOfEmployees,
          dataIndex: 'employeeNum',
          width: 120,
          render: value => {
            return value || '-';
          },
        },
        {
          title: I18N.eca.weightedAverageLabor,
          dataIndex: 'avgWorktime',
          width: 190,
          render: value => {
            return value || '-';
          },
        },
        {
          title: I18N.eca.averageWorkingDays,
          dataIndex: 'avgWorkday',
          width: 160,
          render: value => {
            return value || '-';
          },
        },
        {
          title: I18N.eca.doesItHaveItsOwnOwnership,
          dataIndex: 'ownFactory',
          width: 160,
          render: value => {
            return isNull(value)
              ? '-'
              : Number(value) === 1
              ? I18N.eca.no
              : I18N.eca.have;
          },
        },
        {
          title: I18N.eca.dormitoryAccommodator,
          dataIndex: 'guestsNum',
          width: 160,
          render: value => {
            return value || '-';
          },
        },
        {
          title: I18N.eca.averageAccommodationDays,
          dataIndex: 'stayPeriod',
          width: 160,
          render: value => {
            return value || '-';
          },
        },
        {
          title: (
            <div>
              {I18N.eca.septicTankDepth}{' '}
              <Tooltip
                title={I18N.eca.ifThereIsNoSuchThingWithinTheFactoryArea}
              >
                <ExclamationCircleOutlined />
              </Tooltip>{' '}
            </div>
          ),
          dataIndex: 'depth',
          width: 180,
          render: value => {
            return value || '-';
          },
        },
        {
          title: I18N.eca.methaneEmission2,
          dataIndex: 'dataValue',
          width: 160,
        },
        {
          title: I18N.carbonData.emissionsTC,
          dataIndex: 'carbonEmission',
          width: 160,
          // copyable: true,
        },
        oprateObj,
      ]);
    case 2:
      return compact([
        {
          title: I18N.eca.ghgClassification,
          dataIndex: 'ghgClassify_name',
          width: 120,
          fixed: 'left',

          render: (text: string, record) => {
            return `${record?.ghgCategory_name},${text}`;
          },
        },
        {
          title: I18N.eca.isoClassification,
          dataIndex: 'isoClassify_name',
          width: 120,
          fixed: 'left',

          render: (text: string, record) => {
            return `${record?.isoCategory_name},${text}`;
          },
        },
        {
          title: I18N.eca.emissionSourceName,
          dataIndex: 'sourceName',
          width: 160,
          fixed: 'left',
        },
        {
          title: I18N.eca.emissionSourceId,
          dataIndex: 'sourceCode',
          width: 160,
        },
        {
          title: I18N.eca.emissionFacilityActivity,
          dataIndex: 'facility',
          width: 160,
        },
        {
          title: I18N.eca.wastewaterVolumeT,
          dataIndex: 'escapageVal',
          width: 120,
          render: value => {
            return value || '-';
          },
        },
        {
          title: I18N.eca.anaerobicInfluentC,
          dataIndex: 'inflow',
          width: 190,
          render: value => {
            return value || '-';
          },
        },
        {
          title: I18N.eca.anaerobicEffluentC,
          dataIndex: 'outflow',
          width: 190,
          render: value => {
            return value || '-';
          },
        },
        {
          title: I18N.eca.anaerobicSludgeProduction,
          dataIndex: 'sludgeYield',
          width: 190,
          render: value => {
            return value || '-';
          },
        },
        {
          title: I18N.eca.sludgeCod,
          dataIndex: 'sludgeContent',
          width: 190,
          render: value => {
            return value || '-';
          },
        },
        {
          title: I18N.eca.maximumMethaneProduction,
          dataIndex: 'depth',
          width: 210,
          render: value => {
            return value || '-';
          },
        },
        {
          title: I18N.eca.methaneEmission,
          dataIndex: 'dataValue',
          width: 190,
        },
        // {
        //   title: I18N.eca.activityDataSheet,
        //   dataIndex: 'activityUnitName',
        //   width: 120,
        // },
        // {
        //   title: I18N.Factors.emissionFactors,
        //   dataIndex: 'factorDesc',
        //   width: 160,
        // },
        {
          title: I18N.carbonData.emissionsTC,
          dataIndex: 'carbonEmission',
          width: 160,
          // copyable: true,
        },
        oprateObj,
      ]);
    case 3:
      return compact([
        {
          title: I18N.eca.ghgClassification,
          dataIndex: 'ghgClassify_name',
          width: 120,
          fixed: 'left',

          render: (text: string, record) => {
            return `${record?.ghgCategory_name},${text}`;
          },
        },
        {
          title: I18N.eca.isoClassification,
          dataIndex: 'isoClassify_name',
          width: 120,
          fixed: 'left',

          render: (text: string, record) => {
            return `${record?.isoCategory_name},${text}`;
          },
        },
        {
          title: I18N.eca.emissionSourceName,
          dataIndex: 'sourceName',
          width: 160,
          fixed: 'left',

          // copyable: true,
        },
        {
          title: I18N.eca.emissionSourceId,
          dataIndex: 'sourceCode',
          width: 160,
        },
        {
          title: I18N.eca.emissionFacilityActivity,
          dataIndex: 'facility',
          width: 160,
        },
        {
          title: I18N.eca.sourceOfEscape,
          dataIndex: 'escapeSource',
          width: 120,
          render: value => {
            return value || '-';
          },
        },
        {
          title: I18N.eca.refrigerantType,
          dataIndex: 'refrigerantType',
          width: 120,
          render: value => {
            return value || '-';
          },
        },
        {
          title: I18N.eca.fillingCapacityKg,
          dataIndex: 'dataValue',
          width: 120,
          render: value => {
            return value || '-';
          },
        },
        {
          title: I18N.eca.activityDataSheet,
          dataIndex: 'activityUnitName',
          width: 120,
        },
        // {
        //   title: I18N.Factors.emissionFactors,
        //   dataIndex: 'factorDesc',
        //   width: 160,
        // },
        {
          title: I18N.carbonData.emissionsTC,
          dataIndex: 'carbonEmission',
          width: 160,
          // copyable: true,
        },
        oprateObj,
      ]);
    default:
      return compact([
        {
          title: I18N.eca.ghgClassification,
          dataIndex: 'ghgClassify_name',
          width: 120,
          fixed: 'left',

          render: (text: string, record) => {
            return `${record?.ghgCategory_name},${text}`;
          },
        },
        {
          title: I18N.eca.isoClassification,
          dataIndex: 'isoClassify_name',
          width: 120,
          fixed: 'left',

          render: (text: string, record) => {
            return `${record?.isoCategory_name},${text}`;
          },
        },
        {
          title: I18N.eca.emissionSourceName,
          dataIndex: 'sourceName',
          fixed: 'left',
          width: 160,
          // copyable: true,
        },
        {
          title: I18N.eca.emissionSourceId,
          dataIndex: 'sourceCode',
          width: 160,
        },
        {
          title: I18N.eca.emissionFacilityActivity,
          dataIndex: 'facility',
          width: 160,
        },

        {
          title: I18N.eca.sourceOfEscape,
          dataIndex: 'escapeSource',
          width: 120,
          render: value => {
            return value || '-';
          },
        },
        {
          title: I18N.eca.perfluorocarbonType,
          dataIndex: 'refrigerantType',
          width: 120,
          render: value => {
            return value || '-';
          },
        },
        {
          title: I18N.eca.escalationAmountKg,
          dataIndex: 'dataValue',
          width: 120,
          render: value => {
            return value || '-';
          },
        },
        {
          title: I18N.eca.activityDataSheet,
          dataIndex: 'activityUnitName',
          width: 120,
        },
        // {
        //   title: I18N.Factors.emissionFactors,
        //   dataIndex: 'factorDesc',
        //   width: 160,
        // },
        {
          title: I18N.carbonData.emissionsTC,
          dataIndex: 'carbonEmission',
          width: 160,
          // copyable: true,
        },
        oprateObj,
      ]);
  }
};

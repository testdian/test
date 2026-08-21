import I18N from '@src/lang/I18N';
import { compact } from 'lodash-es';
import { NavigateFunction } from 'react-router-dom';
import {
  SearchProps,
  TableContext,
  TableRenderProps,
} from 'table-render/dist/src/types';

import { UploadFile } from '@/api/type';
import { TableActions } from '@/components/Table/TableActions';
import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';
import { checkAuth } from '@/layout/utills';
import { EcaRouteMaps } from '@/router/utils/ecaEmums';
import {
  PAGE_TYPE_VAR,
  PageTypeInfo,
  RouteMaps,
  virtualLinkTransform,
} from '@/router/utils/enums';
import {
  Report,
  postComputationReportDelete,
} from '@/sdks/Newcomputation/computationV2ApiDocs';
import { modal } from '@/store/module/notification';
import { Toast, returnDelModalStyle, returnNoIconModalStyle } from '@/utils';

import { safeParseJson } from '../../util/transJson';
import style from '../index.module.less';
import { generateAccountingReportApi } from '../service';

export const columns = ({
  refresh,
  navigate,
  handleUploadReportAndClearance,
}: {
  navigate: NavigateFunction;
  refresh: TableContext['refresh'];
  handleUploadReportAndClearance: (record: Report) => void;
}): TableRenderProps<Report>['columns'] => [
  {
    title: I18N.carbonFootPrintLCA.reportName,
    dataIndex: 'reportName',
  },
  {
    title: I18N.eca.accountingOrganization,
    dataIndex: 'orgNames',
  },
  {
    title: I18N.carbonData.accountingYear,
    dataIndex: 'year',
  },

  {
    title: I18N.eca.totalEmissionsT,
    dataIndex: 'carbonEmission',
    width: 160,
  },
  {
    title: '最终版报告及清册',
    dataIndex: 'lastVersionUrl',
    render: lastVersionUrl => {
      const fileList = (safeParseJson(lastVersionUrl) as UploadFile[]) || [];

      if (fileList.length === 0) {
        return <div>-</div>;
      }

      return (
        <div>
          {fileList.map(item => (
            <div key={item.name} className={style.fileItem}>
              <a
                className={style.fileHref}
                href={item.url}
                target='_blank'
                rel='noreferrer'
              >
                <span className={style.name}>{item.name}</span>
              </a>
            </div>
          ))}
        </div>
      );
    },
  },
  {
    title: I18N.Factors.updatedBy,
    dataIndex: 'updateByName',
  },
  {
    title: I18N.Factors.updateTime,
    dataIndex: 'updateTime',
    width: 200,
  },
  {
    title: I18N.Factors.operation,
    width: 300,
    dataIndex: 'id',
    render(id, record) {
      return (
        <TableActions
          menus={compact([
            checkAuth('/accountingReportInfo/Create', {
              label: '生成报告及清册',
              key: '生成报告及清册',
              onClick: async () => {
                modal.confirm({
                  title: I18N.Factors.prompt,
                  ...returnNoIconModalStyle,
                  ...returnDelModalStyle,
                  content: <span>确认生成报告及清册？</span>,
                  onOk: async () => {
                    if (!id) return;
                    await generateAccountingReportApi({ id });

                    modal.confirm({
                      title: '生成报告及清册',
                      className: 'modal_del',
                      content:
                        '生成报告及清册任务已创建，点击“确定”跳转到“下载管理”中下载',
                      onOk: async () => {
                        navigate(RouteMaps.systemDownload);
                      },
                      okText: I18N.base.confirm,
                      cancelText: I18N.Factors.cancel,
                    });
                  },
                  okText: I18N.base.confirm,
                  cancelText: I18N.Factors.cancel,
                });
              },
            }),
            checkAuth('/accountingReportInfo/Edit', {
              label: '上传报告及清册',
              key: '上传报告及清册',
              onClick: async () => {
                handleUploadReportAndClearance(record);
              },
            }),
            checkAuth('/accountingReportInfo/Edit', {
              label: I18N.Factors.edit,
              key: I18N.Factors.edit,
              onClick: async () => {
                navigate(
                  virtualLinkTransform(
                    EcaRouteMaps.accountingReportInfo,
                    [PAGE_TYPE_VAR, ':id'],
                    [PageTypeInfo.edit, id],
                  ),
                );
              },
            }),

            checkAuth('/accountingReportInfo/Del', {
              label: I18N.Factors.delete,
              key: I18N.Factors.delete,
              onClick: async () => {
                modal.confirm({
                  title: I18N.Factors.prompt,
                  ...returnNoIconModalStyle,
                  ...returnDelModalStyle,
                  content: (
                    <span>
                      {I18N.eca.confirmDeletionOfThis2}
                      <span className='modal_text'>{record?.reportName}？</span>
                    </span>
                  ),
                  onOk: () => {
                    return postComputationReportDelete({
                      req: { id },
                    }).then(({ data }) => {
                      if (data.code === 200) {
                        Toast('success', I18N.Factors.deleteSuccessful);
                        refresh?.();
                      }
                    });
                  },
                  okText: I18N.base.confirm,
                  cancelText: I18N.Factors.cancel,
                });
              },
            }),
            checkAuth('/accountingReportInfo/Show', {
              label: I18N.Factors.check,
              key: I18N.Factors.check,
              onClick: async () => {
                navigate(
                  virtualLinkTransform(
                    EcaRouteMaps.accountingReportInfo,
                    [PAGE_TYPE_VAR, ':id'],
                    [PageTypeInfo.show, id],
                  ),
                );
              },
            }),
          ])}
        />
      );
    },
  },
];

export const SearchSchema = (): SearchProps<any>['schema'] => {
  return {
    type: 'object',
    properties: {
      likeReportName: xRenderSeachSchema({
        type: 'string',
        placeholder: I18N.carbonFootPrintLCA.reportName,
      }),
      orgName: xRenderSeachSchema({
        placeholder: '核算组织',
        type: 'string',
      }),
    },
  };
};

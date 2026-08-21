import I18N from '@src/lang/I18N';
import { Checkbox, Form, FormInstance } from 'antd';
import { CheckboxOptionType } from 'antd/es/checkbox';
import { compact } from 'lodash-es';
import { NavigateFunction } from 'react-router-dom';
import { TableContext, TableRenderProps } from 'table-render/dist/src/types';

import { TableActions } from '@/components/Table/TableActions';
import { checkAuth } from '@/layout/utills';
import { PageTypeInfo, RouteMaps } from '@/router/utils/enums';
import { modal } from '@/store/module/notification';
import { Toast, modalText, modelFooterBtnStyle } from '@/utils';

import { postReportCreateApi, postReportDelete } from './service';
import { ReportProps } from './type';

const { edit, show } = PageTypeInfo;

const CheckboxGroup = Checkbox.Group;

export const columns = ({
  refresh,
  onActionBtnClick,
  form,
  plainOptions,
  navigate,
}: {
  navigate: NavigateFunction;
  /** 语言枚举 */
  plainOptions: CheckboxOptionType[];
  refresh: TableContext['refresh'];
  /** 操作按钮的方法 */
  onActionBtnClick?: (type: PageTypeInfo, id?: number) => void;
  form?: FormInstance<any> | undefined;
}): TableRenderProps<ReportProps>['columns'] => {
  return [
    {
      title: I18N.carbonFootPrintLCA.reportName,
      dataIndex: 'reportName',
      fixed: 'left',
    },
    {
      title: I18N.carbonData.affiliatedOrganization,
      dataIndex: 'orgName',
    },
    {
      title: I18N.carbonFootPrintLCA.modelName,
      dataIndex: 'modelName',
    },
    {
      title: I18N.carbonFootPrintLCA.functionalUnits,
      dataIndex: 'funcUnit',
    },
    {
      title: I18N.carbonFootPrintLCA.productionCycle,
      dataIndex: 'productionCycle',
      width: 200,
      render(_, row) {
        const { startTime, endTime } = row || {};
        if (startTime && endTime) {
          return `${startTime}~${endTime}`;
        }
        return '-';
      },
    },
    {
      title: I18N.Factors.productName,
      dataIndex: 'productName',
    },
    {
      title: I18N.carbonFootPrintLCA.productCode,
      dataIndex: 'productCode',
    },
    {
      title: I18N.Factors.updatedBy,
      dataIndex: 'updateByName',
    },
    {
      title: I18N.Factors.updateTime,
      dataIndex: 'updateTime',
      width: 180,
    },
    {
      title: I18N.Factors.operation,
      dataIndex: 'action',
      fixed: 'right',
      width: 280,
      render(_, row) {
        const { id, reportName, assessmentId } = row || {};
        return (
          <TableActions
            menus={compact([
              checkAuth('/carbonFootprintLCA/report/create', {
                label: I18N.carbonFootPrintLCA.generateReport,
                key: I18N.carbonFootPrintLCA.generateReport,
                onClick: () => {
                  if (assessmentId) {
                    modal.confirm({
                      title: I18N.carbonFootPrintLCA.generateReport,
                      icon: '',
                      content: (
                        <Form layout='vertical' form={form}>
                          <Form.Item
                            label={I18N.carbonFootPrintLCA.reportLanguage}
                            name='language'
                            required
                          >
                            <CheckboxGroup options={plainOptions} />
                          </Form.Item>
                        </Form>
                      ),
                      ...modelFooterBtnStyle,
                      okText: I18N.base.confirm,
                      cancelText: I18N.Factors.cancel,
                      okCancel: false,
                      onOk: async () => {
                        const errorText =
                          I18N.carbonFootPrintLCA.pleaseSelectAtLeast2;
                        try {
                          const values = await form?.validateFields();
                          if (
                            !values.language ||
                            values.language.length === 0
                          ) {
                            throw new Error(errorText);
                          }
                          await postReportCreateApi({
                            reportId: Number(id),
                            langTypeList: values.language,
                          });
                          modal.confirm({
                            title: I18N.carbonFootPrintLCA.generateReport,
                            content: I18N.eca.generateReportTask,
                            ...modelFooterBtnStyle,
                            okText: I18N.base.confirm,
                            cancelText: I18N.Factors.cancel,
                            onOk: async () => {
                              navigate(RouteMaps.systemDownload);
                            },
                          });
                        } catch (e) {
                          Toast('error', errorText);
                          throw new Error(errorText);
                        }
                      },
                    });
                  } else {
                    Toast(
                      'error',
                      I18N.carbonFootPrintLCA.pleaseAssociateTheModuleFirst,
                    );
                  }
                },
              }),
              checkAuth('/carbonFootprintLCA/report/edit', {
                label: I18N.Factors.edit,
                key: I18N.Factors.edit,
                onClick: () => {
                  onActionBtnClick?.(edit, id);
                },
              }),
              checkAuth('/carbonFootprintLCA/report/delete', {
                label: I18N.Factors.delete,
                key: I18N.Factors.delete,
                onClick: async () => {
                  modal.confirm({
                    title: I18N.Factors.prompt,
                    icon: '',
                    content: (
                      <div>
                        {I18N.carbonFootPrint.confirmDeletionOfThis3}
                        <span className={modalText}>{reportName}?</span>
                      </div>
                    ),
                    ...modelFooterBtnStyle,
                    okText: I18N.base.confirm,
                    cancelText: I18N.Factors.cancel,
                    onOk: async () => {
                      if (id) {
                        await postReportDelete({
                          id,
                        });
                        Toast('success', I18N.Factors.deleteSuccessful);
                        refresh?.({ stay: true, tab: 1 });
                      }
                    },
                  });
                },
              }),
              checkAuth('/carbonFootprintLCA/report/detail', {
                label: I18N.Factors.check,
                key: I18N.Factors.check,
                onClick: () => {
                  onActionBtnClick?.(show, id);
                },
              }),
            ])}
          />
        );
      },
    },
  ];
};

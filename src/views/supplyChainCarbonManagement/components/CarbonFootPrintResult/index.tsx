/*
 * @@description: 产品碳足迹-核算结果
 */
import {
  ArrayTable,
  Form,
  FormGrid,
  FormItem,
  FormLayout,
  Input,
  NumberPicker,
  Select,
} from '@formily/antd-v5';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import I18N from '@src/lang/I18N';
import { compact, omit } from 'lodash-es';
import { useEffect, useMemo, useState } from 'react';

import { FormActions } from '@/components/FormActions';
import { FormilyFileUpload } from '@/components/FormilyFileUpload';
import {
  FootprintResultReq,
  postSupplychainDataFillFootprintSave,
  postSupplychainDataFillFootprintSaveAndSubmit,
} from '@/sdks_v2/new/supplychainV2ApiDocs';
import { modal } from '@/store/module/notification';
import { Toast, modalText } from '@/utils';
import { publishYear } from '@/views/Factors/utils';
import AuditConfigTable from '@/views/components/AuditConfigTable';
import { modelFooterBtnStyle } from '@/views/components/utils';
import { ADUDIT_REQUIRED_TYPE } from '@/views/dashborad/Approval/Info/constant';

import ProductTableList from './components/TableList';
import { schema } from './utils/schemas';
import { getAuditConfig } from '../../CarbonDataFill/service';
import { onUploadFileFn } from '../../utils';
import { CarbonDataPropsType } from '../../utils/type';

const { NOT_REQUIRED } = ADUDIT_REQUIRED_TYPE;

function CarbonFootPrintResult({
  /** 数据id */
  id,
  /** 上传的报告列表 */
  fileList,
  /** 当前引用的模块类型 */
  // currentModalType,
  /** 是否存在底部的操作按钮 */
  hasAction,
  /** 表单是否不可编辑 */
  disabled,
  /** 数据详情 */
  cathRecord,
  /** 结果数据详情 */
  footprintResult,
}: CarbonDataPropsType) {
  const SchemaField = createSchemaField({
    components: {
      Input,
      Select,
      NumberPicker,
      Form,
      FormItem,
      FormGrid,
      FormLayout,
      ArrayTable,
      FormilyFileUpload,
    },
  });

  /** 产品碳足迹系统边界 */
  const [periodType, setPeriodType] = useState<1 | 2>();

  const form = useMemo(
    () =>
      createForm({
        readPretty: disabled,
        initialValues: {
          productName: cathRecord?.productName,
          productUnit: cathRecord?.productUnit,
          productModel: cathRecord?.productModel,
        },
      }),
    [periodType, cathRecord],
  );

  /** 根据申请的产品碳足迹展示具体的阶段 */
  useEffect(() => {
    if (cathRecord) {
      setPeriodType(Number(cathRecord?.periodType) as 1 | 2);
    }
  }, [cathRecord]);

  /** 产品碳足迹结果详情 */
  useEffect(() => {
    if (footprintResult && periodType) {
      form.setValues({
        ...footprintResult,
      });
    }
  }, [periodType, footprintResult]);

  /** 设置枚举值 */
  useEffect(() => {
    if (!periodType) return;
    /** 核算年份 */
    form.setFieldState('year', {
      dataSource: publishYear().map(v => ({ label: v, value: v })),
    });
  }, [periodType]);

  return (
    <div>
      <Form form={form} previewTextPlaceholder='-'>
        <SchemaField schema={schema()} />
      </Form>
      {/* 列表 */}
      <ProductTableList hasAction />
      {hasAction && (
        <FormActions
          place='center'
          buttons={compact([
            !disabled && {
              title: I18N.supplyChainCarbonManagement.saveAndSubmit,
              type: 'primary',
              onClick: async () => {
                form.submit(
                  async (
                    values: FootprintResultReq & {
                      productName: string;
                      productUnit: string;
                      productModel: string;
                    },
                  ) => {
                    const result = omit(
                      {
                        ...values,
                        applyInfoId: Number(id),
                      },
                      ['productName', 'productUnit', 'productModel'],
                    );

                    const { data } = await getAuditConfig({
                      applyInfoId: Number(id),
                    });

                    const { auditRequired, nodeList } = data?.data || {};

                    modal.confirm({
                      title: I18N.Factors.prompt,
                      icon: '',
                      content:
                        /** 不需要审批 则展示弹窗提示 否则展示审批路程 */
                        auditRequired === NOT_REQUIRED ? (
                          <span>
                            {
                              I18N.supplyChainCarbonManagement
                                .confirmSubmissionOfThis
                            }
                            <span className={modalText}>
                              {cathRecord?.productName}
                              {
                                I18N.supplyChainCarbonManagement
                                  .carbonFootprintVerification8
                              }
                            </span>
                          </span>
                        ) : (
                          <AuditConfigTable dataSource={nodeList} />
                        ),
                      ...modelFooterBtnStyle,
                      okText: I18N.base.confirm,
                      cancelText: I18N.Factors.cancel,
                      onOk: () => {
                        postSupplychainDataFillFootprintSaveAndSubmit({
                          req: result as FootprintResultReq,
                        }).then(({ data }) => {
                          if (data.code === 200) {
                            onUploadFileFn(
                              Number(id),
                              JSON.stringify(fileList),
                            );
                            Toast(
                              'success',
                              I18N.supplyChainCarbonManagement
                                .submittedPleaseWait,
                            );
                            history.back();
                          }
                        });
                      },
                    });
                  },
                );
              },
            },
            !disabled && {
              title: I18N.Factors.preserve,
              onClick: async () => {
                form.submit(
                  (
                    values: FootprintResultReq & {
                      productName: string;
                      productUnit: string;
                      productModel: string;
                    },
                  ) => {
                    const result = omit(
                      {
                        ...values,
                        applyInfoId: Number(id),
                      },
                      ['productName', 'productUnit', 'productModel'],
                    );
                    postSupplychainDataFillFootprintSave({
                      req: result as FootprintResultReq,
                    }).then(({ data }) => {
                      if (data.code === 200) {
                        onUploadFileFn(Number(id), JSON.stringify(fileList));
                        Toast('success', I18N.Factors.saveSuccessful);
                        history.back();
                      }
                    });
                  },
                );
              },
            },
            {
              title: I18N.Factors.return,
              onClick: async () => {
                history.back();
              },
            },
          ])}
        />
      )}
    </div>
  );
}
export default CarbonFootPrintResult;

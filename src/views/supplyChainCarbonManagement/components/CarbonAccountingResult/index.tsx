/*
 * @@description: 企业碳核算-核算结果
 */
import {
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
import {
  ComputationResultReq,
  postSupplychainDataFillComputationSave,
  postSupplychainDataFillComputationSaveAndSubmit,
} from '@/sdks_v2/new/supplychainV2ApiDocs';
import { modal } from '@/store/module/notification';
import { Toast, modalText } from '@/utils';
import AuditConfigTable from '@/views/components/AuditConfigTable';
import { modelFooterBtnStyle } from '@/views/components/utils';
import { ADUDIT_REQUIRED_TYPE } from '@/views/dashborad/Approval/Info/constant';

import style from './index.module.less';
import { basicSchema, ghgSchema, isoSchema } from './utils/schemas';
import { getAuditConfig } from '../../CarbonDataFill/service';
import { onUploadFileFn } from '../../utils';
import { CarbonDataPropsType } from '../../utils/type';

const { NOT_REQUIRED } = ADUDIT_REQUIRED_TYPE;

function CarbonAccountingResult({
  /** 数据id */
  id,
  /** 上传的报告列表 */
  fileList,
  /** 是否存在底部的操作按钮 */
  hasAction,
  /** 表单是否不可编辑 */
  disabled,
  /** 数据详情 */
  cathRecord,
  /** 结果数据详情 */
  computationResult,
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
    },
  });

  /** 企业碳核算标准 */
  const [standardTypesCode, setStandardTypesCode] = useState<number[]>();

  /** 核算范围（GHG Protocol）*/
  const [ghgCategoriesCode, setGhgCategoriesCode] = useState<number[]>();

  /** 核算范围（ISO 14064-1:2018） */
  const [isoCategoriesCode, setIsoCategoriesCode] = useState<number[]>();

  const form = useMemo(
    () =>
      createForm({
        readPretty: disabled,
        initialValues: {
          orgName: cathRecord?.orgName,
          year: cathRecord?.year,
        },
      }),
    [cathRecord],
  );

  /** 根据申请的企业碳核算展示具体的核算标准，以及核算范围 */
  useEffect(() => {
    if (cathRecord) {
      const { standardTypes, ghgCategories, isoCategories } = cathRecord;
      const standardTypesCodeBack = standardTypes
        ? standardTypes.split(',').map(v => Number(v))
        : [];
      const ghgCategoriesCodeBack = ghgCategories
        ? ghgCategories.split(',').map(v => Number(v))
        : [];
      const isoCategoriesCodeBack = isoCategories
        ? isoCategories.split(',').map(v => Number(v))
        : [];
      setStandardTypesCode(standardTypesCodeBack);
      setGhgCategoriesCode(ghgCategoriesCodeBack);
      setIsoCategoriesCode(isoCategoriesCodeBack);
    }
  }, [cathRecord]);

  /** 核算结果详情数据 */
  useEffect(() => {
    if (computationResult) {
      form.setValues({
        ...computationResult,
        orgName: cathRecord?.orgName,
        year: cathRecord?.year,
      });
    }
  }, [computationResult]);

  return (
    <div className={style.wrapper}>
      <Form form={form} previewTextPlaceholder='-'>
        <section>
          <SchemaField schema={basicSchema(hasAction)} />
        </section>
        {standardTypesCode && standardTypesCode.includes(1) && (
          <section>
            <h4>{I18N.carbonData.ghgPr}</h4>
            <SchemaField schema={ghgSchema(ghgCategoriesCode)} />
          </section>
        )}
        {standardTypesCode && standardTypesCode.includes(2) && (
          <section>
            <h4>{I18N.eca.isoStandard2}</h4>
            <SchemaField schema={isoSchema(isoCategoriesCode)} />
          </section>
        )}
      </Form>
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
                    values: ComputationResultReq & {
                      orgName: string;
                      year: number;
                    },
                  ) => {
                    const result = omit(
                      {
                        ...values,
                        applyInfoId: Number(id),
                      },
                      ['orgName', 'year'],
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
                              {
                                I18N.supplyChainCarbonManagement
                                  .corporateCarbonEmissions
                              }
                              {cathRecord?.year}
                              {I18N.supplyChainCarbonManagement.year}
                            </span>
                          </span>
                        ) : (
                          <AuditConfigTable dataSource={nodeList} />
                        ),
                      ...modelFooterBtnStyle,
                      okText: I18N.base.confirm,
                      cancelText: I18N.Factors.cancel,
                      onOk: () => {
                        postSupplychainDataFillComputationSaveAndSubmit({
                          req: result as ComputationResultReq,
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
                    values: ComputationResultReq & {
                      orgName: string;
                      year: number;
                    },
                  ) => {
                    const result = omit(
                      {
                        ...values,
                        applyInfoId: Number(id),
                      },
                      ['orgName', 'year'],
                    );
                    postSupplychainDataFillComputationSave({
                      req: result as ComputationResultReq,
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
export default CarbonAccountingResult;

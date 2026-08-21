/**
 * @description: 产品碳足迹信息（供应商碳数据、碳数据审核、采购产品管理-详情-产品碳足迹公用的页面）
 */
import {
  ArrayTable,
  Cascader,
  Form,
  FormGrid,
  FormItem,
  FormLayout,
  Input,
} from '@formily/antd-v5';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import I18N from '@src/lang/I18N';
import { Button, Table } from 'antd';
import classNames from 'classnames';
import { useEffect, useMemo, useState } from 'react';

import { FormilyFileUpload } from '@/components/FormilyFileUpload';
import { PageTypeInfo } from '@/router/utils/enums';
import { LCARouteMaps } from '@/router/utils/lcaEnums';
import { Toast, changeFactorM2cascaderOptions } from '@/utils';
import { useAllEnumsBatch } from '@/views/dashborad/Dicts/hooks';

import { columns } from './columns';
import style from './index.module.less';
import { schema, fileSchema } from './schemas';
import { getFootprintData } from './service';
import { TargetTable } from '../../CarbonDataFill/Info/CarbonFootPrintFill/type';
import { APPLY_TYPE } from '../../utils/constant';
import { UploadFile } from '../../utils/type';

const SchemaField = createSchemaField({
  components: {
    Input,
    Cascader,
    Form,
    FormItem,
    FormGrid,
    FormLayout,
    ArrayTable,
    FormilyFileUpload,
  },
});

function CarbonFootPrintInfo({
  id,
  disabled,
  applyType,
  isAllCycle,
}: {
  /** 数据id */
  id?: string;
  /** 表单是否禁用 */
  disabled?: boolean;
  /** 数据请求类型 1: 核算结果 2: 核算过程 */
  applyType?: number;
  /** 是否是全生命周期 */
  isAllCycle?: boolean;
}) {
  const form = useMemo(
    () =>
      createForm({
        readPretty: disabled,
      }),
    [disabled],
  );

  /** 请求类型是否为全部核算过程 */
  const isProcess = Number(applyType) === APPLY_TYPE.ALL_PROCESS;

  /** 请求类型是否为仅结果 */
  const isResult = Number(applyType) === APPLY_TYPE.ONLY_RESULT;

  /** 核算单位的枚举值 */
  const accountsUnitsList = useAllEnumsBatch('factorUnitM');

  /** 关联方案id */
  const [linkAssessmentId, setLinkAssessmentId] = useState<number>();

  /** 关联方案id */
  const [linkModalId, setLinkModalId] = useState<number>();

  /** 评价指标表格数据 */
  const [targetDataSource, setTargetDataSource] = useState<TargetTable[]>([]);

  /** 设置枚举值 */
  useEffect(() => {
    /** 核算单位 */
    if (accountsUnitsList) {
      const accountUnitsDicts = accountsUnitsList.factorUnitM;
      form.setFieldState('productUnit', {
        dataSource: changeFactorM2cascaderOptions(accountUnitsDicts),
      });
    }
  }, [accountsUnitsList]);

  useEffect(() => {
    if (id) {
      getFootprintData({ applyInfoId: Number(id) }).then(({ data }) => {
        const result = data?.data || {};
        const {
          startTime,
          endTime,
          productUnit,
          assessmentId,
          modelId,
          resultList = [],
          supportFile,
        } = result;

        setLinkAssessmentId(assessmentId);
        setLinkModalId(modelId);

        // 生产周期
        const productCycle =
          startTime && endTime ? `${startTime}~${endTime}` : undefined;

        /** 核算单位相关处理 */
        const productUnitArr = productUnit ? productUnit?.split(',') : [];

        /** 支撑材料 */
        let supportMaterialsFileList = [];
        if (supportFile && typeof supportFile === 'string') {
          try {
            const parsedFileData = JSON.parse(supportFile) || [];
            supportMaterialsFileList = parsedFileData?.map(
              (file: UploadFile) => {
                const { fileName, fileId, fileUrl } = file || {};
                return {
                  ...file,
                  name: fileName,
                  uid: fileId,
                  url: fileUrl,
                };
              },
            );
          } catch (error) {
            // 防止脏数据导致页面空白
          }
        } else {
          supportMaterialsFileList = [];
        }

        form.setValues({
          ...result,
          productCycle,
          productUnit: productUnitArr,
          supportFile: supportMaterialsFileList,
        });

        /** 处理表格 */
        const resultData = resultList?.map(item => {
          const { dataValueList = [] } = item || {};
          return {
            assessmentTarget: item?.assessmentTarget || '-',
            assessmentTargetName: item?.assessmentTargetName || '-',
            unit: item?.unit || '-',
            resultData: dataValueList?.[0] ?? '-',
            // 半生命周期
            rawMaterialStage: dataValueList?.[1] ?? '-',
            packagingMaterialStage: dataValueList?.[2] ?? '-',
            entranceTransportationStage: dataValueList?.[3] ?? '-',
            productionManufacturing: dataValueList?.[4] ?? '-',
            wasteStage: dataValueList?.[5] ?? '-',
            // 全生命周期
            productProductionStage: dataValueList?.[1] ?? '-',
            constructionProductionStage: dataValueList?.[2] ?? '-',
            usageStage: dataValueList?.[3] ?? '-',
            endStage: dataValueList?.[4] ?? '-',
            additional: dataValueList?.[5] ?? '-',
          };
        });
        setTargetDataSource(resultData || []);
      });
    }
  }, [id]);

  return (
    <div className={style.wrapper}>
      <Form form={form} previewTextPlaceholder='-'>
        <h4>
          {I18N.supplyChainCarbonManagement.theProductEnvironmentIsSufficient}
          <Button
            type='link'
            className={classNames({
              [style.linkDisabled]: !(isProcess && linkAssessmentId),
            })}
            onClick={() => {
              if (isResult) {
                Toast(
                  'warning',
                  I18N.supplyChainCarbonManagement.currentDataPlease,
                );
              }

              if (isProcess && !linkAssessmentId) {
                Toast(
                  'warning',
                  I18N.supplyChainCarbonManagement.noAssociationFound,
                );
              }

              if (isProcess && linkAssessmentId) {
                window.open(
                  `${LCARouteMaps.lcaModelInfo.replace(
                    ':pageTypeInfo',
                    `${PageTypeInfo.show}`,
                  )}?id=${linkModalId}`,
                  '_blank',
                );
              }
            }}
          >
            {I18N.supplyChainCarbonManagement.viewProductEnvironment}
          </Button>
        </h4>
        <SchemaField schema={schema()} />
        <div className={style.tableWrapper}>
          <Table
            dataSource={targetDataSource}
            columns={columns({ isAllCycle })}
            scroll={{ x: 1400 }}
            bordered
            pagination={false}
          />
        </div>
        <h4>{I18N.supplyChainCarbonManagement.evidenceMaterials}</h4>
        <SchemaField schema={fileSchema()} />
      </Form>
    </div>
  );
}
export default CarbonFootPrintInfo;

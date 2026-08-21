/**
 * @description 供应链碳管理-采购产品管理-供应商管理-编辑
 */
import {
  Form,
  FormGrid,
  FormItem,
  FormLayout,
  Input,
  Select,
  Radio,
  NumberPicker,
} from '@formily/antd-v5';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import I18N from '@src/lang/I18N';
import { compact } from 'lodash-es';
import { useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import CommonHeader from '@/components/CommonHeader';
import { FormActions } from '@/components/FormActions';
import { PageTypeInfo, virtualLinkTransform } from '@/router/utils/enums';
import { SccmRouteMaps } from '@/router/utils/sccmEnums';
import {
  postSupplychainProductSupplierEdit,
  getSupplychainProductSupplierSupplierIdProductId,
} from '@/sdks_v2/new/supplychainV2ApiDocs';
import { Toast } from '@/utils';
import { TextArea } from '@/views/eca/component/TextArea';

import style from './index.module.less';
import { infoSchema } from './schemas';
import { UseGetUnitLabel } from '../../../hooks/useGetUnitLabel';
import { usePurchaseProductDetail } from '../../hooks/usePurchaseProductDetail';

const SchemaField = createSchemaField({
  components: {
    Input,
    Select,
    Radio,
    NumberPicker,
    TextArea,
    Form,
    FormItem,
    FormGrid,
    FormLayout,
  },
});

function SupplierManagementInfo() {
  const navigate = useNavigate();

  const { id, supplierPageTypeInfo, supplierId } = useParams<{
    id: string;
    supplierPageTypeInfo: PageTypeInfo;
    supplierId: string;
  }>();

  /** 是否为详情页面 */
  const isDetail = supplierPageTypeInfo === PageTypeInfo.show;

  const form = useMemo(
    () =>
      createForm({
        readPretty: isDetail,
      }),
    [supplierPageTypeInfo],
  );

  /** 采购产品详情 */
  const purchaseProductInfo = usePurchaseProductDetail(id);
  const { productName, productUnit } = purchaseProductInfo || {};

  /** 获取核算单位翻译值 */
  const unitLabel = UseGetUnitLabel(productUnit)?.unitLabel;

  useEffect(() => {
    if (supplierId && id) {
      getSupplychainProductSupplierSupplierIdProductId({
        productId: Number(id),
        supplierId: Number(supplierId),
      }).then(({ data }) => {
        if (data.code === 200) {
          const result = data?.data;
          form.setValues({
            ...result,
          });
        }
      });
    }
  }, [supplierId, id]);

  return (
    <main className={style.purchaseProductInfoWrapper}>
      <div className={style.purchaseProductInfoHeader}>
        <CommonHeader
          basicInfo={[
            {
              label: I18N.Factors.productName,
              value: productName,
            },
            // {
            //   label: I18N.carbonData.affiliatedOrganization,
            //   value: orgName,
            // },
            {
              label: I18N.carbonFootPrint.accountingUnit,
              value: unitLabel,
            },
          ]}
        />
      </div>
      <div className={style.purchaseProductInfoContent}>
        <Form form={form} previewTextPlaceholder='-'>
          <SchemaField schema={infoSchema()} />
        </Form>
      </div>

      <FormActions
        place='center'
        buttons={compact([
          !isDetail && {
            title: I18N.Factors.preserve,
            type: 'primary',
            onClick: async () => {
              const values = await form.submit<{
                materialNo?: string;
                unitPrice?: string;
              }>();
              const result = {
                materialNo: values.materialNo,
                productId: Number(id),
                supplierId: Number(supplierId),
                unitPrice: values.unitPrice,
              };
              return postSupplychainProductSupplierEdit({
                req: result,
              }).then(({ data }) => {
                if (data.code === 200) {
                  Toast('success', I18N.Factors.saveSuccessful);
                  navigate(
                    virtualLinkTransform(
                      SccmRouteMaps.sccmProdctSupplierManagement,
                      [':id'],
                      [id],
                    ),
                  );
                }
              });
            },
          },
          {
            title: isDetail ? I18N.Factors.return : I18N.Factors.cancel,
            onClick: async () => {
              navigate(
                virtualLinkTransform(
                  SccmRouteMaps.sccmProdctSupplierManagement,
                  [':id'],
                  [id],
                ),
              );
            },
          },
        ])}
      />
    </main>
  );
}
export default SupplierManagementInfo;

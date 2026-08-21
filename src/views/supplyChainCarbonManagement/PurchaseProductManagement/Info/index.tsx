/**
 * @description 采购产品管理-详情
 */
import {
  Cascader,
  Form,
  FormGrid,
  FormItem,
  FormLayout,
  Input,
  Select,
} from '@formily/antd-v5';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import I18N from '@src/lang/I18N';
import { Tabs } from 'antd';
import { compact } from 'lodash-es';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { FormActions } from '@/components/FormActions';
import { usePageInfo } from '@/hooks';
import { SccmRouteMaps } from '@/router/utils/sccmEnums';
import { Toast, getSearchParams } from '@/utils';
import { changeFactorM2cascaderOptions } from '@/views/Factors/Info/utils';
import { useLcaEnums } from '@/views/carbonFootPrintLCA/hook';
import { useAllEnumsBatch } from '@/views/dashborad/Dicts/hooks';
// import { useOrgs } from '@/views/dashborad/organizations/OrgManage/hooks';
import { TextArea } from '@/views/eca/component/TextArea';

import { PRODUCT_TABS, SUPPLIER_TABS_ITEMS } from './constant';
import { infoSchema } from './schemas';
import style from '../../SupplierManagement/Info/index.module.less';
import CarbonFootPrintList from '../components/CarbonFootPrintList';
import SupplierList from '../components/SupplierList';
import { getProductInfo, postProductAdd, postProductEdit } from '../service';
import { ProductRequest } from '../type';

const SchemaField = createSchemaField({
  components: {
    Input,
    Select,
    TextArea,
    Cascader,
    Form,
    FormItem,
    FormGrid,
    FormLayout,
  },
});

const { PRODUCT_INFO, SUPPLY_LIST, LCA } = PRODUCT_TABS;

function PurchaseProductManagementInfo() {
  const navigate = useNavigate();

  const { id } = useParams<{
    id: string;
  }>();

  /** URL 携带的参数 */
  const search = { ...getSearchParams()[0] };

  const { isDetail, isAdd } = usePageInfo();

  /** 所属组织枚举 */
  // const orgList = useOrgs();

  /** 核算单位的枚举值 */
  const accountsUnitsList = useAllEnumsBatch('factorUnitM');

  /** 来源系统 */
  const sourceSystemOption = useLcaEnums('SourceSystem');

  /** 当前切换的顶部Tab栏 */
  const [currentTab, setCurrentTab] = useState<string>(
    search?.tab || PRODUCT_INFO,
  );

  const form = useMemo(
    () =>
      createForm({
        readPretty: isDetail,
      }),
    [],
  );

  /** 获取采购产品管理详情 */
  useEffect(() => {
    if (!isAdd && id && accountsUnitsList) {
      getProductInfo({ id: Number(id) }).then(({ data }) => {
        if (data.code === 200) {
          const result = data?.data;
          const { productUnit } = result || {};

          /** 核算单位相关处理 */
          const productUnitArr = productUnit ? productUnit?.split(',') : [];

          form.setValues({
            ...result,
            productUnit: productUnitArr,
          });
        }
      });
    }
  }, [id, accountsUnitsList]);

  /** 设置枚举值 */
  useEffect(() => {
    /** 组织列表 */
    // if (orgList && currentTab === PRODUCT_INFO) {
    //   form.setFieldState('orgId', {
    //     dataSource: orgList.map(item => ({
    //       label: item.orgName,
    //       value: item.id,
    //     })),
    //   });
    // }
    /** 核算单位 */
    if (accountsUnitsList && currentTab === PRODUCT_INFO) {
      const accountUnitsDicts = accountsUnitsList.factorUnitM;
      form.setFieldState('productUnit', {
        dataSource: changeFactorM2cascaderOptions(accountUnitsDicts),
      });
    }
    /** 来源系统 */
    if (sourceSystemOption) {
      form.setFieldState('sourceSystem', {
        dataSource: sourceSystemOption.map(item => ({
          label: item.name,
          value: item.code,
        })),
      });
    }
  }, [accountsUnitsList, currentTab]);

  return (
    <div className={style.supplyManagementInfoWrapper}>
      {isDetail && (
        <Tabs
          defaultActiveKey={search?.tab || PRODUCT_INFO}
          items={SUPPLIER_TABS_ITEMS}
          onChange={value => {
            setCurrentTab(value);
          }}
        />
      )}
      {/* 采购产品信息 */}
      {currentTab === PRODUCT_INFO && (
        <Form form={form} previewTextPlaceholder='-'>
          <SchemaField schema={infoSchema()} />
        </Form>
      )}

      {/* 供应商列表 */}
      {currentTab === SUPPLY_LIST && <SupplierList hasAction={false} />}

      {/* 产品环境足迹 */}
      {currentTab === LCA && <CarbonFootPrintList />}

      <FormActions
        place='center'
        buttons={compact([
          !isDetail && {
            title: I18N.Factors.preserve,
            type: 'primary',
            onClick: async () => {
              const values = await form.submit<ProductRequest>();
              const result = {
                ...values,
                productUnit: String(values.productUnit),
              };
              if (isAdd) {
                return postProductAdd(result).then(({ data }) => {
                  if (data.code === 200) {
                    Toast('success', I18N.Factors.saveSuccessful);
                    navigate(SccmRouteMaps.sccmProdct);
                  }
                });
              }
              return postProductEdit(result).then(({ data }) => {
                if (data.code === 200) {
                  Toast('success', I18N.Factors.saveSuccessful);
                  navigate(SccmRouteMaps.sccmProdct);
                }
              });
            },
          },
          {
            title: isDetail ? I18N.Factors.return : I18N.Factors.cancel,
            onClick: async () => {
              navigate(SccmRouteMaps.sccmProdct);
            },
          },
        ])}
      />
    </div>
  );
}
export default PurchaseProductManagementInfo;

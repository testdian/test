/**
 * @description 供应商商户管理详情页
 */
import {
  Form,
  FormGrid,
  FormItem,
  FormLayout,
  Input,
  NumberPicker,
  Select,
  Radio,
} from '@formily/antd-v5';
import { createForm, onFieldInputValueChange } from '@formily/core';
import { createSchemaField } from '@formily/react';
import I18N from '@src/lang/I18N';
import { Tabs } from 'antd';
import { compact } from 'lodash-es';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { FormActions } from '@/components/FormActions';
import { usePageInfo } from '@/hooks';
import { SccmRouteMaps } from '@/router/utils/sccmEnums';
import { Toast } from '@/utils';
// import { useOrgs } from '@/views/dashborad/organizations/OrgManage/hooks';
import { TextArea } from '@/views/eca/component/TextArea';

import { SUPPLIER_TABS, SUPPLIER_TABS_ITEMS } from './constant';
import style from './index.module.less';
import { infoSchema } from './schemas';
import { useSupplyChainEnums } from '../../hooks/useEnums';
import { RegMobile, RegUscc } from '../../utils';
import ApprovalRecord from '../components/ApprovalRecord';
import { SUPPLIER_STATUS, SUPPLIER_WAY } from '../constant';
import { getSupplierInfo, postSupplierAdd, postSupplierEdit } from '../service';
import { SupplierRequest } from '../type';

/** 校验手机号 */
const onCheckMobile = (value: number) => {
  if (!value) return '';
  if (RegMobile(value)) return '';
  return I18N.supplyChainCarbonManagement.pleaseInputCorrectly3;
};

/** 校验社会信用代码 */
const onCheckUscc = (value: string) => {
  if (!value) return '';
  if (RegUscc(value)) return '';
  return I18N.supplyChainCarbonManagement.onlySupportsUppercase;
};

const { SUPPLIER_INFO, APPROVAL_RECORD } = SUPPLIER_TABS;

const { ENABLE, DISABLED } = SUPPLIER_STATUS;

const SchemaField = createSchemaField({
  components: {
    Input,
    Select,
    Radio,
    NumberPicker,
    Form,
    FormItem,
    FormGrid,
    FormLayout,
    TextArea,
  },
});

const SupplierManagementInfo = () => {
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();

  const { isDetail, isAdd } = usePageInfo();

  /** 所属组织枚举 */
  // const orgList = useOrgs();

  /** 商户类型 */
  const supplyTypeOptions = useSupplyChainEnums('SupplierType');

  /** 新增商户方式 */
  const createSupplierTypeOptions = useSupplyChainEnums('CreateSupplierType');

  /** 当前切换的顶部Tab栏 */
  const [currentTab, setCurrentTab] = useState<string>(SUPPLIER_INFO);

  const form = useMemo(
    () =>
      createForm({
        readPretty: isDetail,
        effects: () => {
          onFieldInputValueChange('createSupplierType', (filed, f) => {
            if (!isDetail) {
              if (filed.value === SUPPLIER_WAY.ASSOCIATION_SUPPLIER) {
                f.setFieldState('uniqueCode', {
                  disabled: false,
                  required: true,
                });
                f.reset('uniqueCode');
              } else {
                f.setFieldState('uniqueCode', {
                  disabled: true,
                  required: false,
                });
                f.setValuesIn('uniqueCode', `${new Date().getTime()}`);
              }
            }
          });
        },
      }),
    [],
  );

  /** 获取供应商详情 */
  useEffect(() => {
    if (!isAdd && id) {
      getSupplierInfo({ id: Number(id) }).then(({ data }) => {
        if (data.code === 200) {
          form.setValues({
            ...data?.data,
          });

          /** 关联已有商户时打开企业唯一代码禁用 */
          if (
            !isDetail &&
            data?.data?.createSupplierType === SUPPLIER_WAY.ASSOCIATION_SUPPLIER
          ) {
            form.setFieldState('uniqueCode', {
              disabled: false,
              required: true,
            });
          }

          /** 当状态为启用、禁用时，企业唯一代码、商户类型、新增商户方式不可以编辑 */
          if ([ENABLE, DISABLED].includes(Number(data?.data?.supplierStatus))) {
            form.setFieldState(
              '*(uniqueCode,supplierType,createSupplierType)',
              {
                disabled: true,
                required: false,
              },
            );
          }
        }
      });
    }
  }, [id]);

  /** 设置枚举值 */
  useEffect(() => {
    /** 商户类型 */
    if (supplyTypeOptions) {
      form.setFieldState('supplierType', {
        dataSource: supplyTypeOptions.map(item => ({
          label: item.name,
          value: item.code,
        })),
      });
    }

    /** 新增商户方式 */
    if (createSupplierTypeOptions) {
      form.setFieldState('createSupplierType', {
        dataSource: createSupplierTypeOptions.map(item => ({
          label: item.name,
          value: item.code,
        })),
      });
    }

    // /** 组织列表 */
    // if (orgList && currentTab === SUPPLIER_INFO) {
    //   form.setFieldState('orgId', {
    //     dataSource: orgList.map(item => ({
    //       label: item.orgName,
    //       value: item.id,
    //     })),
    //   });
    // }

    /** 新增自动生成 企业唯一代码 商户编辑 */
    if (isAdd) {
      form.setFieldState('uniqueCode', {
        value: `${new Date().getTime()}`,
      });

      form.setFieldState('supplierCode', {
        value: `SH${new Date().getTime()}`,
      });
    }
  }, [currentTab, supplyTypeOptions, createSupplierTypeOptions]);

  return (
    <div className={style.supplyManagementInfoWrapper}>
      {isDetail && (
        <Tabs
          defaultActiveKey={SUPPLIER_INFO}
          items={SUPPLIER_TABS_ITEMS}
          onChange={value => {
            setCurrentTab(value);
          }}
        />
      )}

      {/* 商户信息 */}
      {currentTab === SUPPLIER_INFO && (
        <Form form={form} previewTextPlaceholder='-'>
          <SchemaField
            schema={infoSchema()}
            scope={{ onCheckMobile, onCheckUscc }}
          />
        </Form>
      )}

      {/* 审核记录 */}
      {currentTab === APPROVAL_RECORD && <ApprovalRecord />}

      <FormActions
        place='center'
        buttons={compact([
          !isDetail && {
            title: I18N.Factors.preserve,
            type: 'primary',
            onClick: async () => {
              const values = await form.submit<SupplierRequest>();
              if (isAdd) {
                return postSupplierAdd(values).then(({ data }) => {
                  if (data.code === 200) {
                    Toast('success', I18N.Factors.saveSuccessful);
                    navigate(SccmRouteMaps.sccmManagement);
                  }
                });
              }
              return postSupplierEdit(values).then(({ data }) => {
                if (data.code === 200) {
                  Toast('success', I18N.Factors.saveSuccessful);
                  navigate(SccmRouteMaps.sccmManagement);
                }
              });
            },
          },
          {
            title: isDetail ? I18N.Factors.return : I18N.Factors.cancel,
            onClick: async () => {
              navigate(SccmRouteMaps.sccmManagement);
            },
          },
        ])}
      />
    </div>
  );
};
export default SupplierManagementInfo;

/*
 * @@description:
 * @Author: ljh255 jinhai@carbonstop.net
 * @Date: 2023-02-22 10:07:28
 * @LastEditors: ljh255 jinhai@carbonstop.net
 * @LastEditTime: 2023-03-27 11:33:12
 */
import {
  Form,
  DatePicker,
  FormGrid,
  FormItem,
  FormLayout,
  Input,
  Select,
  Upload,
  Cascader,
} from '@formily/antd-v5';
import { createForm, onFormInit } from '@formily/core';
import { createSchemaField } from '@formily/react';
import I18N from '@src/lang/I18N';
import { useEffect, useImperativeHandle, useState } from 'react';

import {
  ControlPlanResp,
  postComputationControlPlanEditOrg,
} from '@/sdks/computation/computationV2ApiDocs';
import { Toast, processData } from '@/utils';
import { TextArea } from '@/views/eca/component/TextArea';
import { FormTwoSchema } from '@/views/eca/dataQualityManage/utils/schema';
import { AddressTree } from '@/views/eca/hooks';

import CardUpload from '../../component/CardUpload';

export type FormRef = {
  submit: () => void;
};
export const FormTwo = ({
  isEdit,
  currentPlanIndex,
  cRef,
  formValue,
  controlPlanIdFn,
  gasEnums,
}: {
  isEdit: boolean;
  currentPlanIndex: number;
  cRef?: React.MutableRefObject<FormRef | undefined>;
  formValue: ControlPlanResp['org'];
  controlPlanIdFn: () => void;
  gasEnums?: { [key: string]: any };
  // langIdObj?: { [key: string]: any };
}) => {
  const AddressTreeArr = AddressTree();
  // 组织基本信息 详情
  // const [orgDetail, getOrgDetail] = useState<ControlPlanResp['org']>({});
  // 编辑 用于存储过的语言id
  const [langIdObj, setLangIdObj] = useState<{ [key: string]: number }>({});
  const [langUageObj, setlangUageObj] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    if (formValue) {
      const langUageObj: { [ket: string]: any } = {};
      const langUageIdObj: { [ket: string]: any } = {};
      (formValue?.languageSourceList as any[])?.forEach(
        (item: {
          sourceType_name: any;
          langType_name: any;
          sourceValue: any;
          id: any;
        }) => {
          langUageObj[`${item.sourceType_name}En`] = item.sourceValue;
          langUageIdObj[`${item.sourceType_name}`] = item.id;
        },
      );
      setlangUageObj(langUageObj);
      setLangIdObj(langUageIdObj);
    }
  }, [formValue]);
  // 版本及修订表单
  const formTwo = createForm({
    readPretty: !isEdit,
    visible: currentPlanIndex === 2,
    values: {
      ...formValue,
      ...langUageObj,
    },
    effects() {
      onFormInit(current => {
        current.setFieldState('orgName', {
          readPretty: true,
        });
        current.setFieldState('regCodes', {
          dataSource: AddressTreeArr,
        });
        current.setFieldState('produceCodes', {
          dataSource: AddressTreeArr,
        });
        current.setFieldState('produceCodes', {
          display: isEdit ? 'visible' : 'hidden',
        });
        current.setFieldState('produceArea', {
          display: isEdit ? 'hidden' : 'visible',
        });
        current.setFieldState('regCodes', {
          display: isEdit ? 'visible' : 'hidden',
        });
        current.setFieldState('regArea', {
          display: isEdit ? 'hidden' : 'visible',
        });
      });
    },
  });
  // 父组件主动触发
  useImperativeHandle(cRef, () => ({
    /** 重新加载数据 */
    submit: async () => {
      formTwo.submit(async (value: ControlPlanResp['org']) => {
        const newValue = {
          controlPlanId: value?.controlPlanId,
          deptName: value?.deptName, // 碳盘查负责部门
          gasGroupDesc: value?.gasGroupDesc, // 温室气体管理小组架构描述
          gasGroupImg: JSON.stringify(value?.gasGroupImg), // 温室气体管理小组架构
          intro: value?.intro, // 企业简介
          planeImg: JSON.stringify(value?.planeImg), // 组织平面示意图
          planeImgDesc: value?.planeImgDesc, // 组织平面示意图描述
          produceAddress: value?.produceAddress, // 生产经营地址-详细地址
          produceAreaCode: value?.produceCodes?.[2], // 生产经营地址-所属地区
          regAddress: value?.regAddress, // 注册地址-详细地址
          regAreaCode: value?.regCodes?.[2], // 注册地址-所属地区
        };
        const processResult = processData(
          value || {},
          gasEnums || {},
          langIdObj,
        );
        await postComputationControlPlanEditOrg({
          req: {
            ...newValue,
            languageSourceList: [...(processResult || [])],
          },
        }).then(({ data }) => {
          if (data.code === 200) {
            controlPlanIdFn();
            Toast('success', I18N.Factors.saveSuccessful);
          }
        });
      });
    },
  }));
  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      FormGrid,
      FormLayout,
      Select,
      DatePicker,
      Upload,
      CardUpload,
      Cascader,
      TextArea,
    },
  });
  return (
    <Form form={formTwo} previewTextPlaceholder='-'>
      <SchemaField schema={FormTwoSchema(isEdit)} />
    </Form>
  );
};

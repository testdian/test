/**
 * @description 环境足迹报告详情抽屉
 */
import {
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
import { Button } from 'antd';
import { useEffect, useMemo, useState } from 'react';

import CustomDrawer from '@/components/CustomDrawer';
import { PageTypeInfo } from '@/router/utils/enums';
import { Org, getSystemOrgUserList } from '@/sdks/systemV2ApiDocs';
import {
  ApiLanguageSourceList,
  LANG_TYPE,
  Toast,
  handleLangFields,
  reverseHandleLangFields,
} from '@/utils';
import { getButtonText } from '@/utils/buttonText';
import { TextArea } from '@/views/eca/component/TextArea';

import style from './index.module.less';
import { modelCaseSchema, reportInfoSchema } from './schemas';
import { updateFormFieldStates } from '../../ProcessesLibrary/ProcessSetDrawer/utils';
import { SOURCE_TYPE_MAPPING } from '../../utils';
import ModelPlanInfo from '../ModelPlanInfo';
import { getReportDetailApi, postReportAdd, postReportEdit } from '../service';
import { AssessmentResp, ReportProps } from '../type';

const { add, edit, show } = PageTypeInfo;

const SchemaField = createSchemaField({
  components: {
    Input,
    Select,
    TextArea,
    Form,
    FormItem,
    FormGrid,
    FormLayout,
  },
});

export const CarbonFootprintReportInfo = ({
  open,
  actionBtnType,
  reportId,
  onOk,
  onClose,
}: {
  /** 抽屉的显隐 */
  open: boolean;
  /** 列表操作按钮的类型 */
  actionBtnType: PageTypeInfo;
  /** 报告ID */
  reportId?: number;
  /** 保存方法 */
  onOk: () => void;
  /** 取消方法 */
  onClose: () => void;
}) => {
  const isAdd = actionBtnType === add;
  const isDetail = actionBtnType === show;
  const isEdit = actionBtnType === edit;

  const titleMap = {
    [add]: I18N.carbonFootPrintLCA.newReportAdded,
    [edit]: I18N.carbonFootPrintLCA.editReport,
    [show]: I18N.carbonFootPrintLCA.reportDetails,
  };

  /** 渲染抽屉标题 */
  const title = titleMap[actionBtnType as keyof typeof titleMap];

  /** 接口返回的languageSourceList */
  const [apiLanguageSourceList, setApiLanguageSourceList] =
    useState<ApiLanguageSourceList[]>();

  const form = useMemo(
    () =>
      createForm({
        readPretty: isDetail,
      }),
    [actionBtnType, open],
  );

  /** 方案id */
  const [assessmentId, setAssessmentId] = useState<number>();

  /** 设置方案弹窗的open */
  const [modelPlanInfoOpen, setModelPlanInfoOpen] = useState(false);

  /** 存放所属组织字段数据源 */
  const [formFieldsDataSource, setFormFieldsDataSource] = useState<{
    orgList: Org[];
  }>({
    /** 数据所属域列表 */
    orgList: [],
  });

  /** 保存时的api接口 */
  const api = isAdd ? postReportAdd : postReportEdit;

  /** 获取数据所属域名列表  */
  const getOrgsList = async () => {
    const { data } = await getSystemOrgUserList({});
    return data.data || [];
  };

  /** 获取报告抽屉详情 */
  const getReportDetail = async () => {
    const { data } = await getReportDetailApi({
      id: Number(reportId),
    });
    setApiLanguageSourceList(data?.data?.languageSourceList);
    /** 反处理多语言 */
    const langFields = reverseHandleLangFields(data?.data?.languageSourceList);
    form.setValues({
      ...data?.data,
      ...langFields,
    });
    setAssessmentId(data?.data?.assessmentId);
  };

  /** 选择方案radio后的回调赋值表单项 */
  const onChangeSelected = ({
    selectRows,
  }: {
    selectRows: AssessmentResp[];
  }) => {
    const {
      modelName,
      modelCode,
      funcUnit,
      planName,
      assessmentMethodName,
      assessmentTargetNames,
    } = selectRows?.[0] || {};
    form.setValues({
      modelName,
      modelCode,
      funcUnit,
      planName,
      assessmentMethodName,
      assessmentTargetNames,
    });
    setAssessmentId(selectRows?.[0]?.id);
    setModelPlanInfoOpen(false);
  };

  /** 保存报告信息 */
  const onSaveReportInfo = async () => {
    const values = await form.submit<ReportProps>();
    /** 处理多语言 */
    const languageSourceList = handleLangFields({
      rawData: values,
      langType: LANG_TYPE.EN,
      sourceTypeMapping: SOURCE_TYPE_MAPPING,
      apiLanguageSourceList,
    });
    const valuesInfo = { ...values, assessmentId, languageSourceList };
    await api(valuesInfo);
    Toast('success', I18N.Factors.saveSuccessful);
    form.reset();
    setAssessmentId(undefined);
    onOk();
  };

  useEffect(() => {
    if (actionBtnType !== add) {
      getReportDetail();
    }
  }, [actionBtnType]);

  useEffect(() => {
    const loadData = async () => {
      // 获取所属组织列表
      const orgsPromise = getOrgsList();
      // 所有接口执行完毕
      const [orgs] = await Promise.all([orgsPromise]);
      // 赋值下拉框数据
      setFormFieldsDataSource({
        orgList: orgs || [],
      });
    };
    if (open) {
      loadData();
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      const fieldsConfig = [
        {
          /** 数据所属组织 */
          fieldName: 'orgId',
          dataList: formFieldsDataSource.orgList,
          labelKey: 'orgName',
          valueKey: 'id',
          isDisabled: !isAdd,
        },
      ];
      // 更新所属组织字段数据源
      updateFormFieldStates(form, fieldsConfig);

      /** 编辑时，所属组织不能编辑 */
      if (isEdit) {
        form.setFieldState('orgId', {
          disabled: true,
          required: false,
        });
      }
    }
  }, [formFieldsDataSource, open, actionBtnType]);

  return (
    <CustomDrawer
      className={`${style.wrapper}`}
      title={title}
      maskClosable={false}
      destroyOnClose
      onClose={() => {
        onClose();
        setAssessmentId(undefined);
      }}
      onSave={onSaveReportInfo}
      visible={open}
      isDetail={actionBtnType === show}
      saveBtnText={getButtonText(actionBtnType)}
    >
      <Form form={form} previewTextPlaceholder='-'>
        {/* 模型方案 */}
        <div className={style.modelNameWrapper}>
          <div className={style.modelName}>
            {I18N.carbonFootPrintLCA.modelScheme}
          </div>
          {!isDetail && (
            <Button type='primary' onClick={() => setModelPlanInfoOpen(true)}>
              {I18N.carbonFootPrintLCA.chooseASolution}
            </Button>
          )}
        </div>
        <SchemaField schema={modelCaseSchema()} />

        {/* 报告信息 */}
        <div className={style.modelNameWrapper}>
          <div className={style.modelName}>
            {I18N.carbonFootPrint.reportInformation}
          </div>
        </div>
        <SchemaField schema={reportInfoSchema()} />
      </Form>

      {/* 环境足迹报告-点击选择方案按钮-数据弹窗 */}
      <ModelPlanInfo
        open={modelPlanInfoOpen}
        handleCancel={() => setModelPlanInfoOpen(false)}
        // @ts-ignore
        handleOk={onChangeSelected}
      />
    </CustomDrawer>
  );
};

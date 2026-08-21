/**
 * 排放源审核/详情抽屉
 * @param emissionSourceDetail 排放源详情
 * @param actionType 页面类型
 * @param visible 抽屉是否展示
 * @param onClose 关闭回调
 * @param onSuccessSave 成功回调
 */
import {
  ArrayTable,
  Form,
  FormGrid,
  FormItem,
  FormLayout,
  NumberPicker,
  Input,
  Select,
  Radio as FormRadio,
  TreeSelect,
} from '@formily/antd-v5';
import { createForm, FieldComponent } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { Cascader, Radio, RadioChangeEvent } from 'antd';
import { isEmpty } from 'lodash-es';
import { FC, ReactNode, useEffect, useMemo, useState } from 'react';

import { AuditMoreModal } from '@/components/AuditMoreModal';
import CustomDrawer from '@/components/CustomDrawer';
import { FormActions } from '@/components/FormActions';
import { useOrgTreeData } from '@/hooks/useOrgTreeData';
import I18N from '@/lang/I18N';
import { PageTypeInfo } from '@/router/utils/enums';
import { getSystemRolePage } from '@/sdks/systemV2ApiDocs';
import {
  reverseHandleLangFields,
  ApiLanguageSourceList,
  LANG_TYPE,
  handleLangFields,
} from '@/utils';
import {
  baseSchema,
  activityLVMHFormSchema,
} from '@/views/components/EmissionSource/utils/schemas';
import SelectButton from '@/views/components/SelectButton';
import {
  editEmissionSourceGroupApi,
  editEmissionSourceNewApi,
} from '@/views/eca/emissionManage/service';
import { EmissionSourceReqRequest } from '@/views/eca/emissionManage/type';
import { getComputationDataFillTemplateListApi } from '@/views/eca/fillData/service';
import { ComputationTemplateResp } from '@/views/eca/fillData/type';
import { useEmissionSourceOrGroupInfo } from '@/views/eca/hooks';
import { useComputationEnum } from '@/views/eca/hooks/useComputationEnum';
import { TEMPLATE_CODE } from '@/views/eca/util/constant';

import style from './index.module.less';
import { AuditRecordLog } from './type';
import { ComputationSourceRequest } from '../../type';
import AuditFlow from '../AuditRecord';
import { getAuditRecordList } from '../AuditRecord/service';
import EmissionCalculationTable from '../EmissionCalculationTable';

export enum PageAuditType {
  'audit' = 'audit',
}

export interface AuditOrCheckDetailProps {
  /** 排放源  */
  emissionSourceDetail: ComputationSourceRequest;
  actionType: PageTypeInfo & PageAuditType;
  visible?: boolean;
  onClose: () => void;
  onSuccessSave: () => void;
  /** 是否是排放源组 */
  isGroup?: boolean;
  /** 核算排放源id列表 */
  computationSourceIdList?: number[];
}

type AuditDrawerProps = AuditOrCheckDetailProps;

const { show, edit } = PageTypeInfo;

const AUDIT_TYPE = {
  data: 1,
  review: 2,
};

const options = [
  { label: I18N.eca.dataRecord, value: AUDIT_TYPE.data },
  { label: I18N.eca.auditRecords, value: AUDIT_TYPE.review },
];

const SchemaField = createSchemaField({
  components: {
    FormItem,
    FormGrid,
    FormLayout,
    Input,
    Select,
    Cascader,
    ArrayTable,
    SelectButton,
    NumberPicker,
    TreeSelect,
    Radio: FormRadio,
  },
});

export const AuditOrCheckDetailContent: FC<
  AuditOrCheckDetailProps & {
    footerClassName?: string;
    footerCancelText?: string;
    renderFooter?: (options: {
      isAudit: boolean;
      isDetail: boolean;
      onAudit: () => void;
      onCancel: () => void;
      onOk: () => void;
    }) => ReactNode;
  }
> = ({
  isGroup,
  computationSourceIdList,
  emissionSourceDetail,
  actionType,
  visible = true,
  onClose,
  onSuccessSave,
  footerClassName,
  footerCancelText,
  renderFooter,
}) => {
  const isDetail = actionType === show;
  const isAudit = actionType === PageAuditType.audit;
  const isEdit = actionType === edit;

  /** 组织树数据 */
  const [orgTreeData] = useOrgTreeData();

  /** 活动数据类别 */
  const activityCategoryList = useComputationEnum({
    enumType: 'ActivityCategory',
    enabled: visible,
  });

  /** 数据收集周期类型 */
  const collectCycleType = useComputationEnum({
    enumType: 'DataPeriod',
    enabled: visible,
  });

  /** 看板标识 */
  const statisticTypeList = useComputationEnum({
    enumType: 'StatisticType',
    enabled: visible,
  });

  /** 审核记录loading状态 */
  const [loading, setLoading] = useState(false);

  /** 审核记录列表 */
  const [auditRecordList, setAuditRecordList] = useState<AuditRecordLog[]>([]);

  const [value, setValue] = useState(AUDIT_TYPE.data);
  /** 排放源 Id */
  const emissionSourceId = emissionSourceDetail?.emissionSourceId;
  /** 核算id */
  const computationId = emissionSourceDetail?.computationId;
  /** 核算排放源关系id */
  const computationSourceId = emissionSourceDetail?.id;

  /** 切换按钮 */
  const onChange = (e: RadioChangeEvent) => {
    setValue(e.target.value);
  };

  /** 排放源信息 */
  const emissionSourceDetailData = useEmissionSourceOrGroupInfo(
    computationSourceId,
    isGroup,
  );

  const form = useMemo(() => {
    return createForm({
      readPretty: true,
    });
  }, [visible]);

  const [templateList, setTemplateList] = useState<ComputationTemplateResp[]>(
    [],
  );

  /** 审核弹窗 */
  const [auditModalVisible, setAuditModalVisible] = useState(false);

  /** 获取排放源的模板收集详情数据 */
  const fetchTemplateList = async () => {
    if (!computationId || !computationSourceId) return [];
    const { data } = await getComputationDataFillTemplateListApi(
      computationId,
      computationSourceId,
    );
    return data?.data;
  };

  // 获取排放源详情
  const getEmissionSourceDetailFn = async () => {
    const {
      // activityCategory,
      // activityCategory_name: activityCategoryName,
      ghgCategory_name: ghgCategoryName,
      ghgClassify_name: ghgClassifyName,
      isoCategory_name: isoCategoryName,
      isoClassify_name: isoClassifyName,
      sourceCode,
      languageSourceList,
      calcMethod_name: calcMethodName,
    } = emissionSourceDetailData || {};
    const langFields = reverseHandleLangFields(
      languageSourceList as ApiLanguageSourceList[],
    );

    /** 获取角色列表 */
    getSystemRolePage({ pageNum: 1, pageSize: 100000 }).then(({ data }) => {
      form.setFieldState('roleIds', state => {
        state.dataSource = data?.data?.list?.map(item => ({
          label: item.roleName,
          value: item.id,
        }));
        state.disabled = !isEdit;
        state.value = emissionSourceDetailData?.roleIds?.split(',').map(Number);
      });
    });

    // 支撑材料反显处理
    form.setValues({
      ...emissionSourceDetailData,
      sourceCode,
      ...langFields,
    });

    /** 转换下拉框的数据为 input 直接取值，不请求枚举接口 */
    const fieldConfigs = [
      {
        fieldName: 'ghg',
        component: 'Input',
        value: `${ghgCategoryName}/${ghgClassifyName}`,
      },
      {
        fieldName: 'iso',
        component: 'Input',
        value: `${isoCategoryName}/${isoClassifyName}`,
      },
      { fieldName: 'calcMethod', component: 'Input', value: calcMethodName },
    ];

    fieldConfigs.forEach(({ fieldName, component, value }) => {
      form.setFieldState(fieldName, state => {
        state.component = component as unknown as
          | FieldComponent<any>
          | undefined;
        state.value = value;
      });
    });

    // form.setFieldState('activityCategory', {
    //   dataSource: [
    //     {
    //       value: activityCategory,
    //       label: activityCategoryName,
    //     },
    //   ],
    // });
  };

  /** 获取审批记录数据 */
  const getAuditRecordListFn = async () => {
    setLoading(true);
    const { data } = await getAuditRecordList({
      computationSourceId,
    }).finally(() => {
      setLoading(false);
    });
    setAuditRecordList(data?.data || []);
  };

  /** 编辑接口 */
  const editApi = isGroup
    ? editEmissionSourceGroupApi
    : editEmissionSourceNewApi;

  /** 编辑状态下的保存 */
  const handelSaveSubmit = async () => {
    const values = await form.submit<
      EmissionSourceReqRequest & { roleIds: string[] }
    >();

    /** 处理多语言 */
    const languageSourceList = handleLangFields({
      rawData: values,
      langType: LANG_TYPE.EN,
      sourceTypeMapping: {
        facility: 2,
        sourceName: 1,
      },
      apiLanguageSourceList:
        emissionSourceDetailData?.languageSourceList as ApiLanguageSourceList[],
    });

    const result = {
      ...emissionSourceDetailData,
      ...values,
      roleIds: values?.roleIds?.join(','),
      sourceName: values?.sourceName,
      facility: values?.facility,
      activityCategory: values?.activityCategory,
      languageSourceList,
    };

    await editApi(result);
    form.reset();
    onSuccessSave?.();
  };

  useEffect(() => {
    if (visible && emissionSourceId && !isEmpty(emissionSourceDetailData)) {
      form.setFieldState(
        '*(sourceName,sourceNameEn,facility,facilityEn,activityCategory)',
        {
          disabled: !isEdit,
        },
      );

      getEmissionSourceDetailFn();
    }
  }, [emissionSourceId, emissionSourceDetailData, visible]);

  useEffect(() => {
    (async () => {
      if (visible && !isGroup) {
        const templates = await fetchTemplateList();
        // 2. 处理模板列表数据
        const processedTemplates = templates?.map?.((item, index) => ({
          ...item,
          label: item?.templateName || `${TEMPLATE_CODE}${index + 1}`,
          key: `${item.id}`,
        }));
        setTemplateList(processedTemplates || []);
      } else {
        setTemplateList([]);
        setValue(AUDIT_TYPE.data);
        setAuditRecordList([]);
        form.reset();
      }
    })();
  }, [visible]);

  useEffect(() => {
    if (value === AUDIT_TYPE.review) {
      getAuditRecordListFn();
    } else {
      getEmissionSourceDetailFn();
    }
  }, [value]);

  useEffect(() => {
    if (activityCategoryList) {
      form.setFieldState('activityCategory', {
        dataSource: activityCategoryList,
      });
    }

    /** 核算组织 */
    if (orgTreeData?.length) {
      form.setFieldState('orgCode', {
        dataSource: orgTreeData,
      });
    }

    /** 数据收集周期 */
    if (collectCycleType?.length) {
      form.setFieldState('dataPeriod', {
        dataSource: collectCycleType,
      });
    }

    /** 看板标识 */
    if (statisticTypeList?.length) {
      form.setFieldState('statisticType', {
        dataSource: statisticTypeList,
        disabled: !isEdit,
      });
    }
  }, [
    activityCategoryList,
    orgTreeData,
    collectCycleType,
    statisticTypeList,
    value,
    isEdit,
  ]);

  const defaultFooterButtons = [
    ...(isAudit
      ? [
          {
            title: I18N.eca.toExamine,
            type: 'primary' as const,
            onClick: async () => {
              setAuditModalVisible(true);
            },
          },
        ]
      : []),
    ...(!isAudit && !isDetail
      ? [
          {
            title: I18N.base.confirm,
            type: 'primary' as const,
            onClick: async () => {
              handelSaveSubmit();
            },
          },
        ]
      : []),
    {
      title:
        footerCancelText ||
        (isDetail ? I18N.carbonFootPrintLCA.close : I18N.Factors.cancel),
      onClick: async () => {
        onClose();
      },
    },
  ];

  return (
    <>
      <div className={!renderFooter ? style.contentWrapper : undefined}>
        {/* 顶部tab 切换区域 */}
        {!isEdit && !isGroup && (
          <Radio.Group
            value={value}
            optionType='button'
            options={options}
            onChange={onChange}
          />
        )}
        {/* 审核记录 */}
        {value === AUDIT_TYPE.review && (
          <AuditFlow flowList={auditRecordList} loading={loading} />
        )}
        {/* 数据详情 */}
        {value === AUDIT_TYPE.data && (
          <Form form={form} previewTextPlaceholder='-'>
            <section className={style.card}>
              <h3 className={style.cardTitle}>
                <div>{I18N.Factors.basicInformation}</div>
              </h3>
              <SchemaField schema={baseSchema()} />
            </section>
            <section className={style.card}>
              <h3>{I18N.eca.activityData}</h3>
              <SchemaField schema={activityLVMHFormSchema()} />
            </section>
            {/* 模版收集 */}
            {!isGroup && (
              <section className={style.card}>
                <h3>{I18N.components.templateCollection}</h3>
                <EmissionCalculationTable
                  templateList={templateList}
                  onClose={onClose}
                />
              </section>
            )}
          </Form>
        )}
      </div>
      {/* 审核弹窗  */}
      <AuditMoreModal
        open={auditModalVisible}
        handleCancel={() => {
          setAuditModalVisible(false);
        }}
        handleOk={() => {
          setAuditModalVisible(false);
          onSuccessSave();
        }}
        formValues={{
          computationSourceIdList,
        }}
      />
      {renderFooter ? (
        renderFooter({
          isAudit,
          isDetail,
          onAudit: () => {
            setAuditModalVisible(true);
          },
          onCancel: onClose,
          onOk: handelSaveSubmit,
        })
      ) : (
        <FormActions
          className={footerClassName || style.footer}
          place='center'
          buttons={defaultFooterButtons}
        />
      )}
    </>
  );
};

const AuditOrCheckDetailDrawer: FC<AuditDrawerProps> = props => {
  const { actionType, visible, onClose, onSuccessSave } = props;
  const isDetail = actionType === show;
  const titleMap = {
    [show]: I18N.router.emissionSourceDetails,
    [edit]: I18N.cbam.editEmissionSources,
  };
  const title = titleMap[actionType as keyof typeof titleMap];

  return (
    <CustomDrawer
      isDetail={isDetail}
      title={title}
      onClose={onClose}
      onSave={() => {
        onSuccessSave();
      }}
      visible={!!visible}
      width='100%'
      footer={null}
    >
      <AuditOrCheckDetailContent {...props} />
    </CustomDrawer>
  );
};

export default AuditOrCheckDetailDrawer;

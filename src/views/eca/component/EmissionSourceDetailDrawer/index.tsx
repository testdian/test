import {
  FormItem,
  FormGrid,
  FormLayout,
  ArrayTable,
  NumberPicker,
  Input,
  Select,
  Cascader,
  Radio,
  Form,
  TreeSelect,
} from '@formily/antd-v5';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { isEmpty } from 'lodash-es';
import React, { useEffect, useMemo, useState } from 'react';

import CustomDrawer from '@/components/CustomDrawer';
import { ModalFooter } from '@/components/ModalFooter';
import { useOrgTreeData } from '@/hooks/useOrgTreeData';
import I18N from '@/lang/I18N';
import { PageTypeInfo } from '@/router/utils/enums';
import { ApiLanguageSourceList, reverseHandleLangFields, Toast } from '@/utils';
import {
  baseSchema,
  activityLVMHFormSchema,
} from '@/views/components/EmissionSource/utils/schemas';
import SelectButton from '@/views/components/SelectButton';
import TemplateCollectionCard from '@/views/components/TemplateCollectionCard';
import { useRoles } from '@/views/dashborad/Role/hooks';

import style from './index.module.less';
import { getEmissionSourceDetailApi } from '../../emissionManage/service';
import { EmissionSourceTemplateResp } from '../../emissionManage/type';
import { useSetEmissionSourceInfo } from '../../hooks';
import { useComputationEnum } from '../../hooks/useComputationEnum';
import { TEMPLATE_CODE } from '../../util/constant';
import { returnReportText } from '../../util/utils';

interface EmissionSourceDetailDrawerProps {
  visible: boolean;
  emissionSourceId: number;
  actionType: PageTypeInfo;
  onClose: () => void;
}

const { show } = PageTypeInfo;

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
    Radio,
    TreeSelect,
  },
});

const EmissionSourceDetailDrawer: React.FC<EmissionSourceDetailDrawerProps> = ({
  visible,
  emissionSourceId,
  actionType,
  onClose,
}) => {
  const titleMap = {
    [show]: I18N.router.emissionSourceDetails,
  };

  /** 填报角色 */
  const roles = useRoles();

  const emissionSourceDetailData = useSetEmissionSourceInfo(emissionSourceId);

  /** 数据收集周期类型 */
  const collectCycleType = useComputationEnum({
    enumType: 'DataPeriod',
    enabled: visible,
  });

  /** 组织树数据 */
  const [orgTreeData] = useOrgTreeData();

  const form = useMemo(() => {
    return createForm({
      readPretty: !!visible,
    });
  }, [visible]);

  const [templateList, setTemplateList] = useState<
    EmissionSourceTemplateResp[]
  >([]);

  /** 获取排放源的模板收集详情数据 */
  const fetchTemplateList = async (sourceId?: number) => {
    const sourceTargetId = sourceId;
    if (sourceTargetId) {
      const { data } = await getEmissionSourceDetailApi(sourceTargetId);
      return data?.data?.templateList || [];
    }
    return Toast('error', I18N.eca.notObtained);
  };

  // 获取排放源详情
  const getEmissionSourceDetailFn = async () => {
    const {
      activityCategory,
      activityCategory_name: activityCategoryName,
      ghgCategory_name: ghgCategoryName,
      ghgClassify_name: ghgClassifyName,
      isoCategory_name: isoCategoryName,
      isoClassify_name: isoClassifyName,
      ghgCategory,
      ghgClassify,
      isoCategory,
      isoClassify,
      sourceCode,
      languageSourceList,
      roleIds,
    } = emissionSourceDetailData || {};
    const langFields = reverseHandleLangFields(
      languageSourceList as ApiLanguageSourceList[],
    );
    // 支撑材料反显处理
    form.setValues({
      ...emissionSourceDetailData,
      sourceCode,
      /** 这里剔除掉不存在角色列表的数据 */
      roleIds: roleIds
        ?.split(',')
        ?.map(Number)
        .filter(id => roles?.some(role => Number(role.id) === id)),
      ghg: [ghgCategory, ghgClassify],
      iso: [isoCategory, isoClassify],
      ...langFields,
    });
    form.setFieldState('ghg', {
      dataSource: [
        {
          value: ghgCategory,
          label: ghgCategoryName,
          children: [
            {
              value: ghgClassify,
              label: ghgClassifyName,
            },
          ],
        },
      ],
    });
    form.setFieldState('iso', {
      dataSource: [
        {
          value: isoCategory,
          label: isoCategoryName,
          children: [
            {
              value: isoClassify,
              label: isoClassifyName,
            },
          ],
        },
      ],
    });
    form.setFieldState('activityCategory', {
      dataSource: [
        {
          value: activityCategory,
          label: activityCategoryName,
        },
      ],
    });
    /** 如果是编辑，编辑角色 */
    form.setFieldState('roleIds', {
      dataSource: roles?.map(role => ({
        value: role.id,
        label: role.roleName,
      })),
    });
  };

  useEffect(() => {
    if (visible && emissionSourceId && !isEmpty(emissionSourceDetailData)) {
      getEmissionSourceDetailFn();
    }
  }, [emissionSourceId, emissionSourceDetailData, visible]);

  useEffect(() => {
    (async () => {
      if (visible) {
        const templates = await fetchTemplateList(Number(emissionSourceId));
        // 2. 处理模板列表数据
        const processedTemplates = templates?.map?.((item, index) => ({
          ...item,
          label: item?.templateName || `${TEMPLATE_CODE}${index + 1}`,
          key: `${item.id}`,
        }));
        setTemplateList(processedTemplates || []);
      } else {
        setTemplateList([]);
        form.reset();
      }
    })();
  }, [visible]);

  useEffect(() => {
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
  }, [orgTreeData, collectCycleType]);

  return (
    <CustomDrawer
      destroyOnClose
      title={titleMap[actionType as keyof typeof titleMap]}
      visible={visible}
      onClose={onClose}
      footer={
        <ModalFooter
          isView={actionType === PageTypeInfo.show}
          onCancel={onClose}
          onOk={onClose}
        />
      }
    >
      <Form form={form} previewTextPlaceholder='-'>
        <section className={style.card}>
          <h3 className={style.cardTitle}>
            <div> {I18N.Factors.basicInformation}</div> {returnReportText()}{' '}
          </h3>
          <SchemaField schema={baseSchema()} />
        </section>
        <section className={style.card}>
          <h3>{I18N.eca.activityData}</h3>
          <SchemaField schema={activityLVMHFormSchema()} />
        </section>
        {/* 模版收集 */}
        <section className={style.card}>
          <h3>{I18N.components.templateCollection}</h3>
          <TemplateCollectionCard templateList={templateList} />
        </section>
      </Form>
    </CustomDrawer>
  );
};

export default EmissionSourceDetailDrawer;

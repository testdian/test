/**
 * @description:其他配置抽屉
 */

import {
  FormItem,
  FormGrid,
  FormLayout,
  Form,
  Input,
  Select,
  Radio,
} from '@formily/antd-v5';
import { createForm, Field } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { uniqBy } from 'lodash-es';
import { FC, useEffect, useMemo } from 'react';

import CustomDrawer from '@/components/CustomDrawer';
import { FormilyCheckboxInputList } from '@/components/formily/FormilyCheckboxInputList ';
import { FormilyCheckboxList } from '@/components/formily/FormilyCheckboxList';
import I18N from '@/lang/I18N';
import { PageTypeInfo } from '@/router/utils/enums';
import { Toast } from '@/utils';
import { getButtonText } from '@/utils/buttonText';
import { useEmissionSourceList } from '@/views/eca/hooks/useEmissionList';

import { schema } from './schemas';
import { CONFIG_TYPE } from '../constant';
import {
  addConfigurationApi,
  editConfigurationApi,
  getConfigurationDetailApi,
  getConfigurationListByEmissionSourceApi,
} from '../service';
import { ConfigurationResp } from '../type';
import style from './index.module.less';

const { FIXED_VALUE, MAPPING_RELATION } = CONFIG_TYPE;

interface ConfigDrawerProps {
  /** 数据ID */
  dataId: number;
  /** 当前抽屉展开的状态类型值：新增、编辑、查看 */
  actionType: PageTypeInfo;
  visible: boolean;
  /** 保存方法 */
  onOk: () => void;
  /** 取消方法 */
  onClose: () => void;
}

const SchemaField = createSchemaField({
  components: {
    Form,
    FormItem,
    FormGrid,
    FormLayout,
    Input,
    Select,
    Radio,
    FormilyCheckboxList,
    FormilyCheckboxInputList,
  },
});

const titleMapping: { [key in PageTypeInfo]?: string } = {
  add: '新增配置',
  edit: '编辑配置',
  show: '查看配置',
};

const { add, edit, show } = PageTypeInfo;

const ConfigDrawer: FC<ConfigDrawerProps> = ({
  dataId,
  actionType,
  visible,
  onClose,
  onOk,
}) => {
  const [emissionList] = useEmissionSourceList({
    mountRequest: true,
  });

  const isAdd = actionType === add;

  /** 渲染抽屉标题 */
  const drawerTitle = titleMapping[actionType] || '其他配置';

  const form = useMemo(
    () =>
      createForm({
        readPretty: actionType === show,
      }),
    [visible],
  );

  /** 保存时的api接口 */
  const postApi = {
    [add]: addConfigurationApi,
    [edit]: editConfigurationApi,
  };

  /** 保存时的文案 */
  const saveToastText = {
    [add]: I18N.Factors.newSuccessfullyAdded,
    [edit]: I18N.dashborad.modifiedSuccessfully,
  };

  /** 审批设置详情 */
  useEffect(() => {
    if (!visible) return;

    if (!isAdd && dataId) {
      getConfigurationDetailApi({
        id: dataId,
      }).then(({ data }) => {
        form.setValues(data?.data);
      });
    }
  }, [isAdd, dataId, visible]);

  /** 关闭弹窗初始化 */
  const onCloseInit = () => {
    form.reset();
    onClose();
  };

  const saveDataAcForm = async () => {
    const values = await form.submit<ConfigurationResp>();

    const { paramConfigType } = values || {};

    /** 是固定值 */
    const isFixedValue = paramConfigType === FIXED_VALUE;

    /** 是映射关系 */
    const isMappingRelation = paramConfigType === MAPPING_RELATION;

    // 映射关系时，检查主要参数和关联参数是否有重复
    if (isMappingRelation) {
      const mainParamCodeList = values.mainParamCodeList || [];
      const associatedParamCodeList = values.associatedParamCodeList || [];

      // 检查是否有重复值
      const hasDuplicate = mainParamCodeList.some(code =>
        associatedParamCodeList.includes(code),
      );

      if (hasDuplicate) {
        Toast('error', '主要参数与关联参数不可重复');
        return;
      }
    }

    const result = {
      ...values,
      // 固定值-选择参数
      mainParamList: isFixedValue ? values.mainParamList : [],
      // 映射关系-选择主要参数
      mainParamCodeList: isMappingRelation ? values.mainParamCodeList : [],
      // 映射关系-选择关联参数
      associatedParamCodeList: isMappingRelation
        ? values.associatedParamCodeList
        : [],
    };
    const api = postApi[actionType as keyof typeof postApi];
    await api(result);
    Toast('success', saveToastText[actionType as keyof typeof saveToastText]);
    onOk();
  };

  /** 根据emissionSourceId查询参数列表 */
  const useAsyncParamListDataSource = () => async (field: Field) => {
    /** 选中的emissionSourceId */
    const selectEmissionSourceId = field?.form?.getValuesIn('emissionSourceId');

    if (!selectEmissionSourceId) {
      /** 设置参数列表 */
      field.setDataSource([]);
      return;
    }

    /** 查询对应枚举值 */
    const { data } = await getConfigurationListByEmissionSourceApi({
      emissionSourceId: selectEmissionSourceId,
    });
    const dataSource = data?.data?.map(item => ({
      label: `${item.paramName}`,
      value: item.paramCode,
    }));

    const uniqDataSource = uniqBy(dataSource, 'value');

    /** 设置参数列表 */
    field.setDataSource(uniqDataSource);
  };

  useEffect(() => {
    if (!visible) return;

    if (emissionList) {
      form.setFieldState('emissionSourceId', {
        dataSource: emissionList?.map(item => ({
          label: item.sourceName,
          value: item.id,
        })),
      });
    }
  }, [visible, emissionList]);

  return (
    <CustomDrawer
      title={drawerTitle}
      isDetail={actionType === PageTypeInfo.show}
      visible={visible}
      onClose={onCloseInit}
      onSave={saveDataAcForm}
      saveBtnText={getButtonText(actionType)}
    >
      <p className={style.tip}>
        当配置了单独年份的数据时，则优先使用单独年份，否则使用每年通用的数据。
      </p>
      <Form form={form} previewTextPlaceholder='-'>
        <SchemaField
          schema={schema()}
          scope={{ useAsyncParamListDataSource }}
        />
      </Form>
    </CustomDrawer>
  );
};

export default ConfigDrawer;

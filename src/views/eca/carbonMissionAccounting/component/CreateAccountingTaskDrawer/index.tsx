import {
  FormItem,
  FormGrid,
  FormLayout,
  Select,
  NumberPicker,
  Radio,
  Form,
  Input,
  TreeSelect,
} from '@formily/antd-v5';
import { createForm, Field, onFieldValueChange } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { isArray, isEmpty } from 'lodash-es';
import { useState, useEffect, useMemo } from 'react';

import CustomDrawer from '@/components/CustomDrawer';
import { FormilyTree } from '@/components/formily/FormilyTree';
import { useOrgVersionData } from '@/hooks/useOrgVersionData';
import I18N from '@/lang/I18N';
import { PageTypeInfo } from '@/router/utils/enums';
import { DictDataResp, getSystemDictdataPage } from '@/sdks/systemV2ApiDocs';
import { Toast } from '@/utils';
import { getButtonText } from '@/utils/buttonText';
import { useOrgTree } from '@/views/eca/hooks/useOrgTree';

import styles from './index.module.less';
import { accountSchema } from './schema';
import { addComputationDataApi, editComputationDataApi } from '../../service';
import { AccountYearComputation, AccountingModelDataDatum } from '../../type';

const { add, edit, show } = PageTypeInfo;

export const DataPeriodType = { year: 1 };

const SchemaField = createSchemaField({
  components: {
    FormItem,
    FormGrid,
    FormLayout,
    Input,
    Select,
    NumberPicker,
    Radio,
    TreeSelect,
    FormilyTree,
  },
});

const CreateAccountingTaskDrawer: React.FC<{
  /** 核算信息 */
  accountingInfo: AccountYearComputation;
  /** 年份 */
  year: number;
  /** 列表操作按钮的类型 */
  actionBtnType: PageTypeInfo;
  visible: boolean;
  onClose: () => void;
  /** 保存成功回调 */
  onSuccessSave: (values: AccountingModelDataDatum) => void;
}> = ({
  visible,
  year,
  accountingInfo,
  actionBtnType,
  onClose,
  onSuccessSave,
}) => {
  const isDetail = actionBtnType === show;
  const isEdit = actionBtnType === edit;

  const titleMap = {
    [add]: I18N.eca.addAccounting,
    [edit]: I18N.eca.editAccounting,
    [show]: I18N.eca.accountingDetails,
  };

  const apiMap = {
    [add]: addComputationDataApi,
    [edit]: editComputationDataApi,
  };

  const form = useMemo(() => {
    return createForm({
      readPretty: isDetail,
      initialValues: {
        year,
      },
      effects() {
        // 监听组织版本变化，清空组织树选中值
        onFieldValueChange('orgVersion', (field, currentForm) => {
          if (field?.selfModified) {
            currentForm.setFieldState('orgCodeList', {
              value: [],
            });
          }
        });
      },
    });
  }, [isDetail, visible]);

  const [gwpVersion, setGwpVersion] = useState<DictDataResp[]>([]);

  /** 组织版本数据 */
  const [versionData, refreshVersionData] = useOrgVersionData(false);

  /** 组织树数据 */
  const [, refreshOrgTree] = useOrgTree({
    orgVersion: '',
    mountRequest: false,
  });

  const handleSubmit = async (values: AccountingModelDataDatum) => {
    const api = apiMap[actionBtnType as keyof typeof apiMap];
    await api({ ...values, id: accountingInfo?.id });
    onSuccessSave(values);
  };

  /** 获取gwp 信息 */
  const getGwpVersion = async () => {
    const { data } = await getSystemDictdataPage({
      pageNum: 1,
      pageSize: 100000,
      dictType: 'gwp',
    });
    setGwpVersion(data?.data?.list || []);
  };

  /** 根据选择的版本设置组织树数据 */
  const useAsyncOrgDataSource = () => async (field: Field) => {
    /** 当前版本 */
    const currentOrgVersion = field?.form?.getValuesIn('orgVersion');

    const result = await refreshOrgTree({ orgVersion: currentOrgVersion });

    const dataSource =
      result?.[0]?.children?.map(item => {
        return {
          ...item,
          disabled: !item.hasPerm,
        };
      }) || [];

    /** 设置组织树数据 */
    field.setDataSource(dataSource);
  };

  /** 设置表单枚举值 */
  useEffect(() => {
    if (!visible) return;

    /** gwp版本枚举值 */
    if (gwpVersion.length) {
      form.setFieldState('gwpVersion', {
        dataSource: gwpVersion?.map(item => ({
          label: item.dictLabel,
          value: item.dictValue,
        })),
      });
    }

    /** 组织版本数据 */
    if (versionData.length) {
      form.setFieldState('orgVersion', {
        dataSource: versionData,
      });
    }
  }, [gwpVersion, versionData, visible]);

  /** 初始化数据 */
  useEffect(() => {
    if (visible) {
      getGwpVersion();
      refreshVersionData();

      // 直接初始化表单数据
      if (accountingInfo) {
        form.setValues({
          ...accountingInfo,
        });
      }
    } else {
      form.reset();
    }
  }, [visible, accountingInfo]);

  return (
    <CustomDrawer
      width='50%'
      title={titleMap[actionBtnType as keyof typeof titleMap]}
      onClose={onClose}
      visible={visible}
      onSave={async () => {
        const values = await form.submit<AccountingModelDataDatum>();
        const { orgCodeList } = values;

        const orgs = isArray(orgCodeList)
          ? orgCodeList
          : orgCodeList?.checked || [];

        if (isEmpty(orgs)) {
          Toast('error', '请选择组织');
          return;
        }

        const result = {
          ...values,
          orgCodeList: orgs,
        };
        handleSubmit(result);
      }}
      isDetail={isDetail}
      saveBtnText={getButtonText(actionBtnType)}
    >
      {isEdit && (
        <div className={styles.tipWrapper}>
          <p>提示：</p>
          <p>
            如您在当前组织树版本中新增组织，则不影响已经核算的其他组织数据。
          </p>
          <p>
            如您在当前组织树版本中删除组织，则该组织已经核算的数据将被删除。
          </p>
          <p>如您选择切换组织树版本，则当前全部核算数据将被删除。</p>
          <p>点击下方确认按钮后即生效，请您谨慎操作。</p>
        </div>
      )}
      <Form form={form} previewTextPlaceholder='-'>
        <SchemaField
          schema={accountSchema()}
          scope={{ useAsyncOrgDataSource }}
        />
      </Form>
    </CustomDrawer>
  );
};

export default CreateAccountingTaskDrawer;

/**
 * @description Code配置页面
 */

import {
  ModalForm,
  ProForm,
  ProFormTextArea,
} from '@ant-design/pro-components';
import I18N from '@src/lang/I18N';
import { Form } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Page } from '@/components/Page';
import { CustomTableRender } from '@/components/x-render/TableRender';
import { useTableRef as useTable } from '@/components/x-render/TableRender/hook/useTableRef';
import { CustomSearchProps } from '@/components/x-render/TableRender/types';
import { checkAuth } from '@/layout/utills';
import { RouteMaps } from '@/router/utils/enums';
import { modal } from '@/store/module/notification';
import { getSearchParams, Toast } from '@/utils';

import { columns } from './columns';
import { codeConfigurationSearchSchema } from './searchSchemas';
import {
  editCodeConfigurationApi,
  exportCodeConfigurationApi,
  getCodeConfigurationListApi,
} from './service';
import { CodeConfigurationListParams, CodeConfigurationListType } from './type';

const CodeConfiguration = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm<CodeConfigurationListType>();
  const [visible, setVisible] = useState(false);
  const [codeRecordInfo, setCodeRecordInfo] =
    useState<CodeConfigurationListType | null>(null);

  const { tableRef } = useTable();

  const searchApi: CustomSearchProps<
    CodeConfigurationListType,
    CodeConfigurationListParams
  > = args =>
    getCodeConfigurationListApi(args).then(({ data }) => {
      return data?.data || [];
    });

  const editCodeFn = (record: CodeConfigurationListType) => {
    setCodeRecordInfo(record);
    setVisible(true);
    form.setFieldsValue(record);
  };

  useEffect(() => {
    if (!visible) {
      form.resetFields();
      setCodeRecordInfo(null);
    }
  }, [visible]);

  return (
    <Page
      title={I18N.router.codeCode}
      onBtnClick={async () => {
        const searchParam = getSearchParams()[0];
        await exportCodeConfigurationApi({ ...searchParam });
        modal.confirm({
          title: I18N.dashborad.codeGuide,
          content: I18N.dashborad.codeGuide2,
          okText: I18N.base.confirm,
          cancelText: I18N.Factors.cancel,
          onOk: async () => {
            navigate(RouteMaps.systemDownload);
          },
        });
      }}
      actionBtnChild={checkAuth('/code/export', <div>{I18N.eca.export}</div>)}
    >
      <CustomTableRender
        tableRef={tableRef}
        searchProps={{
          schema: codeConfigurationSearchSchema(),
          api: searchApi,
        }}
        tableProps={{
          columns: columns(editCodeFn),
          scroll: { x: 1600 },
        }}
        autoSaveSearchInfo
        autoAddIndexColumn
        autoFixNoText
      />
      <ModalForm<CodeConfigurationListType>
        title={I18N.Factors.edit}
        open={visible}
        form={form}
        autoFocusFirstInput
        modalProps={{
          destroyOnClose: true,
          onCancel: () => {
            setVisible(false);
          },
        }}
        submitTimeout={2000}
        onFinish={async values => {
          await editCodeConfigurationApi({
            ...codeRecordInfo,
            ...values,
          });
          Toast('success', I18N.dashborad.editSuccessful);
          setVisible(false);
          tableRef?.current?.refresh();
        }}
      >
        <ProForm.Group>
          <ProFormTextArea
            width='md'
            name='codeDesc'
            label={I18N.dashborad.chineseDescription}
            placeholder={I18N.dashborad.chineseDescription}
            rules={[
              { required: true, message: I18N.dashborad.pleaseEnterChinese },
            ]}
            fieldProps={{
              maxLength: 1000,
            }}
          />

          <ProFormTextArea
            width='md'
            name='codeDescEn'
            label={I18N.dashborad.description}
            placeholder={I18N.dashborad.description}
            rules={[
              { required: true, message: I18N.dashborad.pleaseEnterEnglish },
            ]}
            fieldProps={{
              maxLength: 1000,
            }}
          />
        </ProForm.Group>
      </ModalForm>
    </Page>
  );
};

export default CodeConfiguration;

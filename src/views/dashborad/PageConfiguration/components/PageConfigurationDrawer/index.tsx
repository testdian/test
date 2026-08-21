/**
 * @description:页面配置抽屉
 */

import {
  FormItem,
  FormGrid,
  FormLayout,
  Form,
  NumberPicker,
} from '@formily/antd-v5';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import I18N from '@src/lang/I18N';
import { Input } from 'antd';
import { FC, useEffect, useMemo } from 'react';
import xss from 'xss';

import CustomDrawer from '@/components/CustomDrawer';
import FormilyMyEditor from '@/components/formily/FormilyMyEditor';
import {
  decodeHTML,
  htmlToContent,
} from '@/components/formily/FormilyMyEditor/utils';
import { PageTypeInfo } from '@/router/utils/enums';
import { Toast } from '@/utils';
import { getButtonText } from '@/utils/buttonText';

import { schema } from './schema';
import {
  addPageConfigurationApi,
  editPageConfigurationApi,
  getPageConfigurationDetailApi,
} from '../../service';
import { PageConfigurationListType } from '../../type';

interface DataAcquisitionDrawerProps {
  /** 抽屉的显隐 */
  visible: boolean;
  /** 当前点击的页面配置的id */
  dataFiledId: number;
  /** 当前抽屉展开的状态类型值：新增、编辑、查看 */
  pageConfigurationActionType: PageTypeInfo;
  /** 保存方法 */
  onOk: () => void;
  /** 取消方法 */
  onClose: () => void;
}

const SchemaField = createSchemaField({
  components: {
    Input,
    Form,
    FormItem,
    FormGrid,
    FormLayout,
    FormilyMyEditor,
    NumberPicker,
  },
});

const titleMapping: { [key in PageTypeInfo]?: string } = {
  add: I18N.dashborad.addPageConfiguration,
  edit: I18N.dashborad.editPageConfiguration,
  show: I18N.dashborad.pageConfigurationDetails,
};

const { add, edit, show } = PageTypeInfo;

const PageConfigurationDrawer: FC<DataAcquisitionDrawerProps> = ({
  dataFiledId,
  pageConfigurationActionType,
  visible,
  onClose,
  onOk,
}) => {
  const isAdd = pageConfigurationActionType === add;

  const form = useMemo(
    () =>
      createForm({
        readPretty: pageConfigurationActionType === show,
      }),
    [pageConfigurationActionType],
  );
  /** 渲染抽屉标题 */
  const drawerTitle =
    titleMapping[pageConfigurationActionType] ||
    I18N.dashborad.pageConfiguration;

  /** 保存时的api接口 */
  const postApi = {
    [add]: addPageConfigurationApi,
    [edit]: editPageConfigurationApi,
  };

  useEffect(() => {
    if (visible) {
      if (!isAdd) {
        getPageConfigurationDetailApi(dataFiledId.toString()).then(
          ({ data }) => {
            form.setValues({
              ...data?.data,
              content: xss(decodeHTML(data.data?.content || '')),
              contentEn: xss(decodeHTML(data.data?.contentEn || '')),
            });
          },
        );
      }
    } else {
      form.reset();
    }
  }, [form, visible, dataFiledId, pageConfigurationActionType]);

  /** 保存页面配置 */
  const saveDataAcForm = async () => {
    const values = await form.submit<PageConfigurationListType>();
    const cmsContent = xss(htmlToContent(values.content || ''));
    const cmsContentEn = xss(htmlToContent(values.contentEn || ''));
    const api = postApi[pageConfigurationActionType as keyof typeof postApi];
    await api({ ...values, content: cmsContent, contentEn: cmsContentEn });
    Toast('success', I18N.Factors.saveSuccessful);
    onOk();
  };

  return (
    <CustomDrawer
      title={drawerTitle}
      isDetail={pageConfigurationActionType === PageTypeInfo.show}
      visible={visible}
      onClose={() => {
        form.reset();
        onClose();
      }}
      onSave={saveDataAcForm}
      saveBtnText={getButtonText(pageConfigurationActionType)}
    >
      <Form form={form} previewTextPlaceholder='-'>
        <SchemaField schema={schema} />
      </Form>
    </CustomDrawer>
  );
};

export default PageConfigurationDrawer;

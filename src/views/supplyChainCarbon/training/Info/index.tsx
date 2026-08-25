/**
 * @description 培训资料新增/编辑/查看
 */
import { Form, Input, message } from 'antd';
import { useEffect, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { MyEditor } from '@/components/formily/FormilyMyEditor/RichEditor';
import { decodeHTML } from '@/components/formily/FormilyMyEditor/utils';
import { FormActions } from '@/components/FormActions';
import { ModifyNote } from '@/components/ModifyNote';
import { Page } from '@/components/Page';
import { PageTypeInfo, RouteMaps } from '@/router/utils/enums';
import { routeTypeNameRender } from '@/router/utils/index';
import { SupplyChainRefRouteMaps } from '@/router/utils/supplyChainRefEnums';
import { SupplyChainSupplierRouteMaps } from '@/router/utils/supplyChainSupplierEnums';
import {
  readStoredUserRole,
  ROLE_INFO,
  useUserRole,
} from '@/views/supplyChainCarbon/hooks/useUserRole';
import { useDemoStore } from '@/views/supplyChainCarbon/hooks/useDemoStore';
import styles from '@/views/supplyChainCarbon/styles.module.less';

const MAX_TEXT_LENGTH = 100;

const TRAINING_FORM_NOTE =
  '资料名称，文本框，必输，不超过100个字符；内容摘要，文本框，必输，不超过100个字符；培训内容，富文本框，必输';

const textFieldRules = (label: string) => [
  { required: true, message: `请输入${label}` },
  { max: MAX_TEXT_LENGTH, message: `${label}不超过${MAX_TEXT_LENGTH}个字符` },
];

const isEmptyRichText = (html?: string) => {
  if (!html?.trim()) return true;
  const text = html
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .trim();
  return !text;
};

type TrainingRichEditorProps = {
  value?: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
};

function TrainingRichEditor({
  value,
  onChange,
  readOnly,
}: TrainingRichEditorProps) {
  return (
    <MyEditor
      defaultHtml={value}
      onChange={onChange}
      readOnly={readOnly}
      wrapperStyle={{ height: 400 }}
    />
  );
}

export default function TrainingInfoPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin } = useUserRole();
  const { pageTypeInfo, id } = useParams<{
    pageTypeInfo: PageTypeInfo;
    id: string;
  }>();
  const [form] = Form.useForm<{
    title: string;
    summary: string;
    content: string;
  }>();
  const { data, update, ready } = useDemoStore();

  const isAdd = pageTypeInfo === PageTypeInfo.add;
  const isShow = pageTypeInfo === PageTypeInfo.show;
  const trainingId = Number(id);

  const training = useMemo(() => {
    if (isAdd) return null;
    return data.trainings.find(item => item.id === trainingId) ?? null;
  }, [data.trainings, isAdd, trainingId]);

  useEffect(() => {
    if (!training || isAdd) return;
    form.setFieldsValue({
      title: training.title,
      summary: training.summary,
      content: training.content,
    });
  }, [training, isAdd, form]);

  const title = isAdd ? '新增培训资料' : routeTypeNameRender('培训资料');

  const handleSave = async () => {
    const values = await form.validateFields();
    const today = new Date().toISOString().slice(0, 10);
    const payload = {
      title: values.title.trim(),
      type: training?.type || '培训资料',
      summary: values.summary.trim(),
      content: values.content,
      attachment_name:
        training?.attachment_name || `${values.title.trim()}.html`,
      attachments: training?.attachments || [],
      status: 'published' as const,
      applicable: 'all',
      updated_at: today,
      updated_by: ROLE_INFO[readStoredUserRole()].label,
    };

    if (isAdd) {
      update(d => {
        const newId = d.nextId.training++;
        return {
          ...d,
          trainings: [
            ...d.trainings,
            { id: newId, ...payload, created_at: today },
          ],
        };
      });
      message.success('培训资料已添加');
    } else if (training) {
      update(d => ({
        ...d,
        trainings: d.trainings.map(item =>
          item.id === training.id ? { ...item, ...payload } : item,
        ),
      }));
      message.success('培训资料已更新');
    }
    navigate(SupplyChainRefRouteMaps.training);
  };

  const fromHome =
    isShow && (location.state as { from?: string } | null)?.from === 'home';
  let backPath: string = isAdmin
    ? SupplyChainRefRouteMaps.training
    : SupplyChainSupplierRouteMaps.training;
  if (fromHome) {
    backPath = isAdmin
      ? RouteMaps.home
      : SupplyChainSupplierRouteMaps.workbench;
  }

  if (!ready) return null;
  if (!isAdd && !training) {
    return <Page title='培训资料'>未找到该资料</Page>;
  }

  if (isShow && training) {
    return (
      <Page
        title=''
        wrapperClass={`marginBottomFormActionsHeight ${styles.trainingDetailPage}`}
      >
        <div className={styles.trainingDetail}>
          <div className={styles.trainingDetailHeader}>
            <h1 className={styles.trainingDetailTitle}>{training.title}</h1>
            <div className={styles.trainingDetailTime}>
              {training.updated_at || training.created_at}
            </div>
          </div>
          <div
            className={styles.richContent}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: decodeHTML(training.content),
            }}
          />
        </div>
        <FormActions
          place='center'
          buttons={[
            {
              title: '返回',
              onClick: async () => navigate(backPath),
            },
          ]}
        />
      </Page>
    );
  }

  return (
    <Page
      title={
        <span style={{ display: 'inline-flex', alignItems: 'center' }}>
          {title}
          <ModifyNote content={TRAINING_FORM_NOTE} />
        </span>
      }
      wrapperClass='marginBottomFormActionsHeight'
    >
      <div className={styles.formPage}>
        <Form form={form} layout='vertical'>
          <Form.Item
            name='title'
            label='资料名称'
            rules={textFieldRules('资料名称')}
          >
            <Input
              placeholder='请输入资料名称'
              maxLength={MAX_TEXT_LENGTH}
              showCount
            />
          </Form.Item>
          <Form.Item
            name='summary'
            label='内容摘要'
            rules={textFieldRules('内容摘要')}
          >
            <Input
              placeholder='请输入内容摘要'
              maxLength={MAX_TEXT_LENGTH}
              showCount
            />
          </Form.Item>
          <Form.Item
            name='content'
            label='培训内容'
            required
            rules={[
              {
                validator: (_, value?: string) =>
                  isEmptyRichText(value)
                    ? Promise.reject(new Error('请输入培训内容'))
                    : Promise.resolve(),
              },
            ]}
          >
            <TrainingRichEditor />
          </Form.Item>
        </Form>
        <FormActions
          place='center'
          buttons={[
            {
              title: '返回',
              onClick: async () => navigate(backPath),
            },
            {
              title: '保存',
              type: 'primary' as const,
              onClick: async () => handleSave(),
            },
          ]}
        />
      </div>
    </Page>
  );
}

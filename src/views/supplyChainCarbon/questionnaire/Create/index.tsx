/**
 * @description 新增/编辑调研填报任务
 */
import {
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Space,
  Tooltip,
  TreeSelect,
  message,
} from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import dayjs, { type Dayjs } from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { Page } from '@/components/Page';
import { FormActions } from '@/components/FormActions';
import { FormLabelWithNote, ModifyNote } from '@/components/ModifyNote';
import { useOrgTreeData } from '@/hooks/useOrgTreeData';
import type { OrgTree } from '@/hooks/useOrgTreeData/type';
import { SupplyChainRefRouteMaps } from '@/router/utils/supplyChainRefEnums';
import { FormFieldInputs } from '@/views/supplyChainCarbon/components/FormFieldInputs';
import { normalizeFormTemplate } from '@/views/supplyChainCarbon/data/demo-data';
import {
  publishQuestionnaire,
  saveQuestionnaireTemplate,
  upsertQuestionnaireBasic,
} from '@/views/supplyChainCarbon/data/demo-questionnaires';
import { useDemoStore } from '@/views/supplyChainCarbon/hooks/useDemoStore';
import styles from '@/views/supplyChainCarbon/styles.module.less';

const MAX_NAME_LENGTH = 100;
const MAX_DESCRIPTION_LENGTH = 500;

const ORGANIZATION_NOTE = '所属组织为组织管理全部组织，下拉，单选，必选';
const NAME_NOTE = '任务名称，文本框，不超过100个字符，必输';
const DESCRIPTION_NOTE = '任务说明，必填，文本框，不超过500个字符';
const DEADLINE_NOTE =
  '截止日期，年月日，必输，气泡提示：在截止日期前3天、当天如仍未收到数据，则系统自动发送邮件提醒。';
const DEADLINE_TOOLTIP =
  '在截止日期前3天、当天如仍未收到数据，则系统自动发送邮件提醒。';
const SUPPLIER_SELECT_NOTE =
  '供应商名称，下拉选项，枚举值是这个表单模版关联的供应商类别下的所有供应商名称（供应商编码），允许多选，允许模糊搜索，默认是一键全选';
const PREVIEW_NOTE =
  '顶部居中展示任务名称标题，再展示所属组织、截止日期，然后展示任务说明，最后展示表单字段；左侧填写实时同步到预览区';

function orgTreeWithNameValue(nodes: OrgTree[]): OrgTree[] {
  return nodes.map(node => ({
    ...node,
    label: node.name,
    value: node.name,
    children: node.children?.length
      ? orgTreeWithNameValue(node.children)
      : undefined,
  }));
}

type BasicInfo = {
  name: string;
  organization: string;
  deadline: Dayjs | null;
  description: string;
};

export default function QuestionnaireCreatePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const isEdit = location.pathname.includes('/edit');
  const editId = id ? Number(id) : null;

  const { data, update, ready } = useDemoStore();
  const [questionnaireId, setQuestionnaireId] = useState<number | null>(editId);
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(
    null,
  );
  const [selectedSuppliers, setSelectedSuppliers] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialized, setInitialized] = useState(!isEdit);
  const [previewValues, setPreviewValues] = useState<
    Record<string, string | number>
  >({});

  const [basicForm] = Form.useForm<BasicInfo>();
  const [orgTreeData] = useOrgTreeData();
  const watchedBasic = Form.useWatch([], basicForm);

  const orgTreeOptions = useMemo(
    () => orgTreeWithNameValue(orgTreeData),
    [orgTreeData],
  );

  const initialQuestionnaire = useMemo(() => {
    if (!editId) return null;
    return data.questionnaires.find(q => q.id === editId) ?? null;
  }, [data.questionnaires, editId]);

  useEffect(() => {
    if (!isEdit || !ready || !initialQuestionnaire || initialized) return;
    setQuestionnaireId(initialQuestionnaire.id);
    setSelectedTemplateId(initialQuestionnaire.template_id);
    setSelectedSuppliers(initialQuestionnaire.supplier_ids ?? []);
    basicForm.setFieldsValue({
      name: initialQuestionnaire.name,
      organization: initialQuestionnaire.organization ?? undefined,
      deadline: initialQuestionnaire.deadline
        ? dayjs(initialQuestionnaire.deadline)
        : null,
      description: initialQuestionnaire.description ?? '',
    });
    setInitialized(true);
  }, [isEdit, ready, initialQuestionnaire, initialized, basicForm]);

  const selectedTemplate = data.formTemplates.find(
    t => t.id === selectedTemplateId,
  );

  const categorySuppliers = useMemo(() => {
    if (!selectedTemplate) return [];
    return data.demoSuppliers.filter(
      s => s.category === selectedTemplate.category,
    );
  }, [data.demoSuppliers, selectedTemplate]);

  const categorySupplierOptions = useMemo(
    () =>
      categorySuppliers.map(s => ({
        label: `${s.name}（${s.srm_code || '-'}）`,
        value: s.id,
      })),
    [categorySuppliers],
  );

  const categorySupplierIds = useMemo(
    () => categorySuppliers.map(s => s.id),
    [categorySuppliers],
  );

  const handleTemplateChange = (templateId: number) => {
    setSelectedTemplateId(templateId);
    setPreviewValues({});
    const template = data.formTemplates.find(t => t.id === templateId);
    if (!template) {
      setSelectedSuppliers([]);
      return;
    }
    const ids = data.demoSuppliers
      .filter(s => s.category === template.category)
      .map(s => s.id);
    setSelectedSuppliers(ids);
  };

  const normalizedTemplate = useMemo(
    () => (selectedTemplate ? normalizeFormTemplate(selectedTemplate) : null),
    [selectedTemplate],
  );

  const previewFields = useMemo(
    () =>
      normalizedTemplate
        ? normalizedTemplate.sections.flatMap(section =>
            section.fields.map(field => ({ ...field, sectionId: section.id })),
          )
        : [],
    [normalizedTemplate],
  );

  const previewSections = useMemo(
    () =>
      normalizedTemplate
        ? normalizedTemplate.sections.map(section => ({
            id: section.id,
            name: section.name,
          }))
        : [],
    [normalizedTemplate],
  );

  const persistQuestionnaire = (
    d: typeof data,
    qid: number,
    values: BasicInfo,
    template?: (typeof data.formTemplates)[number],
  ) => {
    const result = upsertQuestionnaireBasic(d, qid, {
      name: values.name.trim(),
      organization: values.organization,
      deadline: values.deadline ? values.deadline.format('YYYY-MM-DD') : null,
      description: values.description || '',
    });
    let next = result.data;
    const targetId = result.questionnaireId;
    if (template) {
      next = saveQuestionnaireTemplate(next, targetId, template);
    }
    return { next, targetId };
  };

  const handleSaveDraft = async () => {
    const values = await basicForm.validateFields();
    if (!values.name?.trim()) {
      message.error('请输入任务名称');
      return;
    }

    const template = selectedTemplateId
      ? data.formTemplates.find(t => t.id === selectedTemplateId)
      : undefined;

    setIsSubmitting(true);
    try {
      update(d => {
        const { next, targetId } = persistQuestionnaire(
          d,
          questionnaireId,
          values,
          template,
        );
        if (selectedSuppliers.length === 0) return next;
        return {
          ...next,
          questionnaires: next.questionnaires.map(q =>
            q.id === targetId
              ? { ...q, supplier_ids: selectedSuppliers }
              : q,
          ),
        };
      });
      message.success('草稿已保存');
      navigate(SupplyChainRefRouteMaps.questionnaire);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublish = async () => {
    const values = await basicForm.validateFields();
    if (!selectedTemplateId) {
      message.error('请选择表单模板');
      return;
    }
    if (selectedSuppliers.length === 0) {
      message.error('请至少选择一个供应商');
      return;
    }

    const template = data.formTemplates.find(t => t.id === selectedTemplateId);
    if (!template) {
      message.error('表单模板不存在');
      return;
    }

    setIsSubmitting(true);
    try {
      update(d => {
        const { next, targetId } = persistQuestionnaire(
          d,
          questionnaireId,
          values,
          template,
        );
        return publishQuestionnaire(next, targetId, selectedSuppliers);
      });
      message.success('调研填报任务发布成功');
      navigate(SupplyChainRefRouteMaps.questionnaire);
    } finally {
      setIsSubmitting(false);
    }
  };

  const previewDeadline = watchedBasic?.deadline
    ? dayjs(watchedBasic.deadline).format('YYYY-MM-DD')
    : '-';

  const handleSelectAllSuppliers = () => {
    setSelectedSuppliers(categorySupplierIds);
  };

  if (!ready || (isEdit && !initialized)) return null;
  if (isEdit && !initialQuestionnaire) {
    return <Page title='编辑调研填报任务'>未找到该任务</Page>;
  }

  const title = isEdit ? '编辑调研填报任务' : '新增调研填报任务';

  return (
    <Page title={title} wrapperClass='marginBottomFormActionsHeight'>
      <div className={styles.questionnaireCreateLayout}>
        <div className={styles.questionnaireCreateMain}>
          <div className={styles.pageSection}>
            <div className={styles.sectionTitle}>基础信息</div>
            <div className={styles.formPage}>
              <Form form={basicForm} layout='vertical'>
                <Form.Item
                  name='name'
                  label={
                    <FormLabelWithNote label='任务名称' note={NAME_NOTE} />
                  }
                  rules={[
                    { required: true, message: '请输入任务名称' },
                    {
                      max: MAX_NAME_LENGTH,
                      message: `任务名称不超过${MAX_NAME_LENGTH}个字符`,
                    },
                  ]}
                >
                  <Input
                    placeholder='请输入任务名称'
                    maxLength={MAX_NAME_LENGTH}
                    showCount
                  />
                </Form.Item>
                <Form.Item
                  name='organization'
                  label={
                    <FormLabelWithNote
                      label='所属组织'
                      note={ORGANIZATION_NOTE}
                    />
                  }
                  rules={[{ required: true, message: '请选择所属组织' }]}
                >
                  <TreeSelect
                    placeholder='请选择所属组织'
                    treeData={orgTreeOptions}
                    showSearch
                    treeNodeFilterProp='label'
                    treeDefaultExpandAll
                    allowClear
                  />
                </Form.Item>
                <Form.Item
                  name='deadline'
                  label={
                    <span
                      style={{ display: 'inline-flex', alignItems: 'center' }}
                    >
                      <FormLabelWithNote
                        label='截止日期'
                        note={DEADLINE_NOTE}
                      />
                      <Tooltip title={DEADLINE_TOOLTIP}>
                        <QuestionCircleOutlined
                          style={{
                            marginLeft: 4,
                            color: 'rgba(0, 0, 0, 0.45)',
                            cursor: 'help',
                          }}
                        />
                      </Tooltip>
                    </span>
                  }
                  rules={[{ required: true, message: '请选择截止日期' }]}
                >
                  <DatePicker style={{ width: '100%' }} format='YYYY-MM-DD' />
                </Form.Item>
                <Form.Item
                  name='description'
                  label={
                    <FormLabelWithNote
                      label='任务说明'
                      note={DESCRIPTION_NOTE}
                    />
                  }
                  rules={[
                    { required: true, message: '请输入任务说明' },
                    {
                      max: MAX_DESCRIPTION_LENGTH,
                      message: `任务说明不超过${MAX_DESCRIPTION_LENGTH}个字符`,
                    },
                  ]}
                >
                  <Input.TextArea
                    rows={4}
                    maxLength={MAX_DESCRIPTION_LENGTH}
                    showCount
                    placeholder='请输入任务说明'
                  />
                </Form.Item>
              </Form>
            </div>

            <div className={styles.sectionTitle}>引用模板</div>
            <div className={styles.formPage}>
              <Form layout='vertical'>
                <Form.Item label='表单模板' required>
                  <Select
                    placeholder='请选择表单模板'
                    value={selectedTemplateId ?? undefined}
                    onChange={handleTemplateChange}
                    options={data.formTemplates.map(t => ({
                      label: `${t.category} · ${t.name}`,
                      value: t.id,
                    }))}
                  />
                </Form.Item>
              </Form>
            </div>

            <div className={styles.sectionTitle}>选择供应商</div>
            <div className={styles.formPage}>
              <Form layout='vertical'>
                <Form.Item
                  label={
                    <FormLabelWithNote
                      label='供应商名称'
                      note={SUPPLIER_SELECT_NOTE}
                    />
                  }
                  required
                >
                  <Space direction='vertical' style={{ width: '100%' }}>
                    <Select
                      mode='multiple'
                      showSearch
                      allowClear
                      optionFilterProp='label'
                      placeholder={
                        selectedTemplateId
                          ? '请选择供应商'
                          : '请先选择表单模板'
                      }
                      disabled={!selectedTemplateId}
                      value={selectedSuppliers.filter(id =>
                        categorySupplierIds.includes(id),
                      )}
                      onChange={setSelectedSuppliers}
                      options={categorySupplierOptions}
                      style={{ width: '100%' }}
                      maxTagCount='responsive'
                    />
                    <Space wrap>
                      <Button
                        type='link'
                        style={{ padding: 0 }}
                        disabled={!categorySupplierIds.length}
                        onClick={handleSelectAllSuppliers}
                      >
                        一键全选
                      </Button>
                      <Button
                        type='link'
                        style={{ padding: 0 }}
                        disabled={!selectedSuppliers.length}
                        onClick={() => setSelectedSuppliers([])}
                      >
                        清空
                      </Button>
                      <span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>
                        已选择 {selectedSuppliers.length} 家
                      </span>
                    </Space>
                  </Space>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>

        <div className={styles.questionnaireCreatePreviewBlock}>
          <div className={styles.pageSection}>
            <div
              className={styles.sectionTitle}
              style={{ display: 'inline-flex', alignItems: 'center' }}
            >
              表单预览
              <ModifyNote content={PREVIEW_NOTE} />
            </div>
            <div className={styles.fieldEditorPreviewHint}>
              可填写体验，不会保存
            </div>
            <div className={styles.fieldEditorPreview}>
              {previewFields.length === 0 ? (
                <div className={styles.fieldEditorPreviewEmpty}>
                  请选择表单模板后预览填报字段
                </div>
              ) : (
                <>
                  <div className={styles.questionnairePreviewTitle}>
                    {watchedBasic?.name?.trim() || '-'}
                  </div>
                  <div className={styles.questionnairePreviewMeta}>
                    <div className={styles.questionnairePreviewMetaRow}>
                      <span className={styles.questionnairePreviewMetaLabel}>
                        所属组织
                      </span>
                      <span className={styles.questionnairePreviewMetaValue}>
                        {watchedBasic?.organization || '-'}
                      </span>
                    </div>
                    <div className={styles.questionnairePreviewMetaRow}>
                      <span className={styles.questionnairePreviewMetaLabel}>
                        截止日期
                      </span>
                      <span className={styles.questionnairePreviewMetaValue}>
                        {previewDeadline}
                      </span>
                    </div>
                  </div>
                  <div className={styles.questionnairePreviewDescription}>
                    <div className={styles.questionnairePreviewMetaLabel}>
                      任务说明
                    </div>
                    <div className={styles.questionnairePreviewDescriptionText}>
                      {watchedBasic?.description?.trim() || '-'}
                    </div>
                  </div>
                  <FormFieldInputs
                    fields={previewFields}
                    sections={previewSections}
                    values={previewValues}
                    labelInline
                    onChange={(code, value) =>
                      setPreviewValues(prev => ({ ...prev, [code]: value }))
                    }
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <FormActions
        place='center'
        buttons={[
          {
            title: '取消',
            onClick: async () =>
              navigate(SupplyChainRefRouteMaps.questionnaire),
          },
          {
            title: '保存草稿',
            loading: isSubmitting,
            onClick: async () => handleSaveDraft(),
          },
          {
            title: '发布任务',
            type: 'primary',
            loading: isSubmitting,
            disabled: selectedSuppliers.length === 0,
            onClick: async () => handlePublish(),
          },
        ]}
      />
    </Page>
  );
}

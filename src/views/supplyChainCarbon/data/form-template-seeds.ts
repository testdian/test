import type {
  FormField,
  FormTemplate,
  FormTemplateSection,
} from './demo-data';

/** 按供应商类别定制的 5 类专属填报表单 */
export const SUPPLIER_FORM_CATEGORIES = [
  '正极材料供应商',
  '负极材料供应商',
  '电解液供应商',
  '结构件供应商',
  '其他类别供应商',
] as const;

export type SupplierFormCategory = (typeof SUPPLIER_FORM_CATEGORIES)[number];

function field(
  id: number,
  name: string,
  code: string,
  type: string,
  opts: Partial<FormField> = {},
): FormField {
  return {
    id,
    name,
    code,
    type,
    maxLength: opts.maxLength ?? (type === 'number' ? 12 : 100),
    unit: opts.unit ?? '',
    required: opts.required ?? true,
    options: opts.options,
  };
}

function section(
  id: number,
  name: string,
  fields: FormField[],
): FormTemplateSection {
  return { id, name, fields };
}

/** 精细化管理字段（各类别必填） */
const managementFields: FormField[] = [
  field(1, '生产基地', 'production_base', 'text', { maxLength: 100 }),
  field(2, '产品型号', 'product_model', 'text', { maxLength: 100 }),
  field(3, '核算时间', 'accounting_period', 'select', {
    maxLength: 20,
    options: '月度,季度,年度',
  }),
  field(4, '核算边界', 'accounting_boundary', 'select', {
    maxLength: 50,
    options: '摇篮到大门,特定工序段,全生命周期',
  }),
];

/** 绿色信息填报项（选填，按标准执行） */
const greenFields: FormField[] = [
  field(90, '再生料（重量/比例/来源认证）', 'recycled_material', 'text', {
    maxLength: 200,
    required: false,
  }),
  field(91, '绿电使用（绿证或可再生能源）', 'green_power_cert', 'text', {
    maxLength: 200,
    required: false,
  }),
  field(92, '自发电（光伏/风电）', 'self_generation', 'number', {
    unit: 'kWh',
    required: false,
  }),
  field(93, '回收料（二次料或工厂回料）', 'reclaimed_material', 'text', {
    maxLength: 200,
    required: false,
  }),
];

function withSections(
  categorySectionName: string,
  categoryFields: FormField[],
): FormTemplateSection[] {
  return [
    section(1, '精细化管理', managementFields),
    section(2, categorySectionName, categoryFields),
    section(3, '绿色信息', greenFields),
  ];
}

export function seedFormTemplates(): FormTemplate[] {
  return [
    {
      id: 1,
      category: '正极材料供应商',
      name: '正极材料供应商碳数据填报',
      sections: withSections('正极材料专属', [
        field(5, '正极材料种类与用量', 'cathode_material_usage', 'text', {
          maxLength: 200,
        }),
        field(6, '原料来源与产地', 'raw_material_origin', 'text', {
          maxLength: 200,
        }),
        field(7, '能耗（电耗/天然气）', 'energy_consumption', 'text', {
          maxLength: 100,
        }),
        field(8, '废弃物产生量', 'waste_generation', 'number', { unit: 't' }),
      ]),
    },
    {
      id: 2,
      category: '负极材料供应商',
      name: '负极材料供应商碳数据填报',
      sections: withSections('负极材料专属', [
        field(5, '石墨/硅基负极种类', 'anode_type', 'text', { maxLength: 100 }),
        field(6, '原料来源（天然/人造）', 'raw_material_source', 'select', {
          options: '天然,人造',
        }),
        field(7, '煅烧工段能耗', 'calcination_energy', 'number', {
          unit: 'kWh/t',
        }),
        field(8, '再生料使用比例', 'recycled_material_ratio', 'number', {
          unit: '%',
        }),
        field(9, '包装材料用量', 'packaging_usage', 'number', { unit: 'kg' }),
      ]),
    },
    {
      id: 3,
      category: '电解液供应商',
      name: '电解液供应商碳数据填报',
      sections: withSections('电解液专属', [
        field(5, '六氟磷酸锂用量', 'lif6_usage', 'number', { unit: 't' }),
        field(6, '溶剂种类与用量', 'solvent_usage', 'text', { maxLength: 200 }),
        field(7, '生产工段能耗', 'production_energy', 'number', {
          unit: 'kWh',
        }),
        field(8, '废液/废气处理量', 'waste_treatment', 'number', { unit: 't' }),
        field(9, '绿电使用量', 'green_power_amount', 'number', { unit: 'kWh' }),
      ]),
    },
    {
      id: 4,
      category: '结构件供应商',
      name: '结构件供应商碳数据填报',
      sections: withSections('结构件专属', [
        field(5, '铝/钢材料种类用量', 'metal_material_usage', 'text', {
          maxLength: 200,
        }),
        field(6, '冲压/焊接工段能耗', 'stamping_welding_energy', 'number', {
          unit: 'kWh',
        }),
        field(7, '回收铝比例', 'recycled_aluminum_ratio', 'number', {
          unit: '%',
        }),
        field(8, '物流运输方式', 'logistics_transport', 'select', {
          options: '公路,铁路,水运,多式联运',
        }),
        field(9, '表面处理工段', 'surface_treatment', 'text', {
          maxLength: 100,
        }),
      ]),
    },
    {
      id: 5,
      category: '其他类别供应商',
      name: '其他类别供应商碳数据填报',
      sections: withSections('其他类别专属', [
        field(5, '产品类别与型号', 'product_category_model', 'text', {
          maxLength: 100,
        }),
        field(6, '主要原材料用量', 'main_raw_material', 'text', {
          maxLength: 200,
        }),
        field(7, '生产工段综合能耗', 'comprehensive_energy', 'number', {
          unit: 'kWh',
        }),
        field(8, '特殊工艺说明', 'special_process', 'text', {
          maxLength: 300,
          required: false,
        }),
        field(9, '产品出厂检测数据', 'factory_inspection', 'text', {
          maxLength: 300,
        }),
      ]),
    },
  ];
}

export function supplierCategoryByIndex(index: number): SupplierFormCategory {
  return SUPPLIER_FORM_CATEGORIES[index % SUPPLIER_FORM_CATEGORIES.length];
}

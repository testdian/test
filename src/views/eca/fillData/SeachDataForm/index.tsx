import classNames from 'classnames';
import { useForm, SearchForm, SchemaBase } from 'form-render';
import { CSSProperties } from 'react';
import { SearchProps } from 'table-render';

import I18N from '@/lang/I18N';

import style from './index.module.less';

// 通用搜索表单支持的组件类型（可根据项目需求扩展）
export type SearchWidgets = Record<string, React.ComponentType<any>>;

// 扩展 form-render 的 SearchFormProps，添加通用配置
export interface GenericSearchFormProps
  extends Omit<React.ComponentType<SearchProps<object>>, 'schema' | 'widgets'> {
  /** 搜索表单配置 */
  schema: Partial<SchemaBase>;
  /** 自定义组件映射（如 Cascader、DatePicker 等） */
  widgets?: SearchWidgets;
  /** 自定义样式类 */
  className?: string;
  /** 自定义内联样式 */
  style?: CSSProperties;
  /** 搜索回调（参数为表单值） */
  onSearch?: (values: any) => void;
  /** 重置回调 */
  onReset?: () => void;
}

export const GenericSearchForm = ({
  schema,
  widgets = {},
  className,
  onSearch,
  onReset,
  ...restProps
}: GenericSearchFormProps) => {
  const form = useForm();

  return (
    <SearchForm
      {...restProps}
      className={classNames(style.searchForm, className)}
      widgets={widgets}
      schema={schema}
      form={form}
      onSearch={values => {
        onSearch?.(values);
      }}
      onReset={() => {
        form.resetFields();
        onReset?.();
      }}
      searchText={I18N.utils.search}
      resetText={I18N.utils.reset}
    />
  );
};

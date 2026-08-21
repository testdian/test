import { Cascader, DatePicker } from 'antd';
import { useForm, SearchForm } from 'form-render';

import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';
import I18N from '@/lang/I18N';

interface SearchFormProps {
  onSearch?: ((search: any) => any) | undefined;
  onReset?: () => void;
}

export const SearchFillDataForm = ({ onSearch, onReset }: SearchFormProps) => {
  const form = useForm();
  const schema = {
    type: 'object',
    properties: {
      likeSourceName: xRenderSeachSchema({
        type: 'string',
        placeholder: I18N.eca.emissionSourceName,
      }),
      year: xRenderSeachSchema({
        placeholder: I18N.components.accountingYear,
        type: 'string',
        widget: 'DatePicker',
        props: {
          picker: 'year',
          format: 'YYYY',
          disabledDate: (current: any) => {
            return (
              current.year() < 2019 || current.year() > new Date().getFullYear()
            );
          },
        },
      }),
      ghg: xRenderSeachSchema({
        placeholder: I18N.eca.ghgClassification3,
        type: 'string',
        widget: 'Cascader',
      }),
    },
  };

  return (
    <SearchForm
      widgets={{ Cascader, DatePicker }}
      schema={schema}
      form={form}
      onSearch={onSearch}
      onReset={onReset}
    />
    // <QueryFilter
    //   defaultCollapsed
    //   defaultColsNumber={1}
    //   collapsed={false}
    //   collapseRender={false}
    //   onFinish={onFinish}
    //   onReset={onReset}
    //   span={6}
    //   layout='horizontal'
    //   // 'horizontal' | 'inline' | 'vertical';
    //   // submitter={{
    //   //   // 配置按钮文本
    //   //   searchConfig: {
    //   //     resetText: '重置',
    //   //     submitText: '提交',
    //   //   },
    //   //   // 配置按钮的属性
    //   //   resetButtonProps: {
    //   //     style: {
    //   //       // 隐藏重置按钮
    //   //       display: 'none',
    //   //     },
    //   //   },
    //   //   submitButtonProps: {},

    //   //   // 完全自定义整个区域
    //   //   render: (props, doms) => {
    //   //     console.log(props);
    //   //     return [
    //   //       <button
    //   //         type='button'
    //   //         key='rest'
    //   //         onClick={() => props.form?.resetFields()}
    //   //       >
    //   //         重置
    //   //       </button>,
    //   //       <button
    //   //         type='button'
    //   //         key='submit'
    //   //         onClick={() => props.form?.submit?.()}
    //   //       >
    //   //         提交
    //   //       </button>,
    //   //     ];
    //   //   },
    //   // }}
    // >
    //   <ProForm.Group>
    //     <ProFormText
    //       label='排放源名称'
    //       name='likeSourceName'
    //       fieldProps={{
    //         placeholder: I18N.eca.emissionSourceName,
    //       }}
    //     />
    //     <ProFormDatePicker
    //       label='核算年份'
    //       name='year'
    //       fieldProps={{
    //         placeholder: I18N.components.accountingYear,
    //         style: {},
    //         picker: 'year',
    //         format: 'YYYY',
    //         disabledDate: (current: any) => {
    //           return (
    //             current.year() < 2019 ||
    //             current.year() > new Date().getFullYear()
    //           );
    //         },
    //       }}
    //     />
    //     <ProFormCascader
    //       label={I18N.eca.ghgClassification3}
    //       name='ghg'
    //       fieldProps={{
    //         placeholder: I18N.eca.ghgClassification3,
    //       }}
    //       // request={async () => {
    //       //   const { data } = await getComputationEnumsEnumName({
    //       //     enumName: 'GHGCategory',
    //       //   });
    //       //   const newArr = getEnumOption(data?.data || []);
    //       //   return newArr;
    //       // }}
    //     />
    //   </ProForm.Group>
    // </QueryFilter>
  );
};

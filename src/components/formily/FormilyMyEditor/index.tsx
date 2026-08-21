import { Field } from '@formily/core';
import { useField, connect, mapProps, mapReadPretty } from '@formily/react';
import { FC } from 'react';

import { MyEditor } from './RichEditor';

const FormilyMyEditor: FC<{ onChange: any }> = ({ onChange }) => {
  const field = useField<Field>();
  const { value } = field;
  return (
    <MyEditor
      wrapperStyle={{ height: 560, marginBottom: 50 }}
      defaultHtml={value}
      onChange={html => onChange(html)}
    />
  );
};

const FormilyPrettyMyEditor = (props: { value: string }) => {
  return (
    <MyEditor
      wrapperStyle={{ height: 'auto', marginBottom: 50 }}
      readOnly
      defaultHtml={props.value}
    />
  );
};

export default connect(
  FormilyMyEditor,
  mapProps(),
  mapReadPretty(FormilyPrettyMyEditor),
);

import { connect } from '@formily/react';
import { Typography } from 'antd';

const CustomTitle = (props: {
  title: string;
  level: 1 | 4 | 3 | 5 | 2 | undefined;
  classNames: string;
}) => {
  return (
    <Typography.Title level={props.level || 3} className={props.classNames}>
      {props.title}
    </Typography.Title>
  );
};

export const FormilyCustomTitle = connect(CustomTitle);

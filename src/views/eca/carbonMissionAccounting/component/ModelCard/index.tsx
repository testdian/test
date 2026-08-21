import I18N from '@src/lang/I18N';
import { Card, Button } from 'antd';
import React from 'react';

interface ModelCardProps {
  title: string;
  description: string;
  onViewDetails: () => void;
}

const ModelCard: React.FC<ModelCardProps> = ({
  title,
  description,
  onViewDetails,
}) => {
  return (
    <Card title={title} bordered={false}>
      <p>{description}</p>
      <Button type='primary' onClick={onViewDetails}>
        {I18N.eca.viewModel}
      </Button>
    </Card>
  );
};

export default ModelCard;

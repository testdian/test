import { ProColumns } from '@ant-design/pro-components';
import I18N from '@src/lang/I18N';
import { Typography } from 'antd';

export const factorColumns = (
  onFactorClick: (factorId: string) => void,
  paramNamesArray: string[],
): ProColumns<any, 'text'>[] => [
  {
    title: I18N.Factors.emissionFactors,
    dataIndex: 'factorName',
    ellipsis: true,
    renderText: (
      text: string,
      record: { factorId: string; factorValue: string; unit: string },
    ) => {
      const fullText = `${text || ''}${record?.factorValue ?? ''}${
        record?.unit || ''
      }`;

      return (
        <Typography.Text
          onClick={() => {
            onFactorClick(record?.factorId);
          }}
          style={{ width: '95%', color: '#103861', cursor: 'pointer' }}
          ellipsis={{
            tooltip: {
              title: <div style={{ whiteSpace: 'pre-line' }}>{fullText}</div>,
            },
          }}
        >
          {fullText}
        </Typography.Text>
      );
    },
  },
  ...paramNamesArray.map(paramName => ({
    title: paramName,
    dataIndex: `paramValue_${paramName}`,
    key: `paramValue_${paramName}`,
  })),
];

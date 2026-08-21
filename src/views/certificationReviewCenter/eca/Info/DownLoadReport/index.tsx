import { Button, Modal, Table } from 'antd';

import I18N from '@/lang/I18N';

const MyModalComponent = ({
  isVisible,
  handleOk,
  handleCancel,
  importLogList,
}: {
  isVisible: boolean;
  handleOk: () => void;
  handleCancel: () => void;
  importLogList?: any[];
}) => {
  //   const [isVisible, setIsVisible] = useState(false);

  const columns = [
    {
      title: I18N.carbonFootPrintLCA.number,
      dataIndex: 'index',
      key: 'index',
      render: (_: any, __: any, index: number) => {
        return index + 1;
      },
    },
    {
      title: I18N.certificationReviewCenter.textInformation,
      dataIndex: 'fileName',
      key: 'fileName',
      render: (text: string, record: any) => {
        return <a href={record.fileUrl}>{text}</a>;
      },
    },
  ];

  return (
    <Modal
      title={I18N.certificationReviewCenter.downloadReportsAnd}
      open={isVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      width={700}
      footer={[
        <Button key='back' onClick={handleCancel}>
          {' '}
          {I18N.carbonFootPrintLCA.close}
        </Button>,
      ]}
    >
      <Table columns={columns} dataSource={importLogList} pagination={false} />
    </Modal>
  );
};

export default MyModalComponent;

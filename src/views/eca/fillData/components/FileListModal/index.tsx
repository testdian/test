import { ProTable } from '@ant-design/pro-components';
import I18N from '@src/lang/I18N';
import { Button, Modal } from 'antd';
import saveAs from 'file-saver';
import React from 'react';

import { ModalFooter } from '@/components/ModalFooter';

interface FileListModalProps {
  visible: boolean;
  fileList: {
    name: string;
    url: string;
    uid: string;
  }[];
  onClose: () => void;
  title?: string;
  width?: string | number;
}

const FileListModal: React.FC<FileListModalProps> = ({
  visible,
  fileList,
  onClose,
  title = I18N.eca.attachmentList,
  width = '50%',
}) => {
  return (
    <Modal
      title={title}
      width={width}
      centered
      destroyOnClose
      open={visible}
      onCancel={onClose}
      footer={<ModalFooter isView onCancel={onClose} />}
    >
      <ProTable
        options={false}
        search={false}
        columns={[
          {
            title: I18N.eca.attachmentName,
            dataIndex: 'name',
            ellipsis: true,
            render: (_, record) => {
              return (
                <Button
                  type='link'
                  onClick={() => {
                    saveAs(record.url, record.name);
                  }}
                >
                  {record.name}
                </Button>
              );
            },
          },
        ]}
        dataSource={fileList}
        pagination={false}
        rowKey='uid'
        toolBarRender={false}
        scroll={{
          y: 55 * 6,
        }}
      />
    </Modal>
  );
};

export default FileListModal;

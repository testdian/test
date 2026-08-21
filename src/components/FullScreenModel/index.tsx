import { Modal } from 'antd';
import { ReactNode } from 'react';

import './index.less';

export const FullScreenModal = ({ children }: { children: ReactNode }) => (
  <Modal
    className='carbonFullScreenModelWrapper'
    destroyOnClose
    mask={false}
    open
    width='100%'
    title={undefined}
    footer={null}
    closable={false}
    transitionName=''
  >
    {children}
  </Modal>
);

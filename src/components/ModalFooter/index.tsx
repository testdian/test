// 新建 ModalFooter.tsx
import I18N from '@/lang/I18N';
import { Button } from 'antd';
import React from 'react';

interface ModalFooterProps {
  /** 是否是查看模式 */
  isView: boolean;
  /** 取消/关闭回调 */
  onCancel: () => void;
  /** 确定提交回调 */
  onOk?: () => void;
  /** 自定义取消按钮文本 */
  cancelText?: string;
  /** 自定义确定按钮文本 */
  okText?: string;
  /** 自定义关闭按钮 */
  closeText?: string;
  /** 默认展示确定按钮 */
  defaultShowOk?: boolean;
}

export const ModalFooter: React.FC<ModalFooterProps> = ({
  isView,
  onCancel,
  onOk,
  cancelText = I18N.Factors.cancel,
  okText = I18N.base.confirm,
  closeText = I18N.utils.close,
  defaultShowOk = true,
}) => {
  return isView
    ? [
        <Button key='cancel' onClick={onCancel}>
          {closeText}
        </Button>,
      ]
    : [
        <Button key='cancel' onClick={onCancel}>
          {cancelText}
        </Button>,
        defaultShowOk && (
          <Button key='submit' type='primary' onClick={onOk}>
            {okText}
          </Button>
        ),
      ];
};

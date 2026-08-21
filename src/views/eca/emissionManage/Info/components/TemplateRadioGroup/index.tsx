/**
 * @file 模板按钮切换组件
 */

import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Radio,
  Button,
  ButtonProps,
  RadioChangeEvent,
  TabsProps,
  Input,
  message,
} from 'antd';
import React, { useState } from 'react';

import I18N from '@/lang/I18N';

import style from './index.module.less';
import { editEmissionSourceTemplateNameApi } from '../../../service';
import { EmissionSourceTemplateResp } from '../../../type';

// 组件Props定义
interface TemplateRadioGroupProps {
  /** 模板 tab 切换列表 */
  templateList?: TabsProps['items'] | EmissionSourceTemplateResp[];
  /** 当前选中的模板ID（数字或字符串） */
  activeKeyTemplateId: number | string;
  /** 排放源id */
  emissionSourceId?: number;
  /** 是否为详情查看模式 */
  isShow?: boolean;
  /** 选中变化回调（返回选中的key） */
  onChange?: (key: number | string) => void;
  /** 添加新模板回调 */
  onAdd?: () => void;
  /** 删除模板回调 */
  onRemove?: (key: string) => void;
  /** 编辑模板名称成功回调 */
  onEditSuccess?: () => void;
  /** 添加按钮文本（默认使用I18N） */
  addLabel?: React.ReactNode;
  /** 添加按钮额外属性 */
  addButtonProps?: Omit<ButtonProps, 'onClick' | 'icon'>;
}

const TemplateRadioGroup: React.FC<TemplateRadioGroupProps> = ({
  isShow = false,
  templateList = [],
  activeKeyTemplateId,
  onChange,
  onAdd,
  onRemove,
  onEditSuccess,
  addLabel = I18N.eca.addTemplate,
  addButtonProps,
  emissionSourceId,
}) => {
  //  是否显示操作
  const showOperations = !isShow;
  // 是否有模板数据
  const hasTemplates = templateList.length > 0;

  // 编辑状态：记录正在编辑的模板key
  const [editingKey, setEditingKey] = useState<string | number | null>(null);
  // 编辑中的模板名称
  const [editingName, setEditingName] = useState<string>('');

  // 生成Radio选项列表（提取新增项逻辑）
  const radioItems = hasTemplates
    ? [
        ...templateList,
        ...(showOperations ? [{ key: 'add', label: <PlusOutlined /> }] : []),
      ]
    : [];

  // 处理选中变化逻辑
  const handleChange = (e: RadioChangeEvent) => {
    const { value } = e.target;
    if (value === 'add') {
      onAdd?.();
    } else {
      onChange?.(value);
    }
  };

  // 处理删除模板
  const handleRemove = (key: string) => {
    onRemove?.(key);
  };

  // 处理双击开始编辑
  const handleDoubleClick = (item: {
    key: string | number;
    label: React.ReactNode;
  }) => {
    if (showOperations && item.key !== 'add') {
      setEditingKey(item.key);
      setEditingName(String(item.label));
    }
  };

  // 处理编辑完成
  const handleEditFinish = async () => {
    if (!editingName.trim()) {
      message.warning('模板名称不能为空');
      return;
    }

    if (editingName.length > 20) {
      message.warning('模板名称不能超过20个字符');
      return;
    }

    try {
      await editEmissionSourceTemplateNameApi({
        id: editingKey as number,
        templateName: editingName,
        emissionSourceId: emissionSourceId as number,
      });
      message.success('模板名称修改成功');
      setEditingKey(null);
      onEditSuccess?.();
    } catch (error) {
      message.error('模板名称修改失败');
    }
  };

  // 处理取消编辑
  // const handleEditCancel = () => {
  //   setEditingKey(null);
  //   setEditingName('');
  // };

  return (
    <div className={style.templateRadioGroupWrapper}>
      {hasTemplates ? (
        <Radio.Group value={activeKeyTemplateId} onChange={handleChange}>
          {radioItems.map(item => (
            <Radio.Button
              key={item.key}
              value={item.key === 'add' ? 'add' : item.key}
            >
              {editingKey === item.key ? (
                <Input
                  value={editingName}
                  onChange={e => setEditingName(e.target.value)}
                  onPressEnter={handleEditFinish}
                  onBlur={handleEditFinish}
                  autoFocus
                  maxLength={20}
                  onClick={e => e.stopPropagation()}
                  className={style.templateRadioGroupInputWrapper}
                />
              ) : (
                <span
                  style={{ marginRight: 5 }}
                  onDoubleClick={() =>
                    handleDoubleClick(
                      item as {
                        key: string | number;
                        label: React.ReactNode;
                      },
                    )
                  }
                >
                  {item.label}
                </span>
              )}
              {showOperations && item.key !== 'add' && !editingKey && (
                <CloseOutlined
                  onClick={e => {
                    e.stopPropagation();
                    handleRemove(item.key);
                  }}
                  style={{ cursor: 'pointer' }}
                />
              )}
            </Radio.Button>
          ))}
        </Radio.Group>
      ) : (
        !isShow && (
          <Button
            type='primary'
            icon={<PlusOutlined />}
            onClick={onAdd}
            {...addButtonProps}
          >
            {addLabel}
          </Button>
        )
      )}
    </div>
  );
};

export default TemplateRadioGroup;

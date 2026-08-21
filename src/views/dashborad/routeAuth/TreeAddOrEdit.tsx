/*
 * @@description: 编辑、新增权限树 - 功能切换到了管理端，不能再使用
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2023-02-06 19:33:56
 * @LastEditors: qifeng qifeng@carbonstop.net
 * @LastEditTime: 2023-03-22 11:06:23
 */

/* @deprecated */
import I18N from '@src/lang/I18N';
import { Button, Form, Input, Select } from 'antd';
import { useEffect } from 'react';

import { PageTypeInfo } from '@/router/utils/enums';
import { Permission } from '@/sdks/systemV2ApiDocs';
import { Toast } from '@/utils';

import style from './index.module.less';
import { addPermission, editPermission } from './service';

const { TextArea } = Input;
const { Option } = Select;

export interface TreeAddProps {
  onFinish: (type: 'add' | 'edit' | 'del') => void;
  checkTreeDetail?: Permission;
  addCanCelFn: () => void;
  treeType: PageTypeInfo;
  /** 最顶层节点的id */
  topPid?: number;
}

function TreeAdd(props: TreeAddProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { checkTreeDetail, onFinish, addCanCelFn, treeType, topPid } = props;
  const [form] = Form.useForm<Permission | undefined>();

  // 设置初始值
  useEffect(() => {
    if (treeType === PageTypeInfo.add) {
      form.resetFields();
    } else if (checkTreeDetail) form.setFieldsValue(checkTreeDetail);
    else form.resetFields();
  }, [checkTreeDetail, treeType]);
  return (
    <div className={style.treeAddWrapper}>
      <Form
        form={form}
        className={style.treeForm}
        onFinish={values => {
          if (!checkTreeDetail && topPid === undefined) return;
          const newVal = {
            ...values,
            pid:
              treeType === PageTypeInfo.add
                ? checkTreeDetail?.id || topPid
                : checkTreeDetail?.pid || topPid,
            id: treeType === PageTypeInfo.add ? undefined : checkTreeDetail?.id,
          } as Permission;
          if (treeType === PageTypeInfo.add) {
            addPermission(newVal).then(
              // @ts-ignore
              ({ data }) => {
                if (data?.code === 200) {
                  Toast(
                    'success',
                    I18N.supplyChainCarbonManagement.operationSuccessful,
                  );
                  onFinish('add');
                }
              },
            );
          } else {
            editPermission(newVal).then(
              // @ts-ignore
              ({ data }) => {
                if (data?.code === 200) {
                  onFinish('edit');
                  Toast('success', I18N.Factors.updateSuccessful);
                }
              },
            );
          }
        }}
        disabled={treeType === PageTypeInfo.show}
        labelCol={{ span: 8 }}
      >
        <Form.Item
          label={I18N.dashborad.permissionName}
          name='permissionName'
          rules={[
            {
              required: true,
              message: I18N.dashborad.permissionNameNotAvailable,
            },
            { type: 'string', min: 0, max: 50 },
          ]}
        >
          <Input placeholder={I18N.dashborad.pleaseEnterPermission2} />
        </Form.Item>
        <Form.Item
          label={I18N.dashborad.permissionNameEnglish}
          name='permissionNameEn'
          required={false}
        >
          <Input placeholder={I18N.dashborad.pleaseEnterPermission2} />
        </Form.Item>
        <Form.Item
          name='menuType'
          label={I18N.dashborad.permissionType}
          rules={[{ required: true }]}
        >
          <Select
            placeholder={I18N.dashborad.pleaseSelectPermissions}
            allowClear
          >
            <Option value='M'>{I18N.dashborad.directoryRight}</Option>
            <Option value='C'>{I18N.dashborad.menuPermissions}</Option>
            <Option value='F'>{I18N.dashborad.buttonPermissions}</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label={I18N.dashborad.permissionIdentification}
          name='perms'
          rules={[
            {
              required: true,
              message: I18N.dashborad.permissionIdentificationNotAvailable,
            },
            { type: 'string', min: 0, max: 50 },
          ]}
        >
          <Input placeholder={I18N.dashborad.pleaseEnterPermission} />
        </Form.Item>
        <Form.Item
          label={I18N.dashborad.linkAddress}
          name='path'
          rules={[{ type: 'string', min: 0, max: 100 }]}
        >
          <Input placeholder={I18N.dashborad.pleaseEnterTheLink} />
        </Form.Item>
        {/* <Form.Item
            name='status'
            label='权限状态'
            rules={[{ required: true }]}
          >
            <Select placeholder='请选择权限状态' allowClear>
              <Option value='0'>启用</Option>
              <Option value='1'>禁用</Option>
            </Select>
          </Form.Item> */}
        <Form.Item
          label={I18N.dashborad.order}
          name='orderNum'
          rules={[
            { required: true, message: I18N.dashborad.theOrderCannotBe },
            {
              type: 'number',
              transform(val) {
                return Number(val);
              },
            },
          ]}
        >
          <Input placeholder={I18N.dashborad.pleaseEnterTheCurrent} />
        </Form.Item>
        <Form.Item
          label={I18N.dashborad.remarks}
          name='remark'
          rules={[{ type: 'string', min: 0, max: 200 }]}
        >
          <TextArea placeholder={I18N.dashborad.currentPermissions} rows={4} />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button
            className={style.btn}
            htmlType='button'
            onClick={() => {
              addCanCelFn();
              form.setFieldsValue(checkTreeDetail);
            }}
          >
            {I18N.Factors.cancel}
          </Button>
          <Button type='primary' htmlType='submit' className={style.btn}>
            {I18N.dashborad.submit}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default TreeAdd;

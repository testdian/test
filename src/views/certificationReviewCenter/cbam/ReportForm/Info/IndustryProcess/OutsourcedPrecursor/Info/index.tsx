/**
 * @description 前体详情抽屉
 */
import {
  Form,
  FormGrid,
  FormItem,
  FormLayout,
  Input,
  NumberPicker,
  Radio,
  Select,
} from '@formily/antd-v5';
import { createForm } from '@formily/core';
import { createSchemaField, FormConsumer } from '@formily/react';
import I18N from '@src/lang/I18N';
import { Button, Drawer } from 'antd';
import { useEffect, useMemo, useState } from 'react';

import { IconFont } from '@/components/IconFont';
import { InfoTitle } from '@/components/InfoTitle';
import { useAllEnumsBatch } from '@/hooks/dict';
import { PageTypeInfo } from '@/router/utils/enums';
import { modal } from '@/store/module/notification';
import { modelFooterBtnStyle, omitInfoFn, Toast } from '@/utils/index';
import {
  getOutsourcedPrecursorDetail,
  postOutsourcedPrecursorAdd,
  putOutsourcedPrecursorEdit,
} from '@/views/certificationReviewCenter/cbam/ReportForm/service';
import { OutsourcedPrecursorResp } from '@/views/certificationReviewCenter/cbam/ReportForm/type';

import style from './index.module.less';
import { precursorSchema, supplySchema } from './schemas';
import { FILL_WAY_ENUM } from '../../../constant';
import ChooseSupplyCbamModal from '../components/ChooseSupplyCbamModal';
import { SupplyInfo } from '../components/ChooseSupplyCbamModal/type';

const { SUPPLY_FILL } = FILL_WAY_ENUM;

const { add, edit, show } = PageTypeInfo;

const SchemaField = createSchemaField({
  components: {
    Input,
    Select,
    NumberPicker,
    Radio,
    Form,
    FormItem,
    FormGrid,
    FormLayout,
  },
});
interface PrecursorInfoProps {
  /** 抽屉的显隐 */
  open: boolean;
  /** 列表操作按钮的类型 */
  actionBtnType?: string;
  /** 前体ID */
  precursorId?: number;
  /** 报表ID */
  cbamId?: number;
  /** 保存方法 */
  onOk: () => void;
  /** 取消方法 */
  onClose: () => void;
}
export const PrecursorInfo = ({
  open,
  actionBtnType,
  precursorId,
  cbamId,
  onOk,
  onClose,
}: PrecursorInfoProps) => {
  const isAdd = actionBtnType === add;
  const isDetail = actionBtnType === show;

  /** 抽屉标题 */
  const titleMap = {
    [add]: I18N.cbam.addPrecursor,
    [edit]: I18N.cbam.editPrecursor,
    [show]: I18N.cbam.precursorDetails,
  };
  const title = titleMap[actionBtnType as keyof typeof titleMap];

  const enumOptions = useAllEnumsBatch('CBAMcountryinfo');
  /** 国家名称枚举 */
  const countryCodeList = enumOptions?.CBAMcountryinfo;

  const form = useMemo(
    () =>
      createForm({
        readPretty: isDetail,
      }),
    [actionBtnType, open],
  );

  /** 保存按钮的loading */
  const [btnLoading, setBtnLoading] = useState(false);

  /** 保存时的api接口 */
  const postApi = isAdd
    ? postOutsourcedPrecursorAdd
    : putOutsourcedPrecursorEdit;

  /** 关闭弹窗初始化 */
  const onCloseInit = () => {
    form.reset();
    onClose();
  };

  useEffect(() => {
    if (!open) return;

    /** 获取详情 */
    if (!isAdd && precursorId) {
      getOutsourcedPrecursorDetail({ id: precursorId }).then(({ data }) => {
        const result = data?.data || {};
        const { productRoute, supplierId, productCategoryId } = result;

        const productRouteArr = productRoute
          ? productRoute.split(',').map(route => Number(route))
          : [];

        /** 记录供应商id初始值 */
        form.setInitialValuesIn('supplierId', supplierId);

        /** 记录外购前体类别初始值 */
        form.setInitialValuesIn('productCategoryId', productCategoryId);

        form.setValues({
          ...result,
          productRoute: productRouteArr,
        });
      });
    }
  }, [isAdd, precursorId, open]);

  /** 设置表单枚举值 */
  useEffect(() => {
    if (!open) return;

    if (!actionBtnType) {
      return;
    }

    /** 来源国家名称 */
    if (countryCodeList) {
      form.setFieldState('countryCode', {
        dataSource: countryCodeList?.map(item => ({
          ...item,
          label: item.dictLabel,
          value: item.dictValue,
        })),
      });
    }
  }, [countryCodeList, actionBtnType, open]);

  /** --------------------------------------------选择供应商CBAM弹窗相关-------------------------------------------- */
  /** 供应商CBAM弹窗的显隐 */
  const [chooseCbamOpen, setChooseCbamOpen] = useState(false);
  /** 选中的CBAM数据 */
  const [selectedCbamInfo, setSelectedCbamInfo] = useState<SupplyInfo>();

  return (
    <Drawer
      rootClassName={style.wrapper}
      title={title}
      open={open}
      closeIcon={false}
      maskClosable={false}
      destroyOnClose
      placement='right'
      size='large'
      extra={
        <div className={style.closeIcon} onClick={() => onCloseInit()}>
          <IconFont icon='icon-icon-guanbi' />
        </div>
      }
      onClose={() => onCloseInit()}
      footer={[
        <Button onClick={() => onCloseInit()}>
          {isDetail ? I18N.carbonFootPrintLCA.close : I18N.Factors.cancel}
        </Button>,
        !isDetail && (
          <Button
            type='primary'
            loading={btnLoading}
            onClick={async () => {
              const values = await form.submit<OutsourcedPrecursorResp>();

              const { productRoute, supplierId } = values || {};

              const result = omitInfoFn({
                ...values,
                cbamId,
                productRoute: productRoute?.toString(),
              });

              const saveFn = async () => {
                try {
                  setBtnLoading(true);
                  await postApi(result);
                  Toast('success', I18N.Factors.saveSuccessful);
                  setBtnLoading(false);
                  form.reset();
                  onOk();
                } catch (e) {
                  setBtnLoading(false);
                  throw e;
                }
              };

              /** 校验供应商数据ID，若无变化则可直接保存，若有变化则弹窗提示 */
              const supplierIdChange =
                form?.getFieldState('supplierId')?.initialValue !== supplierId;

              if (supplierIdChange) {
                modal.confirm({
                  title: I18N.Factors.prompt,
                  icon: '',
                  content: <div>{I18N.cbam.detectedSupply}</div>,
                  ...modelFooterBtnStyle,
                  okText: I18N.base.confirm,
                  cancelText: I18N.Factors.cancel,
                  onOk: async () => {
                    saveFn();
                  },
                });
              } else {
                saveFn();
              }
            }}
          >
            {I18N.Factors.preserve}
          </Button>
        ),
      ]}
    >
      <Form form={form} previewTextPlaceholder='-'>
        <SchemaField schema={precursorSchema()} />
        <FormConsumer>
          {currentForm => {
            /** 供应商信息填写方式 */
            const supplierInfoType = currentForm.getValuesIn('manual');

            /** 是否是供应商填写 */
            const isSupplyFill = supplierInfoType === SUPPLY_FILL;

            /** 关联供应商数据id */
            const supplierId = currentForm.getValuesIn('linkId');

            return (
              <InfoTitle
                title={I18N.cbam.supplierSpecific}
                rightRender={
                  !isDetail &&
                  isSupplyFill && (
                    <Button
                      key='chooseSupplyCbam'
                      type='primary'
                      onClick={() => {
                        if (supplierId) {
                          modal.confirm({
                            title: I18N.Factors.prompt,
                            icon: '',
                            content: (
                              <div>
                                {I18N.cbam.confirmSelectionOfNew}
                                <div className='primaryColor'>
                                  {I18N.cbam.noteToReselect}
                                </div>
                              </div>
                            ),
                            ...modelFooterBtnStyle,
                            okText: I18N.base.confirm,
                            cancelText: I18N.Factors.cancel,
                            onOk: async () => {
                              setChooseCbamOpen(true);
                            },
                          });
                          return;
                        }
                        setChooseCbamOpen(true);
                      }}
                    >
                      {I18N.cbam.selectSupplier}
                    </Button>
                  )
                }
              />
            );
          }}
        </FormConsumer>

        <SchemaField schema={supplySchema()} />
      </Form>
      {/* 选择供应商CBAM弹窗 */}
      <ChooseSupplyCbamModal
        open={chooseCbamOpen}
        // @ts-ignore
        handleOk={({ selectRows }: { selectRows: SupplyInfo[] }) => {
          const {
            supplyName,
            fillStatus,
            fillStatus_name,
            countryCode,
            productCategoryId,
          } = selectRows?.[0] || {};

          /** 选中供应商CBAM数据时，设置表单值 */
          form.setValues({
            ...selectedCbamInfo,
            supplierName: supplyName,
            fillStatus,
            fillStatus_name,
            countryCode,
            linkId: selectRows[0]?.id,
            productCategoryId,
          });

          setSelectedCbamInfo(selectRows[0]);
          setChooseCbamOpen(false);
        }}
        handleCancel={() => {
          setChooseCbamOpen(false);
        }}
      />
    </Drawer>
  );
};

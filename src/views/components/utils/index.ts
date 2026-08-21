import I18N from '@src/lang/I18N';
import { saveAs } from 'file-saver';

import { returnDelModalStyle, returnNoIconModalStyle, Toast } from '@/utils';

/** textArea 详情下的样式 */
export const textAreaReadPrettyStyle = (isDetail: boolean) => {
  return {
    placeholder: !isDetail ? I18N.base.pleaseEnter : '',
    bordered: !isDetail,
    style: isDetail && {
      background: '#f5f5f5',
      color: '#333',
      fontWeight: 500,
    },
  };
};

/** 弹窗底部按钮样式 */
export const modelFooterBtnStyle = {
  ...returnDelModalStyle,
  ...returnNoIconModalStyle,
  // okButtonProps: {
  //   style: {
  //     background: '#0CBF9F',
  //     color: '#fff',
  //   },
  // },
};

export const RegAccountValue = (value: string | number) => {
  if (!value && value !== 0) return '';
  const y = String(value).indexOf('.') + 1;
  const count = String(value).length - y;
  if (y > 0 && count > 6) {
    return I18N.carbonFootPrint.upToSupport2;
  }
  if (Number(value) <= 0) {
    return I18N.carbonFootPrint.theValueNeedsToBeLarge;
  }
  if (Number(value) > 10000000000) {
    return I18N.carbonFootPrint.mustBeLessThan2;
  }
  return '';
};

export const RegAccountUnitValue = (value: string | number) => {
  if (!value && value !== 0) return '';
  // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
  if (Number(value) <= 0.0000000001 || Number(value) > 99999999999.9999999999) {
    return I18N.carbonFootPrint.valueRange;
  }
  return '';
};

export const RegFactorValue = (value: string | number) => {
  if (!value) return '';

  const y = String(value).indexOf('.') + 1;
  const count = String(value).length - y;
  if (y > 0 && count > 10) {
    return I18N.carbonFootPrint.upToSupport;
  }
  if (Number(value) < 0) {
    return I18N.carbonFootPrint.valueNotSupported;
  }
  // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
  if (Number(value) > 99999999.9999999999) {
    return I18N.carbonFootPrint.mustBeLessThan;
  }

  return '';
};

/** 下载文件 */
export const downloadFile = (url: string, name?: string) => {
  Toast('success', I18N.carbonFootPrint.startDownloading);
  saveAs(url, name);
};

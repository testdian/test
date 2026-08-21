/*
 * @@description:
 */

import I18N from '@src/lang/I18N';

import { postSupplychainDataFillReportSave } from '@/sdks_v2/new/supplychainV2ApiDocs';
/**
 * @description 数字校验
 * @value 输入框的值
 * @max 允许输入的最大值
 * @min 允许输入的最小值
 * @decimal 允许输入的小数位
 * @tips 不符合验证规则的提示
 */
export const RegValue = (
  value: number,
  max: number,
  min: number,
  decimal: number,
  tips?: string,
) => {
  if (!value && value !== 0) return '';
  const y = String(value).indexOf('.') + 1;
  const count = String(value).length - y;

  if (y > 0 && count > decimal) {
    return I18N.template(I18N.supplyChainCarbonManagement.upToSupport, {
      val1: decimal,
    });
  }
  if (value < min) {
    return (
      tips ||
      I18N.template(I18N.supplyChainCarbonManagement.theValueNeedsToBeLarge, {
        val1: min,
      })
    );
  }
  if (value > max) {
    return (
      tips ||
      I18N.template(I18N.supplyChainCarbonManagement.mustBeLessThanM, {
        val1: max,
      })
    );
  }
  return '';
};

/** 验证社会信用代码 */
export const RegUscc = (value: string) => {
  return /^[A-Z0-9]*$/.test(value);
};

/** 验证手机号码 */
export const RegMobile = (value: string | number) => {
  return /^1[0-9]{10}/.test(`${value}`);
};

/** 验证邮箱 */
export const RegEmail = (value: string) => {
  return /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(
    value,
  );
};

/** 产品碳足迹核算结果选择产品返回的key */
export const SELECT_BACK_KEY = 'React-ant-Admin-selectBackKey';

/** 保存报告 applyInfoId: 申请id， report：上传的文件 格式为JSON */
export const onUploadFileFn = async (applyInfoId: number, report: string) => {
  await postSupplychainDataFillReportSave({
    req: {
      applyInfoId,
      report,
    },
  });
};

/** 判断是否为当前匹配到的路由，path：路由路径 */
export const culHistory = (path: string) => {
  const { pathname } = window.location;

  return pathname.includes(path);
};

/** 状态值 */
export const StatusValues = {
  /** 未发布 */
  Unpublished: 0,
  /** 已发布 */
  Published: 1,
  /** 已结束 */
  Over: 2,
  /** 已提交 */
  submitted: 0,
  /** 未提交 */
  uncommitted: 1,
};

/** 题型 */
export const questionTypes = {
  /** 单选 */
  RadioQuestion: 1,
  /** 多选 */
  CheckboxQuestion: 2,
  /** 判断 */
  DetermineQuestion: 3,
  /** 填空 */
  FillQuestion: 4,
};

/** 碳数据填报类型 */
export const CarbonFillType = {
  /** 企业碳核算 */
  carbonAccounting: 1,
  /** 产品碳足迹 */
  carbonFootPrint: 2,
  /** 低碳问卷 */
  questionnaire: 3,
};

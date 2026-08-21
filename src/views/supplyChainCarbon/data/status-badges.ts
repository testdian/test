/** 与碳资质认证「有效期」标签一致的四色体系 */
export const STATUS_BADGE = {
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  danger: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
  neutral: 'bg-gray-100 text-gray-700',
} as const;

export type StatusBadgeTone = keyof typeof STATUS_BADGE;

export type StatusBadgeConfig = {
  label: string;
  className: string;
};

export function statusBadge(
  tone: StatusBadgeTone,
  label: string,
): StatusBadgeConfig {
  return { label, className: STATUS_BADGE[tone] };
}

export const PLAN_STATUS_BADGES: Record<string, StatusBadgeConfig> = {
  to_fill: statusBadge('warning', '待填报'),
  draft: statusBadge('warning', '待填报'),
  pending: statusBadge('warning', '待审核'),
  approved: statusBadge('success', '已通过'),
  rejected: statusBadge('danger', '已驳回'),
};

export const TARGET_STATUS_BADGES: Record<string, StatusBadgeConfig> = {
  draft: statusBadge('neutral', '待推送'),
  pushed: statusBadge('warning', '待确认'),
  confirmed: statusBadge('success', '已确认'),
  modified: statusBadge('info', '已修改'),
};

/** 与管理端减排目标状态标签颜色保持一致 */
export const SUPPLIER_TARGET_STATUS_BADGES = TARGET_STATUS_BADGES;

export const QUESTIONNAIRE_STATUS_BADGES: Record<string, StatusBadgeConfig> = {
  draft: statusBadge('warning', '未发布'),
  published: statusBadge('success', '已发布'),
  ended: statusBadge('info', '已结束'),
};

export const SUPPLIER_QUESTIONNAIRE_STATUS_BADGES: Record<
  string,
  StatusBadgeConfig
> = {
  published: statusBadge('success', '进行中'),
  ended: statusBadge('info', '已结束'),
};

export const QUESTIONNAIRE_SUBMIT_STATUS_BADGES: Record<
  string,
  StatusBadgeConfig
> = {
  pending: statusBadge('warning', '待填写'),
  submitted: statusBadge('success', '已提交'),
};

export const SUBMISSION_STATUS_BADGES: Record<string, StatusBadgeConfig> = {
  submitted: statusBadge('success', '已提交'),
  pending: statusBadge('warning', '未提交'),
};

export const TRAINING_STATUS_BADGES: Record<string, StatusBadgeConfig> = {
  published: statusBadge('success', '已发布'),
  draft: statusBadge('neutral', '草稿'),
};

export const TASK_SUBMISSION_BADGES: Record<string, StatusBadgeConfig> = {
  submitted: statusBadge('success', '已提交'),
  pending: statusBadge('warning', '待处理'),
};

export function getStatusBadgeConfig(
  status: string,
  map: Record<string, StatusBadgeConfig>,
  fallbackLabel?: string,
): StatusBadgeConfig {
  return map[status] ?? statusBadge('neutral', fallbackLabel ?? status);
}

import { Tag } from 'antd';

import {
  getStatusBadgeConfig,
  STATUS_BADGE,
  type StatusBadgeConfig,
} from '../data/status-badges';

const TONE_COLOR: Record<string, string> = {
  [STATUS_BADGE.success]: 'success',
  [STATUS_BADGE.warning]: 'warning',
  [STATUS_BADGE.danger]: 'error',
  [STATUS_BADGE.info]: 'processing',
  [STATUS_BADGE.neutral]: 'default',
};

type StatusTagProps = {
  status: string;
  map: Record<string, StatusBadgeConfig>;
  fallbackLabel?: string;
};

export function StatusTag({ status, map, fallbackLabel }: StatusTagProps) {
  const config = getStatusBadgeConfig(status, map, fallbackLabel);
  const color = TONE_COLOR[config.className] || 'default';
  return <Tag color={color}>{config.label}</Tag>;
}

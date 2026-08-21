export type SupplierDataFillStatus =
  | '未填报'
  | '填报中'
  | '已填报'
  | '待审批'
  | '审批通过'
  | '审批不通过'
  | '已撤回'
  | '已关闭';

export type SupplierDataFillRow = {
  id: number;
  companyName: string;
  contact: string;
  mobile: string;
  applyTime: string;
  deadline: string;
  applyStatus: SupplierDataFillStatus;
  auditStatus: '未审核' | '审核中' | '已审核';
  submitTime: string;
};

export const supplierDataFillRows: SupplierDataFillRow[] = [
  {
    id: 1,
    companyName: 'test',
    contact: 'test',
    mobile: 'test',
    applyTime: '2025-09-15 14:34:17',
    deadline: '-',
    applyStatus: '审批通过',
    auditStatus: '未审核',
    submitTime: '2025-09-15 14:34:17',
  },
  {
    id: 2,
    companyName: 'test',
    contact: 'test',
    mobile: 'test',
    applyTime: '2025-05-29 10:17:50',
    deadline: '-',
    applyStatus: '审批通过',
    auditStatus: '未审核',
    submitTime: '2025-05-29 10:17:50',
  },
  {
    id: 3,
    companyName: 'test',
    contact: 'test',
    mobile: 'test',
    applyTime: '2025-05-14 17:54:04',
    deadline: '-',
    applyStatus: '审批通过',
    auditStatus: '审核中',
    submitTime: '2025-05-14 17:54:04',
  },
  {
    id: 4,
    companyName: 'test',
    contact: 'test',
    mobile: 'test',
    applyTime: '2025-01-15 16:16:45',
    deadline: '2025-01-16',
    applyStatus: '审批通过',
    auditStatus: '审核中',
    submitTime: '-',
  },
  {
    id: 5,
    companyName: 'test',
    contact: 'test',
    mobile: 'test',
    applyTime: '2025-01-15 16:08:06',
    deadline: '-',
    applyStatus: '审批通过',
    auditStatus: '未审核',
    submitTime: '2025-01-15 16:08:06',
  },
  {
    id: 6,
    companyName: 'test',
    contact: 'test',
    mobile: 'test',
    applyTime: '2025-01-13 14:28:03',
    deadline: '-',
    applyStatus: '审批通过',
    auditStatus: '未审核',
    submitTime: '2025-01-13 14:28:03',
  },
  {
    id: 7,
    companyName: 'test',
    contact: 'test',
    mobile: 'test',
    applyTime: '2025-01-09 15:59:40',
    deadline: '-',
    applyStatus: '审批通过',
    auditStatus: '未审核',
    submitTime: '2025-01-09 15:59:40',
  },
  {
    id: 8,
    companyName: 'test',
    contact: 'test',
    mobile: 'test',
    applyTime: '2026-08-12 09:30:00',
    deadline: '2026-08-31',
    applyStatus: '未填报',
    auditStatus: '未审核',
    submitTime: '-',
  },
  {
    id: 9,
    companyName: 'test',
    contact: 'test',
    mobile: 'test',
    applyTime: '2026-08-10 14:20:00',
    deadline: '2026-08-28',
    applyStatus: '填报中',
    auditStatus: '未审核',
    submitTime: '-',
  },
  {
    id: 10,
    companyName: 'test',
    contact: 'test',
    mobile: 'test',
    applyTime: '2026-08-08 11:05:00',
    deadline: '2026-08-25',
    applyStatus: '已填报',
    auditStatus: '未审核',
    submitTime: '-',
  },
  {
    id: 11,
    companyName: 'test',
    contact: 'test',
    mobile: 'test',
    applyTime: '2026-08-06 16:40:00',
    deadline: '2026-08-22',
    applyStatus: '待审批',
    auditStatus: '未审核',
    submitTime: '2026-08-13 10:12:00',
  },
  {
    id: 12,
    companyName: 'test',
    contact: 'test',
    mobile: 'test',
    applyTime: '2026-08-05 08:50:00',
    deadline: '2026-08-20',
    applyStatus: '审批不通过',
    auditStatus: '审核中',
    submitTime: '2026-08-11 15:26:00',
  },
  {
    id: 13,
    companyName: 'test',
    contact: 'test',
    mobile: 'test',
    applyTime: '2026-08-03 13:15:00',
    deadline: '2026-08-18',
    applyStatus: '已撤回',
    auditStatus: '未审核',
    submitTime: '2026-08-09 09:45:00',
  },
  {
    id: 14,
    companyName: 'test',
    contact: 'test',
    mobile: 'test',
    applyTime: '2026-07-28 10:10:00',
    deadline: '2026-08-15',
    applyStatus: '已关闭',
    auditStatus: '未审核',
    submitTime: '-',
  },
];

export const fillStatusOptions: SupplierDataFillStatus[] = [
  '未填报',
  '填报中',
  '已填报',
  '待审批',
  '审批通过',
  '审批不通过',
  '已撤回',
  '已关闭',
];

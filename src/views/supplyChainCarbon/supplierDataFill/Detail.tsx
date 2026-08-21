import {
  Button,
  Input,
  Modal,
  Radio,
  Select,
  Space,
  Tabs,
  message,
} from 'antd';
import { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { Page } from '@/components/Page';
import { SupplyChainRefRouteMaps } from '@/router/utils/supplyChainRefEnums';

import { supplierDataFillRows } from './data';
import styles from './index.module.less';

const ReadItem = ({
  label,
  value,
  full,
  multi,
}: {
  label: string;
  value: string;
  full?: boolean;
  multi?: boolean;
}) => (
  <div className={full ? styles.readItemFull : undefined}>
    <span className={styles.readLabel}>{label}：</span>
    <div
      className={`${styles.readValue} ${multi ? styles.readValueMulti : ''}`}
    >
      {value || '-'}
    </div>
  </div>
);

function DataRequest({ companyName }: { companyName: string }) {
  return (
    <>
      <h4 className={styles.sectionTitle}>基础要求信息</h4>
      <div className={styles.readGrid}>
        <ReadItem label='客户名称' value={companyName} />
        <ReadItem label='填报名称' value='2026年度组织碳核算数据填报' />
        <ReadItem label='填报类型' value='企业碳核算' />
        <ReadItem label='组织名称' value={companyName} />
        <ReadItem label='核算年度' value='2026年' />
        <ReadItem label='数据请求类型' value='组织碳排放数据' />
        <ReadItem label='核算标准' value='ISO 14064-1 / GHG Protocol' />
        <ReadItem label='核算边界' value='运营控制法' />
        <ReadItem label='排放范围' value='范围一、范围二、范围三' />
        <ReadItem label='排放数据单位' value='tCO₂e' />
        <ReadItem label='任务截止日期' value='2026-08-31' />
        <ReadItem label='基准年度' value='2025年' />
        <ReadItem label='申请人' value='-' />
        <ReadItem label='申请人联系方式' value='-' />
        <ReadItem label='申请时间' value='2026-08-12 09:30:00' />
        <ReadItem
          label='填报要求'
          value='请填报组织在核算年度内的温室气体排放总量、范围一/范围二/范围三排放明细及相关证明材料。'
          full
          multi
        />
        <ReadItem label='备注' value='-' full multi />
      </div>
      <div className={styles.evidence}>
        <span className={styles.readLabel}>证明材料：</span>
        <Button disabled>上传文件</Button>
      </div>
    </>
  );
}

function DataFill({ editable }: { editable: boolean }) {
  const navigate = useNavigate();
  const [fillMode, setFillMode] = useState('system');
  const [year, setYear] = useState<string>();
  const [total, setTotal] = useState('');
  const [ratio, setRatio] = useState('');
  const [scope1, setScope1] = useState('');
  const [scope2, setScope2] = useState('');
  const [scope3, setScope3] = useState('');
  const [note, setNote] = useState('');
  const [matchOpen, setMatchOpen] = useState(false);
  const [matchYear, setMatchYear] = useState<string>();
  const [matchOrganization, setMatchOrganization] = useState<string>();

  const isSystemMatch = fillMode === 'system';

  const handleMatchConfirm = () => {
    if (!matchYear || !matchOrganization) {
      message.warning('请选择核算年份和核算组织');
      return;
    }

    setYear(matchYear);
    setTotal('12680.50');
    setScope1('3280.20');
    setScope2('7415.30');
    setScope3('1985.00');
    setMatchOpen(false);
    message.success('已匹配该组织的核算数据');
  };

  const handleSubmit = () => {
    if (!year || !total || !ratio) {
      message.warning('请先填写核算年份、排放总量和占比系数');
      return;
    }
    message.success('提交成功');
  };

  return (
    <>
      <h4 className={styles.sectionTitle}>基础要求信息</h4>
      <div className={styles.readGrid}>
        <ReadItem label='填报名称' value='2026年度组织碳核算数据填报' />
        <ReadItem label='填报类型' value='企业碳核算' />
        <ReadItem label='客户名称' value='供应链客户企业' />
        <ReadItem
          label='填报要求'
          value='请填报组织在核算年度内的温室气体排放总量、范围一/范围二/范围三排放明细及相关证明材料。'
          full
          multi
        />
      </div>

      <h4 className={styles.sectionTitle}>碳数据信息</h4>
      <div className={styles.fillModeRow}>
        <Radio.Group
          value={fillMode}
          disabled={!editable}
          onChange={event => setFillMode(event.target.value)}
        >
          <Radio value='system'>系统匹配</Radio>
          <Radio value='manual'>手动填报</Radio>
        </Radio.Group>
        {editable && isSystemMatch && (
          <Button type='primary' onClick={() => setMatchOpen(true)}>
            选择核算数据
          </Button>
        )}
      </div>

      <div className={styles.formControlGrid}>
        <div className={styles.controlField}>
          <span className={styles.required}>核算年份</span>
          <Select
            disabled={!editable || isSystemMatch}
            placeholder='请选择'
            value={year}
            onChange={setYear}
            options={['2026', '2025', '2024'].map(value => ({
              label: value,
              value,
            }))}
          />
        </div>
        <div className={styles.controlField}>
          <span className={styles.required}>排放总量/tCO₂e</span>
          <Input
            disabled={!editable || isSystemMatch}
            placeholder='请输入'
            value={total}
            onChange={event => setTotal(event.target.value)}
          />
        </div>
        <div className={styles.controlField}>
          <span className={styles.required}>占比系数</span>
          <Input
            disabled={!editable}
            placeholder='请输入'
            addonAfter='%'
            value={ratio}
            onChange={event => setRatio(event.target.value)}
          />
        </div>
      </div>

      <span className={styles.readLabel}>排放量明细/tCO₂e</span>
      <div className={styles.scopeTable}>
        {[
          ['范围一', scope1, setScope1],
          ['范围二', scope2, setScope2],
          ['范围三', scope3, setScope3],
        ].map(([label, value, setter]) => (
          <div className={styles.scopeField} key={label as string}>
            <strong>{label as string}</strong>
            <Input
              disabled={!editable || isSystemMatch}
              placeholder='请输入'
              value={value as string}
              onChange={event =>
                (setter as React.Dispatch<React.SetStateAction<string>>)(
                  event.target.value,
                )
              }
            />
          </div>
        ))}
      </div>

      <div className={styles.noteField}>
        <span className={styles.readLabel}>补充信息</span>
        <Input.TextArea
          disabled={!editable}
          placeholder='补充信息'
          rows={3}
          value={note}
          onChange={event => setNote(event.target.value)}
        />
      </div>
      <div className={styles.evidence}>
        <div className={styles.uploadHint}>
          支持PDF、JPG、JPEG、PNG、Word、Excel、zip、rar格式文件上传，最多10个文件，每个不超过10M
        </div>
        <Button disabled={!editable}>上传文件</Button>
        <div className={styles.reportStatus}>未提交报告</div>
      </div>

      <Modal
        title='选择核算'
        open={matchOpen}
        onCancel={() => setMatchOpen(false)}
        onOk={handleMatchConfirm}
        okText='确定'
        cancelText='取消'
      >
        <div className={styles.matchForm}>
          <div className={styles.controlField}>
            <span className={styles.required}>核算年份</span>
            <Select
              placeholder='请选择'
              value={matchYear}
              onChange={setMatchYear}
              options={['2026', '2025', '2024'].map(value => ({
                label: `${value}年`,
                value,
              }))}
            />
          </div>
          <div className={styles.controlField}>
            <span className={styles.required}>核算组织</span>
            <Select
              showSearch
              placeholder='请选择'
              value={matchOrganization}
              onChange={setMatchOrganization}
              options={[
                { label: 'test', value: 'test-1' },
                { label: 'test', value: 'test-2' },
                { label: 'test', value: 'test-3' },
              ]}
            />
          </div>
        </div>
      </Modal>

      <div className={styles.bottomActions}>
        <Space>
          {editable && (
            <>
              <Button type='primary' onClick={handleSubmit}>
                提交
              </Button>
              <Button onClick={() => message.success('保存成功')}>保存</Button>
            </>
          )}
          <Button
            onClick={() => navigate(SupplyChainRefRouteMaps.supplierDataFill)}
          >
            返回
          </Button>
        </Space>
      </div>
    </>
  );
}

export default function SupplierDataFillDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const row = supplierDataFillRows.find(item => item.id === Number(id));
  const editable = searchParams.get('mode') === 'edit';
  const defaultTab = searchParams.get('tab') === 'fill' ? 'fill' : 'request';
  const [activeTab, setActiveTab] = useState(defaultTab);

  if (!row) {
    return <Page title='核算数据详情'>未找到该供应商数据填报任务</Page>;
  }

  return (
    <Page title='核算数据详情'>
      <Tabs
        className={styles.detailTabs}
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'request',
            label: '数据请求',
            children: <DataRequest companyName={row.companyName} />,
          },
          {
            key: 'fill',
            label: '数据填报',
            children: <DataFill editable={editable} />,
          },
        ]}
      />
      {activeTab !== 'fill' && (
        <div className={styles.bottomActions}>
          <Button
            onClick={() => navigate(SupplyChainRefRouteMaps.supplierDataFill)}
          >
            返回
          </Button>
        </div>
      )}
    </Page>
  );
}

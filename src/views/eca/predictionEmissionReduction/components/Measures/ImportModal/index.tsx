import type { ActionType } from '@ant-design/pro-components';
import I18N from '@src/lang/I18N';
import { Alert, Modal, Select, message } from 'antd';
import type { FC } from 'react';
import { useRef, useState } from 'react';

import { downloadTemplateFileApi } from '@/api/file';
import ImportFile from '@/components/ImportFile';
import { ModalFooter } from '@/components/ModalFooter';
import { downloadTemplateBlobFile } from '@/utils/downBlobFile';
import type { FileType } from '@/views/components/utils/types';

import { columns } from './columns';
import {
  getReductionMeasureImportRecordsApi,
  postReductionMeasureImportApi,
} from '../service';
import { scopeTypeOptions } from '../utils';

/** 导入范围类型与模板枚举 code 的映射 */
const SCOPE_TEMPLATE_CODE_MAP: Record<
  number,
  { code: number; fileName: string }
> = {
  1: { code: 20, fileName: 'scope12.xlsx' },
  2: { code: 20, fileName: 'scope12.xlsx' },
  3: { code: 21, fileName: 'scope3.xlsx' },
};

interface MeasuresImportModalProps {
  visible: boolean;
  orgCode?: string;
  onOk: () => void;
  onCancel: () => void;
  /** 导入成功后刷新外部列表（如措施列表） */
  onImportSuccess?: () => void;
}

const MeasuresImportModal: FC<MeasuresImportModalProps> = ({
  visible,
  orgCode,
  onOk,
  onCancel,
  onImportSuccess,
}) => {
  const tableRef = useRef<ActionType>(null);
  /** 导入类别：1 / 2 / 3，与概览区范围选项及接口一致，独立于页面当前筛选 */
  const [importScopeType, setImportScopeType] = useState<number>(1);

  return (
    <Modal
      title={
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 16,
            maxWidth: 'calc(100% - 48px)',
          }}
        >
          <span style={{ flexShrink: 0 }}>{I18N.carbonFootPrint.import}</span>
          <Select
            size='small'
            style={{ minWidth: 140 }}
            value={importScopeType}
            onChange={v => setImportScopeType(Number(v))}
            options={scopeTypeOptions}
          />
        </div>
      }
      width='80%'
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      footer={<ModalFooter isView={false} onCancel={onCancel} onOk={onOk} />}
      destroyOnClose
    >
      <Alert
        showIcon
        type='info'
        message={I18N.template(
          I18N.eca.reductionMeasureImportSelectCategoryHint,
          {
            val1: I18N.eca.scopeOne,
            val2: I18N.eca.fanWeisan,
          },
        )}
        style={{ marginBottom: 16 }}
      />
      <ImportFile
        key={importScopeType}
        tableRef={tableRef}
        isView={false}
        fileTypeText='xlsx、xls、csv'
        fileTypeValue={['xlsx', 'xls', 'csv', 'XLSX', 'XLS', 'CSV']}
        acceptValue='.xlsx,.xls,.csv,.XLSX,.XLS,.CSV'
        templateTipsText={I18N.eca.reductionMeasureImportTemplateTip}
        maxSize={200}
        columns={columns()}
        extraParams={{}}
        proTableProps={{
          request: async params => {
            const { current = 1, pageSize = 10 } = params;
            const { data } = await getReductionMeasureImportRecordsApi({
              pageNum: current,
              pageSize,
            });
            return data?.data;
          },
        }}
        onDownloadTemplate={async () => {
          const templateInfo = SCOPE_TEMPLATE_CODE_MAP[importScopeType];
          const res = await downloadTemplateFileApi({
            templateType: templateInfo.code,
          });
          downloadTemplateBlobFile(res?.data, res);
        }}
        onImportFile={async (
          fileListParams: FileType,
          successCallBack: () => void,
          failCallBack: () => void,
        ) => {
          if (!orgCode) {
            message.warning(I18N.eca.pleaseSelectAnOrganization);
            failCallBack();
            return;
          }
          const { name, url } = fileListParams;
          try {
            await postReductionMeasureImportApi({
              orgCode,
              scopeType: importScopeType,
              fileName: name,
              fileUrl: url,
            });
            message.success(I18N.carbonFootPrint.importSuccessful);
            successCallBack();
            onImportSuccess?.();
          } catch {
            failCallBack();
          }
        }}
      />
    </Modal>
  );
};

export default MeasuresImportModal;

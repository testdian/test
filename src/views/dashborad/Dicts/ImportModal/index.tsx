import { ActionType } from '@ant-design/pro-components';
import I18N, { LocaleType } from '@src/lang/I18N';
import { Modal } from 'antd';
import { FC, useContext, useRef } from 'react';

import ImportFile from '@/components/ImportFile';
import { LocaleContext } from '@/components/LocaleProvider';
import { ModalFooter } from '@/components/ModalFooter';
import { downloadFile } from '@/views/components/utils';
import { FileType } from '@/views/components/utils/types';

import { columns } from './columns';
import { importDictApi } from './service';

interface ImportModalProps {
  isView?: boolean;
  visible: boolean;
  onOk: () => void;
  onCancel: () => void;
}

const ImportModal: FC<ImportModalProps> = ({
  isView = false,
  visible,
  onOk,
  onCancel,
}) => {
  const { locale } = useContext(LocaleContext);

  /** 是否是英文 */
  const isEn = locale === LocaleType.enUS;

  const tableRef = useRef<ActionType>(null);

  return (
    <Modal
      title={I18N.carbonFootPrint.import}
      width='80%'
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      footer={<ModalFooter isView={isView} onCancel={onCancel} onOk={onOk} />}
      destroyOnClose
    >
      <ImportFile
        hiddenTable
        tableRef={tableRef}
        isView={isView}
        fileTypeText='xlsx'
        fileTypeValue={['xlsx', 'XLSX']}
        acceptValue='.xlsx,.XLSX'
        templateTipsText={I18N.dashborad.pleaseDownloadTheData}
        maxSize={200}
        columns={columns(isView, isEn)}
        extraParams={{}}
        proTableProps={
          {
            // request: async params => {
            //   if (!emissionSourceTemplateId) {
            //     return {
            //       data: [],
            //       success: true,
            //       total: 0,
            //     };
            //   }
            //   const { current = 1, pageSize = 10 } = params;
            //   return getComputationImportLogPageApi({
            //     pageNum: current,
            //     pageSize,
            //     emissionSourceTemplateId,
            //   }).then(({ data }) => {
            //     return data?.data;
            //   });
            // },
          }
        }
        onDownloadTemplate={async () => {
          return;
          // const { data } = await downloadComputationImportLogTemplateApi({
          //   computationId,
          //   computationSourceId,
          //   emissionSourceTemplateId,
          // });
          // downloadFile(data?.data?.url, data?.data?.fileName);
          downloadFile('', '');
        }}
        onImportFile={async (
          fileListParams: FileType,
          successCallBack: () => void,
          failCallBack: () => void,
        ) => {
          const { name, url } = fileListParams;

          try {
            await importDictApi({
              fileName: name,
              fileUrl: url,
            });

            successCallBack();

            // 关闭弹窗
            onCancel();
          } catch (error) {
            failCallBack();
          }
        }}
      />
    </Modal>
  );
};

export default ImportModal;

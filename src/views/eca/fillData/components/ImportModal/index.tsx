import { ActionType } from '@ant-design/pro-components';
import I18N, { LocaleType } from '@src/lang/I18N';
import { Modal, Button } from 'antd';
import { FC, useContext, useRef } from 'react';

import ImportFile from '@/components/ImportFile';
import { LocaleContext } from '@/components/LocaleProvider';
import { ModalFooter } from '@/components/ModalFooter';
import { modal } from '@/store/module/notification';
import { commonRequestDownloadFile } from '@/utils/downBlobFile';
import { FileType } from '@/views/components/utils/types';

import { columns } from './columns';
import {
  deleteComputationImportLogApi,
  downloadComputationImportLogTemplateApi,
  getComputationImportLogPageApi,
  importComputationImportLogDataApi,
  importComputationImportLogDataCheckApi,
} from './service';

interface ImportModalProps {
  isView?: boolean;
  /** 核算id	 */
  computationId: number;
  /** 核算排放源关系id */
  computationSourceId: number;
  /** 模板id */
  emissionSourceTemplateId: number;
  visible: boolean;
  onOk: () => void;
  onCancel: () => void;
}

const ImportModal: FC<ImportModalProps> = ({
  isView = false,
  computationId,
  computationSourceId,
  emissionSourceTemplateId,
  visible,
  onOk,
  onCancel,
}) => {
  const { locale } = useContext(LocaleContext);

  /** 是否是英文 */
  const isEn = locale === LocaleType.enUS;

  const tableRef = useRef<ActionType>(null);
  const onDelete = async (id: number) => {
    if (!id) return;
    modal.confirm({
      title: I18N.Factors.prompt,
      content: I18N.eca.pleaseConfirmIfItIs2,
      okText: I18N.base.confirm,
      cancelText: I18N.Factors.cancel,
      onOk: async () => {
        await deleteComputationImportLogApi({ id });
        tableRef.current?.reload();
      },
    });
  };
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
        tableRef={tableRef}
        isView={isView}
        fileTypeText='xlsx'
        fileTypeValue={['xlsx', 'XLSX']}
        acceptValue='.xlsx,.XLSX'
        templateTipsText={I18N.eca.pleaseDownloadEmissions}
        maxSize={200}
        columns={columns(isView, onDelete, isEn)}
        extraParams={{
          emissionSourceTemplateId,
        }}
        proTableProps={{
          request: async params => {
            if (!emissionSourceTemplateId) {
              return {
                data: [],
                success: true,
                total: 0,
              };
            }
            const { current = 1, pageSize = 10 } = params;
            return getComputationImportLogPageApi({
              pageNum: current,
              pageSize,
              emissionSourceTemplateId,
              computationSourceId,
            }).then(({ data }) => {
              return data?.data;
            });
          },
        }}
        onDownloadTemplate={async () => {
          if (
            !emissionSourceTemplateId ||
            !computationId ||
            !computationSourceId
          )
            return;
          const { data } = await downloadComputationImportLogTemplateApi({
            computationId,
            computationSourceId,
            emissionSourceTemplateId,
          });
          commonRequestDownloadFile(
            data?.data?.url,
            data?.data?.fileName,
            false,
          );
        }}
        onImportFile={async (
          fileListParams: FileType,
          successCallBack: () => void,
          failCallBack: () => void,
        ) => {
          const { name, url } = fileListParams;

          try {
            // 检查文件是否存在
            const { data } = await importComputationImportLogDataCheckApi({
              fileName: name,
              fileUrl: url,
              computationId,
              computationSourceId,
              emissionSourceTemplateId,
            });

            // 如果文件存在，询问用户是否要新增数据
            const shouldImport = data?.data
              ? await new Promise<boolean>(resolve => {
                  modal.confirm({
                    width: 500,
                    title: I18N.Factors.prompt,
                    okText: I18N.eca.addNewData,
                    cancelText: I18N.Factors.cancel,
                    content: (
                      <div>
                        <p> {I18N.eca.theModelYouUploaded}</p>
                        <p>{I18N.eca.addNewData2}</p>
                        <Button type='link'>
                          {I18N.eca.fileName}
                          {name}
                        </Button>
                      </div>
                    ),
                    onOk: () => resolve(true),
                    onCancel: () => {
                      resolve(false);
                      failCallBack();
                    },
                  });
                })
              : true;

            // 根据用户选择执行导入
            if (shouldImport) {
              await importComputationImportLogDataApi({
                fileName: name,
                fileUrl: url,
                computationId,
                computationSourceId,
                emissionSourceTemplateId,
              });
              successCallBack();
            }
          } catch (error) {
            failCallBack();
          }
        }}
      />
    </Modal>
  );
};

export default ImportModal;

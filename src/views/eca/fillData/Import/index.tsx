import I18N from '@src/lang/I18N';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { getImportTreeListApi } from '@/api/compution';
import { FileType } from '@/views/components/utils/types';

import ImportFile from '../components/ImportFile';

function Import() {
  /** 导入文件的loading */
  const [importBtnLoading, setImportBtnLoading] = useState(false);
  const { approvalId } = useParams<{ approvalId: string }>();
  /** 文件导入的标识 */
  const [importFlag, changeImportFlag] = useState(false);
  return (
    <ImportFile
      importType='3'
      importTypeName={I18N.router.supplier}
      importFlag={importFlag}
      importBtnLoading={importBtnLoading}
      importFile={({ fileName, url }: FileType) => {
        setImportBtnLoading(true);
        getImportTreeListApi({
          fileName: fileName || '',
          fileUrl: url,
          computationDataId: approvalId || '',
        }).then(({ data }) => {
          if (data.code === 200) {
            setImportBtnLoading(false);
            changeImportFlag(!importFlag);
          }
        });
      }}
    />
  );
}
export default Import;

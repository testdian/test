/**
 * @description 导入清单
 */
import I18N, { LocaleType } from '@src/lang/I18N';
import { useContext, useState } from 'react';

import { LocaleContext } from '@/components/LocaleProvider';
import { usePageInfo } from '@/hooks';
import { TEMPLATE_FILE_URL } from '@/utils/const';
import ImportFile from '@/views/carbonFootPrintLCA/components/ImportFile';
import { FileType } from '@/views/components/utils/types';

import { postImportList } from '../../service';

function Import() {
  /** 模型ID */
  const { modelId } = usePageInfo();

  /** 导入文件的loading */
  const [importBtnLoading, setImportBtnLoading] = useState(false);

  /** 文件导入的标识 */
  const [importFlag, changeImportFlag] = useState(false);

  const { locale } = useContext(LocaleContext);

  const fileUrl =
    locale === LocaleType.enUS
      ? `${TEMPLATE_FILE_URL}/applus/tpl/tpl_import_lca_en.xlsx`
      : `${TEMPLATE_FILE_URL}/applus/tpl/tpl_import_lca_zh.xlsx`;

  return (
    <ImportFile
      dataId={modelId}
      importType='4'
      importTypeName={I18N.carbonFootPrintLCA.detailedList}
      masterplateFile={{
        name: I18N.carbonFootPrintLCA.listImportModule,
        url: fileUrl,
      }}
      importFlag={importFlag}
      importBtnLoading={importBtnLoading}
      importFile={({ fileName, url }: FileType) => {
        setImportBtnLoading(true);
        postImportList({
          fileName,
          fileUrl: url,
          modelId,
        })
          .then(({ data }) => {
            if (data.code === 200) {
              changeImportFlag(!importFlag);
            }
          })
          .finally(() => {
            setImportBtnLoading(false);
          });
      }}
    />
  );
}
export default Import;

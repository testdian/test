/**
 * @description 采购产品管理-导入
 */
import I18N, { LocaleType } from '@src/lang/I18N';
import { useContext, useState } from 'react';

import { LocaleContext } from '@/components/LocaleProvider';
import { postSupplychainProductImport } from '@/sdks_v2/new/supplychainV2ApiDocs';
import { TEMPLATE_FILE_URL } from '@/utils/const';
import { FileType } from '@/views/components/utils/types';

import ImportFile from '../../components/ImportFile';

function Import() {
  /** 导入文件的loading */
  const [importBtnLoading, setImportBtnLoading] = useState(false);

  /** 文件导入的标识 */
  const [importFlag, changeImportFlag] = useState(false);

  const { locale } = useContext(LocaleContext);

  const fileUrl =
    locale === LocaleType.enUS
      ? `${TEMPLATE_FILE_URL}/applus/tpl/tpl_import_product_en.xlsx`
      : `${TEMPLATE_FILE_URL}/applus/tpl/tpl_import_product_zh.xlsx`;

  return (
    <ImportFile
      importType='2'
      importTypeName={I18N.components.purchasingProducts}
      masterplateFile={{
        name: I18N.supplyChainCarbonManagement.procurementProductGuide,
        url: fileUrl,
      }}
      importFlag={importFlag}
      importBtnLoading={importBtnLoading}
      importFile={({ fileName, url }: FileType) => {
        setImportBtnLoading(true);
        postSupplychainProductImport({
          req: {
            fileName,
            fileUrl: url,
          },
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

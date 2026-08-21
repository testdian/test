import { PlusOutlined } from '@ant-design/icons';
import I18N from '@src/lang/I18N';
import { Button, Radio } from 'antd';
import classNames from 'classnames';
import React from 'react';

import { checkAuth } from '@/layout/utills';
import { TEMPLATE_CODE } from '@/views/eca/util/constant';

import { ComputationTemplateResp } from '../../../type';
import styles from '../index.module.less';

interface FillDataHeaderButtonsProps {
  isDetail: boolean;
  columns: any[];
  activeTemplateId: string;
  templateList: ComputationTemplateResp[];
  onTemplateChange: (value: string) => void;
  onUploadClick: () => void;
  onImportClick: () => void;
  onAddNew: () => void;
}

const FillDataHeaderButtons: React.FC<FillDataHeaderButtonsProps> = ({
  isDetail,
  columns,
  activeTemplateId,
  templateList,
  onTemplateChange,
  onUploadClick,
  onImportClick,
  onAddNew,
}) => {
  return (
    <div className={styles.fillDataDrawerHeader}>
      {/* 模版切换 */}
      <Radio.Group
        value={activeTemplateId}
        optionType='button'
        defaultValue={activeTemplateId}
        style={{ marginBottom: 16 }}
        className={classNames({
          [styles.disabledHover]: templateList?.length === 1,
        })}
        options={templateList?.map((item, index) => {
          return {
            label: item?.templateName || `${TEMPLATE_CODE}${index + 1}`,
            value: `${`${TEMPLATE_CODE}${index + 1}`}_${
              item?.emissionSourceTemplateId
            }`,
          };
        })}
        onChange={e => onTemplateChange(e.target.value)}
      />
      <div className={styles.fillDataDrawerHeaderBtn}>
        {/* 导入历史 */}
        {isDetail && (
          <Button
            type='primary'
            disabled={!(columns.length > 0)}
            onClick={onImportClick}
          >
            {I18N.carbonFootPrint.importHistory}
          </Button>
        )}

        {/* 批量导入 */}
        {!isDetail &&
          checkAuth(
            '/fillData/export',
            <Button
              type='primary'
              disabled={!(columns.length > 0)}
              onClick={onImportClick}
            >
              {I18N.eca.batchImport}
            </Button>,
          )}

        {/* 新增数据按钮 */}
        {!isDetail &&
          checkAuth(
            '/fillData/edit/add',
            <Button
              type='primary'
              disabled={!(columns.length > 0)}
              onClick={onAddNew}
              icon={<PlusOutlined />}
            >
              {I18N.eca.addNewData}
            </Button>,
          )}

        {/* 上传附件按钮 */}
        {!isDetail && (
          <div className={styles.fillDataDrawerHeaderBtnItem}>
            {checkAuth(
              '/fillData/uploadFile',
              <Button
                disabled={!(columns.length > 0)}
                type='primary'
                onClick={onUploadClick}
              >
                上传佐证附件
              </Button>,
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FillDataHeaderButtons;

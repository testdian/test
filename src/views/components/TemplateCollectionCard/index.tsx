// 新建 src/views/components/EmissionSource/TemplateCollectionCard.tsx
import { RightOutlined } from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
import { Button } from 'antd';
import { useState } from 'react';

import ParamsTable from '@/views/eca/emissionManage/Info/components/ParamsTable';
import TemplateFormulaConfiguration from '@/views/eca/emissionManage/Info/components/TemplateFormulaConfiguration';
import { proCardCommonConfig } from '@/views/eca/emissionManage/Info/utils/proCardConfig';
import type { EmissionSourceTemplateResp } from '@/views/eca/emissionManage/type';

import style from './index.module.less';
import MergedFactorTable from '../MergedFactorTable';

const TemplateCollectionCard = ({
  templateList = [],
  proCardConfig = proCardCommonConfig,
}: {
  /** 模板数据 */
  templateList: EmissionSourceTemplateResp[];
  /** ProCard配置项 */
  proCardConfig?: Record<string, any>;
}) => {
  const [collapsedKeys, setCollapsedKeys] = useState<Record<number, boolean>>(
    {},
  );
  return (
    <div>
      {templateList?.map((item, index) => {
        const isCollapsed = collapsedKeys[index] ?? true;
        return (
          <ProCard
            key={item.id || index}
            className={style.templateItem}
            {...proCardConfig}
            bordered
            title={
              <>
                {/* 展开收起 */}
                <Button
                  type='link'
                  onClick={() => {
                    setCollapsedKeys(prev => ({
                      ...prev,
                      [index]: !prev[index],
                    }));
                  }}
                >
                  <RightOutlined rotate={!isCollapsed ? 90 : undefined} />
                  <div>{item?.label}</div>
                </Button>
                <div className={style.templateItemTable}>
                  {(item?.paramList || [])?.length > 0 && (
                    <ParamsTable paramsData={item?.paramList || []} />
                  )}
                </div>
              </>
            }
            style={{ marginBlockStart: 16 }}
            headerBordered
            collapsed={isCollapsed}
          >
            {/* 公式配置 */}
            {(item?.formulaList || []).length > 0 && (
              <TemplateFormulaConfiguration
                emissionSourceId={item?.emissionSourceId}
                templateParamsList={item?.paramList || []}
                notDisplayPramList={item?.notDisplayPramList || []}
                formulaList={item?.formulaList || []}
                templateDetail={item}
                onSuccess={() => {}}
                isDetail
              />
            )}
            {/* 因子 */}
            {(item?.mainParamList || [])?.length > 0 &&
              item?.mainParamList?.map(mainParamListItem => (
                <MergedFactorTable item={mainParamListItem} />
              ))}
          </ProCard>
        );
      })}
    </div>
  );
};

export default TemplateCollectionCard;

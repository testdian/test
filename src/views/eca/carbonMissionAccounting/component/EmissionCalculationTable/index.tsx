import { CaretDownOutlined, CaretRightOutlined } from '@ant-design/icons';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import I18N from '@src/lang/I18N';
import { Card, Button, Space, Typography, TablePaginationConfig } from 'antd';
import { compact } from 'lodash-es';
import { FC, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { UploadFile } from '@/api/type';
import { RouteMaps } from '@/router/utils/enums';
import { modal } from '@/store/module/notification';
import { FullPageDetail } from '@/views/Factors/FullPageDetail';
import FileListModal from '@/views/eca/fillData/components/FileListModal';
import { getComputationDataFillDataPageApi } from '@/views/eca/fillData/service';
import { ComputationTemplateResp } from '@/views/eca/fillData/type';
import { transformDataToTableDataSource } from '@/views/eca/fillData/utils/transFromData';
import { COMMON_PARAM_TYPE } from '@/views/eca/util/constant';
import {
  baseTableConfig,
  generateParamsSummary,
} from '@/views/eca/util/tableUtil';
import { safeParseJson } from '@/views/eca/util/transJson';

import { rawDataExportApi } from './service';
import FactorListModal, { FactorItem } from '../FactorListModal';
import styles from './index.module.less';

const { NUMBER } = COMMON_PARAM_TYPE;

const EmissionCalculationTable: FC<{
  templateList: ComputationTemplateResp[];
  onClose?: () => void;
}> = ({ templateList, onClose }) => {
  const navigate = useNavigate();
  const [expandedTemplateId, setExpandedTemplateId] = useState<number | null>();
  const [factorDetailModalOpen, setFactorDetailModalOpen] = useState(false);
  const [checkFactorId, setCheckFactorId] = useState<string>();
  const [loading, setLoading] = useState(false);
  // 因子列表弹窗
  const [factorListModalOpen, setFactorListModalOpen] = useState(false);
  const [factorListForModal, setFactorListForModal] = useState<FactorItem[]>(
    [],
  );
  /** 设置文件列表信息 */
  const [fileListInfo, setFileListInfo] = useState({
    visible: false,
    fileList: [],
  });

  // 查看因子详情
  const onCheckFactor = (factorId: string) => {
    setCheckFactorId(factorId);
    setFactorDetailModalOpen(true);
  };

  useMemo(() => {
    // 如果没有传入的模板ID，则默认展开第一个模板
    if (
      !expandedTemplateId &&
      templateList?.length > 0 &&
      templateList?.[0]?.emissionSourceTemplateId
    ) {
      setExpandedTemplateId(templateList[0].emissionSourceTemplateId);
    }
  }, [templateList?.[0]?.emissionSourceTemplateId]);

  return (
    <div className={styles.templateTable}>
      {templateList?.map?.(template => {
        // 生成表格列
        const columns: ProColumns<any>[] =
          template?.paramList?.map?.(param => {
            const { paramName, unit1Name, unit2Name } = param || {};

            const title = unit1Name
              ? `${paramName}(${unit1Name}${unit2Name ? `/${unit2Name}` : ''})`
              : paramName;

            // 数值类型阅读态处理（组件默认只展示3位小数，改成显示实际值）
            if (param?.paramType === NUMBER) {
              const render = (_: any, row: { [x: string]: any }) => {
                const value = param?.paramCode
                  ? row?.[param?.paramCode] ?? '-'
                  : '-';
                const warningFlag = param?.paramCode
                  ? row?.[`${param?.paramCode}_warningFlag`]
                  : false;

                // 如果warningFlag字段为真，则设置其父级元素的背景色为黄色，宽高占满整个单元格，文本上下居中
                if (warningFlag) {
                  return (
                    <div
                      style={{
                        backgroundColor: '#ffe238',
                        height: '33px',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0 10px',
                      }}
                    >
                      {`${value}`}
                    </div>
                  );
                }
                return `${value}`;
              };

              return {
                width: 200,
                title,
                dataIndex: param.paramCode,
                ellipsis: true,
                render,
              };
            }

            return {
              width: 200,
              title,
              dataIndex: param.paramCode,
              ellipsis: true,
            };
          }) || [];

        // 添加固定列
        columns?.push(
          {
            title: '附件',
            dataIndex: 'attachmentUrl',
            // 不可编辑
            editable: false,
            width: 200,
            renderText: (_, record) => {
              const { attachmentUrl } = record || {};
              const fileList =
                (safeParseJson(attachmentUrl) as UploadFile[]) || [];

              if (fileList.length === 0) {
                return <div>-</div>;
              }

              return (
                <div>
                  {fileList.map(item => (
                    <div key={item.name} className={styles.fileItem}>
                      <a
                        className={styles.fileHref}
                        href={item.url}
                        target='_blank'
                        rel='noreferrer'
                      >
                        <span className={styles.name}>{item.name}</span>
                      </a>
                    </div>
                  ))}
                </div>
              );
            },
          },
          {
            width: 200,
            title: I18N.Factors.emissionFactors2,
            dataIndex: 'factorId',
            ellipsis: true,
            render: (
              _,
              record: {
                factorId: string;
                factorName: string;
                factorValue: string;
                unit: string;
                factorList: {
                  factorId: string;
                  factorName: string;
                  factorValue: string;
                  unit: string;
                }[];
              },
            ) => {
              const { factorList } = record;

              const factorInfoArr = compact(
                factorList?.map(item => {
                  if (item.factorName || item.factorValue || item.unit) {
                    return `${item.factorName} ${item.factorValue} ${item.unit}`;
                  }
                  return '';
                }),
              );

              // 列表展示
              const factorInfoShow = factorInfoArr?.join(',') || '-';

              // 列表tooltip展示，用逗号分割，一行一个
              const factorInfoTooltip = factorInfoArr?.join('，\n') || '-';

              return (
                <Typography.Text
                  onClick={() => {
                    // 如果factorList长度大于1，则打开弹窗，否则直接查看因子详情
                    if (record?.factorList?.length > 1) {
                      setFactorListForModal(record?.factorList || []);
                      setFactorListModalOpen(true);
                    } else {
                      const factorId = record?.factorList?.[0]?.factorId;
                      onCheckFactor(factorId);
                    }
                  }}
                  style={{ width: 100, color: '#103861', cursor: 'pointer' }}
                  ellipsis={{
                    tooltip: {
                      title: (
                        <div style={{ whiteSpace: 'pre-line' }}>
                          {factorInfoTooltip}
                        </div>
                      ),
                    },
                  }}
                >
                  {factorInfoShow}
                </Typography.Text>
              );
            },
          },
          {
            width: 200,
            title: '碳排放量(kg)',
            dataIndex: 'dataValue',
            ellipsis: true,
          },
        );

        const isExpanded =
          expandedTemplateId === template.emissionSourceTemplateId;

        return (
          <Card
            key={template.emissionSourceTemplateId}
            title={
              <Space className={styles.ButtonGroup} size={8}>
                <div className='flex gap-10'>
                  <h4>{template.label}</h4>
                  <Button
                    size='small'
                    type='primary'
                    onClick={() => {
                      modal.confirm({
                        title: I18N.Factors.prompt,
                        content: I18N.eca.doYouWantToDownloadTheOriginal,
                        onOk: async () => {
                          if (
                            !template?.emissionSourceTemplateId ||
                            !template?.computationId ||
                            !template?.computationSourceId
                          )
                            return;
                          await rawDataExportApi({
                            computationId: template.computationId,
                            computationSourceId: template.computationSourceId,
                            emissionSourceTemplateId:
                              template.emissionSourceTemplateId,
                          });
                          modal.confirm({
                            title: I18N.eca.rawData,
                            content: (
                              <div
                                style={{
                                  marginBottom: '24px',
                                }}
                              >
                                {I18N.eca.rawData2}
                              </div>
                            ),
                            okText: I18N.eca.jumpToDownloadManager,
                            cancelText: I18N.eca.returnAccountingColumn,
                            width: 500,
                            onOk: async () => {
                              navigate(RouteMaps.systemDownload);
                            },
                            onCancel: () => {
                              // 关闭抽屉，回到列表页
                              onClose?.();
                            },
                          });
                        },
                      });
                    }}
                  >
                    {I18N.eca.rawData}
                  </Button>
                  {template?.attachmentUrl && (
                    <Button
                      size='small'
                      type='primary'
                      onClick={() => {
                        setFileListInfo({
                          visible: true,
                          fileList: safeParseJson(template?.attachmentUrl),
                        });
                      }}
                    >
                      {I18N.eca.attachmentDownload}
                    </Button>
                  )}
                </div>
                <Button
                  type='link'
                  icon={
                    isExpanded ? <CaretDownOutlined /> : <CaretRightOutlined />
                  }
                  onClick={() => {
                    setExpandedTemplateId(
                      isExpanded ? null : template.emissionSourceTemplateId,
                    );
                  }}
                >
                  {isExpanded ? I18N.cbam.putItAway : I18N.cbam.open}
                </Button>
              </Space>
            }
            style={{ marginBottom: 24, overflow: 'hidden' }}
          >
            {/* 数据源表格 */}
            {isExpanded && (
              <ProTable
                columns={columns}
                rowKey='id'
                options={false}
                loading={loading}
                search={false}
                sticky={{ offsetHeader: 0 }}
                scroll={{ x: 'max-content' }}
                rowClassName={record => {
                  return record.repeatFlag ? styles.lightBlueRow : '';
                }}
                pagination={{
                  ...(baseTableConfig?.pagination as TablePaginationConfig),
                }}
                params={{
                  isExpanded,
                  emissionSourceTemplateId: template.emissionSourceTemplateId,
                }}
                summary={() => generateParamsSummary(template.paramList)}
                request={async ({
                  current,
                  pageSize,
                  emissionSourceTemplateId,
                }) => {
                  if (isExpanded && emissionSourceTemplateId) {
                    setLoading(true);
                    const { data } = await getComputationDataFillDataPageApi({
                      pageNum: current,
                      pageSize,
                      emissionSourceTemplateId,
                      computationId: template?.computationId,
                      computationSourceId: template?.computationSourceId,
                    }).finally(() => {
                      setLoading(false);
                    });
                    // 转换数据格式
                    const transformedData = transformDataToTableDataSource(
                      data?.data?.list || [],
                      columns || [],
                      'valueDesc',
                    );
                    return {
                      data: transformedData,
                      success: true,
                      total: data?.data?.total || 0,
                    };
                  }
                  return {
                    data: [],
                    success: true,
                    total: 0,
                  };
                }}
              />
            )}
          </Card>
        );
      })}
      {/* 排放因子列表弹窗 */}
      <FactorListModal
        open={factorListModalOpen}
        onClose={() => {
          setFactorListModalOpen(false);
          setFactorListForModal([]);
        }}
        list={factorListForModal}
        onCheckFactor={onCheckFactor}
      />
      {/* 排放因子详情页面 */}
      <FullPageDetail
        open={factorDetailModalOpen}
        onClose={() => {
          setFactorDetailModalOpen(false);
          setCheckFactorId('');
        }}
        initFactorId={checkFactorId || ''}
        defaultApi
      />
      {/* 文件附件弹窗 */}
      <FileListModal
        visible={fileListInfo.visible}
        onClose={() => {
          setFileListInfo({ visible: false, fileList: [] });
        }}
        fileList={fileListInfo.fileList}
        title={I18N.eca.attachmentList}
      />
    </div>
  );
};

export default EmissionCalculationTable;

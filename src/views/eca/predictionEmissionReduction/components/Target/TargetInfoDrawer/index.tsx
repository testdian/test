import I18N, { LocaleType } from '@src/lang/I18N';
import {
  Col,
  Form,
  InputNumber,
  message,
  Radio,
  Row,
  Select,
  Steps,
} from 'antd';
import classNames from 'classnames';
import { useContext, useEffect, useState } from 'react';

import CustomDrawer from '@/components/CustomDrawer';
import { LocaleContext } from '@/components/LocaleProvider';
import { ModalFooter } from '@/components/ModalFooter';
import { PageTypeInfo } from '@/router/utils/enums';
import { Toast } from '@/utils';
import { useComputationEnum } from '@/views/eca/hooks/useComputationEnum';

import {
  postComputationReductionPlanTargetCalcRatioApi,
  postComputationReductionPlanTargetCalcSbtApi,
  postComputationReductionPlanTargetStageAddApi,
  postComputationReductionPlanTargetStageEditApi,
} from '../service';
import { StageTargetValueListResp } from '../type';
import style from './index.module.less';

// 财年范围计算，假设基准年是 2020（实际按业务逻辑调整）
const BASE_YEAR = 2019;
const getYearOptions = () => {
  const years = [];
  for (let year = BASE_YEAR + 1; year <= 2099; year++) {
    years.push({ label: `${year}`, value: year });
  }
  return years;
};

const TargetInfoDrawer: React.FC<{
  /** 类别数据 */
  categoryData: {
    name: string;
    code: number;
  }[];
  /** 阶段record数据 */
  stageRecord: StageTargetValueListResp;
  actionType: PageTypeInfo;
  visible: boolean;
  onClose: () => void;
  onSuccessSave?: () => void;
}> = ({
  visible,
  actionType,
  stageRecord,
  categoryData,
  onSuccessSave,
  onClose,
}) => {
  const { locale } = useContext(LocaleContext);

  /** 是否是英文 */
  const isEn = locale === LocaleType.enUS;

  const isDetail = actionType === PageTypeInfo.show;

  const isAdd = actionType === PageTypeInfo.add;

  const titleMap = {
    add: '新增阶段',
    edit: I18N.eca.editingStage,
  };

  const TypeName = I18N.eca.categoryInd;

  const effectStageRatioTypeOptions = useComputationEnum({
    enumType: 'EffectStageRatioType',
  });

  const [form] = Form.useForm();
  // 状态管理
  const [sbtLevelLabels] = useState([
    I18N.eca.notApplicable,
    '2℃',
    I18N.eca.beBetterThan,
    '1.5℃',
    I18N.eca.netZero,
  ]);
  const [targetYear, setTargetYear] = useState<number>();
  const [sbtLevel, setSbtLevel] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [isInitializing, setIsInitializing] = useState(false);

  // 表单初始化/接口联动计算
  const fetchInitialData = async (year?: number, level?: number) => {
    if (!year) return;
    try {
      const { data } = await postComputationReductionPlanTargetCalcRatioApi({
        targetYear: year,
        sbtLevel: Number(level),
      });
      // 将接口返回的 scope1Ratio、scope2Ratio、scope3Ratio、scope3ClassifyRatioList 回填表单
      stageRecord?.scope3ClassifyRatios?.split(',').forEach((_, index) => {
        form.setFieldValue(['scope3ClassifyRatioList', index], data?.data);
      });
      form.setFieldsValue({
        scope1Ratio: data?.data,
        scope2Ratio: data?.data,
        scope3Ratio: data?.data,
      });
    } catch (error) {
      message.error(I18N.eca.initializedData);
    }
  };

  useEffect(() => {
    if (targetYear && isInitializing) {
      fetchInitialData(targetYear, sbtLevel);
    }
  }, [targetYear, sbtLevel]);

  // 处理表单值变化（范围1-3 或 15个类别），调用接口更新目标标签
  const handleFormChange = async (changedFields: any) => {
    const {
      scope1Ratio,
      scope2Ratio,
      scope3Ratio,
      scope3ClassifyRatioList,
      targetYear: targetYearValue,
    } = form.getFieldsValue();

    // 有任一比例变化时调用接口
    if (
      changedFields.scope1Ratio ||
      changedFields.scope2Ratio ||
      changedFields.scope3Ratio ||
      changedFields.scope3ClassifyRatioList
    ) {
      try {
        const { data } = await postComputationReductionPlanTargetCalcSbtApi({
          scope1Ratio,
          scope2Ratio,
          scope3Ratio,
          scope3ClassifyRatioList,
          targetYear: targetYearValue,
        });
        form.setFieldsValue({
          sbtLevel: data?.data,
        });
        setSbtLevel(data?.data as unknown as 0 | 1 | 2 | 3 | 4);
        setIsInitializing(false);
      } catch (error) {
        message.error(I18N.eca.targetLabelCalculation);
      }
    }
  };

  // 渲染 15 个类别输入项（可根据实际类别循环生成）
  const renderScope3Classify = () => {
    return categoryData?.map?.((item, index) => (
      <Col
        span={8}
        key={item.name}
        className={classNames({
          [style.classifyItemEn]: isEn,
        })}
      >
        <Form.Item
          name={['scope3ClassifyRatioList', index]} // 对应数组索引
          label={`${TypeName}${index + 1}：${item.name}`}
          key={item.name}
        >
          <InputNumber
            min={0}
            max={100}
            precision={2}
            placeholder={I18N.base.pleaseEnter}
            suffix='%'
            style={{ width: '100%' }}
          />
        </Form.Item>
      </Col>
    ));
  };

  useEffect(() => {
    if (!visible) {
      form.resetFields();
      setSbtLevel(0);
      setTargetYear(undefined);
      setIsInitializing(false); // 关闭抽屉时重置状态
    } else if (stageRecord) {
      /** 设置15 个类别的值 */
      stageRecord?.scope3ClassifyRatios?.split(',').forEach((item, index) => {
        const val = item === 'null' || item === '' ? undefined : Number(item);
        form.setFieldValue(['scope3ClassifyRatioList', index], val);
      });
      form.setFieldsValue({
        targetYear: stageRecord.targetYear,
        sbtLevel: stageRecord.sbtLevel,
        scope1Ratio: stageRecord.scope1Ratio,
        scope2Ratio: stageRecord.scope2Ratio,
        scope3Ratio: stageRecord.scope3Ratio,
        scope3Type: stageRecord.scope3Type,
      });
      setSbtLevel(stageRecord.sbtLevel as 0 | 1 | 2 | 3 | 4);
      setTargetYear(stageRecord.targetYear);
    }
  }, [visible, stageRecord]);

  return (
    <CustomDrawer
      width='60%'
      title={titleMap[actionType as keyof typeof titleMap]}
      visible={visible}
      onClose={onClose}
      footer={
        <ModalFooter
          isView={isDetail}
          onCancel={onClose}
          onOk={() => {
            form.validateFields().then(async values => {
              if (isAdd) {
                await postComputationReductionPlanTargetStageAddApi({
                  ...values,
                });
                Toast('success', '新增成功');
                onSuccessSave?.();
              } else if (stageRecord?.id != null) {
                await postComputationReductionPlanTargetStageEditApi({
                  id: stageRecord.id,
                  targetYear: values.targetYear,
                  reductionRatio:
                    values.scope3Ratio != null
                      ? Number(values.scope3Ratio)
                      : values.scope1Ratio != null
                      ? Number(values.scope1Ratio)
                      : undefined,
                });
                Toast('success', I18N.dashborad.modifiedSuccessfully);
                onSuccessSave?.();
              }
            });
          }}
        />
      }
    >
      <Form form={form} onValuesChange={handleFormChange} layout='vertical'>
        {/* 目标年 */}
        <Form.Item
          name='targetYear'
          label={I18N.eca.targetYear2}
          rules={[{ required: true, message: I18N.eca.pleaseSelectTheTarget }]}
        >
          <Select
            placeholder={I18N.eca.pleaseSelectFiscalYear}
            options={getYearOptions()}
            onChange={value => {
              setTargetYear(value);
              setIsInitializing(true);
            }}
          />
        </Form.Item>

        {/* 符合雄心目标标签 */}
        <Form.Item
          label={I18N.eca.inLineWithXiongsHeart}
          rules={[
            { required: true, message: I18N.eca.pleaseSelectASuitableOption },
          ]}
          name='sbtLevel'
        >
          <Steps
            progressDot
            current={sbtLevel}
            items={[
              {
                title: (
                  <div className='baseText12Color666'>{sbtLevelLabels[0]}</div>
                ),
              },
              {
                title: (
                  <div className='baseText12Color666'>{sbtLevelLabels[1]}</div>
                ),
              },
              {
                title: (
                  <div className='baseText12Color666'>{sbtLevelLabels[2]}</div>
                ),
              },
              {
                title: (
                  <div className='baseText12Color666'>{sbtLevelLabels[3]}</div>
                ),
              },
            ]}
            onChange={value => {
              setSbtLevel(value as unknown as 0 | 1 | 2 | 3 | 4);
              setIsInitializing(true);
            }}
          />
        </Form.Item>

        {/* 范围1、2、3 */}
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name='scope1Ratio'
              label={I18N.eca.rangeReductionRatio3}
              rules={[
                { required: true, message: I18N.eca.pleaseEnterTheRange3 },
              ]}
            >
              <InputNumber
                min={0}
                max={100}
                precision={2}
                placeholder={I18N.base.pleaseEnter}
                suffix='%'
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name='scope2Ratio'
              label={I18N.eca.rangeReductionRatio2}
              rules={[
                { required: true, message: I18N.eca.pleaseEnterTheRange2 },
              ]}
            >
              <InputNumber
                min={0}
                max={100}
                precision={2}
                placeholder={I18N.base.pleaseEnter}
                suffix='%'
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name='scope3Type'
              label={I18N.eca.rangeReductionRatio4}
              rules={[{ required: true, message: I18N.eca.pleaseSelectARange }]}
              initialValue={effectStageRatioTypeOptions[0]?.value}
            >
              <Radio.Group
                options={effectStageRatioTypeOptions.map(item => ({
                  label: item.label ?? '',
                  value: item.value,
                }))}
                style={{
                  width: '100%',
                }}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name='scope3Ratio'
              label={I18N.eca.rangeReductionRatio}
              rules={[
                { required: true, message: I18N.eca.pleaseEnterTheRange },
              ]}
            >
              <InputNumber
                min={0}
                max={100}
                precision={2}
                placeholder={I18N.base.pleaseEnter}
                suffix='%'
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>
        {/* 15个类别 */}

        <Form.Item label={I18N.eca.categoryEmissionReduction}>
          <Row gutter={16}>{renderScope3Classify()}</Row>
        </Form.Item>
      </Form>
    </CustomDrawer>
  );
};
export default TargetInfoDrawer;

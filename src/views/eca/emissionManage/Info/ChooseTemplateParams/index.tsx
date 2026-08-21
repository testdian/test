/**
 * @file 步骤3：选择模板参数
 */

import { uniqueId } from 'lodash-es';

import { EmissionSourceFactorResp, EmissionSourceParam } from '../../type';
import MainParamsModal from './components/MainParamsModal';
import EditableTable from '../components/TableWithAddRow/EditableProTable';

const ChooseTemplateParams = ({
  computationSourceId,
  mainParamsList,
  templateParamsList,
  activeKeyTemplateId,
  emissionSourceId,
  paramsModalOpen,
  onAddMainParamsSuccess,
  onCancel,
  onSaveFactorSuccess,
  onDeleteAllFactorSuccess,
}: {
  /** 核算排放源关系id */
  computationSourceId?: number;
  /** 当前模板已选择的step1中的参数列表 */
  templateParamsList: EmissionSourceParam[];
  /** 当前模板step3的主要参数列表 */
  mainParamsList: EmissionSourceFactorResp[];
  /** 当前模板id */
  activeKeyTemplateId: number;
  /** 排放源ID */
  emissionSourceId: number;
  /** 模板参数弹窗 */
  paramsModalOpen: boolean;
  /** 新增主要参数成功 */
  onAddMainParamsSuccess: () => void;
  /** 新增因子/修改成功 */
  onSaveFactorSuccess: () => void;
  onCancel: () => void;
  /** 删除所有因子成功 */
  onDeleteAllFactorSuccess: () => void;
}) => {
  return (
    <div key={uniqueId()}>
      {/* 主要参数配置信息表格 */}
      <EditableTable
        onDeleteAllFactorSuccess={() => {
          onDeleteAllFactorSuccess();
        }}
        onSaveFactorSuccess={() => {
          onSaveFactorSuccess();
        }}
        mainParamsList={mainParamsList}
        templateList={templateParamsList}
        activeKeyTemplateId={activeKeyTemplateId}
        computationSourceId={computationSourceId}
      />
      {/* 步骤3的选择模板参数弹窗 */}
      <MainParamsModal
        templateParamsList={templateParamsList}
        emissionSourceId={emissionSourceId}
        activeKeyTemplateId={activeKeyTemplateId}
        visible={paramsModalOpen}
        onCancel={onCancel}
        onAddMainParamsSuccess={() => {
          onAddMainParamsSuccess();
        }}
      />
    </div>
  );
};

export default ChooseTemplateParams;

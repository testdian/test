import { EmissionSourceFactorResp, EmissionSourceParam } from '../../../type';

export interface EditableTableProps {
  activeKeyTemplateId: number;
  mainParamsList: EmissionSourceFactorResp[];
  templateList: EmissionSourceParam[];
  /** 修改因子成功 */
  onSaveFactorSuccess: () => void;
  /** 全部删除因子 */
  onDeleteAllFactorSuccess: () => void;
  computationSourceId?: number;
}

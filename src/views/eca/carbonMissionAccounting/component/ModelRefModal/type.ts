/**
 * 引用模型
 */
export interface SelectModelRequest {
  computationId: number;
  orgCode: string;
  emissionSourceCodeList?: string[];
  modelId?: number;
}

import { Factor } from '@/sdks/systemV2ApiDocs';

export interface BatchUpdateFactorInfo
  extends Omit<Factor, 'year'>,
    Record<string, unknown> {
  factorId?: number;
  factorValueId?: number;
  year?: string | number;
  region?: string;
  emissionType?: string;
  remark?: string;
  recommended?: boolean;
}

export interface BatchUpdateFactorRecord extends Record<string, unknown> {
  recordKey?: string;
  id?: number;
  sourceId?: number;
  emissionSourceId?: number;
  computationSourceId?: number;
  computationSourceGroupId?: number;
  sourceCode?: string;
  sourceName?: string;
  emissionSourceName?: string;
  orgCode?: string;
  orgName?: string;
  organizationName?: string;
  institution?: string;
  factorName?: string;
  emissionType?: string;
  currentFactor?: BatchUpdateFactorInfo;
  oldFactor?: BatchUpdateFactorInfo;
  selectedFactor?: BatchUpdateFactorInfo;
  recommendFactor?: BatchUpdateFactorInfo;
  suggestedFactor?: BatchUpdateFactorInfo;
  newFactor?: BatchUpdateFactorInfo;
  targetFactor?: BatchUpdateFactorInfo;
  candidateFactors?: BatchUpdateFactorInfo[];
  alternativeFactors?: BatchUpdateFactorInfo[];
  recommendFactors?: BatchUpdateFactorInfo[];
}

export interface EmissionSourceFactorUpdateListParams {
  orgCode?: string;
  likeSourceName?: string;
}

export interface ComputationSourceGroupFactorUpdateListParams
  extends EmissionSourceFactorUpdateListParams {
  computationId: number;
  orgCode: string;
  fillStatus?: string | number;
  reviewStatus?: string | number;
  emailStatus?: string | number;
}

export interface FactorUpdateFactorResp extends Record<string, unknown> {
  id?: number;
  name?: string;
  institution?: string;
  year?: string | number;
  factorValue?: string;
  unit?: string;
}

export interface FactorUpdateDetailResp extends Record<string, unknown> {
  currentFactor?: FactorUpdateFactorResp;
  newFactor?: FactorUpdateFactorResp;
}

export interface FactorUpdateResp extends Record<string, unknown> {
  emissionSourceId?: number;
  computationSourceGroupId?: number;
  sourceCode?: string;
  sourceName?: string;
  orgCode?: string;
  orgName?: string;
  factorList?: FactorUpdateDetailResp[];
}

export interface FactorUpdateItemReq {
  currentFactorId: number;
  newFactorId: number;
}

export interface FactorUpdateReq {
  emissionSourceId: number;
  factorList: FactorUpdateItemReq[];
}

export type BatchUpdateFactorSubmitRequest = FactorUpdateReq[];

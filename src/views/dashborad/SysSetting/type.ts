/** tabs类型 */
export type TabsType = {
  id: number;
  modelName: string;
};

/** 修改方法 */
export type OnSysSetRadioChangeType = (
  value: number,
  type: number,
  reqName: string,
) => void;

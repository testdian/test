/*
 * @description: 添加、编辑、排放源详情
 */

import CustomDrawer from '@/components/CustomDrawer';
import I18N from '@/lang/I18N';
import { PageTypeInfo } from '@/router/utils/enums';
import { getButtonText } from '@/utils/buttonText';
import EmissionSourceComponent from '@/views/components/EmissionSource/indexcopy';

import {
  useSetAuthEmissionSourceInfo,
  useSetEmissionSourceInfo,
} from '../../hooks';

const DrawEmissionSourceInfo = ({
  open,
  setOpen,
  id,
  computationDataSourceId,
  CarbonMissionPageTypeInfoType,
  authNo,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
  id: string;
  computationDataSourceId?: string;
  CarbonMissionPageTypeInfoType?: string; // 1
  authNo?: string;
}) => {
  // 排放源ID
  const emissionSourceId = Number(id);

  // 排放源详情信息
  const authEmissionSourceInfo = useSetAuthEmissionSourceInfo(
    emissionSourceId,
    authNo,
  );
  const emissionSourceInfo = useSetEmissionSourceInfo(
    emissionSourceId,
    computationDataSourceId,
  );

  const emissionSourceDetailData =
    authNo && Number(CarbonMissionPageTypeInfoType)
      ? authEmissionSourceInfo
      : emissionSourceInfo;
  return (
    <CustomDrawer
      width={1200}
      title={I18N.router.emissionSourceDetails}
      maskClosable={false}
      destroyOnClose
      onClose={() => {
        setOpen(false);
      }}
      onSave={() => {}}
      visible={open}
      isDetail
      saveBtnText={getButtonText(PageTypeInfo.show)}
    >
      <EmissionSourceComponent
        autoCreateSourceCode
        readPretty
        emissionSourceId={emissionSourceId}
        activityDataVisible
        noRequiredField=''
        emissionSourceDetailData={emissionSourceDetailData}
        onSelectFn={() => {}}
        isNeedFooter={false}
        onCancelFn={() => {}}
      />
    </CustomDrawer>
  );
};
export default DrawEmissionSourceInfo;

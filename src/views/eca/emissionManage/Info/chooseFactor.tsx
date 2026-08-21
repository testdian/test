/*
 * @@description:选择排放因子
 */

import { Factor } from '@/sdks/systemV2ApiDocs';

import ChooseFactorComponent from '../../component/chooseFactor';
import { ParamsProp } from '../../component/chooseFactor/type';

const ChooseFactorsPage = ({
  onDetailClick,
  onConfirmClick,
  onCancelClick,
}: {
  onDetailClick?: (data: Factor) => void;
  onConfirmClick?: (data: ParamsProp) => void;
  onCancelClick?: (data: ParamsProp) => void;
}) => {
  return (
    <ChooseFactorComponent
      onDetailClick={onDetailClick}
      onConfirmClick={onConfirmClick}
      onCancelClick={onCancelClick}
    />
  );
};

export default ChooseFactorsPage;

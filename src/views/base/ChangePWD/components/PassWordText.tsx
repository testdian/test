/*
 * @@description:
 * @Author: ljh255 jinhai@carbonstop.net
 * @Date: 2023-05-30 11:00:45
 * @LastEditors: ljh255 jinhai@carbonstop.net
 * @LastEditTime: 2023-05-30 18:53:22
 */
import I18N from '@src/lang/I18N';

import style from '../index.module.less';

export const PassWordText = () => {
  return (
    <div className={style.paswordText}>
      <p className={style.paswordTextTitle}> {I18N.base.passwordNeedsToMeet}</p>
      <p> {I18N.base.atLeastXCharacters}</p>
      <p> {I18N.base.passwordLengthTo}</p>
      <p> {I18N.base.notACommonSecret}</p>
    </div>
  );
};

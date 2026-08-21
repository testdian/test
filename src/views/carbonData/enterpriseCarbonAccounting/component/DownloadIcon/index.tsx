/**
 * @description 下载icon
 */
import { ClassAttributes, HTMLAttributes } from 'react';

import style from './index.module.less';

const DownloadIcon = (
  props: JSX.IntrinsicAttributes &
    ClassAttributes<HTMLDivElement> &
    HTMLAttributes<HTMLDivElement>,
) => {
  return (
    <div className={style.downloadIcon} {...props}>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='16'
        height='16'
        viewBox='0 0 16 16'
        fill='none'
        className={style.svgIcon}
      >
        <path
          fillRule='evenodd'
          clipRule='evenodd'
          d='M3.10002 10.7V12.7C3.10002 12.9209 3.27911 13.1 3.50002 13.1H12.5C12.7209 13.1 12.9 12.9209 12.9 12.7V10.7H14.1V12.7C14.1 13.5837 13.3837 14.3 12.5 14.3H3.50002C2.61637 14.3 1.90002 13.5837 1.90002 12.7V10.7H3.10002Z'
        />
        <path
          fillRule='evenodd'
          clipRule='evenodd'
          d='M7.57576 11.6243L3.57576 7.62426L4.42429 6.77573L8.00002 10.3515L11.5758 6.77573L12.4243 7.62426L8.42429 11.6243C8.18997 11.8586 7.81007 11.8586 7.57576 11.6243Z'
        />
        <path
          fillRule='evenodd'
          clipRule='evenodd'
          d='M8.60002 1.7V10.7H7.40002V1.7H8.60002Z'
        />
      </svg>
    </div>
  );
};

export default DownloadIcon;

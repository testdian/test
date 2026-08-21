import { Image } from 'antd';
import { useState } from 'react';

import styles from './index.module.less';

type RequirementScreenshotProps = {
  src: string;
  alt: string;
};

export function RequirementScreenshot({ src, alt }: RequirementScreenshotProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className={styles.screenshotPlaceholder}>
        截图待补充
        <span className={styles.screenshotPath}>{src}</span>
      </div>
    );
  }

  return (
    <Image
      className={styles.screenshotImage}
      src={src}
      alt={alt}
      fallback="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='120'/%3E"
      onError={() => setFailed(true)}
    />
  );
}

import I18N from '@src/lang/I18N';
import { Button, Result } from 'antd';
import { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';

import { RouteMaps } from '@/router/utils/enums';

function Error404(): ReactElement {
  const navgate = useNavigate();
  return (
    <Result
      status='404'
      title='404'
      subTitle={I18N.error.theSystemPromptsYou2}
      extra={
        <Button
          type='primary'
          onClick={() => {
            navgate(RouteMaps.home, { replace: true });
          }}
        >
          {I18N.error.returnToHomepage}
        </Button>
      }
    />
  );
}

export default Error404;

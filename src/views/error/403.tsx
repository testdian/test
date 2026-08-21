import I18N from '@src/lang/I18N';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

import { RouteMaps } from '@/router/utils/enums';

function Error403() {
  const navgate = useNavigate();
  return (
    <Result
      status='403'
      title='403'
      subTitle={I18N.error.theSystemPromptsYou}
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

export default Error403;

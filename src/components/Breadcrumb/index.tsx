/*
 * @@description: 面包屑
 */
import { Breadcrumb, Button } from 'antd';
import classNames from 'classnames';
import { compact } from 'lodash-es';
import { memo, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useBreadcrumbs, { BreadcrumbsRoute } from 'use-react-router-breadcrumbs';

import { RouteMaps } from '@/router/utils/enums';
import { CHOOSE_FACTOR } from '@/views/components/EmissionSource/utils/constant';

import style from './index.module.less';
import { allRoute } from '../../router/utils';

// FIXME 面包屑点击测试
function Breadcrumbs() {
  const breadcrumbs = useBreadcrumbs(
    allRoute.map(r => ({
      path: r.path,
      breadcrumb:
        typeof r.meta.title === 'string' ? r.meta.title : r.meta.title(),
      meta:
        typeof r.meta.title === 'string'
          ? r.meta
          : { ...r.meta, title: r.meta.title() },
      props: {
        isLink: !!r.component,
      },
    })) as BreadcrumbsRoute<string>[],
  );
  const usedRoute = useMemo(() => {
    return compact(
      breadcrumbs.map(r => {
        // 去除不需要展示的路由
        if (
          !r.match?.route?.path ||
          [RouteMaps.layout, '/'].includes(r.match.route?.path) ||
          // 去除一级菜单
          (r.match.route?.path?.split('/').length <= 2 &&
            !['/home'].includes(r.match.route?.path))
        )
          return null;

        return r;
      }),
    );
  }, [breadcrumbs]);
  const navigate = useNavigate();

  if (!usedRoute?.length || usedRoute.length <= 1) return null;
  return (
    <div className={classNames(style.wrapper, 'bread-wrapper')}>
      <Breadcrumb>
        {usedRoute.map(route => (
          <Breadcrumb.Item key={route.match.pathname}>
            <Button
              type='text'
              className='margin0 padding0'
              onClick={() => {
                const emissionManageInfoValues =
                  new URLSearchParams(window.location.search).get(
                    CHOOSE_FACTOR.FORM_VALUES,
                  ) || undefined;
                if (
                  route.match.route?.props?.isLink &&
                  route.match.route?.path
                ) {
                  if (emissionManageInfoValues) {
                    navigate(
                      `${route.key}?${CHOOSE_FACTOR.FORM_VALUES}=${emissionManageInfoValues}`,
                    );
                  } else {
                    navigate(route.key);
                  }
                }
              }}
            >
              {route.match.route?.breadcrumb as unknown as string}
            </Button>
          </Breadcrumb.Item>
        ))}
      </Breadcrumb>
    </div>
  );
}

export default memo(Breadcrumbs);

/**
 * @description 排放目标
 */
import { FormLabelWithNote } from '@/components/ModifyNote';
import { Page } from '@/components/Page';

import { EmissionTargetTable } from './EmissionTargetTable';

const PAGE_NOTE =
  '排放目标页需求：由总部管理员为每个基地设置年度排放量目标、年度减碳比例，之后系统先自动将年度排放目标平均拆分到月度，但允许修改；之后根据各基地实际排放量，查看目标达成比例；同时相应数据放到报告中。页面描述：顶部展示年份切换器，页面展示表格，纵列为基地名称，横列为指标。';

const EmissionTarget = () => {
  return (
    <Page title={<FormLabelWithNote label='排放目标' note={PAGE_NOTE} />}>
      <EmissionTargetTable />
    </Page>
  );
};

export default EmissionTarget;

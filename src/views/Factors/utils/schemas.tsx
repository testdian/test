/*
 * @@description:
 */
import I18N from '@src/lang/I18N';
import { SearchProps } from 'table-render/dist/src/types';

import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';

import { publishYear } from './index';

export const searchSchema = (): SearchProps<any>['schema'] => ({
  type: 'object',
  properties: {
    likeName: xRenderSeachSchema({
      type: 'string',
      placeholder: I18N.Factors.factorName,
      widget: 'input',
    }),
    year: xRenderSeachSchema({
      type: 'number',
      placeholder: I18N.Factors.yearOfPublication,
      enum: publishYear(),
      widget: 'select',
      props: {
        allowClear: true,
      },
    }),
    likeInstitution: xRenderSeachSchema({
      type: 'string',
      placeholder: I18N.Factors.publishingInstitution,
      widget: 'input',
    }),
    likeDescription: xRenderSeachSchema({
      type: 'string',
      placeholder: I18N.Factors.applicableScenarios,
      widget: 'input',
    }),
    areaRepresent: xRenderSeachSchema({
      type: 'string',
      placeholder: I18N.Factors.geographicalRepresentativeness,
      widget: 'input',
    }),
    likeEmissionSourceName: xRenderSeachSchema({
      type: 'string',
      placeholder: I18N.Factors.emissionSourceName,
      widget: 'input',
    }),
  },
});

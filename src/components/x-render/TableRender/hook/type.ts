import { TableContext } from 'table-render';
import { TableRenderStoreType } from 'table-render/dist/src/core/store';

export interface UseTableRefResult {
  tableRef: React.RefObject<TableContext | null>;
  refresh: TableContext['refresh'];
  doSearch: TableContext['doSearch'];
  setState: TableRenderStoreType['setState'];
}

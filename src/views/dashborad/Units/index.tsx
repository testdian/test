/*
 * @@description: 单位换算
 */
import { PlusOutlined } from '@ant-design/icons';
import {
  Form,
  FormItem,
  FormLayout,
  NumberPicker,
  Select,
} from '@formily/antd-v5';
import { createForm, onFieldValueChange } from '@formily/core';
import { createSchemaField } from '@formily/react';
import I18N from '@src/lang/I18N';
import { Modal } from 'antd';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { SearchProps } from 'table-render/dist/src/types';

import { LocaleContext } from '@/components/LocaleProvider';
import { Page } from '@/components/Page';
import { CustomTableRender } from '@/components/x-render/TableRender';
import { useTableRef as useTable } from '@/components/x-render/TableRender/hook/useTableRef';
import { checkAuth } from '@/layout/utills';
import {
  getSystemLibUnitPage,
  getSystemLibUnitPageProps,
  OperLog,
  postSystemLibUnitAdd,
  postSystemLibUnitDelete,
  postSystemLibUnitEdit,
} from '@/sdks/systemV2ApiDocs';
import { modal } from '@/store/module/notification';
import {
  changeTableColumnsNoText,
  getSearchParams,
  returnDelModalStyle,
  returnNoIconModalStyle,
  Toast,
  updateUrl,
} from '@/utils';
import { useIndexColumn } from '@/utils/columns';

import style from './index.module.less';
import { columns } from './utils/columns';
import { modalSchema, searchSchema } from './utils/schemas';
import { SearchParamses } from './utils/types';
import { useGetDict } from '../Dicts/hooks';

const SchemaProvider = createSchemaField({
  components: { Select, NumberPicker, FormLayout, FormItem },
});
const Dict = () => {
  const modalForm = useMemo(() => createForm(), []);
  const [searchParams, setSearchParams] = useState<SearchParamses>({
    current: 1,
  });
  const units = useGetDict('factorUnitM');
  console.log(units, 'units-units');
  const { locale } = useContext(LocaleContext);

  //   add/edit modal
  const [addModal, setAddModal] = useState<boolean | number>();

  const { refresh, tableRef } = useTable();
  const form = tableRef?.current?.form;
  const indexColumn = useIndexColumn<any>(
    (Number(searchParams?.current) - 1) * Number(searchParams?.pageSize),
  );
  // 用于修正第一次页码无法正常设置问题
  const isFirstLoad = useRef(true);

  const searchApi: SearchProps<OperLog>['api'] = ({
    current,
    ...args
  }: {
    current: number;
  }) => {
    const pageNum =
      (isFirstLoad.current ? searchParams.current : current) || current;
    const time = JSON.parse(getSearchParams()[0]?.time || '[]').map(
      (t: string) => t,
    );

    const search = {
      ...getSearchParams()[0],
      time,
    } as Partial<SearchParamses>;
    let newSearch = { ...args, ...search };
    if (!isFirstLoad.current) {
      newSearch = {
        ...args,
        current: pageNum,
        moduleType: form?.getValues().moduleType,
      };
      updateUrl(newSearch);
    } else {
      form?.setValues({ ...search });
    }
    setSearchParams({ ...newSearch, current: newSearch.current || 1 });

    isFirstLoad.current = false;
    let searchVals = {
      ...newSearch,
      pageNum: current,
    } as unknown as getSystemLibUnitPageProps;
    if (newSearch?.time?.length) {
      searchVals = {
        ...searchVals,
      };
    }

    return getSystemLibUnitPage(searchVals).then(({ data }) => {
      const result = data?.data || {};
      return { ...result, rows: result?.list || [], total: result.total || 0 };
    });
  };
  const effectElementPath = '*(unitFrom,unitTo)';
  const dictLabelMapObj = {
    'en-US': 'dictLabelLanguage',
    'zh-CN': 'dictLabel',
  };
  const setUnitOptions = (type?: string) => {
    if (!type) return;
    modalForm.setFieldState(effectElementPath, {
      dataSource: units.enums
        .filter(u => u.sourceType === type)
        .map(v => ({
          // @ts-ignore
          label: v?.[dictLabelMapObj?.[locale]],
          value: `${v.dictValue}`,
        })),
    });
  };
  const addTypeChangeEffectId = 'unitClassEffect123';
  const addTypeChangeEffect = () => {
    modalForm.addEffects(addTypeChangeEffectId, () => {
      onFieldValueChange('unitClass', field => {
        const { value } = field;
        if (value) {
          modalForm.reset(effectElementPath);
          setUnitOptions(value);
        }
      });
    });
  };

  // modal 设置枚举值
  useEffect(() => {
    if (units.enums.length) {
      modalForm.setFieldState('unitClass', {
        dataSource: units.type.map(u => ({
          // @ts-ignore
          label: u?.[dictLabelMapObj?.[locale]],
          value: `${u.dictValue}`,
        })),
      });
    }
  }, [units]);

  const closeModal = (isRefresh?: boolean) => {
    modalForm.removeEffects(addTypeChangeEffectId);
    modalForm.reset();
    setAddModal(false);
    if (isRefresh) refresh?.();
  };
  return (
    <Page
      title={I18N.dashborad.unitConversion}
      actionBtnChild={checkAuth(
        '/sys/units/add',
        <div>
          <PlusOutlined />
          {I18N.Factors.newAddition}
        </div>,
      )}
      onBtnClick={async () => {
        setAddModal(true);
        addTypeChangeEffect();
      }}
    >
      <CustomTableRender
        tableRef={tableRef}
        searchProps={{
          schema: searchSchema(units, locale),
          api: searchApi,
        }}
        tableProps={{
          columns: changeTableColumnsNoText(
            [
              ...indexColumn,
              ...columns(
                units,
                row => {
                  // @ts-ignore
                  const unit1 = units.enums.find(
                    u => u.dictValue === String(row.unitFrom),
                  )?.[dictLabelMapObj?.[locale]];
                  // @ts-ignore
                  const unit2 = units.enums.find(
                    u => u.dictValue === String(row.unitTo),
                  )?.[dictLabelMapObj?.[locale]];
                  modal.confirm({
                    title: I18N.Factors.prompt,
                    icon: '',
                    content: (
                      <div>
                        {I18N.dashborad.deleteUnit}
                        <span className={style.warnText}>
                          {unit1}/{unit2}
                        </span>
                      </div>
                    ),
                    ...returnNoIconModalStyle,
                    ...returnDelModalStyle,
                    onOk: async () => {
                      if (row.id)
                        postSystemLibUnitDelete({
                          req: { id: row.id },
                        }).then(({ data }) => {
                          if (data.code === 200) {
                            refresh?.();
                            Toast('success', I18N.Factors.deleteSuccessful);
                          }
                        });
                    },
                    okText: I18N.utils.ok,
                    cancelText: I18N.Factors.cancel,
                  });
                },
                row => {
                  setAddModal(row.id);
                  setUnitOptions(`${row.unitClass ?? ''}`);
                  const value = {
                    id: row.id,
                    unitClass: `${row.unitClass ?? ''}`,
                    unitFrom: `${row.unitFrom ?? ''}`,
                    unitTo: `${row.unitTo ?? ''}`,
                    unitValue: row.unitValue,
                  };
                  modalForm.setValues(value);
                  addTypeChangeEffect();
                },
              ),
            ],
            '-',
          ),
          pagination: {
            pageSize: searchParams?.pageSize
              ? +searchParams.pageSize
              : undefined,
            current: searchParams?.current ? +searchParams.current : undefined,
          },
        }}
      />
      <Modal
        open={!!addModal}
        maskClosable={false}
        centered
        onCancel={() => closeModal()}
        okText={I18N.Factors.preserve}
        cancelText={I18N.Factors.cancel}
        onOk={async () => {
          return modalForm.submit(values => {
            if (typeof addModal === 'boolean') {
              return postSystemLibUnitAdd({ req: values }).then(({ data }) => {
                if (data?.code === 200) {
                  Toast('success', I18N.Factors.newSuccessfullyAdded);
                  closeModal(true);
                }
              });
            }
            return postSystemLibUnitEdit({
              req: { ...values, id: addModal },
            }).then(({ data }) => {
              if (data?.code === 200) {
                Toast('success', I18N.dashborad.editSuccessful);
                closeModal(true);
                modalForm.removeEffects(addTypeChangeEffectId);
                modalForm.reset();
                setAddModal(false);
              }
            });
          });
        }}
      >
        <Form form={modalForm}>
          <SchemaProvider
            schema={modalSchema()}
            scope={{ validateTip: I18N.dashborad.pleaseModifyUnit }}
          />
        </Form>
      </Modal>
    </Page>
  );
};

export default Dict;

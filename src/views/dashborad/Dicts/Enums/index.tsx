/*
 * @@description:数据字典 枚举值
 */

import { PlusOutlined } from '@ant-design/icons';
import {
  Form,
  FormItem,
  FormLayout,
  Input,
  NumberPicker,
  Select,
} from '@formily/antd-v5';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import I18N from '@src/lang/I18N';
import { Modal } from 'antd';
import { isBoolean } from 'lodash-es';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SearchProps } from 'table-render/dist/src/types';

import { FormActions } from '@/components/FormActions';
import { LocaleContext } from '@/components/LocaleProvider';
import { Page } from '@/components/Page';
import { CustomTableRender } from '@/components/x-render/TableRender';
import { useTableRef as useTable } from '@/components/x-render/TableRender/hook/useTableRef';
import {
  DictTypeResp,
  getSystemDictenumPage,
  getSystemDictenumPageProps,
  getSystemDicttypePage,
  postSystemDictenumEdit,
  postSystemDictenumAdd,
} from '@/sdks/systemV2ApiDocs';
import {
  Toast,
  changeTableColumnsNoText,
  getSearchParams,
  updateUrl,
} from '@/utils';
import { useIndexColumn } from '@/utils/columns';

import style from './index.module.less';
import { useDictType } from '../hooks';
import {
  TypeLanuageDictTypeResp,
  dictAddSchema,
  dictColumns,
  dictSearchSchema,
} from './utils/columns';

const SchemaField = createSchemaField({
  components: {
    FormItem,
    Input,
    FormLayout,
    NumberPicker,
    Select,
  },
});

const DictType = () => {
  const { locale } = useContext(LocaleContext);

  const [searchParams, setSearchParams] = useState<
    Record<string, string | number>
  >(getSearchParams()[0]);
  const { id: dictType } = useParams<{ id: string }>();
  const { refresh, tableRef } = useTable();
  const form = tableRef.current?.form;
  const modalForm = useMemo(createForm, []);
  // 编辑时存放id，其它时候是boolean
  const [isModalVisible, setIsModalVisible] = useState<
    string | number | boolean
  >();
  const indexColumn = useIndexColumn<any>(
    (Number(searchParams?.pageNum) - 1) * Number(searchParams?.pageSize),
  );
  // table 标题 - 字典名称
  const [dict, setDict] = useState<DictTypeResp>();
  // 字典枚举值
  const dictSourceType = useDictType(dictType);
  useEffect(() => {
    getSystemDicttypePage({
      dictType,
      pageNum: 1,
      pageSize: 1,
      dictName: '',
    }).then(({ data }) => {
      setDict(data?.data?.list?.[0]);
    });
  }, [dictType]);

  // 用于修正第一次页码无法正常设置问题
  const isFirstLoad = useRef(true);
  const searchApi: SearchProps<DictTypeResp>['api'] = ({
    current,
    ...args
  }: {
    current: number;
  }) => {
    const pageNum: number =
      (isFirstLoad.current ? Number(searchParams.pageNum) : current) || current;
    let newSearch = {
      ...args,
      ...searchParams,
      pageNum,
      dictType,
    } as getSystemDictenumPageProps;
    if (!isFirstLoad.current) {
      newSearch = {
        ...args,
        pageNum,
        dictType,
      } as getSystemDictenumPageProps;
      updateUrl(args);
    } else {
      form?.setValues({ ...newSearch });
    }
    setSearchParams({ ...args, pageNum });
    isFirstLoad.current = false;
    return getSystemDictenumPage(newSearch).then(({ data }) => {
      return {
        rows: data?.data?.list || [],
        total: data?.data?.total || 0,
      };
    });
  };
  const modalClose = (isRefresh?: boolean) => {
    if (isRefresh !== false) refresh?.();
    setIsModalVisible(false);
    modalForm.reset();
    modalForm.setFieldState('dictValue', {
      editable: true,
    });
  };
  const dictLabelObj: TypeLanuageDictTypeResp = {
    'en-US': 'dictNameLanguage',
    'zh-CN': 'dictName',
  };
  const dictLabelMapObj = {
    'en-US': 'dictLabelLanguage',
    'zh-CN': 'dictLabel',
  };
  const getsourceTypefn = () => {
    modalForm.setFieldState('sourceType', {
      dataSource: dictSourceType.map(s => ({
        // @ts-ignore
        label: s?.[dictLabelMapObj?.[locale]],
        value: s.dictValue,
      })),
    });
  };

  return (
    <Page
      title=''
      wrapperClass={style.wrapper}
      actionBtnChildArr={[
        {
          button: (
            <div className={style.headerAction}>
              <PlusOutlined /> {I18N.Factors.newAddition}
            </div>
          ),
          click: () => {
            setIsModalVisible(true);
            getsourceTypefn();
          },
        },
      ]}
    >
      <CustomTableRender
        tableRef={tableRef}
        searchProps={{
          schema: dictSearchSchema({ dictSourceType }),
          className: style.search,
          api: searchApi,
        }}
        tableProps={{
          title: (
            <div className={style.title}>
              <span>
                {I18N.dashborad.dictionaryName}
                {
                  // @ts-ignore
                  dict?.[dictLabelObj?.[locale]]
                }
              </span>
              <span>
                {I18N.dashborad.dictionaryIdentification}
                {dictType}
              </span>
            </div>
          ),
          columns: changeTableColumnsNoText(
            [
              ...indexColumn,
              ...dictColumns({
                locale,
                onEdit: async row => {
                  setIsModalVisible(row.id as number);
                  // 字典标识不能修改
                  const setFormValue = () => {
                    modalForm.setValues(row);
                    modalForm.setFieldState('dictValue', {
                      editable: false,
                    });

                    getsourceTypefn();
                  };
                  // 第一次
                  modalForm.onMount = () => {
                    setFormValue();
                  };
                  setFormValue();
                },
                refresh,
              }),
            ],
            '-',
          ),
          pagination: {
            pageSize: searchParams?.pageSize
              ? +searchParams.pageSize
              : undefined,
            current: searchParams?.pageNum ? +searchParams.pageNum : undefined,
          },
        }}
      />
      <Modal
        open={!!isModalVisible}
        width={440}
        centered
        maskClosable={false}
        title={
          isBoolean(isModalVisible)
            ? I18N.dashborad.addEnum
            : I18N.dashborad.editEnum
        }
        okText={I18N.Factors.preserve}
        onOk={async () => {
          modalForm.submit(values => {
            if (typeof isModalVisible === 'boolean') {
              return postSystemDictenumAdd({
                req: { ...values, dictType },
              }).then(({ data }) => {
                if (data?.code === 200) {
                  Toast('success', I18N.dashborad.addEnumerationValue);
                  modalClose();
                }
              });
            }
            return postSystemDictenumEdit({
              req: { ...values, id: isModalVisible },
            }).then(({ data }) => {
              if (data?.code === 200) {
                Toast('success', I18N.dashborad.editEnumerationValues);
                modalClose();
              }
            });
          });
        }}
        onCancel={() => modalClose(false)}
        cancelText={I18N.Factors.cancel}
      >
        <Form form={modalForm}>
          <SchemaField schema={dictAddSchema()} />
        </Form>
      </Modal>
      <FormActions
        place='center'
        buttons={[
          {
            title: I18N.Factors.return,

            onClick: async () => history.back(),
          },
        ]}
      />
    </Page>
  );
};

export default DictType;

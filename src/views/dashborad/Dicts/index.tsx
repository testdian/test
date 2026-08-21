/*
 * @@description:数据字典
 */

import { PlusOutlined } from '@ant-design/icons';
import { Form, FormItem, FormLayout, Input } from '@formily/antd-v5';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import I18N, { serviceLangMap } from '@src/lang/I18N';
import { Button, Modal, Space } from 'antd';
import { compact, isBoolean } from 'lodash-es';
import { useContext, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchProps } from 'table-render/dist/src/types';

import { LocaleContext } from '@/components/LocaleProvider';
import { Page } from '@/components/Page';
import { TextArea } from '@/components/formily/TextArea';
import { CustomTableRender } from '@/components/x-render/TableRender';
import { useTableRef as useTable } from '@/components/x-render/TableRender/hook/useTableRef';
import { checkAuth } from '@/layout/utills';
import {
  DictTypeResp,
  getSystemDicttypePage,
  getSystemDicttypePageProps,
  postSystemDicttypeAdd,
  postSystemDicttypeEdit,
} from '@/sdks/systemV2ApiDocs';
import { Toast, getSearchParams, updateUrl } from '@/utils';
import { useIndexColumn } from '@/utils/columns';

import ImportModal from './ImportModal';
import { dictAddSchema, dictColumns, dictSearchSchema } from './utils/columns';

const SchemaField = createSchemaField({
  components: {
    FormItem,
    Input,
    FormLayout,
    TextArea,
  },
});

const Dict = () => {
  const { locale } = useContext(LocaleContext);

  const [searchParams, setSearchParams] = useState<
    Record<string, string | number>
  >(getSearchParams()[0]);
  const { refresh, tableRef } = useTable();
  const form = tableRef.current?.form;
  const navigate = useNavigate();
  const modalForm = useMemo(createForm, []);
  // 编辑时存放id，其它时候是boolean
  const [isModalVisible, setIsModalVisible] = useState<
    string | number | boolean
  >();
  const indexColumn = useIndexColumn<any>(
    (Number(searchParams?.pageNum) - 1) * Number(searchParams?.pageSize),
  );
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
    } as getSystemDicttypePageProps;
    if (!isFirstLoad.current) {
      newSearch = {
        ...args,
        pageNum,
      } as getSystemDicttypePageProps;
      updateUrl(newSearch);
    } else {
      form?.setValues({ ...newSearch });
    }
    setSearchParams({ ...args, pageNum });
    isFirstLoad.current = false;
    return getSystemDicttypePage(newSearch).then(({ data }) => {
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
    modalForm.setFieldState('dictType', {
      editable: true,
    });
  };

  /** 导入弹窗 */
  const [importModalVisible, setImportModalVisible] = useState(false);

  return (
    <Page
      title={I18N.dashborad.dataDictionary}
      rightRender={
        <Space>
          {compact([
            checkAuth(
              '/dicttype/add',
              <Button
                type='primary'
                onClick={() => {
                  setIsModalVisible(true);
                }}
              >
                <PlusOutlined />
                {I18N.Factors.newAddition}
              </Button>,
            ),
            checkAuth(
              '/dict/import',
              <Button
                onClick={() => {
                  setImportModalVisible(true);
                }}
              >
                {I18N.carbonFootPrint.import}
              </Button>,
            ),
          ])}
        </Space>
      }
    >
      <CustomTableRender
        tableRef={tableRef}
        searchProps={{
          schema: dictSearchSchema(),
          api: searchApi,
        }}
        tableProps={{
          columns: [
            ...indexColumn,
            ...dictColumns({
              refresh,
              locale,
              navigate,
              onEdit: async row => {
                setIsModalVisible(row.id);
                // 字典标识不能修改
                const setFormValue = () => {
                  modalForm.setValues(row);
                  modalForm.setFieldState('dictType', {
                    editable: false,
                  });
                };
                // 第一次
                modalForm.onMount = () => {
                  setFormValue();
                };
                setFormValue();
              },
            }),
          ],
          pagination: {
            pageSize: searchParams?.pageSize
              ? +searchParams.pageSize
              : undefined,
            current: searchParams?.pageNum ? +searchParams.pageNum : undefined,
          },
        }}
        autoFixNoText
      />
      <Modal
        open={!!isModalVisible}
        maskClosable={false}
        width={540}
        title={
          isBoolean(isModalVisible)
            ? I18N.dashborad.addDictionary
            : I18N.dashborad.editDictionary
        }
        okText={I18N.Factors.preserve}
        onOk={async () => {
          modalForm.submit(values => {
            if (typeof isModalVisible === 'boolean') {
              return postSystemDicttypeAdd({
                req: { ...values, langType: serviceLangMap[locale] },
              }).then(({ data }) => {
                if (data?.code === 200) {
                  Toast('success', I18N.dashborad.addDictionaryAs);
                  modalClose();
                }
              });
            }
            return postSystemDicttypeEdit({
              req: { ...values, id: isModalVisible },
            }).then(({ data }) => {
              if (data?.code === 200) {
                Toast('success', I18N.dashborad.editDictionaryInto);
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

      {/* 批量导入 */}
      <ImportModal
        isView={false}
        visible={importModalVisible}
        onOk={() => {
          setImportModalVisible(false);
          refresh?.();
        }}
        onCancel={() => {
          setImportModalVisible(false);
          refresh?.();
        }}
      />
    </Page>
  );
};

export default Dict;

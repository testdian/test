/**
 * @description 编辑控制计划
 */
import I18N from '@src/lang/I18N';
import { Tabs } from 'antd';
import { compact } from 'lodash-es';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import { FormActions } from '@/components/FormActions';
import { useLanguage } from '@/hooks';
import {
  ControlPlanResp,
  getComputationControlPlanId,
} from '@/sdks/computation/computationV2ApiDocs';

import { FormFore, SubmitFormForeRef } from './component/FromFore';
import { FormOne, SubmitFormOneRef } from './component/FromOne';
import { FromSix, SubmitFormSixRef } from './component/FromSix';
import { FormRef, FormTwo } from './component/FromTwo';
import { TableFive } from './component/TableFive';
import { TableThree } from './component/TableThree';
import style from './index.module.less';
import { returnReportText } from '../../util/utils';
// 左侧导航
const tabList = [
  { key: '1', label: I18N.eca.versionAndRevision },
  {
    key: '2',
    label: I18N.eca.organizationalBasicInformation,
  },
  { key: '3', label: I18N.eca.mainProductsOr },
  { key: '4', label: I18N.eca.organizationalBoundaries },
  {
    key: '5',
    label: I18N.eca.dataManagementMeter,
  },
  {
    key: '6',
    label: I18N.eca.dataQualityManagement,
  },
];

const ControlPlan = () => {
  const childRef = useRef<FormRef>();
  const childRefFormOne = useRef<SubmitFormOneRef>();
  const childRefFormFore = useRef<SubmitFormForeRef>();
  const childRefFormSix = useRef<SubmitFormSixRef>();

  const { id } = useParams<{
    id: string;
  }>();
  const SearchcurrentPlanIndex =
    new URLSearchParams(location.search).get('currentPlanIndex') || '';
  const currentStandardValue =
    new URLSearchParams(location.search).get('currentStandard') || '';

  /** 控制当前计划**/
  const [currentPlanIndex, changeCurrentPlanIndex] = useState(1);
  /** 控制是否编辑***/
  const [isEdit, changeIsEdit] = useState(false);
  // 当前标准计划
  const [currentStandard, changeCurrentStandard] = useState('GHG');
  // 修改当前history
  const changeHisToryFn = (urlParamsData: string) => {
    window.history.replaceState(null, '', urlParamsData);
  };
  // 控制计划详情
  const [currentPlanDetail, changeCurrentPlanDetail] =
    useState<ControlPlanResp>({});
  // 组织基本信息 详情
  const [orgDetail, getOrgDetail] = useState<ControlPlanResp['org']>({});
  // 编辑 用于存储过的语言id
  // const [langIdObj, setLangIdObj] = useState<{ [key: string]: number }>({});
  // console.log(langIdObj);
  const gasEnums = useLanguage();

  const controlPlanIdFn = async () => {
    await getComputationControlPlanId({ id: Number(id) }).then(({ data }) => {
      if (data.code === 200) {
        changeCurrentPlanDetail({ ...data.data });
        getOrgDetail({
          ...data.data?.org,
          planeImg: data.data?.org?.planeImg
            ? JSON.parse(data.data?.org?.planeImg)
            : [],
          gasGroupImg: data.data?.org?.gasGroupImg
            ? JSON.parse(data.data?.org?.gasGroupImg)
            : [],
        });
      }
    });
  };
  useEffect(() => {
    controlPlanIdFn();
  }, []);
  // 编辑完成后的调用方法
  const submitFinishFn = () => {
    controlPlanIdFn();
    changeIsEdit(false);
  };
  useEffect(() => {
    changeCurrentPlanIndex(Number(SearchcurrentPlanIndex || 1));
  }, [SearchcurrentPlanIndex]);
  useEffect(() => {
    changeCurrentStandard(currentStandardValue || 'GHG');
  }, [currentStandardValue]);
  return (
    <div className={style.wrap}>
      {returnReportText()}
      <Tabs
        items={tabList}
        className='customTabs'
        onChange={index => {
          changeIsEdit(false);
          changeCurrentPlanIndex(Number(index));
          let urlParamsData = '';
          if (Number(index) === 3) {
            urlParamsData = `?id=${id}&currentPlanIndex=${index}&currentStandard=GHG`;
            changeCurrentStandard('GHG');
          } else {
            urlParamsData = `?id=${id}&currentPlanIndex=${index}`;
          }
          changeHisToryFn(urlParamsData);
        }}
        activeKey={`${currentPlanIndex}`}
      />
      {/* 版本及修订表单*/}
      <FormOne
        isEdit={isEdit}
        childRefFormOne={childRefFormOne}
        currentPlanIndex={currentPlanIndex}
        formValue={currentPlanDetail}
        controlPlanIdFn={submitFinishFn}
      />
      {/* 组织基本信息 */}
      <FormTwo
        isEdit={isEdit}
        cRef={childRef}
        currentPlanIndex={currentPlanIndex}
        formValue={orgDetail}
        controlPlanIdFn={submitFinishFn}
        gasEnums={gasEnums}
        // langIdObj={langIdObj}
      />
      {/* 主营业务产品或服务 */}
      {currentPlanIndex === 3 && <TableThree />}
      {/* 组织边界 */}
      <FormFore
        isEdit={isEdit}
        currentPlanIndex={currentPlanIndex}
        cRef={childRefFormFore}
        formValue={currentPlanDetail}
        controlPlanIdFn={submitFinishFn}
        gasEnums={gasEnums}
      />
      {/* 数据管理计划 */}
      {currentPlanIndex === 5 && (
        <TableFive
          changeHisToryFn={changeHisToryFn}
          currentPlanIndex={currentPlanIndex}
          formValue={currentPlanDetail}
          currentStandard={currentStandard}
          changeCurrentStandard={changeCurrentStandard}
        />
      )}
      {/* 数据质量管理规定 */}
      <FromSix
        isEdit={isEdit}
        currentPlanIndex={currentPlanIndex}
        cRef={childRefFormSix}
        formValue={currentPlanDetail}
        controlPlanIdFn={submitFinishFn}
      />
      <FormActions
        place='center'
        buttons={compact([
          window.location.pathname.indexOf('edit') >= 0 &&
            [3, 5].indexOf(currentPlanIndex) === -1 && {
              title: isEdit ? I18N.Factors.preserve : I18N.Factors.edit,
              type: 'primary',
              onClick: async () => {
                if (!isEdit) {
                  changeIsEdit(!isEdit);
                } else {
                  if (currentPlanIndex === 1) {
                    childRefFormOne?.current?.submitFormOne();
                  }
                  if (currentPlanIndex === 2) {
                    childRef?.current?.submit();
                  }
                  if (currentPlanIndex === 4) {
                    childRefFormFore?.current?.submitFormFore();
                  }
                  if (currentPlanIndex === 6) {
                    childRefFormSix?.current?.submitFormSix();
                  }
                }
              },
            },
          {
            title: isEdit ? I18N.Factors.cancel : I18N.Factors.return,
            onClick: async () => {
              isEdit ? changeIsEdit(!isEdit) : history.go(-1);
            },
          },
        ])}
      />
    </div>
  );
};

export default ControlPlan;

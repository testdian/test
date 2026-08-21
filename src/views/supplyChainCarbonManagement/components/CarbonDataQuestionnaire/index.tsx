/**
 * @description:供应商碳数据/审核/填报-填报数据（问卷）
 */

import I18N from '@src/lang/I18N';
import { Card, Checkbox, Input, Radio, Tooltip } from 'antd';
import { compact, filter, has, includes, isEmpty } from 'lodash-es';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { FormActions } from '@/components/FormActions';
import { PageTypeInfo } from '@/router/utils/enums';
import {
  QuestionnaireResp,
  getSupplychainDataQuestionnaireQuestionListApplyInfoId,
  getSupplychainQuestionnaireDataApplyInfoId,
  postSupplychainDataQuestionnaireSave,
  postSupplychainDataQuestionnaireSaveAndSubmit,
} from '@/sdks_v2/new/supplychainV2ApiDocs';
import { Toast } from '@/utils';

import style from './index.module.less';
import { questionTypes } from '../../utils';
import { QuestionOpts } from '../../utils/type';

const CarbonDataQuestionnaire = (props: {
  isFill?: boolean;
  applyInfoId?: number;
}) => {
  const { isFill, applyInfoId } = props;

  const { pageTypeInfo, id } = useParams<{
    pageTypeInfo: PageTypeInfo;
    id: string;
  }>();

  /** 是否为详情页面 */
  const isDetail = pageTypeInfo === PageTypeInfo.show;

  /** 问卷数据 */
  const [questionnaireData, setQuestionnaireData] =
    useState<QuestionnaireResp>();

  /** 题目列表 */
  const [questionList, setQuestionList] = useState<QuestionOpts[]>([]);

  /** 获取问卷数据 */
  const getQuestionArr = async () => {
    if (isFill) {
      await getSupplychainDataQuestionnaireQuestionListApplyInfoId({
        applyInfoId: Number(id),
      }).then(({ data }) => {
        const currentQuestionList = data?.data?.questionList || [];
        setQuestionnaireData(data?.data);
        setQuestionList(currentQuestionList);
      });
    } else {
      await getSupplychainQuestionnaireDataApplyInfoId({
        applyInfoId: Number(applyInfoId) || Number(id),
      }).then(({ data }) => {
        const currentQuestionList = data?.data?.questionList || [];
        setQuestionnaireData(data?.data);
        setQuestionList(currentQuestionList);
      });
    }
  };

  useEffect(() => {
    if (id) {
      getQuestionArr();
    }
  }, [id]);

  /** 禁用-除碳数据填报编辑页 */
  const disabled = !isFill || isDetail;

  /** 题型 */
  const { RadioQuestion, CheckboxQuestion, DetermineQuestion, FillQuestion } =
    questionTypes;

  /** 处理答案 */
  const handleAnswerChange = (questionId: number, answer: any) => {
    setQuestionList(prevQuestions =>
      prevQuestions.map(question => {
        const newAnswer = { ...question, answer };
        return question.id === questionId ? newAnswer : question;
      }),
    );
  };

  /** 不同题型返回内容 */
  const questionTypeRender = (type: number, question: QuestionOpts) => {
    switch (type) {
      case RadioQuestion:
        return (
          <Radio.Group
            disabled={disabled}
            defaultValue={`${question.answer}`}
            onChange={e => {
              question.answer = e.target.value;
              handleAnswerChange(Number(question?.id), e.target.value);
            }}
          >
            {question.optionList?.map(item => {
              return (
                <>
                  <Radio
                    className={style.options}
                    key={item.optionId}
                    value={`${item.optionId}`}
                  >
                    <Tooltip title={item?.content}>
                      <p className={style.optionTextOverflow}>
                        {item.blankRequired && (
                          <span className={style.requiredStar}>*</span>
                        )}
                        {item?.content}
                      </p>
                    </Tooltip>
                    {item?.description && (
                      <Tooltip
                        title={item?.description}
                        className={style.optionsTip}
                      >
                        <p>{item?.description}</p>
                      </Tooltip>
                    )}
                    {(item.allowFillBlanks || item.blankRequired) && (
                      <Input
                        placeholder={isDetail ? '-' : I18N.base.pleaseEnter}
                        className={style.fillBlank}
                        disabled={disabled}
                        maxLength={100}
                        defaultValue={item.ext}
                        key={item.optionId}
                        onChange={e => {
                          item.ext = e.target.value;
                        }}
                      />
                    )}
                  </Radio>
                  <br />
                </>
              );
            })}
          </Radio.Group>
        );
      case CheckboxQuestion:
        const checkboxValue =
          question?.answer && question?.answer.includes(',')
            ? question.answer.split(',')
            : [question.answer];
        return (
          <Checkbox.Group
            disabled={disabled}
            defaultValue={checkboxValue}
            onChange={e => {
              question.answer = e;
              handleAnswerChange(Number(question?.id), e);
            }}
          >
            {question.optionList?.map(item => {
              return (
                <>
                  <Checkbox
                    className={style.options}
                    key={item.optionId}
                    value={`${item.optionId}`}
                    onChange={e =>
                      handleAnswerChange(Number(question?.id), e.target.value)
                    }
                  >
                    <Tooltip title={item?.content}>
                      <p className={style.optionTextOverflow}>
                        {item.blankRequired && (
                          <span className={style.requiredStar}>*</span>
                        )}
                        {item?.content}
                      </p>
                    </Tooltip>
                    {item?.description && (
                      <Tooltip
                        title={item?.description}
                        className={style.optionsTip}
                      >
                        <p>{item?.description}</p>
                      </Tooltip>
                    )}
                    {(item.allowFillBlanks || item.blankRequired) && (
                      <Input
                        placeholder={isDetail ? '-' : I18N.base.pleaseEnter}
                        className={style.fillBlank}
                        disabled={disabled}
                        maxLength={100}
                        defaultValue={item.ext}
                        key={item.optionId}
                        onChange={e => {
                          item.ext = e.target.value;
                        }}
                      />
                    )}
                  </Checkbox>
                  <br />
                </>
              );
            })}
          </Checkbox.Group>
        );
      case DetermineQuestion:
        return (
          <Radio.Group
            disabled={disabled}
            value={question.answer}
            onChange={e => {
              question.answer = e.target.value;
              handleAnswerChange(Number(question?.id), e.target.value);
            }}
          >
            <Radio value='1' key='1' className={style.labelText}>
              {I18N.eca.yes}
            </Radio>
            <Radio value='0' key='0' className={style.labelText}>
              {I18N.eca.no}
            </Radio>
          </Radio.Group>
        );
      case FillQuestion:
        return (
          <Input
            placeholder={isDetail ? '-' : I18N.base.pleaseEnter}
            className={style.questionCardInput}
            disabled={disabled}
            defaultValue={question.answer}
            key={question.id}
            onChange={e => {
              question.answer = e.target.value;
              handleAnswerChange(Number(question?.id), e.target.value);
            }}
          />
        );
      default:
        return '';
    }
  };

  /** 题目卡片 */
  const getCards = () => {
    return questionList?.map((item, index) => {
      const { required, title, tips, questionType } = item;
      if (
        Number(questionType) === RadioQuestion ||
        Number(questionType) === CheckboxQuestion
      ) {
        item.optionList = item.answerExt
          ? JSON.parse(item.answerExt)
          : item.optionList;
      }
      return (
        <Card className={style.showOnly} key={item.id} bordered={false}>
          <Tooltip title={title}>
            <h3 className={style.textOverflow}>
              {required && <span className={style.requiredStar}>*</span>}
              {index + 1}.{title}
            </h3>
          </Tooltip>

          <Tooltip title={tips}>
            <p className={style.textOverflowTips}>{tips}</p>
          </Tooltip>

          {questionTypeRender(Number(questionType), item)}
        </Card>
      );
    });
  };

  /** 校验必填项 */
  const canSubmit = (questionAnswer: QuestionOpts[]) => {
    let verification = false;

    /** 校验必选题 */
    const requiredQuestion = questionAnswer.filter(item => {
      return item.required === true;
    });
    const questionPass = requiredQuestion.every(
      item => item.answer && item.answer !== 'null',
    );

    if (questionPass) {
      /** 校验单选题必填补充 */
      const radioQuestionList = questionAnswer?.filter(item => {
        return Number(item.questionType) === RadioQuestion;
      });
      const selectedRadio = radioQuestionList?.map(item => {
        return filter(item.optionList, {
          optionId: Number(item.answer),
          blankRequired: true,
        })[0];
      });
      const radioPass =
        typeof selectedRadio[0] !== 'object' ||
        selectedRadio?.every(item => has(item, 'ext') && !isEmpty(item?.ext));

      /** 校验多选题必填补充 */
      const checkboxQuestionList = questionAnswer.filter(item => {
        return Number(item.questionType) === CheckboxQuestion;
      });
      const selectedCheckbox = checkboxQuestionList?.map(item => {
        return item?.optionList?.filter(option => {
          return (
            includes(item.answer, `${option.optionId}`) && option.blankRequired
          );
        });
      });
      const checkboxSelectList = selectedCheckbox?.flat();
      const checkboxPass =
        checkboxSelectList?.length === 0 ||
        checkboxSelectList?.every(
          item => has(item, 'ext') && !isEmpty(item?.ext),
        );

      verification = radioPass && checkboxPass;
    }

    return verification;
  };

  return (
    <div className={style.supplyQuestionnaireInfoWrapper}>
      <div className={style.designHead}>
        <h3>{questionnaireData?.questionnaireName || ''}</h3>
        <p>{questionnaireData?.questionnaireDesc || ''}</p>
      </div>

      <div className={style.previewCards}>{getCards()}</div>

      {isFill && (
        <FormActions
          place='center'
          buttons={compact([
            !isDetail && {
              title: I18N.supplyChainCarbonManagement.saveAndSubmit,
              type: 'primary',
              onClick: async () => {
                if (canSubmit(questionList)) {
                  const submitAnswerList = questionList.map(item => {
                    return {
                      questionId: item.id,
                      answer: item.answer ? `${item.answer}` : item.answer,
                      answerExt: JSON.stringify(item.optionList),
                    };
                  });
                  await postSupplychainDataQuestionnaireSaveAndSubmit({
                    req: {
                      answerList: submitAnswerList,
                      applyInfoId: Number(id),
                    },
                  }).then(({ data }) => {
                    if (data.code === 200) {
                      Toast('success', I18N.Factors.saveSuccessful);
                      history.back();
                    }
                  });
                } else {
                  Toast(
                    'error',
                    I18N.supplyChainCarbonManagement
                      .thereAreMandatoryFieldsThatAreNotFilledIn,
                  );
                }
              },
            },
            !isDetail && {
              title: I18N.Factors.preserve,
              onClick: async () => {
                const submitAnswerList = questionList.map(item => {
                  return {
                    questionId: item.id,
                    answer: item.answer ? `${item.answer}` : item.answer,
                    answerExt: JSON.stringify(item.optionList),
                  };
                });
                await postSupplychainDataQuestionnaireSave({
                  req: {
                    answerList: submitAnswerList,
                    applyInfoId: Number(id),
                  },
                }).then(({ data }) => {
                  if (data.code === 200) {
                    Toast('success', I18N.Factors.saveSuccessful);
                    history.back();
                  }
                });
              },
            },
            {
              title: I18N.Factors.return,
              onClick: async () => {
                history.back();
              },
            },
          ])}
        />
      )}
    </div>
  );
};
export default CarbonDataQuestionnaire;

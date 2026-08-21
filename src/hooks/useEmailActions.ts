import I18N from '@/lang/I18N';
import { PageTypeInfo } from '@/router/utils/enums';
import { modal } from '@/store/module/notification';
import { SEND_ACTION_TYPE } from '@/views/dashborad/EmailSendingRecord/constant';
import {
  resendEmailSendingRecordApi,
  cancelEmailSendingRecordApi,
  cancelEmailSendingTaskApi,
} from '@/views/dashborad/EmailSendingRecord/service';
import { EmailTemplateListType } from '@/views/dashborad/EmailSendingRecord/type';

export const useEmailActions = (
  tableRef: any,
  setModelAction: (actionType: PageTypeInfo) => void,
  showDrawer: () => void,
  setEmailTemplateDetail: React.Dispatch<
    React.SetStateAction<EmailTemplateListType | undefined>
  >,
) => {
  const { EDIT, SHOW, RESEND, CANCEL } = SEND_ACTION_TYPE;

  const handelActionType = async (
    type: string,
    record: EmailTemplateListType,
  ) => {
    if (!record.id) {
      return;
    }
    switch (type) {
      case EDIT:
        setEmailTemplateDetail(record);
        setModelAction(EDIT as PageTypeInfo);
        showDrawer();
        break;
      case SHOW:
        setEmailTemplateDetail(record);
        setModelAction(SHOW as PageTypeInfo);
        showDrawer();
        break;
      case RESEND:
        modal.confirm({
          title: I18N.Factors.prompt,
          content: I18N.utils.pleaseConfirmIfItIs,
          onOk: async () => {
            await resendEmailSendingRecordApi({ id: Number(record.id) });
            tableRef?.current?.refresh();
          },
        });
        break;
      case CANCEL:
        modal.confirm({
          title: I18N.Factors.prompt,
          content: I18N.utils.pleaseConfirmIfItIs2,
          onOk: async () => {
            if (record?.childrenFlag === 1) {
              await cancelEmailSendingRecordApi({ id: Number(record.id) });
            } else {
              await cancelEmailSendingTaskApi({ id: Number(record.id) });
            }
            tableRef?.current?.refresh();
          },
        });
        break;
      default:
        break;
    }
  };

  return { handelActionType };
};

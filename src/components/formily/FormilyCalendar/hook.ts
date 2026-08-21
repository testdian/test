import { createStyles } from 'antd-style';

export const useCalendarStyle = createStyles(({ css, token }) => ({
  container: css`
    position: relative;
    display: flex;
    width: 470px;
    height: 380px;
    box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08);
    border-radius: ${token.borderRadiusLG}px;
    background: transparent;
  `,
  wrapper: css`
    position: relative;
    display: flex;
    width: 300px;
    display: block;
    box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08),
      0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
    border-radius: ${token.borderRadiusLG}px;
    overflow: hidden;
  `,
  dateCell: css`
    position: relative;
    height: 48px !important;
    padding: 4px !important;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      background-color: ${token.colorPrimaryBg};
    }
  `,
  current: css`
    background-color: ${token.colorPrimaryBg} !important;

    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 24px;
      height: 24px;
      border-radius: 50%;
      z-index: 1;
    }
  `,
  today: css`
    &::before {
      content: '';
      position: absolute;
      top: 4px;
      right: 4px;
      width: 4px;
      height: 4px;
      background-color: ${token.colorPrimary};
      border-radius: 50%;
    }
  `,
  disabled: css`
    opacity: 0.4;
    cursor: not-allowed !important;

    &:hover {
      background-color: transparent !important;
    }
  `,
  text: css`
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    font-size: 12px;
  `,
  lunar: css`
    font-size: 10px;
    color: ${token.colorTextSecondary};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  `,
  monthCell: css`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 60px;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      background-color: ${token.colorPrimaryBg};
    }
  `,
  monthCellCurrent: css`
    background-color: ${token.colorPrimaryBg} !important;
    color: ${token.colorPrimary};
  `,
  timeSelectorContainer: css`
    width: 168px;
    height: 100%;
    padding: 8px 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: end;
    background: transparent;
  `,
  timeSelector: css`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  `,
  timeColumn: css`
    flex: 1;
    width: 56px;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 300px;
    padding: 0 8px;
  `,
  timeLabel: css`
    padding: 2px 0 8px 0;
    font-size: 14px;
    color: ${token.colorText};
  `,
  timeWheel: css`
    width: 100%;
    max-height: 300px;
    padding-bottom: 238px;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: thin;
    scrollbar-color: var(--ant-color-text-tertiary) transparent;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
      display: none;
    }
  `,
  timeItem: css`
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    transition: all 0.2s;
    color: ${token.colorText};
  `,
  timeItemSelected: css`
    color: ${token.colorWhite};
    background-color: ${token.colorPrimary};
    border-radius: ${token.borderRadius}px;
  `,
  addTimeButton: css`
    width: 47px;
    margin-top: 8px;
    font-size: 12px;
  `,
  datePickerWrapper: css`
    min-height: 500px;
    position: relative;
  `,
  timeItemsContainer: css`
    margin-top: 8px;
    padding: 8px;
    background-color: ${token.colorBgContainer};
  `,
  timeItemsHeader: css`
    font-size: 12px;
    font-weight: 500;
    color: ${token.colorTextSecondary};
    margin-bottom: 4px;
  `,
  timeItemsList: css`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  `,
  timeItemTag: css`
    width: 180px;
    display: flex;
    align-items: center;
    padding: 4px 8px;
    gap: 10px;
    border: 1px solid ${token.colorBorder};
    border-radius: ${token.borderRadius}px;
    color: ${token.colorPrimaryText};
  `,
  holiday: css`
    color: #cf1322;
    background: #fff1f0;
    border-radius: 8px;
    position: relative;
  `,
  holidayTag: css`
    position: absolute;
    top: -6px;
    right: -4px;
    font-size: 10px;
    line-height: 1;
    padding: 1px 2px;
    border-radius: 4px;
    z-index: 2;
    pointer-events: none;
    background: #cf1322;
    color: #fff;
  `,
  weekend: css`
    color: #cf1322;
    position: relative;
  `,
  workday: css`
    color: #1677ff;
    position: relative;
  `,
  workdayTag: css`
    position: absolute;
    top: -6px;
    right: -4px;
    font-size: 10px;
    line-height: 1;
    padding: 1px 2px;
    border-radius: 4px;
    z-index: 2;
    pointer-events: none;
    background: #1677ff;
    color: #fff;
  `,
}));

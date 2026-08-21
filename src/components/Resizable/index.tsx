import close from '@src/image/close-icon.svg';
import { Resizable, ResizableProps } from 're-resizable';
import { useState, CSSProperties, FC, useRef, useEffect } from 'react';

import './index.less';

const COLLAPSED_WIDTH = 20;

const CustResizable: FC<{
  defaultPropsWidth?: number;
  /** 初始是否折叠，默认 false */
  defaultCollapsed?: boolean;
  /** 受控展开状态；设为 true 时自动展开 */
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  /** 折叠按钮位置：left 适合右侧抽屉，right 适合左侧面板 */
  handlePosition?: 'left' | 'right';
  style?: CSSProperties;
  resizeProp?: ResizableProps;
  childRender: () => React.ReactNode;
  resizableCurrentSize?: (size: { width: number; height: number }) => void;
}> = ({
  style,
  resizeProp,
  childRender,
  resizableCurrentSize,
  defaultPropsWidth = 220,
  defaultCollapsed = false,
  expanded,
  onExpandedChange,
  handlePosition = 'right',
}) => {
  const isControlled = expanded !== undefined;
  const [internalExpanded, setInternalExpanded] = useState(!defaultCollapsed);
  const isExpanded = isControlled ? expanded : internalExpanded;

  const [panelWidth, setPanelWidth] = useState(
    defaultCollapsed ? COLLAPSED_WIDTH : defaultPropsWidth,
  );
  const resizableBox = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isExpanded) {
      setPanelWidth(w => (w === COLLAPSED_WIDTH ? defaultPropsWidth : w));
    } else {
      setPanelWidth(COLLAPSED_WIDTH);
    }
  }, [isExpanded, defaultPropsWidth]);

  const notifySize = () => {
    const box = resizableBox.current;
    if (!box) return;
    resizableCurrentSize?.({
      width: panelWidth === COLLAPSED_WIDTH ? COLLAPSED_WIDTH : box.offsetWidth,
      height: box.offsetHeight,
    });
  };

  useEffect(() => {
    notifySize();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 宽度/展开态变化时同步外部
  }, [panelWidth, isExpanded]);

  const handleToggle = () => {
    const next = !isExpanded;
    if (!isControlled) {
      setInternalExpanded(next);
    }
    onExpandedChange?.(next);
  };

  const isCollapsed = panelWidth === COLLAPSED_WIDTH;
  const isLeftHandle = handlePosition === 'left';
  const toggleIconClass = isCollapsed ? 'close-icon closeable' : 'close-icon';

  const renderToggleIcon = (interactive = true) => (
    /* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */
    <img
      className={toggleIconClass}
      src={close}
      onClick={interactive ? handleToggle : undefined}
      alt=''
    />
  );

  const resizeHandleClass = isCollapsed ? 'hidden-handle' : 'drag-handle';

  return (
    <div
      className={`resizable-container${
        isLeftHandle ? ' resizable-container-left-handle' : ''
      }`}
      ref={resizableBox}
      style={{ ...style }}
    >
      <Resizable
        className={isLeftHandle ? 'resizable-drawer-panel' : undefined}
        maxWidth={500}
        minWidth={isCollapsed ? COLLAPSED_WIDTH : 140}
        handleWrapperClass={resizeHandleClass}
        enable={{ right: !isCollapsed }}
        size={{ width: panelWidth, height: '100%' }}
        style={isLeftHandle ? { transition: 'width 0.3s ease' } : undefined}
        onResize={notifySize}
        onResizeStop={(_e, _dir, ref) => {
          if (!isCollapsed) {
            setPanelWidth(ref.offsetWidth);
          }
        }}
        {...resizeProp}
      >
        {isLeftHandle ? (
          <div className='drawer-panel-inner'>
            <div className='drawer-handle'>
              <div
                className='drawer-toggle'
                onClick={handleToggle}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleToggle();
                  }
                }}
                role='button'
                tabIndex={0}
              >
                {renderToggleIcon(false)}
              </div>
            </div>
            {!isCollapsed && (
              <>
                <div className='drawer-body'>{childRender()}</div>
                <div className='drag-line' />
              </>
            )}
          </div>
        ) : (
          <>
            {renderToggleIcon()}
            {!isCollapsed && <div className='drag-line' />}
            {!isCollapsed && (
              <div
                style={{
                  height: '100%',
                  overflow: 'hidden',
                }}
              >
                {childRender()}
              </div>
            )}
          </>
        )}
      </Resizable>
    </div>
  );
};

export default CustResizable;

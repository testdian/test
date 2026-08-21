/**
 * @description 原型需求说明：右上角悬浮按钮 + 右侧抽屉汇总
 */
import { FileTextOutlined, SearchOutlined } from '@ant-design/icons';
import { Drawer, Input } from 'antd';
import classnames from 'classnames';
import { useEffect, useMemo, useRef, useState } from 'react';

import {
  PROTOTYPE_REQUIREMENTS,
  type PrototypeRequirementItem,
} from '@/config/prototypeRequirements';
import { resolveRequirementScreenshot } from '@/config/prototypeRequirementScreenshots';

import { RequirementScreenshot } from './RequirementScreenshot';
import styles from './index.module.less';

const FAB_SIZE = 48;
const FAB_STORAGE_KEY = 'carbon_prototype_requirement_fab_pos';
const DRAG_THRESHOLD = 6;

function clampFabPosition(x: number, y: number) {
  if (typeof window === 'undefined') {
    return { x, y };
  }
  const maxX = Math.max(0, window.innerWidth - FAB_SIZE);
  const maxY = Math.max(0, window.innerHeight - FAB_SIZE);
  return {
    x: Math.min(Math.max(0, x), maxX),
    y: Math.min(Math.max(0, y), maxY),
  };
}

function getDefaultFabPosition() {
  return clampFabPosition(window.innerWidth - 24 - FAB_SIZE, 72);
}

function readStoredFabPosition() {
  try {
    const raw = localStorage.getItem(FAB_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { x?: number; y?: number };
    if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
      return clampFabPosition(parsed.x, parsed.y);
    }
  } catch {
    // ignore invalid storage
  }
  return null;
}

function matchesRequirement(item: PrototypeRequirementItem, keyword: string) {
  const text = `${item.menu} ${item.feature} ${item.description}`.toLowerCase();
  return text.includes(keyword);
}

function RequirementItem({
  item,
  index,
}: {
  item: PrototypeRequirementItem;
  index: number;
}) {
  const screenshot = resolveRequirementScreenshot(item);

  return (
    <li className={styles.item}>
      <div className={styles.itemIndex}>{index + 1}</div>
      <div className={styles.itemBody}>
        <div className={styles.itemRow}>
          <span className={styles.itemLabel}>菜单</span>
          <span className={styles.itemValue}>{item.menu}</span>
        </div>
        <div className={styles.itemRow}>
          <span className={styles.itemLabel}>功能</span>
          <span className={styles.itemValue}>{item.feature}</span>
        </div>
        <div className={styles.itemRow}>
          <span className={styles.itemLabel}>需求描述</span>
          <span className={styles.itemValue}>{item.description}</span>
        </div>
        {screenshot && (
          <div className={styles.itemScreenshotBlock}>
            <span className={styles.itemLabel}>页面截图</span>
            <RequirementScreenshot
              src={screenshot}
              alt={`${item.menu}-${item.feature}`}
            />
          </div>
        )}
      </div>
    </li>
  );
}

export function RequirementSpecFab() {
  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [position, setPosition] = useState(() =>
    readStoredFabPosition() ?? getDefaultFabPosition(),
  );
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef({
    active: false,
    moved: false,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
    pointerId: -1,
  });

  useEffect(() => {
    const onResize = () => {
      setPosition(prev => clampFabPosition(prev.x, prev.y));
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const filteredRequirements = useMemo(() => {
    const trimmed = keyword.trim().toLowerCase();
    return PROTOTYPE_REQUIREMENTS.map((item, index) => ({ item, index })).filter(
      ({ item }) => !trimmed || matchesRequirement(item, trimmed),
    );
  }, [keyword]);

  const handleClose = () => {
    setOpen(false);
    setKeyword('');
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return;
    event.preventDefault();
    dragRef.current = {
      active: true,
      moved: false,
      startX: event.clientX,
      startY: event.clientY,
      originX: position.x,
      originY: position.y,
      pointerId: event.pointerId,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (!drag.active || event.pointerId !== drag.pointerId) return;

    const deltaX = event.clientX - drag.startX;
    const deltaY = event.clientY - drag.startY;
    if (
      !drag.moved &&
      (Math.abs(deltaX) > DRAG_THRESHOLD || Math.abs(deltaY) > DRAG_THRESHOLD)
    ) {
      drag.moved = true;
    }
    if (drag.moved) {
      setPosition(
        clampFabPosition(drag.originX + deltaX, drag.originY + deltaY),
      );
    }
  };

  const finishDrag = (event: React.PointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (!drag.active || event.pointerId !== drag.pointerId) return;

    drag.active = false;
    setDragging(false);
    event.currentTarget.releasePointerCapture(event.pointerId);

    if (drag.moved) {
      setPosition(prev => {
        const next = clampFabPosition(prev.x, prev.y);
        localStorage.setItem(FAB_STORAGE_KEY, JSON.stringify(next));
        return next;
      });
      return;
    }

    setOpen(true);
  };

  return (
    <>
      <button
        type='button'
        className={classnames(styles.fab, dragging && styles.fabDragging)}
        style={{ left: position.x, top: position.y }}
        title='需求说明（可拖动）'
        aria-label='需求说明'
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
      >
        <FileTextOutlined style={{ fontSize: 20 }} />
      </button>
      <Drawer
        title='需求说明'
        placement='right'
        width={560}
        open={open}
        onClose={handleClose}
        destroyOnClose
      >
        <div className={styles.hint}>
          以下内容汇总各页面黄色标注的需求说明，按菜单与功能顺序排列，供开发查阅。每条需求下方可查看对应页面截图（PNG
          存放在 public/prototype-requirements/）。
        </div>
        <Input
          allowClear
          prefix={<SearchOutlined style={{ color: 'rgba(0, 0, 0, 0.45)' }} />}
          placeholder='搜索菜单、功能或需求描述'
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          className={styles.search}
        />
        {filteredRequirements.length === 0 ? (
          <div className={styles.empty}>未找到匹配的需求说明</div>
        ) : (
          <ol className={styles.list}>
            {filteredRequirements.map(({ item, index }) => (
              <RequirementItem
                key={`${item.menu}-${item.feature}-${index}`}
                item={item}
                index={index}
              />
            ))}
          </ol>
        )}
        {keyword.trim() && filteredRequirements.length > 0 && (
          <div className={styles.searchSummary}>
            共 {filteredRequirements.length} 条匹配结果
          </div>
        )}
      </Drawer>
    </>
  );
}

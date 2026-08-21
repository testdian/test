import { RefObject, useEffect } from 'react';

import styles from './index.module.less';

function isInteractiveTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return !!target.closest(
    'input, textarea, button, a, .ant-input-number, .ant-select',
  );
}

function getScrollElements(wrap: HTMLElement) {
  return Array.from(
    wrap.querySelectorAll<HTMLElement>(
      '.ant-table-content, .ant-table-body, .ant-table-header',
    ),
  );
}

export function useHorizontalTableDrag(
  wrapRef: RefObject<HTMLElement | null>,
  deps: unknown[] = [],
) {
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    const bindDragScroll = () => {
      const scrollEl =
        (wrap.querySelector('.ant-table-content') as HTMLElement | null) ||
        (wrap.querySelector('.ant-table-body') as HTMLElement | null);
      if (!scrollEl) return false;

      let dragging = false;
      let startX = 0;
      let scrollStart = 0;

      const syncScrollLeft = (left: number) => {
        getScrollElements(wrap).forEach(el => {
          el.scrollLeft = left;
        });
      };

      const onMouseDown = (event: MouseEvent) => {
        if (isInteractiveTarget(event.target)) return;
        dragging = true;
        startX = event.clientX;
        scrollStart = scrollEl.scrollLeft;
        wrap.classList.add(styles.wrapDragging);
      };

      const onMouseMove = (event: MouseEvent) => {
        if (!dragging) return;
        event.preventDefault();
        syncScrollLeft(scrollStart - (event.clientX - startX));
      };

      const stopDragging = () => {
        dragging = false;
        wrap.classList.remove(styles.wrapDragging);
      };

      scrollEl.addEventListener('mousedown', onMouseDown);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', stopDragging);

      cleanup = () => {
        scrollEl.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', stopDragging);
        wrap.classList.remove(styles.wrapDragging);
      };
      return true;
    };

    const timer = window.setInterval(() => {
      if (disposed) return;
      if (bindDragScroll()) {
        window.clearInterval(timer);
      }
    }, 100);

    return () => {
      disposed = true;
      window.clearInterval(timer);
      cleanup?.();
    };
  }, deps);
}

export function sumColumnWidths(widths: Array<number | undefined>) {
  return widths.reduce<number>((total, width) => total + (width || 120), 0);
}

import { RefObject, useLayoutEffect } from "react";
import appStyles from "../components/app/app.module.css";
import { useWindowResize } from "./utils";

interface IUseScrollbarExtraParams {
  exclude?: RefObject<HTMLElement> | RefObject<HTMLElement>[];
  props?: any[];
  maxHeight?: number;
  isInModal?: boolean;
}

export function useScrollbar(
  ref: RefObject<HTMLElement>,
  {
    exclude = [],
    props = [],
    maxHeight,
    isInModal,
  }: IUseScrollbarExtraParams = {}
) {
  let arrExclude: RefObject<HTMLElement>[];

  if (exclude instanceof Array) {
    arrExclude = exclude;
  } else {
    arrExclude = [exclude];
  }

  const updateScrollbar = () => {
    const el = ref.current;

    if (!el) return;

    const bottom = arrExclude.reduce((acc, ref) => {
      const el = ref.current;
      if (!el) return acc;
      const style = getComputedStyle(el);

      return (
        acc +
        el.offsetHeight +
        parseInt(style.marginTop) +
        parseInt(style.marginBottom)
      );
    }, 0);
    const modalFix = isInModal ? "(5vh + 41px)" : "0px";
    const { top } = el.getBoundingClientRect();
    const aroundSpace = `(${modalFix} + ${Math.ceil(top + bottom)}px)`;
    if (maxHeight) {
      el.style.maxHeight = `calc(min(100vh - ${aroundSpace}, 
      ${maxHeight}px))`;
    } else {
      el.style.maxHeight = `calc(100vh - ${aroundSpace})`;
    }
    el.classList.add(appStyles.customScrollbar);
  };

  useLayoutEffect(() => {
    updateScrollbar();
    return () => {
      const el = ref.current;
      if (!el) return;
      el.classList.remove(appStyles.customScrollbar);
      el.style.maxHeight = "";
    };
  }, [ref, maxHeight, isInModal, arrExclude, ...props]);

  useWindowResize(updateScrollbar, [
    ref,
    maxHeight,
    isInModal,
    arrExclude,
    ...props,
  ]);
}

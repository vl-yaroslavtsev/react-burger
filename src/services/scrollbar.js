import { useLayoutEffect } from "react";
import appStyles from "../components/app/app.module.css";

export function useScrollbar(
  ref,
  { exclude = [], props = [], maxHeight, isInModal } = {}
) {
  if (!Array.isArray(exclude)) {
    exclude = [exclude];
  }
  useLayoutEffect(() => {
    const el = ref.current;

    if (!el) return;

    const bottom = exclude.reduce((acc, ref) => {
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

    return () => {
      el.classList.remove(appStyles.customScrollbar);
      el.style.maxHeight = "";
    };
  }, [ref, maxHeight, isInModal, exclude, ...props]);
}

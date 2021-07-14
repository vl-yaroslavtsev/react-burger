import { useState, useCallback, useRef } from "react";
import { Input } from "@ya.praktikum/react-developer-burger-ui-components";

import "./view-input.module.css";

export default function ViewInput(props) {
  const [isEditMode, setEditMode] = useState(false);
  const inputRef = useRef(null);
  let iconClick = false;

  const handleIconClick = (e) => {
    const el = inputRef.current;
    iconClick = true;
    if (isEditMode) {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value"
      ).set;
      nativeInputValueSetter.call(el, "");

      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.focus();
    } else {
      setEditMode(true);
      setTimeout(() => {
        el.focus();
      }, 0);
    }
  };

  const handleBlur = (e) => {
    setTimeout(() => {
      if (iconClick) {
        iconClick = false;
        return;
      }
      setEditMode(false);
    }, 200);
  };

  return (
    <Input
      {...props}
      ref={inputRef}
      icon={isEditMode ? "CloseIcon" : "EditIcon"}
      onIconClick={handleIconClick}
      onBlur={handleBlur}
      disabled={props.disabled || !isEditMode}
    />
  );
}

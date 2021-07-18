import { useState, useCallback, useRef } from "react";
import { Input } from "@ya.praktikum/react-developer-burger-ui-components";

import "./password-input.module.css";

export default function PasswordInput(props) {
  const [isValueHidden, setValueHidden] = useState(true);
  const inputRef = useRef(null);

  const handleIconClick = useCallback(() => {
    setValueHidden(!isValueHidden);
    const el = inputRef.current;
    const pos = el.selectionStart;
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(pos || el.value.length, pos || el.value.length);
    }, 0);
  }, [isValueHidden]);

  return (
    <Input
      {...props}
      ref={inputRef}
      type={isValueHidden ? "password" : "text"}
      icon={isValueHidden ? "ShowIcon" : "HideIcon"}
      onIconClick={handleIconClick}
    />
  );
}

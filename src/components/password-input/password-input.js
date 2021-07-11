import { useState, useCallback } from "react";
import { Input } from "@ya.praktikum/react-developer-burger-ui-components";

import "./password-input.module.css";

export default function PasswordInput(props) {
  const [isValueHidden, setValueHidden] = useState(true);

  const handleIconClick = useCallback(() => {
    setValueHidden(!isValueHidden);
  }, [isValueHidden]);

  return (
    <Input
      type={isValueHidden ? "password" : "text"}
      icon={isValueHidden ? "ShowIcon" : "HideIcon"}
      onIconClick={handleIconClick}
      {...props}
    />
  );
}

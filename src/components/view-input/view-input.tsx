import { useState, useRef, FocusEvent } from "react";
import { Input } from "@ya.praktikum/react-developer-burger-ui-components";
import "./view-input.module.css";

type TViewInputProps = {
  setValue: (value: string) => void;
} & {
  value: string;
  onChange(e: React.ChangeEvent<HTMLInputElement>): void;
} & typeof Input["defaultProps"];

export default function ViewInput({ setValue, ...props }: TViewInputProps) {
  const [isEditMode, setEditMode] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  let iconClick = false;

  const handleIconClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const el = inputRef.current;
    iconClick = true;
    if (isEditMode && el) {
      setValue("");
      el.focus();
    } else if (el) {
      setEditMode(true);
      setTimeout(() => {
        el.focus();
      }, 0);
    }
  };

  const handleBlur = (e?: FocusEvent<HTMLInputElement>) => {
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

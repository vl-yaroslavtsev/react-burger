import cn from "classnames";

import styles from "./spinner.module.css";

interface ISpinnerProps {
  size?: number;
  stroke?: number;
  className?: string;
  center?: boolean;
}

const Spinner: React.FC<ISpinnerProps> = ({
  size = 50,
  stroke = 3,
  className,
  center = false,
}) => {
  const radius = 0.4 * size;

  return (
    <svg
      className={cn(
        styles.spinner,
        { [styles.spinnerCenter]: center },
        className
      )}
      style={{ width: size, height: size }}
      viewBox={`0 0 ${size} ${size}`}
    >
      <circle
        className={styles.circle}
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        strokeWidth={stroke}
      ></circle>
    </svg>
  );
};

export default Spinner;

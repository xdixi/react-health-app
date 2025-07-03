import React from "react";
import styles from "./Button.module.scss";
import { ButtonIcons, type ButtonIconKey } from "./types";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ButtonIconKey;
}

const Button: React.FC<ButtonProps> = ({
  className = "",
  icon,
  children,
  ...rest
}) => {
  const combinedClassName = `${styles.button} ${icon} ${className}`.trim();
  const iconSrc = icon ? ButtonIcons[icon] : null;

  return (
    <button className={combinedClassName} {...rest}>
      {children}
    </button>
  );
};

export default Button;

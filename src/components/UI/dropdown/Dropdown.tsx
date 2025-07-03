import React, { useState } from "react";
import styles from "./Dropdown.module.scss";

interface DropdownProps<T> {
  value: T;
  options: T[];
  onChange: (value: T) => void;
  renderSelected: (value: T) => React.ReactNode;
  renderOption: (value: T) => React.ReactNode;
  className?: string;
}

const Dropdown = <T,>({
  value,
  options,
  onChange,
  renderSelected,
  renderOption,
  className = "",
}: DropdownProps<T>) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (option: T) => {
    onChange(option);
    setOpen(false);
  };

  return (
    <div
      className={`${styles["dropdown-wrapper"]} ${className}`}
      onMouseLeave={() => setOpen(false)}
    >
      <div className={styles.dropdown}>
        <div
          className={styles["dropdown-selected"]}
          onClick={() => setOpen((prev) => !prev)}
          onMouseEnter={() => setOpen(true)}
        >
          {renderSelected(value)}
        </div>

        {open && (
          <ul className={styles["dropdown-list"]}>
            {options.map((option, index) => (
              <li key={index} onClick={() => handleSelect(option)}>
                {renderOption(option)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dropdown;

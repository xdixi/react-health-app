import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./LanguageSwitcher.module.scss"; // или .css

const languages = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLang =
    languages.find((l) => l.code === i18n.language) || languages[0];

  const handleSelect = (code: string) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className={styles.selectContainer}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={styles.selectButton}
      >
        <span className={styles.flag}>{currentLang.flag}</span>
        <span>{currentLang.label}</span>``
        <span className={styles.arrow}>▼</span>
      </button>

      {isOpen && (
        <ul className={styles.dropdown}>
          {languages.map((lang) => (
            <li
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className={styles.dropdownItem}
            >
              <span className={styles.flag}>{lang.flag}</span>
              <span>{lang.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageSwitcher;

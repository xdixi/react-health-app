import React, { useEffect, useRef } from "react";
import styles from "./Modal.module.scss";
import closeIcon from "../../../assets/icons/buttons/close.png";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [isOpen]);

  // Закрытие по клику вне модалки
  const handleClickOutside = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className={`${styles.modal} ${className || ""}`}
      onClick={handleClickOutside}
    >
      <button
        className={styles.close}
        onClick={onClose}
        aria-label="Close modal"
      >
        <img src={closeIcon} alt="close modal button" width={30} height={30} />
      </button>
      <div className={styles.content}>{children}</div>
    </dialog>
  );
};

export default Modal;

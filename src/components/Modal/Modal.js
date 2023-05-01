import { useEffect } from 'react';
import { MdOutlineClose } from 'react-icons/md';
import css from './Modal.module.css';

function Modal({ onClose, children }) {
  useEffect(() => {
    const onKeyDown = event => {
      if (event.code === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  const onBackdropClick = event => {
    if (event.currentTarget === event.target) {
      onClose();
    }
  };

  return (
    <div className={css.overlay} onClick={onBackdropClick}>
      <div className={css.modal}>
        <button type="button" className={css.button} onClick={onClose}>
          <MdOutlineClose fill="#140539" />
        </button>
        {children}
      </div>
    </div>
  );
}
export default Modal;

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { setModal } from 'redux/slices/modalSlice';
import { changeImgIndx } from 'redux/slices/imgIndxSlice';

import scroll from 'operations/scroll';
import download from 'operations/download';

import {
  Overlay,
  ModalModal,
  Img,
  Prev,
  Next,
  Btn,
  Download,
} from './Modal.styled';

const modalRoot = document.querySelector('#modal-root');

export function Modal({ data }) {
  const dispatch = useDispatch();
  const indx = useSelector(state => state.imgIndx);
  const scrollImgByKeyDown = event => {
    if (event.code === 'ArrowRight' && indx + 1 !== data.length) {
      dispatch(changeImgIndx(+1));
    }
    if (event.code === 'ArrowLeft' && indx !== 0) {
      dispatch(changeImgIndx(-1));
    }
  };
  const handleKeyDown = event => {
    if (event.code === 'Escape') {
      dispatch(setModal());
    }
  };
  const handleBackDropClick = event => {
    if (event.currentTarget === event.target) {
      dispatch(setModal());
    }
  };
  const { urls, alt_description } = data[indx];
  useEffect(() => {
    scroll.enable();
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keydown', scrollImgByKeyDown);
    return () => {
      scroll.disable();
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keydown', scrollImgByKeyDown);
    };
  });

  return createPortal(
    <Overlay onClick={handleBackDropClick}>
      <ModalModal className="animate__animated animate__pulse">
        <Btn
          onClick={() => download(data, indx, 'inner')}
          variant="contained"
          size="small"
        >
          <Download size={55} />
        </Btn>

        <Img src={urls.regular} alt={alt_description} />
      </ModalModal>
      {indx !== 0 && (
        <Prev size={77} onClick={() => dispatch(changeImgIndx(-1))} />
      )}
      {indx + 1 !== data.length && (
        <Next size={77} onClick={() => dispatch(changeImgIndx(+1))} />
      )}
    </Overlay>,
    modalRoot
  );
}

Modal.propTypes = {
  data: PropTypes.array.isRequired,
};

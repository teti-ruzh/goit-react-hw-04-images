import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Searchbar from './Searchbar';
import api from '../services/image-api';
import Loader from './Loader';
import ImageGallery from './ImageGallery';
import Button from './Button';
import Modal from './Modal';
import css from './App.module.css';

export function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [urlModal, setUrlModal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showLoadMore, setShowLoadMore] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  useEffect(() => {
    if (!searchQuery) {
      return;
    }
    setIsLoading(true);
    api
      .getImg(searchQuery, page)
      .then(({ hits, totalHits }) => {
        if (!hits.length) {
          setIsEmpty(true);
          return;
        }
        setImages(images => [...images, ...hits]);
        setShowLoadMore(() => page < Math.ceil(totalHits / 12));
      })
      .catch(error => {
        setError(`${error}`);
      })
      .finally(() => setIsLoading(false));
  }, [searchQuery, page]);

  const openModal = url => {
    setShowModal(!showModal);
    setUrlModal(url);
  };

  const closeModal = () => {
    setShowModal(!showModal);
    setUrlModal('');
  };

  const toggleOnLoading = () => {
    setIsLoading(isLoading => !isLoading);
  };

  const handleFormSubmit = query => {
    setSearchQuery(query);
    setImages([]);
    setPage(1);
    setShowLoadMore(false);
    setIsEmpty(false);
    setError('');
  };

  const onLoadMore = () => {
    setPage(page => page + 1);
  };

  return (
    <div className={css.container}>
      <ToastContainer autoClose={2000} />
      <Searchbar onSubmit={handleFormSubmit} />

      {isEmpty && (
        <h2 className={css.errorMsg}>
          Sorry, there is no images for {searchQuery}
        </h2>
      )}
      {error && <h2 className={css.errorMsg}>{error}</h2>}
      <ImageGallery
        images={images}
        openModal={openModal}
        toggleOnLoading={toggleOnLoading}
      />
      {showLoadMore && <Button onLoadMore={onLoadMore} />}
      {isLoading && <Loader />}

      {showModal && (
        <Modal onClose={closeModal}>
          <img
            onLoad={toggleOnLoading}
            src={urlModal}
            alt=""
            className={css.modalImg}
          />
        </Modal>
      )}
    </div>
  );
}

import galleryItems from './gallery-items.js';

const refs = {
  galleryRef: document.querySelector('.js-gallery'),
  modalRef: document.querySelector('.js-lightbox'),
  closeModalButton: document.querySelector(
    'button[data-action="close-lightbox"]',
  ),
  modalImgRef: document.querySelector('img.lightbox__image'),
  backdropRef: document.querySelector('div.lightbox__content'),
};

let defaultIndex;

function createArrOfMarkup(arr, e, index) {
  const li = document.createElement('li');
  const a = document.createElement('a');
  const img = document.createElement('img');

  li.classList.add('gallery__item');
  a.classList.add('gallery__link');
  a.href = e.original;
  img.classList.add('gallery__image');
  img.src = e.preview;
  img.dataset.source = e.original;
  img.dataset.index = index;
  img.alt = e.description;

  li.appendChild(a);
  a.appendChild(img);

  arr.push(li);

  return arr;
}

function createMarcup(items) {
  const arrOfMarkup = items.reduce(createArrOfMarkup, []);

  refs.galleryRef.append(...arrOfMarkup);
}

function onImageClick(event) {
  event.preventDefault();
  const imgTarget = event.target;
  if (imgTarget.nodeName !== 'IMG') {
    return;
  }

  defaultIndex = Number(imgTarget.dataset.index);
  refs.modalRef.classList.add('is-open');
  refs.modalImgRef.src = imgTarget.dataset.source;
  refs.closeModalButton.addEventListener('click', closeModal);
  refs.backdropRef.addEventListener('click', closeOnClickBackdrop);
  window.addEventListener('keydown', controlByButtons);
}

function closeModal() {
  refs.modalRef.classList.remove('is-open');
  refs.modalImgRef.src = '';
  window.removeEventListener('keydown', controlByButtons);
}

function closeOnClickBackdrop(e) {
  if (e.target === e.currentTarget) {
    closeModal();
  }
}

function controlByButtons(e) {
  onPressEsc(e);
  nextImg(e);
  prevImg(e);
}

function showNewImg() {
  const newIndex = galleryItems[defaultIndex].original;
  refs.modalImgRef.src = newIndex;
}

function nextImg(e) {
  if (e.code === 'ArrowRight' && defaultIndex < galleryItems.length - 1) {
    defaultIndex += 1;
    showNewImg();
  }
}

function prevImg(e) {
  if (e.code === 'ArrowLeft' && defaultIndex > 0) {
    defaultIndex -= 1;
    showNewImg();
  }
}

function onPressEsc(e) {
  if (e.code === 'Escape') {
    closeModal();
  }
}

createMarcup(galleryItems);

refs.galleryRef.addEventListener('click', onImageClick);

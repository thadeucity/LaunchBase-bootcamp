const modalOverlay = document.querySelector('.modal-overlay');
const modal = document.querySelector('.modal');
const cards = document.querySelectorAll('.card');

const modalTitle = document.querySelector('#modal-title');
const modalAuthor = document.querySelector('#modal-author');
const modalImage = document.querySelector('#modal-img');

for (let card of cards){
  card.addEventListener("click", function(){
    modalOverlay.classList.add('active');
    const recipeId = card.getAttribute('id');
    modalImage.src = `./src/img/${recipeId}.png`;
    modalTitle.innerHTML = card.querySelector('p').innerHTML;
    modalAuthor.innerHTML = card.querySelector('.author').innerHTML;
  });
}

// Close Iframe

document.querySelector('#close-modal').addEventListener('click', function(){
  modalOverlay.classList.remove('active');
});


// Maximize iframe 

document.querySelector('#maximize-modal').addEventListener('click', function(){
  if (!modal.classList.contains('maximize')){
    modal.classList.add('maximize');
    document.querySelector('#maximize-modal').innerHTML = 'fullscreen_exit';
  } else {
    modal.classList.remove('maximize');
    document.querySelector('#maximize-modal').innerHTML = 'fullscreen';
  }
});


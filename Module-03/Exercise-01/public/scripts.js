const modalOverlay = document.querySelector('.modal-overlay');
const modal = document.querySelector('.modal');
const cards = document.querySelectorAll('.card');

for (let card of cards){
  card.addEventListener("click", function(){
    modalOverlay.classList.add('active');
    const courseId = card.getAttribute('id');
    modalOverlay.querySelector('iframe').src = 
      `https://rocketseat.com.br/${courseId}`
    ;
  })
}

// Close Iframe

document.querySelector('#close-modal').addEventListener('click', function(){
  modalOverlay.classList.remove('active');
  modalOverlay.querySelector('iframe').src = '';
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
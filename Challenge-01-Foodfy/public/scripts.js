const cards = document.querySelectorAll('.card');
const recipeSections = document.querySelectorAll('.recipe-section');

for (let card of cards){
  card.addEventListener("click", function(){
    const recipeId = card.getAttribute('id');
    window.location.href = `/recipes/${recipeId}`;
  });
}

for (let section of recipeSections){
  section.querySelector('.toggle').addEventListener("click", function(){
    recipeInfo = section.querySelector('.recipe-section-info');
    if (!recipeInfo.classList.contains('active')){
      recipeInfo.classList.add('active');
    } else {
      recipeInfo.classList.remove('active');
    }
  });
}
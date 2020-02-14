const currentPage = location.pathname;
const menuItens = document.querySelectorAll('header nav a');
const recipeSections = document.querySelectorAll('.recipe-section');
const moreFields = document.querySelectorAll('.add-field');
const removeFields = document.querySelectorAll('.remove-fields');

for (item of menuItens) {
  if(currentPage.includes(item.getAttribute('href'))) {
    item.classList.add('active');
  }
}

function toggleSecstions(){
  for (let section of recipeSections){
    section.querySelector('.toggle').addEventListener("click", function(){
      recipeInfo = section.querySelector('.recipe-section-info');
      if (!recipeInfo.classList.contains('active')){
        recipeInfo.classList.add('active');
        section.querySelector('.toggle').innerHTML = 'hide';
      } else {
        recipeInfo.classList.remove('active');
        section.querySelector('.toggle').innerHTML = 'show';
      }
    });
  }
}

function addField(place) {
  console.log('entered the function')
  const parent = document.querySelector(`#${place}s`);
  const fieldContainer = document.querySelectorAll(`.${place}`);

  const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);
  if (newField.children[0].value == "") return false;

  newField.children[0].value = "";
  parent.appendChild(newField);
}

function removeBlanks(place) {
  const fieldContainer = document.querySelectorAll(`.${place}`);
  let count = 0;

  for (let i=0; i<fieldContainer.length; i++){
    if (fieldContainer[i].querySelector('input').value == ""){
      count++;
      if (count<fieldContainer.length){
        fieldContainer[i].remove();
      }
    }
  }
}

function manageFields(){
  for(let element of moreFields){
    element.addEventListener("click", function(){
      addField(element.getAttribute('name'));
    });
  }
  
  for(let element of removeFields){
    element.addEventListener("click", function(){
      removeBlanks(element.getAttribute('name'));
    });
  }
}


if(recipeSections) toggleSecstions();

if(moreFields && removeFields) manageFields();

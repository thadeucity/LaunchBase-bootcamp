function addField(place) {
  const parent = document.querySelector(`#${place}s`);
  const fieldContainer = document.querySelectorAll(`.${place}`);

  // Realiza um clone do último ingrediente adicionado
  const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);

  // Não adiciona um novo input se o último tem um valor vazio
  if (newField.children[0].value == "") return false;

  // Deixa o valor do input vazio
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


document
  .querySelector(".add-ingredient")
  .addEventListener("click", function(){
    addField("ingredient")
  });

  document
  .querySelector(".add-step")
  .addEventListener("click", function(){
    addField("step")
  });


  document
  .querySelector(".remove-ingr-blanks")
  .addEventListener("click", function(){
    removeBlanks("ingredient")
  });

  document
  .querySelector(".remove-step-blanks")
  .addEventListener("click", function(){
    removeBlanks("step")
  });
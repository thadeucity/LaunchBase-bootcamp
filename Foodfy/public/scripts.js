const currentPage = location.pathname;
const menuItens = document.querySelectorAll('header nav a');
const recipeSections = document.querySelectorAll('.recipe-section');
const moreFields = document.querySelectorAll('.add-field');
const removeFields = document.querySelectorAll('.remove-fields');
const cards = document.querySelectorAll('.card');

const urlParams = new URLSearchParams(window.location.search);
const myParam = urlParams.get('page');

const pagination = document.querySelector('.pagination');

for (item of menuItens) {
  if(currentPage.includes(item.getAttribute('href'))) {
    item.classList.add('active');
  }
}

function paginate (selectedPage, totalPages){
  let pages = [];
  let oldPage;

  for (let currentPage = 1; currentPage <= totalPages; currentPage++){

    const firstAndLastPage = currentPage == 1 || currentPage == totalPages;
    const pagesAfterSelectedPage = currentPage <= selectedPage + 2;
    const pagesBeforeSelectedPage = currentPage >= selectedPage - 2;

    if (firstAndLastPage || pagesAfterSelectedPage && pagesBeforeSelectedPage){

      if (oldPage && currentPage - oldPage > 2){
        pages.push('...');
      }

      if (oldPage && currentPage - oldPage == 2){
        pages.push(oldPage + 1);
      }

      pages.push(currentPage);
      oldPage = currentPage;
    }
  }

    return pages
}

function createPagination(pagination){  
  const filter = pagination.dataset.filter;
  const page = +pagination.dataset.page;
  const total = +pagination.dataset.total;
  const pages = paginate(page,total); 
  
  let elements = '';

  if (total > 1){

    for (let page of pages){
      if(String(page).includes('...')){
        elements += `<span>${page}</span>`;
      }else{
        if (filter) {
          if (myParam == page || (!myParam && page == 1)){
            elements += `<a class="active" href="?page=${page}&filter=${filter}">${page}</a>`;
          } else {
            elements += `<a href="?page=${page}&filter=${filter}">${page}</a>`;
          }
        }else{
          if (myParam == page || (!myParam && page == 1)){
            elements += `<a class="active" href="?page=${page}">${page}</a>`;
          } else {
            elements += `<a href="?page=${page}">${page}</a>`;
          }
        }
      }
    }
    
    pagination.innerHTML = elements

  }
}

function toggleSections(){
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

function clickCard(){
  for (let card of cards){
    const cardId = card.getAttribute('id');
    if (card.classList.contains('chefs')){
      card.addEventListener("click", function(){
        window.location.href = `/chefs/${cardId}`;
      });
    } else{
      card.addEventListener("click", function(){
        window.location.href = `/recipes/${cardId}`;
      });
    }   
  }
}


const ImgUpload = {
  input: '',
  files: [],
  uploadLimit:5,
  preview: document.querySelector('.upload-grid'),
  handleFileInput(e){
    const {files: fileList} = e.target;
    ImgUpload.input = e.target;

    Array.from(fileList).forEach((file) =>{

      ImgUpload.files.push(file);


      const reader = new FileReader();

      if (ImgUpload.hasLimit(e)) return;

      reader.onload = () => {
        const image = new Image();
        image.src = String(reader.result);

        const div = ImgUpload.getContainer(image);
        ImgUpload.preview.appendChild(div);
      };

      reader.readAsDataURL(file);
    });


  },
  getContainer(image){
    const div = document.createElement('div');
    div.classList.add('photo');
    div.onclick = ImgUpload.removePhoto;
    
    div.appendChild(image);

    div.appendChild(ImgUpload.getRemoveButton());

    return div;
  },
  getAllFiles(){
    const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer();

    ImgUpload.files.forEach(file => dataTransfer.items.add(file));

    return dataTransfer.files;
  },
  getRemoveButton(){
    const button = document.createElement('i');
    button.classList.add('material-icons');
    button.innerHTML = "close";
    return button;
  },
  removePhoto(e){
    const photoDiv = e.target.parentNode; // <div class="photo">
    const photosArray = Array.from(ImgUpload.preview.children);
    const index = photosArray.indexOf(photoDiv);

    ImgUpload.files.splice(index, 1);
    ImgUpload.input.files = ImgUpload.getAllFiles();

    photoDiv.remove();
  },
  hasLimit(event){
    const { uploadLimit, input, preview } = ImgUpload;
    const { files: fileList } = input;

    if(fileList.length > uploadLimit){
      alert (`Envie no máximo ${uploadLimit} fotos`);
      event.preventDefault();
      return true;
    }

    const photosDiv = [];
    preview.childNodes.forEach(item => {
      if (item.classList && item.classList.value == "photo"){
        photosDiv.push(item);
      }
    });

    const totalPhotos = fileList.length + photosDiv.length;

    if (totalPhotos > uploadLimit){
      alert("Você atingiu o limite máximo de fotos")
      event.preventDefault();
      return true;
    }

    return false;
  },
  removeOldPhoto(event){
    const photoDiv = event.target.parentNode;

    if(photoDiv.id){
      const removedFiles = document.querySelector('input[name="removed_files"]');
      if(removedFiles){
        removedFiles.value += `${photoDiv.id},`;
      }
    }

  photoDiv.remove();
  }
}

const AvatarUpload = {
  preview: document.querySelector('.avatar-upload'),
  icon: document.querySelector('.avatar-upload .material-icons'),
  previewUpload(e){
    const {files: fileList} = e.target;

    Array.from(fileList).forEach((file) =>{

      const reader = new FileReader();

      reader.onload = () => {
        const image = new Image();
        image.src = String(reader.result);
  
        AvatarUpload.preview.style.backgroundImage = `url('${image.src}')`;
        AvatarUpload.preview.classList.add('active');
        AvatarUpload.icon.classList.add('active');
        AvatarUpload.icon.innerHTML = 'swap_horiz';
      };

      reader.readAsDataURL(file);
    });
  }
}

const RecipeGallery = {
  highlightImg: document.querySelector('.highlight img'),
  previews: document.querySelectorAll('.mini-gallery img'),
  setImage(e) {
    const {target} = e;

    RecipeGallery.previews.forEach(preview => preview.classList.remove('active'));
    target.classList.add('active');

    RecipeGallery.highlightImg.src = target.src;

  }
}

if(recipeSections) toggleSections();

if(moreFields && removeFields) manageFields();

if (cards && !(currentPage.includes('admin'))) clickCard();

if (pagination) createPagination(pagination);

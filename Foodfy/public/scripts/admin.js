const moreFields = document.querySelectorAll('.add-field');
const removeFields = document.querySelectorAll('.remove-fields');


if (currentPage.includes('/admin/profile')){
  menuItens[2].classList.add('active');
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
  icon: document.querySelector('.avatar-upload .material-icons'),
  avatarImg: document.querySelector('#avatar-img'),

  previewUpload(e){
    const {files: fileList} = e.target;

    Array.from(fileList).forEach((file) =>{

      const reader = new FileReader();

      reader.onload = () => {
        AvatarUpload.avatarImg.src = String(reader.result);

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

if(moreFields && removeFields) manageFields();
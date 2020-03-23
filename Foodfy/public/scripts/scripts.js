const currentPage = location.pathname;
const menuItens = document.querySelectorAll('header nav a');
const recipeSections = document.querySelectorAll('.recipe-section');
const cards = document.querySelectorAll('.card');


const urlParams = new URLSearchParams(window.location.search);
const myParam = urlParams.get('page');

const pagination = document.querySelector('.pagination');

function activeMenu(){
  for (item of menuItens) {
    if(currentPage.includes(item.getAttribute('href'))) {
      item.classList.add('active');
    }
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

const RecipeGallery = {
  highlightContainer: document.querySelector('.img-container.highlight'),
  highlightImg: document.querySelector('.highlight img'),
  previews: document.querySelectorAll('.mini-gallery img'),
  setImage(e) {
    const {target} = e;

    RecipeGallery.previews.forEach(preview => preview.classList.remove('active'));
    target.classList.add('active');

    RecipeGallery.highlightImg.src = target.src;

  },
  showMore(){
    RecipeGallery.highlightContainer.classList.toggle('large');
  }
}

if(recipeSections) toggleSections();

if (cards && !(currentPage.includes('admin'))) clickCard();

if (pagination) createPagination(pagination);

activeMenu();

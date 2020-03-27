const Chef = require('../models/Chef');
const Recipe = require('../models/Recipe');
const File = require ('../models/File');

async function loadAvatar (chef){
  const avatar = await Chef.avatar(chef.id);
  if(avatar){   
    chef.avatar = avatar.path.replace('public', '');
  }
  return chef;
}

async function loadRecipeImage (recipe){
  const recipeImg = await Recipe.files(recipe.id);
  recipe.cardImage = recipeImg[0].path.replace('public', '');
  return recipe;
}

async function loadAllRecipeImages(recipe){
  const files = await Recipe.files(recipe.id);

  recipe.files = files.map((file, index) => ({
    ...file,
    src: `${file.path.replace('public', '')}`,
    name: `${recipe.title}_image_${index}`
  }));

  return recipe;
}

async function loadRecipes (chef){
  const recipes = await Recipe.find({filters: {WHERE: {chef_id: chef.id}}});
  const recipesPromise = recipes.map(loadRecipeImage);
  chef.recipes = await Promise.all( recipesPromise );

  return chef;
}

const LoadService = {
  load(service, filter){
    this.filter = filter;
    return this[service](filter);
  },
  async chef(){
    try {
      let chef = await Chef.find(this.filter);
      chef = await loadAvatar(chef);
      chef = await loadRecipes(chef);

      return chef;

    } catch (err) {
      console.error(err);
    }
  },
  async chefs(){
    try {
      const chefs = await Chef.findAll(this.filter);
      const chefsPromise = chefs.map(loadAvatar);
      return Promise.all( chefsPromise );

    } catch (err) {
      console.log(err);
    }
  },
  async recipe(){
    try {
      let recipe = await Recipe.findOne(this.filter);
      recipe = await loadAllRecipeImages(recipe);
      return recipe;
      
    } catch (err){
      console.log(err);
    }
  },
  async recipes(){
    try {
      const recipes = await Recipe.find(this.filter);
      const recipesPromise = recipes.map(loadRecipeImage);
      return Promise.all( recipesPromise );
    } catch (err){
      console.log(err);
    }
  }
};

module.exports = LoadService;
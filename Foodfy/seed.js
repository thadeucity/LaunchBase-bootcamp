const fs = require('fs');
const request = require ('request');

const db = require ('./src/config/db');

const faker = require('faker');
const { hash } = require ('bcryptjs');

const User = require ('./src/app/models/User');
const Chef = require ('./src/app/models/Chef');
const File = require ('./src/app/models/File');
const Recipe = require ('./src/app/models/Recipe');

let usersIds = [];
let chefsIds = [];
let recipesIds = [];

const totalUsers = 5;
const totalChefs = 12;
const totalRecipes = 30;

///////////////////////   COMPLEMENTARY FUNCTIONS   ///////////////////////

function message(text, error){
  if(error){
    console.log (`Something went wrong during the ${text}`);
  } else{
    console.log (text);
  }
}

function randNumber(min, max){
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

/////////////////////////   AUXILIARY FUNCTIONS   /////////////////////////

function textList(size){
  let textArray = [];
  for (let i=0; i<size; i++){
    textArray.push(faker.lorem.sentence(randNumber(2,7)));
  }
  return textArray;
}

async function downloadImage(type, number){
  try {
    const url = `http://placehold.it/500?text=${type}_${number}`;
    const path = `./public/img/${type}s_images/${type}_${number}.png`

    request(url).pipe(fs.createWriteStream(path));
    
    return `public/img/${type}s_images/${type}_${number}.png`;

  } catch (err) {
    console.error(err);
    message(`${type} file creation process`, true);
  }
}

async function createAvatar(id){
  const path = await downloadImage('chef', id);
  const fileId = await File.create({
    name: `Chef_${id}_avatar`,
    path
  });
  await Chef.linkFile(id, fileId);
  return;
}

async function createRecipeImages (id, total){
  for (let i=0; i<total; i++){
    const path = await downloadImage('recipe', `${id}_${i}`);
    const fileId = await File.create({
      name: `Recipe_${id}_image_${i+1}`,
      path
    });
    await Recipe.linkFile(id, fileId);
  }
  return;
}

////////////////////////   RESET/ERASE FUNCTIONS   ///////////////////////

async function resetfiles(folder){
  try {
    const folderPath = `./public/img/${folder}_images`; 
    const files = fs.readdirSync(folderPath);
    files.map(file => fs.unlinkSync(`${folderPath}/${file}`));
    message(`All ${folder} files were deleted`);
    return;
    
  } catch (err) {
    console.error(err);
    message(`Deleting processs for ${folder}`, true);
  }
}

async function resetTables(){
  try {
    const query = `
      DELETE FROM chef_files;
      DELETE FROM recipe_files;
      DELETE FROM files;
      DELETE FROM recipes;
      DELETE FROM chefs;
      DELETE FROM session;
      DELETE FROM users;

      ALTER SEQUENCE chef_files_id_seq RESTART WITH 1;
      ALTER SEQUENCE chefs_id_seq RESTART WITH 1;
      ALTER SEQUENCE files_id_seq RESTART WITH 1;
      ALTER SEQUENCE recipe_files_id_seq RESTART WITH 1;
      ALTER SEQUENCE recipes_id_seq RESTART WITH 1;
      ALTER SEQUENCE users_id_seq RESTART WITH 1;

      INSERT INTO chefs(name) VALUES ('Foodfy');
      INSERT INTO files(name, path) VALUES ('Foodfy_avatar', 'public/img/foodfy-avatar.png');
      INSERT INTO chef_files(chef_id, file_id) VALUES ('1', '1');
    `;

    await db.query(query);
    message (`All tables were cleaned`)
    return;
    
  } catch (err) {
    console.error(err);
    message(`process of reseting the tables`);
  }
}

////////////////////////   CREATION FUNCTIONS   /////////////////////////

async function createUsers(){
  try {
    const users = [];
    const password = await hash('1234', 8);

    while (users.length < totalUsers){
      const firstName = faker.name.firstName();
      users.push({
        name: `${firstName} ${faker.name.lastName()}`,
        email: `${firstName.toLocaleLowerCase()}${randNumber(1,9)}@mail.com`,
        password,
        is_admin: (users.length==0) ? true : faker.random.boolean(),
        is_verified: (users.length==0) ? true : faker.random.boolean()
      });
    }

    const usersPromise = users.map(user => User.create(user));

    usersIds = await Promise.all(usersPromise);
    message('All Users were created')
    return;
    
  } catch (err) {
    console.error(err);
    message('User creation process', true)
  }
}

async function createChefs(){
  try {
    const chefs = [];

    while (chefs.length < totalChefs){
      const name = `${faker.name.firstName()} ${faker.name.lastName()}`;
      chefs.push({
        name
      });
    }

    const chefsPromise = chefs.map(chef => Chef.create(chef));

    chefsIds = await Promise.all(chefsPromise);

    message('All Chefs were created');

    const avatarPromise = chefsIds.map(id => createAvatar(id));

    await Promise.all(avatarPromise);
    
    return;

  } catch (err) {
    console.error(err);
    message('Chefs creation process');
  }
}

async function createRecipes(){
  const recipes = [];

  while (recipes.length < totalRecipes){
    recipes.push({
      chef_id: chefsIds[randNumber(1, totalChefs-1)],
      user_id: usersIds[randNumber(0, totalUsers-1)],
      title: faker.commerce.productName(),
      ingredients: textList(randNumber(2,6)),
      preparation: textList(randNumber(2,8)),
      information: faker.lorem.paragraphs(randNumber(1,5))
    });
  }

  const recipesPromise = recipes.map(recipe => Recipe.create(recipe));

  recipesIds = await Promise.all(recipesPromise);

  const recipeImagesPromise = recipesIds.map(id => createRecipeImages(id, randNumber(2,5)));

  await Promise.all(recipeImagesPromise);

  return;
}

/////////////////////////   EXPORTABLE FUNCTIONS   /////////////////////////

async function init() {
  await resetfiles('chefs');
  await resetfiles('recipes');
  await resetTables();
  await createUsers();
  await createChefs();
  await createRecipes();
  return;
}

// if (process.argv.includes('freshStart')) {
//   freshStart();
// }

init();
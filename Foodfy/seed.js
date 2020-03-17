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
let filesIds = [];

const totalUsers = 5;
const totalChefs = 12;
const totalRecipes = 30;

async function resetTables(){
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
  `;

  await db.query(query);
  return;
}

async function createUsers(){
  const users = [];
  const password = await hash('1234', 8);
  let name = '';

  while (users.length < totalUsers){
    name = faker.name.firstName();
    users.push({
      name,
      email: `${name.toLocaleLowerCase()}@mail.com`,
      password,
      is_admin: faker.random.boolean(),
      is_verified: faker.random.boolean()
    });
  }

  const usersPromise = users.map(user => User.create(user));

  usersIds = await Promise.all(usersPromise);
}

async function createChefs(){
  const chefs = [];

  while (chefs.length < totalChefs){
    chefs.push({
      name: faker.name.firstName(),
    });
  }

  const chefsPromise = chefs.map(chef => Chef.create(chef));

  chefsIds = await Promise.all(chefsPromise);
}

async function createRecipes(){
  const recipes = [];

  while (recipes.length < totalRecipes){
    recipes.push({
      chef_id: chefsIds[Math.floor(Math.random() * totalChefs)],
      user_id: usersIds[Math.floor(Math.random() * totalUsers)],
      title: faker.name.title(),
      ingredients: `{${faker.lorem.sentence(3)}, ${faker.lorem.sentence(4)}, ${faker.lorem.sentence(2)}}`,
      preparation: `{${faker.lorem.sentence(2)}, ${faker.lorem.sentence(3)}, ${faker.lorem.sentence(2)}}`,
      information: faker.lorem.paragraphs(3)
    });
  }

  const recipesPromise = recipes.map(recipe => Recipe.create(recipe));

  recipesIds = await Promise.all(recipesPromise);
}

async function createFiles(){
  const files = [];
  const totalFiles = totalChefs + (3*totalRecipes);

  while (files.length < totalFiles){
    files.push({
      name: faker.image.image(),
      path: `public/img/placeholder.png`
    });
  }

  const filesPromise = await files.map(file => File.create(file));

  filesIds = await Promise.all(filesPromise);

  for (let i=1; i <= totalChefs; i++){
    await Chef.linkFile(i,i);
  }

  for (let i=0; i < totalRecipes; i++){
    await Recipe.linkFile((i+1),(i*3)+totalChefs);
    await Recipe.linkFile((i+1),(i*3)+totalChefs+1);
    await Recipe.linkFile((i+1),(i*3)+totalChefs+2);
  }

}

async function init() {
  await resetTables();
  await createUsers();
  await createChefs();
  await createRecipes();
  await createFiles();
  return;
}

init();


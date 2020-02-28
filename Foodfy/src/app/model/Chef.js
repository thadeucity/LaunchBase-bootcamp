const db = require('../../config/db');
const { date } = require('../../lib/utils');

module.exports = {
  all(){
    const QUERY = `
      SELECT 
        chefs.*, count(recipes) AS total_recipes 
      FROM 
        chefs
      LEFT JOIN
        recipes ON (chefs.id = recipes.chef_id)
      GROUP BY
        chefs.id
      ORDER 
        BY name
    `;

    return db.query(QUERY);
  },
  create(data){
    const QUERY = `
      INSERT INTO chefs (
        name,
        avatar_url,
        created_at 
      ) VALUES ($1, $2, $3)
      RETURNING id
    `;

    const VALUES = [
      data.name,
      data.avatar_url,
      date(Date.now()).iso
    ];

    return db.query(QUERY, VALUES);
  },
  update(data){
    const QUERY = `
      UPDATE chefs SET
        name=($1),
        avatar_url=($2)
      WHERE id = $3
      RETURNING id
    `;

    const VALUES = [
      data.name,
      data.avatar_url, 
      data.id
    ];

    return db.query(QUERY, VALUES);
  },
  find(id){
    const QUERY = `
      SELECT
        chefs.*, count(recipes) AS total_recipes
      FROM 
        chefs
      LEFT JOIN
        recipes ON (chefs.id = recipes.chef_id)
      WHERE
        chefs.id = $1
      GROUP BY
        chefs.id
    `;
    return db.query(QUERY, [id]);
  },
  findRecipes(id){
    const QUERY = `
      SELECT 
        * 
      FROM 
        recipes 
      WHERE 
        chef_id = $1
      ORDER BY
        recipes.updated_at DESC
    `;

    return db.query(QUERY, [id])
  },
  files(id){
    const QUERY = `
      SELECT 
        files.*, chef_files.chef_id
      FROM
        files
      LEFT JOIN
        chef_files on (files.id = chef_files.file_id)
      WHERE
        chef_id = $1 
    `;

    return db.query(QUERY, [id]);
  }
};
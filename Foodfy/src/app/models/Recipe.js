const db = require('../../config/db');
const { date } = require('../../lib/utils');

module.exports = {
  create(data, userId){
    const QUERY = `
      INSERT INTO recipes (
        chef_id,
        user_id,
        title,
        ingredients,
        preparation,
        information,
        created_at 
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `;

    const VALUES = [
      data.chef_id,
      userId,
      data.title,
      data.ingredients,
      data.preparation,
      data.information,
      date(Date.now()).iso
    ];

    return db.query(QUERY, VALUES);

  },
  async update(data, userId){
    const QUERY = `
      UPDATE recipes SET
        chef_id=($1),
        user_id=($2),
        title=($3),
        ingredients=($4),
        preparation=($5),
        information=($6)
      WHERE id = $7
      RETURNING id
    `;

    const VALUES = [
      data.chef_id,
      userId, 
      data.title,
      data.ingredients,
      data.preparation,
      data.information,
      data.id
    ];
  
    const results = await db.query(QUERY, VALUES);
    return results.rows[0].id;
  },
  async find(id){
    const QUERY = `
      SELECT
        recipes.*, chefs.name AS chef_name
      FROM
        recipes
      LEFT JOIN
        chefs ON (recipes.chef_id = chefs.id)
      WHERE
        recipes.id = $1
    `;

    const results = await db.query(QUERY, [id]);
    return results.rows[0];
  },
  all(){
    const QUERY = `
      SELECT 
        recipes.*, chefs.name as chef_name 
      FROM
        recipes
      LEFT JOIN 
        chefs ON (recipes.chef_id = chefs.id)
      ORDER BY
        recipes.updated_at DESC
    `;

    return db.query(QUERY)
  },
  mostViewed(limit){
    const QUERY = `
      SELECT recipes.*, chefs.name as chef_name 
      FROM recipes
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      ORDER BY name
      LIMIT $1
    `;

    return db.query(QUERY, [limit]);
  },
  paginate(params){
    let filterQuery = ``;

    if (params.filter){
      filterQuery = `
        WHERE
          recipes.title ILIKE '%${params.filter}%'
          OR chefs.name ILIKE '%${params.filter}%'
      `;
    }

    let counterQuery =
      `(SELECT count(*) FROM recipes ${filterQuery}) AS total`;

    let QUERY = `
      SELECT
        recipes.*, chefs.name as chef_name, ${counterQuery}
      FROM
        recipes
      LEFT JOIN
        chefs ON (recipes.chef_id = chefs.id)
      ${filterQuery}
      ORDER BY 
        recipes.updated_at DESC
      LIMIT ${params.limit} OFFSET ${params.offset}
    `;

    return db.query(QUERY);
  },
  async chefsList(){
    const QUERY = `
      SELECT name, id
      from chefs
      ORDER BY name
    `;

    const results = await db.query(QUERY);
    return results.rows;
  },
  files(id){
    const QUERY = `
      SELECT 
        files.*, recipe_files.recipe_id
      FROM
        files
      LEFT JOIN
        recipe_files on (files.id = recipe_files.file_id)
      WHERE
        recipe_id = $1 
    `;

    return db.query(QUERY, [id]);
  }
};
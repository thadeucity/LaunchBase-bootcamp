const db = require('../../config/db');

const Base = require('./Base');

function find(params){
  const {filters, search, paginate} = params;

  let orderBy = `created_at`;

  let filterQuery = ``,
      counterQuery = ``,
      limitQuery = ``;

  if (filters){
    Object.keys(filters).map(key => {
      filterQuery += `${key}`;
  
      Object.keys(filters[key]).map(field => {
        filterQuery += ` recipes.${field} = '${filters[key][field]}'`;
      });
    });
  }

  if (search){
    filterQuery = `
    WHERE
      recipes.title ILIKE '%${search}%'
      OR chefs.name ILIKE '%${search}%'
    `;
    orderBy = `updated_at`;
  }

  if (paginate){
    counterQuery = `, (SELECT count(*) FROM recipes ${filterQuery}) AS total`;
    limitQuery = `LIMIT ${paginate.limit} OFFSET ${paginate.offset}`;
  }

  const query = `
    SELECT
      recipes.*, chefs.name AS chef_name${counterQuery}
    FROM
      recipes
    LEFT JOIN
      chefs ON (recipes.chef_id = chefs.id)
    ${filterQuery}
    ORDER BY
      recipes.${orderBy} DESC
    ${limitQuery}
  `;

  return db.query(query);
}

Base.init({table: 'recipes'});

module.exports = {
  ...Base,
  async findOne(id){
    const results = await find({filters: {WHERE: {id}}});
    return results.rows[0];
  },
  async findAll(){
    const results = await find({});
    return results.rows;
  },
  async find(params){
    const results = await find(params);
    return results.rows;
  },
  async files(id){
    const query = `
      SELECT 
        files.*, recipe_files.recipe_id
      FROM
        files
      LEFT JOIN
        recipe_files on (files.id = recipe_files.file_id)
      WHERE
        recipe_id = $1 
    `;

    const results = await db.query(query, [id]);
    return results.rows;
  }
};
const db = require('../../config/db');

const Base = require('./Base');

function find (filters){
  try {
    let filterQuery = ``;

    if (filters){
      Object.keys(filters).map(key => {
        filterQuery += `${key}`;
    
        Object.keys(filters[key]).map(field => {
          filterQuery += ` chefs.${field} = '${filters[key][field]}'`;
        });
      });
    }

    const query = `
      SELECT
        chefs.*, count(recipes) AS total_recipes
      FROM 
        chefs
      LEFT JOIN
        recipes ON (chefs.id = recipes.chef_id)
      ${filterQuery}
      GROUP BY
        chefs.id
      ORDER BY
        chefs.name
    `;

  return db.query(query);
    
  } catch (err) {
    console.error(err);
  }
}

Base.init({table: 'chefs'});

module.exports = {
  ...Base,
  async findAll(){
    const results = await find();
    return results.rows;
  },
  async findOne(id){
    const results = await find({ WHERE: {id} });
    return results.rows[0];
  },
  async avatar(id){
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

    const results = await db.query(QUERY, [id]);
    return results.rows[0];
  }
};
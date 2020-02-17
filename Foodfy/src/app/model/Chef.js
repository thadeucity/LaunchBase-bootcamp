const db = require('../../config/db');
const { date } = require('../../lib/utils');

module.exports = {
  all(callback){
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

    db.query(QUERY, function(err, results){
      if (err) throw `Database Error! ${err}`;

      callback(results.rows);
    });
  },
  create(data,callback){
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

    db.query(QUERY, VALUES, function(err, results){
      if (err) throw `Database Error! ${err}`;
      callback(results.rows[0]);
    });

  },
  update(data,callback){
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

    db.query(QUERY, VALUES, function(err, results){
      if (err) throw `Database Error! ${err}`;
      callback(results.rows[0]);
    });
  },
  find(id, callback){
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
    db.query(QUERY, [id], function(err, results){
      if (err) throw `Database Error! ${err}`;

      callback(results.rows[0]);
    });
  },
  findRecipes(id, callback){
    const QUERY = `SELECT * FROM recipes WHERE chef_id = $1`;

    db.query(QUERY, [id], function(err, results){
      if (err) throw `Database Error! ${err}`;

      callback(results.rows);
    });
  }
};
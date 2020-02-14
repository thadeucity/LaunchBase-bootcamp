const db = require('../../config/db');
const { date } = require('../../lib/utils');

module.exports = {
  create(data,callback){
    const QUERY = `
      INSERT INTO recipes (
        chef_id,
        image,
        title,
        ingredients,
        preparation,
        information,
        created_at 
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `;

    const VALUES = [
      1,
      data.image,
      data.title,
      data.ingredients,
      data.preparation,
      data.information,
      date(Date.now()).iso
    ];

    db.query(QUERY, VALUES, function(err, results){
      if (err) throw `Database Error! ${err}`;

      callback(results.rows[0]);
    });

  },
  find(id, callback){
    const QUERY = `
      SELECT *
      FROM recipes
      WHERE id = $1
    `;

    db.query(QUERY, [id], function(err, results){
      if (err) throw `Database Error! ${err}`;

      callback(results.rows[0]);
    });
  },
  all(callback){
    const QUERY = `
      SELECT recipes.*, chefs.name as chef_name 
      from recipes
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      ORDER BY name
    `;

  db.query(QUERY, function(err, results){
    if (err) throw `Database Error! ${err}`;
    callback(results.rows);
  });
  },
  mostViewed(limit,callback){
    const QUERY = `
      SELECT recipes.*, chefs.name as chef_name 
      from recipes
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      ORDER BY name
      LIMIT $1
    `;

    db.query(QUERY, [limit], function(err, results){
      if (err) throw `Database Error! ${err}`;

      callback(results.rows);
    });
  },
  chefsList(callback){
    const QUERY = `
      SELECT name, id
      from chefs
      ORDER BY name
    `;

    db.query(QUERY, function(err, results){
      if (err) throw `Database Error! ${err}`;

      callback(results.rows);
    });
  }
};
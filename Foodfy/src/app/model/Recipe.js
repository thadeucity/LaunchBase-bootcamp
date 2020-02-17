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
      data.chef_id,
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
  update(data, callback){
    const QUERY = `
      UPDATE recipes SET
        chef_id=($1),
        image=($2),
        title=($3),
        ingredients=($4),
        preparation=($5),
        information=($6)
      WHERE id = $7
      RETURNING id
    `;

    const VALUES = [
      data.chef_id,
      data.image, 
      data.title,
      data.ingredients,
      data.preparation,
      data.information,
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
        recipes.*, chefs.name AS chef_name
      FROM
        recipes
      LEFT JOIN
        chefs ON (recipes.chef_id = chefs.id)
      WHERE
        recipes.id = $1
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
      FROM recipes
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      ORDER BY name
      LIMIT $1
    `;

    db.query(QUERY, [limit], function(err, results){
      if (err) throw `Database Error! ${err}`;

      callback(results.rows);
    });
  },
  paginate(params, callback){
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
      LIMIT ${params.limit} OFFSET ${params.offset}
    `;

    db.query(QUERY, function(err, results){
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
const db = require('../../config/db');
const { date } = require('../../lib/utils');

module.exports = {
  all(callback){
    const QUERY = `
      SELECT *
      FROM chefs
      ORDER BY name
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
  find(id, callback){
    const QUERY = `
      SELECT *
      FROM chefs
      WHERE id = $1
    `;
    db.query(QUERY, [id], function(err, results){
      if (err) throw `Database Error! ${err}`;

      callback(results.rows[0]);
    });
  },
  mostViewed(limit,callback){ // CHANGE
    const QUERY = `
      SELECT *
      FROM recipes
      LIMIT $1
    `;

    db.query(QUERY, [limit], function(err, results){
      if (err) throw `Database Error! ${err}`;

      callback(results.rows);
    });
  }
};
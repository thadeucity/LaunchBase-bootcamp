const db = require('../../config/db');
const { date } = require('../../lib/utils');

module.exports = {
  all(callback){
    const query = `
      SELECT * 
      FROM teachers 
      ORDER BY name ASC
    `;

    db.query(query, function(err, results){
      if (err) throw `Database Error! ${err}`;
      callback(results.rows);
    }); 
  },

  create(data, callback){
    const query = `
      INSERT INTO teachers (
        name,
        avatar_url,
        birth,
        degree_lvl,
        degree_area,
        place,
        teaching_area,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id
    `;

    const values = [
      data.name,
      data.avatar_url,
      date(data.birth).iso,
      data.degree_lvl,
      data.degree_area,
      data.place,
      data.teaching_area,
      date(Date.now()).iso
    ];

    db.query(query, values, function(err, results){
      if (err) throw `Database Error! ${err}`;
      callback(results.rows[0]);
    });
  },

  find(id, callback){
    const query = `
      SELECT * 
      FROM teachers 
      WHERE id = $1
    `;

    db.query(query, [id], function(err, results){
      if (err) throw `Database Error! ${err}`;
      callback(results.rows[0]);
    });

  },

  update(data, callback){
    const query = `
      UPDATE teachers SET
        name=($1),
        avatar_url=($2),
        birth=($3),
        degree_lvl=($4),
        degree_area=($5),
        place=($6),
        teaching_area=($7)
      WHERE id = $8
    `;

    const values = [
      data.name,
      data.avatar_url,
      date(data.birth).iso,
      data.degree_lvl,
      data.degree_area,
      data.place,
      data.teaching_area,
      data.id
    ];

    db.query(query, values, function(err, results){
      if (err) throw `Database Error! ${err}`;
      return callback();
    });
  },

  delete(id, callback){
    const query = `DELETE FROM teachers WHERE id = $1`;

    db.query(query, [id], function(err, results){
      if (err) throw `Database Error! ${err}`;
      return callback();
    });
  }
}
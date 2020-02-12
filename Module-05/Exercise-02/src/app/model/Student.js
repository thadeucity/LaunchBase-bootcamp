const db = require('../../config/db');
const { date } = require('../../lib/utils');

module.exports = {
  all(callback){
    const query = `
      SELECT * 
      FROM students 
      ORDER BY name ASC
    `;

    db.query(query, function(err, results){
      if (err) throw `Database Error! ${err}`;
      callback(results.rows);
    }); 
  },

  create(data, callback){
    const query = `
      INSERT INTO students (
        name,
        avatar_url,
        email,
        birth,
        degree_lvl,
        place,
        load
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `;

    const values = [
      data.name,
      data.avatar_url,
      data.email,
      date(data.birth).iso,
      data.degree_lvl,
      data.place,
      Number(data.load),
    ];

    db.query(query, values, function(err, results){
      if (err) throw `Database Error! ${err}`;
      callback(results.rows[0]);
    });
  },

  find(id, callback){
    const query = `
      SELECT * 
      FROM students 
      WHERE id = $1
    `;

    db.query(query, [id], function(err, results){
      if (err) throw `Database Error! ${err}`;
      callback(results.rows[0]);
    });
  },

  update(data, callback){
    const query = `
      UPDATE students SET
        name=($1),
        avatar_url=($2),
        email=($3),
        birth=($4),
        degree_lvl=($5),
        place=($6),
        load=($7)
      WHERE id = $8
    `;

    const values = [
      data.name,
      data.avatar_url,
      data.email,
      date(data.birth).iso,
      data.degree_lvl,
      data.place,
      data.load,
      data.id
    ];

    db.query(query, values, function(err, results){
      if (err) throw `Database Error! ${err}`;
      return callback();
    });
  },

  delete(id, callback){
    const query = `DELETE FROM students WHERE id = $1`;

    db.query(query, [id], function(err, results){
      if (err) throw `Database Error! ${err}`;
      return callback();
    });
  },

  levels(){
    const query = `SELECT * FROM settings WHERE name = 'studentDegrees'`;

    db.query(query, function(err, results){
      if (err) throw `Database Error! ${err}`;
      console.log(results.rows[0].value)
      return (results.rows[0].value);
    });
  }
}
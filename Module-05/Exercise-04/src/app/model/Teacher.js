const db = require('../../config/db');
const { date } = require('../../lib/utils');

module.exports = {
  all(callback){
    const query = `
      SELECT teachers.*, count(students) AS total_students 
      FROM teachers
      LEFT JOIN students ON (teachers.id = students.teacher_id)
      GROUP BY teachers.id
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

  findBy(filter, callback){
    const query = `
      SELECT teachers.*, count(students) AS total_students 
      FROM teachers
      LEFT JOIN students ON (teachers.id = students.teacher_id)
      WHERE teachers.name ILIKE '%${filter}%'
      OR teachers.teaching_area ILIKE '%${filter}%'
      GROUP BY teachers.id
      ORDER BY name ASC
    `;

    db.query(query, function(err, results){
      if (err) throw `Database Error! ${err}`;
      callback(results.rows);
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
  },

  paginate(params){
    const {filter, limit, offset, callback} = params;

    let query = "";
    let filterQuery = "";
    let totalQuery = `(
      SELECT count(*) FROM teachers
      ) AS total
    `;

    if (filter){
      filterQuery = `${query}
        WHERE teachers.name ILIKE '%${filter}%'
        OR teachers.teaching_area ILIKE '%${filter}%'
      `;

      totalQuery = `
        (SELECT count(*) FROM teachers
        ${filterQuery}
        ) as total
      `; 
    }

    query = `
      SELECT teachers.*, ${totalQuery} ,
      count (students) AS total_students 
      FROM teachers
      LEFT JOIN students ON (teachers.id = students.teacher_id)
      ${filterQuery}
      GROUP BY teachers.id LIMIT $1 OFFSET $2
    `;

    db.query(query, [limit, offset], function(err, results){
      if (err) throw `Database Error! ${err}`;
      callback(results.rows);
    })


  },
}
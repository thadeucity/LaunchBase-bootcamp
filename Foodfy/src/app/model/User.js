const db = require ('../../config/db');
const { hash } = require ('bcryptjs');

module.exports = {
  async findOne (filters){
    let query = "SELECT * FROM users";

    Object.keys(filters).map(key => {
      query = `
        ${query}
        ${key}
      `;

      Object.keys(filters[key]).map(field => {
        query = `${query} ${field} = '${filters[key][field]}'`;
      });
    });

    const results = await db.query(query);

    return results.rows[0];
  },
  async create (data){
    try{
      const query = `
        INSERT INTO users (
          name,
          email,
          password,
          is_admin
        ) VALUES ($1, $2, $3, $4)
        RETURNING id
      `;

      const passwordHash = await hash(data.password, 8);

      const values = [
        data.name,
        data.email,
        passwordHash,
        data.isAdmin
      ];

      await db.query(query, values);

      return {error: false}; 

    } catch (err) {
      console.error(err);
      return {error: true};
    }
    
  },
  async update (id, fields){
    let query = 'UPDATE users SET';

    Object.keys(fields).map((key, index, array) => {
      if((index+1) < array.length){
        query = `${query}
          ${key} = '${fields[key]}',
        `;
      }else{  //last iteration
        query = `${query}
          ${key} = '${fields[key]}'
          WHERE id = ${id}
        `;
      }
    });

    console.log(query)

    await db.query(query);
    return;
  }
}
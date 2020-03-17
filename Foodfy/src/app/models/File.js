const Base = require('./Base');

Base.init({table: 'files'});

module.exports = {
  ...Base
}


  // async delete(id){

  //   try{
  //     const result = await db.query(`SELECT * FROM files WHERE id = $1`, [id]);
  //     const file = result.rows[0];
  
  //     fs.unlinkSync(file.path);

  //     return db.query(`
  //       DELETE FROM recipe_files WHERE file_id = $1
  //     `, [id]);
  //   }catch(err){
  //     console.error(err);
  //   }

  // },

  // async deleteAvatar(chefId){

    //  try{
    //    let result = await db.query(
    //      `SELECT * FROM chef_files WHERE chef_id = $1`,
    //      [chefId]
    //    );
    //    if (!result.rows[0]){
    //      return false;
    //    }
    //    const fileId = result.rows[0].file_id;

    //    result = await db.query(`SELECT * FROM files WHERE id = $1`, [fileId]);
    //    const file = result.rows[0];
  
    //    fs.unlinkSync(file.path);

    //    return db.query(`
    //      DELETE FROM chef_files WHERE file_id = $1
    //    `, [fileId]);
    //  }catch(err){
    //    console.error(err);
    //  }

  // }
const Messages = require ('../../lib/messages');

const LoadContentService = require ('../services/LoadContentService');

const { unlinkSync } = require('fs');

const Chef = require('../models/Chef');
const Recipe = require('../models/Recipe');
const File = require ('../models/File');

module.exports = {
  async chefs (req, res){
    const chefs = await LoadContentService.load('chefs');
    
    return res.render('public/chefs', {chefs});
  },
  async show (req, res){
    const {id} = req.params;

    const chef = await LoadContentService.load('chef', { where: {id} });

    return res.render('public/chefs_show', {chef});
  },

  //////////////////////    ADMIN CONTROLLERS    /////////////////////

  async adminChefs (req, res){
    const chefs = await LoadContentService.load('chefs');
    
    return res.render('admin/chefs/index', {chefs, admin:req.session.admin});
  },
  
  async adminShow (req, res){
    const {id} = req.params;

    const chef = await LoadContentService.load('chef', { where: {id} });

    return res.render('admin/chefs/show', {chef, admin:req.session.admin});
  },

  create (req, res){
    let error = null;
    if (req.query) error = req.query.error;
    return res.render('admin/chefs/create', {error});
  },

  async post (req, res){ // Create a Service for saving 
    try {
      const {name} = req.body
      const chefId = await Chef.create({name});
  
      for (const file of req.files){       // Change to req.files[].path
        const fileId = await File.create({
          name: `${name}_avatar`,
          path: file.path
        });
        await Chef.linkFile(chefId, fileId);
      }

      return res.redirect(`/admin/chefs/${chefId}`);

    } catch (err) {
      console.error(err);
    }
  },

  async edit (req, res){
    const {id} = req.params;
    
    const message = Messages.fromQuery(req.query);

    const chef = await LoadContentService.load('chef', { where: {id} });

    return res.render('admin/chefs/edit', {chef, error:message.error});
  },

  async put (req, res){
    try {
      const {id, name} = req.body;

      if (req.files.length >= 1){
        const avatar = await Chef.avatar(id);
        unlinkSync(avatar.path);
  
        await File.delete(avatar.id);
  
        for (const file of req.files){  // Change to req.files[].path
          const fileId = await File.create({
            name: `${name}_avatar`,
            path: file.path
          });
          await Chef.linkFile(id, fileId);
        }
      }
    
      await Chef.update(id,{name});
      
      return res.redirect(`/admin/chefs/${id}`);
      
    } catch (err) {
      console.error(err);
    }
    
  },
  
  async delete (req, res){
    try {
      const {id} = req.body;

      const recipes = await Recipe.find({filters: {where: {chef_id: id}}});
      
      const avatar = await Chef.avatar(id);
      unlinkSync(avatar.path);

      await File.delete(avatar.id);

      const changeChefPromises = recipes.map( recipe => {
        return Recipe.update(recipe.id,{chef_id : 1})
      });

      await Promise.all(changeChefPromises);
      await Chef.delete(id);


      return res.redirect(`/admin/chefs`);
      
    } catch (err) {
      console.error(err);
    }

  }
}
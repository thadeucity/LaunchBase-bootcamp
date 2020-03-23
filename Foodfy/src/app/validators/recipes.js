const checkForm = require('../services/checkForm');

const Chef = require('../models/Chef');

async function createRecipe (req, res, next) {
  try {
    let error = checkForm.images(req.files, true);
    if (error) {
      const chefs = await Chef.findAll();
      return res.render('admin/recipes/create', {
        chefs,
        recipe: req.body,
        error
      });
    }

    error = checkForm.allFields(req.body, req.files);
    if (error) return res.render(`admin/errors/invalid-form`, {error});

    next();

  } catch (err) {
    console.error(err);
  }

}

async function updateRecipe (req, res, next){
  try {
    let error = checkForm.images(req.files);
    if (error) {
      const chefs = await Chef.findAll();
      return res.render('admin/recipes/create', {
        chefs,
        recipe: req.body,
        error
      });
    }

    error = checkForm.allFields(req.body, req.files);
    if (error) return res.render(`admin/errors/invalid-form`, {error});

    next();

  } catch (err) {
    console.error(err);
  }
}

module.exports = {
 createRecipe,
 updateRecipe
}
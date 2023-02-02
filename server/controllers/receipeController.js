require('../models/database');
const Category = require('../models/Category')
const Recipe = require('../models/Recipe')


/**
 * GET /
 * Homepage 
*/
exports.homepage = async(req,res) => {
    try {
        const limitNumber = 5;
        const categories = await Category.find({}).limit(limitNumber);
        const latest = await Recipe.find({}).sort({_id: -1}).limit(limitNumber);
        const thai = await Recipe.find({ 'category': 'Thai' }).limit(limitNumber);
        const american = await Recipe.find({ 'category': 'American' }).limit(limitNumber);
        const chinese = await Recipe.find({ 'category': 'Chinese' }).limit(limitNumber);
        const mexican = await Recipe.find({ 'category': 'Mexican' }).limit(limitNumber);
        const indian = await Recipe.find({ 'category': 'Indian' }).limit(limitNumber);
        const spanish = await Recipe.find({ 'category': 'Spanish' }).limit(limitNumber);
        const food = {latest, thai,american,chinese,mexican,indian,spanish};
        res.render('index',{ title: 'Bananewala : The Receipe Store',categories,food});
    } catch (error) {
        res.status(500).send({message: error.message || "Errror Occured"})
    }
    

}

/**
 * GET /categories
 * Categories 
*/
exports.exploreCategories = async(req,res) => {
    try {
        const limitNumber = 20;
        const categories = await Category.find({}).limit(limitNumber);
        res.render('categories',{ title: 'Bananewala : categories',categories});
    } catch (error) {
        res.status(500).send({message: error.message || "Errror Occured"})
    }
    

}



/**
 * GET /categories/:id
 * Categories By Id
*/

exports.exploreCategoriesById = async(req, res) => { 
    try {
      let categoryId = req.params.id;
      
      const limitNumber = 20;
      const categoryById = await Recipe.find({ 'category': categoryId }).limit(limitNumber);

      res.render('categories', { title: 'Bananewala - Categoreis', categoryById } );
    } catch (error) {
      res.satus(500).send({message: error.message || "Error Occured" });
    }
  } 


/**
 * GET /recipe/:id
 * Recipe 
*/

exports.exploreRecipe = async(req,res) => {
    try {
        const recipeId = req.params.id;
        const recipe = await Recipe.findById(recipeId);
        res.render('recipe',{ title: 'Bananewala : categories',recipe});
    } catch (error) {
        res.status(500).send({message: error.message || "Errror Occured"})
    }
    

}

/**
 * POST /search
 * Search 
*/

exports.search = async(req,res) => {
    try {
        let searchTerm = req.body.searchTerm;
        let recipe = await Recipe.find( { $text: { $search: searchTerm, $diacriticSensitive: true } });
        res.render('search',{ title: 'Bananewala : categories',recipe});
    } catch (error) {
        res.status(500).send({message: error.message || "Errror Occured"})
    }
    

}


/**
 * GET /explore-latest
 * Explore Latest 
*/
exports.exploreLatest = async(req, res) => {
    try {
      const limitNumber = 20;
      const recipe = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
      res.render('explore-latest', { title: 'Bananewala - Explore Latest', recipe } );
    } catch (error) {
      res.satus(500).send({message: error.message || "Error Occured" });
    }
  } 


/**
 * GET /explore-random
 * Explore Random as JSON
*/
exports.exploreRandom = async(req, res) => {
    try {
      let count = await Recipe.find().countDocuments();
      let random = Math.floor(Math.random() * count);
      let recipe = await Recipe.findOne().skip(random).exec();
      res.render('explore-random', { title: 'Bananewala - Explore Latest', recipe } );
    } catch (error) {
      res.satus(500).send({message: error.message || "Error Occured" });
    }
  } 


/**
 * GET /submit-recipe
 * Submit Recipe
*/
exports.submitRecipe = async(req, res) => {
  const infoErrorsObj = req.flash('infoErrors');
  const infoSubmitObj = req.flash('infoSubmit');
  res.render('submit-recipe', { title: 'Bananewala - Submit Recipe', infoErrorsObj, infoSubmitObj} );
}


/**
 * POST /submit-recipe
 * Submit Recipe
*/
exports.submitRecipeOnPost = async(req, res) => {

  try {

    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if(!req.files || Object.keys(req.files).length === 0){
      console.log('No Files where uploaded.');
    }
    else 
    {

      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

      imageUploadFile.mv(uploadPath, function(err){
        if(err) return res.satus(500).send(err);
      })

    }



  const newrecipe = new Recipe({
      name: req.body.name,
      description: req.body.description,
      email: req.body.email,
      ingredients: req.body.ingredients,
      category: req.body.category,
      image: newImageName
      

      // manually filling the form data
      //name: 'Grilled Lobster Roll',
      //description: 'Grilled Southwestern Lobster Rolls Recipe from Food Network You can also find 1000s of Food Network best recipes from top chefs, shows and experts. ',
      // email: 'lobster@gmail.com',
      // ingredients: ['water','pick of salt and lobster','oil','labita'],
      // category: 'Spanish',
      // image: newImageName
  
  })
  
  // saving the form data
  await newrecipe.save();

  req.flash('infoSubmit','Recipe has been added');
  res.redirect('/submit-recipe');
  } 
  
  catch (error) {
  
  req.flash('infoErrors',error);
  res.redirect('/submit-recipe');
  }
}


exports.deleteId = async(req, res) => { 
  try {
    let Id = req.params.id;
    await Recipe.findByIdAndDelete(Id);
    res.redirect('/');
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
} 





// async function deleteRecipe(){
//   try {
//     await Recipe.deleteOne({ name: 'New Recipe From Form' });
//   } catch (error) {
//     console.log(error);
//   }
// }
// deleteRecipe();


// Update Recipe
// async function updateRecipe(){
//   try {
//     const res = await Recipe.updateOne({ name: 'New Recipe' }, { name: 'New Recipe Updated' });
//     res.n; // Number of documents matched
//     res.nModified; // Number of documents modified
//   } catch (error) {
//     console.log(error);
//   }
// }
// updateRecipe();



// POST MANUALLY DATA FOR RECIPE AND CATEGORY

// async function insertDummyCategoryDate(){
//     try {
//         await Category.insertMany([
//      {
//         "name": "Thai",
//         "image": "thai-food.jpg"
//       },
//       {
//         "name": "American",
//         "image": "american-food.jpg"
//       }, 
//       {
//         "name": "Chinese",
//         "image": "chinese-food.jpg"
//       },
//       {
//         "name": "Mexican",
//         "image": "mexican-food.jpg"
//       }, 
//       {
//         "name": "Indian",
//         "image": "indian-food.jpg"
//       },
//       {
//         "name": "Spanish",
//         "image": "spanish-food.jpg"
//       }
//         ]);
//     } catch (error) {
//         console.log(error);
//     }
// }

// insertDummyCategoryDate();




// async function insertDymmyRecipeData(){
//   try {
//     await Recipe.insertMany([
//       {
//       "name": "Southern Fried Chicken",
//       "description": "Southern Fried Chicken, is a British-based fast food outlet headquartered in Reading, England. It operates a franchise network in the United Kingdom and worldwide. Southern Fried Chicken has 93 locations in 15 countries.",
//       "email": "renticle@fried.com",
//       "ingredients": [
//         "1 level teaspoon baking powder",
//         "1 level teaspoon cayenne pepper",
//         "1 level teaspoon hot smoked paprika"
//       ],
//       "category": "American",
//       "image": "southern-friend-chicken.jpg"
//     },{
//       "name": "Crab Cake",
//       "description": "Recipe Description Goes Here",
//       "email": "Crab@rentfood.com",
//       "ingredients": [
//         "1 level teaspoon baking powder",
//         "1 level teaspoon cayenne pepper",
//         "1 level teaspoon hot smoked paprika"
//       ],
//       "category": "Thai",
//       "image": "crab-cakes.jpg"
//     },{
//       "name": "Spring Rolls",
//       "description": "Recipe Description Goes Here",
//       "email": "chinese@spring.com",
//       "ingredients": [
//         "1 level teaspoon baking powder",
//         "1 level teaspoon cayenne pepper",
//         "1 level teaspoon hot smoked paprika"
//       ],
//       "category": "Chinese",
//       "image": "spring-rolls.jpg"
//     },{
//       "name": "Pie Lime",
//       "description": "Recipe Description Goes Here",
//       "email": "pie@lime.com",
//       "ingredients": [
//         "1 level teaspoon baking powder",
//         "1 level teaspoon cayenne pepper",
//         "1 level teaspoon hot smoked paprika"
//       ],
//       "category": "American",
//       "image": "key-lime-pie.jpg"
//     },{
//       "name": "Thai Green Curry",
//       "description": "Recipe Description Goes Here",
//       "email": "thaifood@yorks.com",
//       "ingredients": [
//         "1 level teaspoon baking powder",
//         "1 level teaspoon cayenne pepper",
//         "1 level teaspoon hot smoked paprika"
//       ],
//       "category": "Thai",
//       "image": "thai-green-curry.jpg"
//     },{
//       "name": "Thai Veggies",
//       "description": "Recipe Description Goes Here",
//       "email": "thai@veggies.com",
//       "ingredients": [
//         "1 level teaspoon baking powder",
//         "1 level teaspoon cayenne pepper",
//         "1 level teaspoon hot smoked paprika"
//       ],
//       "category": "Chinese",
//       "image": "veggie-pad-thai.jpg"
//     },{
//       "name": "Stir Fried Vegetable",
//       "description": "Recipe Description Goes Here",
//       "email": "recipeemail@raddy.co.uk",
//       "ingredients": [
//         "1 level teaspoon baking powder",
//         "1 level teaspoon cayenne pepper",
//         "1 level teaspoon hot smoked paprika"
//       ],
//       "category": "American",
//       "image": "stir-fried-vegetables.jpg"
//     },{
//       "name": "Thai Mussels",
//       "description": "Recipe Description Goes Here",
//       "email": "thai@mussels.com",
//       "ingredients": [
//         "1 level teaspoon baking powder",
//         "1 level teaspoon cayenne pepper",
//         "1 level teaspoon hot smoked paprika"
//       ],
//       "category": "Thai",
//       "image": "thai-style-mussels.jpg"
//     }
//   ]);
//   } catch (error) {
//     console.log('err', + error)
//   }
// }

// insertDymmyRecipeData();
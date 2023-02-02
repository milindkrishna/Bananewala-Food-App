const express = require('express');
const router = express.Router();

const receipeController = require('../controllers/receipeController');

router.get('/',receipeController.homepage);
router.get('/categories',receipeController.exploreCategories);
router.get('/categories/:id',receipeController.exploreCategoriesById);
router.get('/recipe/:id', receipeController.exploreRecipe );
router.post('/search', receipeController.search );
router.get('/explore-latest', receipeController.exploreLatest );
router.get('/explore-random', receipeController.exploreRandom );
router.get('/submit-recipe', receipeController.submitRecipe );
router.post('/submit-recipe', receipeController.submitRecipeOnPost );
router.get('/delete/:id',receipeController.deleteId);

module.exports = router
const express= require('express');
const router = express.Router();
const postController= require('../Controllers/postController');
const asyncWrapper= require('../Middleware/asycWrapper');
const {createPostContentSchema, generateCaptionSchema, savePosterSchema} = require('../Middleware/Validators/postValidator');
const auth = require('../Middleware/authMiddleware');


// Recent post from the dalli E 2
router.get('/graphics/recent', auth(), asyncWrapper(postController.getListOfgeneration));
// Call to action for the posts
router.post('/posterContent', auth(), createPostContentSchema, asyncWrapper(postController.getPosterContent));

// Generate the graphics using dalli E 2
router.post( '/graphics', auth(), asyncWrapper(postController.generateGraphics));

// Get the generated graphics from Mid Journey
router.post('/midJourneyGraphics', auth(), asyncWrapper(postController.midJourneyGraphics));

// Generate Caption
router.post('/captions', auth(), generateCaptionSchema, asyncWrapper(postController.generateCaption));

// Save Generated hashtage
router.post('/hashtags', auth(), asyncWrapper(postController.generateHashtag));

// Save Generated Poster
router.post('/savePoster', auth(),savePosterSchema,  asyncWrapper(postController.savePoster));

// Get the saved poster
router.get('/savePoster', auth(), asyncWrapper(postController.getSavedPoster));




module.exports = router;
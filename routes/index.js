const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController')
const userController = require('../controllers/userController')
const {catchErrors} = require('../handlers/errorHandlers')

// Do work here
router.get('/', catchErrors(storeController.getStores));
router.get('/store/:slug/', catchErrors(storeController.getStoreBySlug));
router.get('/stores', catchErrors(storeController.getStores));
router.get('/stores/:id/edit', catchErrors(storeController.editStore));
router.get('/add',  catchErrors(storeController.addStore));
router.post('/add', 
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.createStore)
);
router.post('/add/:id', 
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.updateStore)
);

// Tags
router.get('/tags/',  catchErrors(storeController.getStoreByTag));
router.get('/tags/:tag',  catchErrors(storeController.getStoreByTag));

// User
router.get('/login',  catchErrors(userController.login));
router.get('/register',  catchErrors(userController.register));
router.post('/register',  catchErrors(userController.validateRegister));



module.exports = router;


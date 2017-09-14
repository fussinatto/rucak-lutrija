const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController')
const userController = require('../controllers/userController')
const authController = require('../controllers/authController')
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
router.get('/tags/:tag',  storeController.getStoreByTag);

// User
router.get('/login',  catchErrors(userController.loginForm));
router.get('/register',  catchErrors(userController.registerForm));
router.post('/register',  
  userController.validateRegister,
  userController.register,
  authController.login
);



module.exports = router;


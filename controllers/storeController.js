const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const jimp = require('jimp');
const uuid = require('uuid');
const multer = require('multer');
const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter: (req, file, next) => {
    const isPhoto = file.mimetype.startsWith('image');
    if (isPhoto) {
      next(null, true);
    } else {
      next({ message: 'That filetype isn\'t allowed' }, false)
    }
  }
}


exports.homePage = (req, res) => {
  res.render('index');
};

exports.addStore = (req, res) => {
  res.render('editStore', {
    title: 'Add store'
  });
};

exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next) => {
  if (!req.file) {
    next()
    return;
  }
  const extension = req.file.mimetype.split('/')[1];
  req.body.photo = `${uuid.v4()}.${extension}`;
  const photo = await jimp.read(req.file.buffer)
  await photo.resize(800, jimp.AUTO)
  await photo.write(`./public/uploads/${req.body.photo}`)
  next();
}

exports.createStore = async (req, res) => {
  let store = await (new Store(req.body)).save();
  req.flash('success', `Successfully created ${store.name}.`)
  res.redirect('/')
};

exports.getStores = async (req, res) => {
  const stores = await Store.find()
  res.render('stores', { title: 'Stores', stores })
}

exports.editStore = async (req, res) => {
  const store = await Store.findOne({ _id: req.params.id })
  res.render('editStore', {
    title: `Edit ${store.name}`,
    store
  });
}

exports.updateStore = async (req, res) => {
  req.body.location.type = 'Point';
  const store = await Store.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true, runValidators: true }).exec();
  req.flash('success', `Successfully updates <strong>${store.name}<strong>`)
  res.redirect(`/stores/${store._id}/edit`)
}

exports.getStoreBySlug = async (req, res, next) => {
  const store = await Store.findOne({ slug: req.params.slug })
  if (!store) return next();
  res.render('store', {
    store
  });
}

exports.getStoreByTag = async (req, res, next) => {
  const pageTag = req.params.tag;
  const tagQuery = pageTag || {$exists: true};
  const tagsPromise = Store.getTagList();
  const storePromise = Store.find({ tags: tagQuery});
  const [tags, stores] = await Promise.all([tagsPromise, storePromise]);
  res.render('tags', {tags, title: `${req.params.tag}`, pageTag, stores});
}

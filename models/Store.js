const mongoose = require('mongoose');
const slug = require('slugs');

mongoose.Promise = global.Promise;

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Please enter the store name'
  },
  slug: String,
  description: {
    type: String,
    trim: true
  },
  tags: [String],
  location: {
    type: {
      type: String,
      default: 'Point',
    },
    address: {
      type: String,
      required: 'Please enter the store address'
    },
    coordinate: [{
      type: Number,
      required: 'You must supply coordinates!'
    }]
  },
  created: {
    type: Date,
    default: Date.now
  },
  photo: String
});


storeSchema.pre('save', async function(next) {
  if (!this.isModified('name')) {
    next();
    return;
  }
  this.slug = slug(this.name);

  const slugRegex = new RegExp(`^(${this.slug})((-[0-9]*)?)`, 'i');
  const storesWithSlug = await this.constructor.find({slug: slugRegex});
  if (storesWithSlug.length) {
    this.slug = `${this.slug}-${storesWithSlug.length + 1}`
  }
  next();
});

module.exports = mongoose.model('Store', storeSchema);

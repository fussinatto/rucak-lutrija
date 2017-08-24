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
  }
});


storeSchema.pre('save', function(next) {
  if (!this.isModified('name')) {
    next();
    return;
  }
  this.slug = slug(this.name);
  next();
});

module.exports = mongoose.model('Store', storeSchema);

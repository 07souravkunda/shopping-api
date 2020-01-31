const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tour should have a name'],
      unique: [true, 'name should be unique'],
      trim: true,
      minlength: [10, 'Tour name must have 10 characters'],
      maxlength: [30, 'Tour name should have maximum 30 characters']
    },
    rating: {
      type: Number,
      default: 4.5,
      min: [1, 'rating should be minium 1.0'],
      max: [5, 'rating should be less than 5.0']
    },
    price: {
      type: Number,
      required: [true, 'Tour should have a price']
    },
    priceDiscount: {
      type: Number,
      default: 0
      // validate: {
      //   validator: function(val) {
      //     return this.price > val;
      //   },
      //   message: 'discount should be less than price'
      // }
    },
    duration: {
      type: Number,
      required: [true, 'Tour should have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'Tour should have a group size']
    },
    ratingsAverage: {
      type: Number,
      default: 0
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    summary: {
      type: String,
      required: [true, 'Tour should have a summary'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Tour should have a description'],
      trim: true
    },
    difficulty: {
      type: String,
      required: [true, 'Tour should have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'difficulty should be: easy,medium or difficult'
      }
    },
    imageCover: {
      type: String,
      required: [true, 'Tour should have a image cover']
    },
    slug: String,
    images: {
      type: [String],
      required: [true, 'Tour should have images']
    },
    startDates: {
      type: [Date]
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    isSecret: {
      type: Boolean,
      default: false
    }
  },
  {
    toJSON: {
      virtuals: true
    },
    toObject: {
      virtuals: true
    }
  }
);

tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
});
//for create() and save()
tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, {
    lower: true
  });
  next();
});

tourSchema.pre('save', function(next) {
  console.log('after first pre');
  next();
});

tourSchema.post('save', function(doc, next) {
  console.log(doc);
  next();
});

tourSchema.pre(/^find/, function(next) {
  this.find({ isSecret: { $ne: true } });
  this.start = Date.now();
  next();
});
tourSchema.post('find', function(docs, next) {
  console.log(`Your query took ${Date.now() - this.start} miliseconds`);
  next();
});

tourSchema.pre('aggregate', function(next) {
  this.pipeline().unshift({ $match: { isSecret: { $ne: true } } });
  console.log(this.pipeline());
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;

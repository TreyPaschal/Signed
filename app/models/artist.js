var mongoose = require('mongoose');

// define our artist model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('Artist', {
   artist : {type : String, text : true},
   name : {type : String},
   aci: {type : String},
   timestamp: {type: String}
});
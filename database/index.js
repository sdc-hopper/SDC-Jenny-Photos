const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/fetcher');


let checkoutSchema = mongoose.Schema({

});

let Checkout = mongoose.model('Checkout', checkoutSchema);



// {
//   ProductId: Number,
//   Price: Number,
//   Inventory: Number
// }

// {
//   ProductId: Number,
//   Url: String,
//   Category: String,
//   Primary: Boolean,
// }
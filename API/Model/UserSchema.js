const mongoose = require('mongoose')

const review = mongoose.Schema({
  _id : mongoose.Schema.Types.ObjectId,
  title : {type: String, required: false},
  description : {type: String, required: false}
})

const recent_Activity = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: {type: String, required: false},
  description: {type: String, required: false},
  activityImage: {type: String, required: false}
})

const UserSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  ngoName: { type: String ,required: true},
  email: { type: String ,required: true,unique: true,match:  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/},
  password: { type: String ,required: true},
  ngoAim: { type: String, required: false },
  ngoDescription: { type: String, required: false},
  ngoCategory: { type: String, required: true},
  ngoReviews: [review],
  ngo_Recent_Activities: [recent_Activity],
  contact_Info: {
    link: {type: String},
    Address: {type: String, required: true},
    contact_No: {type: Number, required: true}
  },
  ngo_Authorization_Id : { type: String, required: true}
})

module.exports = mongoose.model('Users',UserSchema)
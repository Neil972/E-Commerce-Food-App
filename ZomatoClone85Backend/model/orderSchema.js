let mongoose = require("mongoose")

let menuItemSchema=new mongoose.Schema({
    foodName:String,
    price:Number
})
let orderSchema=new mongoose.Schema({
    name:{type:String,required:true},
    emailId:String,
    contactNo:{type:Number,required:true},
    address:{type:String,required:true},
    userOrder:{type:[menuItemSchema],required:true},
    totalPrice:{type:Number,required:true},
    paid:{type:Boolean,default:false}
})

let orderModel=mongoose.model("orderModel",orderSchema)

module.exports=orderModel
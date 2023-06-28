let mongoose=require("mongoose")

let restaurantMenuSchema=new mongoose.Schema({
        restaurantName:{type:String,required:true},
        foodName:{type:String,required:true},
        price:{type:Number,required:true},
        description:String,
        imgPath:String
    })

let restaurantMenuModel=mongoose.model("restaurantMenuModel",restaurantMenuSchema)

module.exports=restaurantMenuModel
require("dotenv").config()
let express=require("express")
let cors=require("cors")
const { default: mongoose, model } = require("mongoose")
let app=express()
let bcrypt=require("bcryptjs")
let razorpay=require("razorpay")
let crypto=require("crypto")

   let fetchData=require("./model/restaurant")
   
   let locationsJSON= require("./model/location")

   let mealsObj=require("./model/meals")

   console.log("imported restaurant",fetchData)
   console.log("imported location",locationsJSON)
   console.log("imported meals",mealsObj)

   app.use(express.json())
   app.use(cors())

   let PORT=5000
   app.listen(PORT,(req,res)=>{
    console.log("server is started and listening to PORT",PORT)
   })

   app.post("/",(req,res)=>{
    console.log("request recieved for locations")
    if(req.body.needed==="getLocations"){
        let resArr=locationsJSON.map((x)=>{
            let resSubArr=[]
            if("name" in x){
                resSubArr.push(x["name"])
            }
            if("city" in x){
                resSubArr.push(x["city"])
            }
            return resSubArr
        })
        console.log("resArr",resArr)
        return res.json(resArr)
    }
   })

   app.post("/dataAccInp",async (req,res)=>{
    try{
        console.log(req.body,"req.body")
        let inptArr=req.body.select.split(",")
        let userInp=req.body.inp.toLowerCase()
        // locality,city,name
        let srchResult=fetchData.filter((x)=>{
            console.log("city",x["city"],inptArr[1],"locality",x["locality"],inptArr[0])
            if(x["city"]===inptArr[1]&& x["locality"]===inptArr[0]){
                let dbLCval=x["name"].toLowerCase()
                console.log(dbLCval,req.body.inp,dbLCval.includes(userInp,0))
                if(dbLCval.includes(userInp,0)){
                    return x
                }
            }
        })
        // let srchResult=locationsJSON.filter((x)=>{
        //     let inptArr=req.body.select.split(",")
        //     if(x["name"]===inptArr[0] && x["city"]===inptArr[1]){
        //         return x
        //     }
        // })
        console.log("filtered srch result",srchResult)
        res.json(srchResult)
    }
    catch(e){
        return console.error(e)
    }
   })

   app.get("/getMealTypes",(req,res)=>{
    res.json(mealsObj)
   })
   let URI=process.env.URI
//    "mongodb+srv://Indranil:MKljrvOdRkRADNOZ@cluster0.dsapfrd.mongodb.net/?retryWrites=true&w=majority"
//    
   
   mngseCnnct()

   async function mngseCnnct(){
    // {useNewUrlParser:true,useUnifiedTopology:true}
    await mongoose.connect(URI).then((x)=>{
        console.log("connected to mongoDB Atlas")
    }).catch((y)=>{
        console.log("error",y)
        return console.error(y)
    })
   }

   let userInfoSchema=new mongoose.Schema({
    emailID:{type:String,required:true,unique:true},
    password:{type:String,required:true}
   })
    
   let userInfoModel=mongoose.model("userInfoModel",userInfoSchema)

   app.post("/accountCrd/Login",(req,res)=>{
    console.log("crd",req.body)
    let resObj={foundUser:null}
    findUser()

    async function findUser(){
        let userinDB=null
        await userInfoModel.find({emailID:req.body.name}).then((x)=>{
            if(x.length===0){
                resObj={foundUser:"user doesn't exists"}
            }
            else{
                console.log("found user",x)
                userinDB=x
                resObj={foundUser:"user exists"}
            }
        }).catch((e)=>{
            console.log("error",e)
            console.error(e)
        })

        if(resObj.foundUser===`user exists`){
            await bcrypt.compare(req.body.password,userinDB[0].password).then((result)=>{
                if(result===true){
                    console.log("foundUser",userinDB[0],"result",result)
                    resObj={password:"matched",foundUser:userinDB}
                }
                else{
                    resObj={foundUser:"password incorrect"}
                }
            }).catch((e)=>{
                console.log("error in login",e)
                return console.error(e)
            })
        }

        return res.json(resObj)
    }
    // async function createUser(){
    
    //     await userInfoModel.create({emailID:req.body.name,password:req.body.password}).then((x)=>{
    //         if(!x){
    //             console.log("user not created",req.body)
    //             resObj= "no user created"
    //         }
    //         else{
    //             console.log("user created",x)
    //             resObj = {...x}
    //         }
    //     }).catch((e)=>{
    //         console.log("error",e)
    //         console.error(e)
    //     }).finally(()=>{
    //         return resObj
    //     })     
    // }
   })

   app.post("/accountCrd/Create",(req,res)=>{
    console.log("Create Account",req.body)
    findOrCreate()
    async function findOrCreate(){
        let foundProfile=null
        await userInfoModel.find({emailID:req.body.name}).then((x)=>{
            if(x.length>0){
                return foundProfile={foundUser:"userExists"}
            }else{
                return foundProfile="none exists"
            }
        }).catch((e)=>{
            console.log(e)
            return console.error(e)
        })

        console.log("foundProfile",foundProfile)

        let user={profileCreated:null}
        if(foundProfile==="none exists"){
            let hashedVar=""
            await bcrypt.hash(req.body.password,11).then((x)=>{
                hashedVar=x
            }).catch((e)=>{
                console.log("hashError",e)
                return console.error(e)
            })
            await userInfoModel.create({emailID:req.body.name,password:hashedVar}).then((x)=>{
                console.log("userCreated",x)
                user={profileCreated:"new Account created"}
            }).catch((e)=>{
                console.log(e)
                return console.error(e)
            })
            console.log("pC")
            res.json(user)
        }
        else{
            console.log("nE")
            res.json(foundProfile)
        }
    }
   })

   app.get("/getMealAccToMealtype",(req,res)=>{
    // console.log("req.query of /getMealAccToMealtype",req.query)
    let mealFilterArr=fetchData.filter((x)=>{
        // console.log("t",x)
        console.log(x.name,x.mealtype_id,"req.query",req.query)
        if(x["mealtype_id"]==req.query.mealType){
            return x
        }
    })
    console.log("foodAccMealtype",mealFilterArr)
    res.send({foodAccMealtype:mealFilterArr})
   })

   app.post("/filterSelect",(req,res)=>{
    console.log(req.body)
    let filterSelectRes=fetchData.filter((y)=>{
        // console.log(y["mealtype_id"])
        if(y["mealtype_id"]==req.body.mealTypeId && 
           y["city"]===req.body.option[1] &&
           y["locality"]===req.body.option[0]){
            return y
        }
    })
    console.log("filterSelect",filterSelectRes)
    res.send(filterSelectRes)
   })

   app.get("/gtMlsAccPrc",(req,res)=>{
    console.log("/gtMlsAccPrc")
    console.log(req.query)
    let prcFltrArr= fetchData.filter((y)=>{
        if(y.mealtype_id==req.query.mealType 
            && y.min_price<=req.query.prcRng){
                return y
            }
    })
    res.send(prcFltrArr)
    // res.send("query Parameter recieved")
   })

   app.get("/restaurantDetails",(req,res)=>{
    console.log("/restaurantDetails")
    console.log(req.query)
    let detailsArr=fetchData.filter((y)=>{
        if(y["name"]==req.query.resName){
            return y
        }
    })

    res.send(detailsArr)
   })


   let restaurantMenuModel=require("./model/restaurantMenu")
   let resMenuJSON=require("./model/resMenuJ.js")

   console.log("resMenu",resMenuJSON)

   resMenuJSON.map(async (x)=>{
    let foundResMenu=null
    await restaurantMenuModel.find({restaurantName:x.restaurantName,foodName:x.foodName}).then((x)=>{
        foundResMenu=x
        console.log("foundRes",x)
    }).catch((e)=>{
        console.log("err",e)
        return console.error(e)
    })

    if(foundResMenu.length===0){
        await restaurantMenuModel.create(x).then((x)=>{
            console.log("createdMenu",x)
        }).catch((e)=>{
            console.log("err",e)
            return console.error(e)
        })
    }
   })

   app.post("/menuDetails",async (req,res)=>{
    console.log("/menuDetails")
    console.log(req.body)
    let foundMenu=null
    await restaurantMenuModel.find({restaurantName:req.body.restaurant})
    .then((x)=>{
        foundMenu=x
        console.log("menuAcctoRestaurant",x)
    })
    .catch((e)=>{
        console.log("menu's req error",e)
        return console.error(e)
    })
    await res.send(foundMenu)
   })

   let orderModel=require("./model/orderSchema")
// const { default: RazorPay } = require("../ZomatoClone85Frontend/src/payment")

   app.post("/userSpecificOrder",async(req,res)=>{
    console.log("/userSpecificOrder",req.body)
    await orderModel.create(req.body).then((svdOrdr)=>{
        console.log("savedOrder",svdOrdr)
        res.send({yourOrder:svdOrdr,recieved:"yes"})
    }).catch((e)=>{
        console.log("order error",e)
        return console.error(e)
    })
   })

   app.post("/razorPayPayment/order",async (req,res)=>{
    console.log("/razorPayPayment/order",process.env.key_id)
    let paymentInstance=new razorpay({
        key_id:process.env.key_id,
        key_secret:process.env.key_secret
    })
        // console.log(typeof req.body.price)
    try{
        // creates a razorPay Payment order with inp amount
        let paymentInstanceRes=await paymentInstance.orders.create({
            amount:parseInt(req.body.totalPrice*100),
            currency:"INR",
            receipt:req.body._id
        })

        console.log("paymentInstanceRes",paymentInstanceRes)
        if(paymentInstanceRes){
            res.json({...paymentInstanceRes,razorpay_key:process.env.key_id})
        }
    }
    catch(e){
        console.log("razorPay e",e)
        return console.error(e)
    }
   })

   app.post("/razorPayPayment/success",async (req,res)=>{
    console.log("/razorPayPayment/success")
    console.log("req.body",req.body)

    let orderSignature= 
    crypto.createHmac("sha256",process.env.key_secret)
    .update(`${req.body.orderCreation}|${req.body.razorpayPaymentId}`)
    .digest(`hex`)

    
    if(orderSignature===req.body.razorpaySignature){
        try{
            let orderConfirmed=await orderModel.findOneAndUpdate({_id:req.body.placedOrder._id},{paid:true},{new:true})
            console.log(
                {
                    paymentSuccessful:true,
                    msg:"payment successfull",
                    confirmed:orderConfirmed
                }
            )
            res.json({
                paymentSuccessful:true,
                msg:"payment successfull",
                confirmed:orderConfirmed
            })
        }
        catch(e){
            console.log("e",e)
        }
    }
    else{
        console.log(
            {
                paymentSuccessful:false,
                msg:"payment failed"
            }
        )
        res.json({
            paymentSuccessful:false,
            msg:"payment failed"
        })
    }
   })

   


//    modelCrt()
//   async function modelCrt(){
//     await userInfoModel.create({emailID:"indranilghosh1520@gmail.com",password:"abczyx"}).then((x)=>{
//         console.log("savedData",x)
//     }).catch((y)=>{
//         console.log("error",y)
//         return console.error(y)
//     })
//   }
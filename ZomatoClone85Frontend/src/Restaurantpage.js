import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useParams,useLocation } from "react-router-dom";
// import { resCntxt } from "./App";
import {Carousel} from "react-responsive-carousel"
import "react-responsive-carousel/lib/styles/carousel.min.css"
import axios from "axios";
import {Tabs,Tab,TabList,TabPanel} from "react-tabs"
import "react-tabs/style/react-tabs.css"
import "./App.css"
import { useGoogleLogin,googleLogout } from "@react-oauth/google";
import RazorPay from "./payment";

export let accptdOrdrCntxt=createContext()

function RestaurantPage(){
    let paramsMprtd=useParams()
    let [rstrntDtls,setrstrntDtls]=useState([])
    
    let userQryP=new URLSearchParams(useLocation().search)
    let [userQryStt,setUserQryStt]=useState(null)
    useEffect(()=>{
        if(userQryP){
            console.log("userQryP",JSON.parse(userQryP.get("userInfo")))
            setUserGglInfo(JSON.parse(userQryP.get("userInfo")))
        }
    },[])
    useEffect(()=>{
        if(paramsMprtd){
            getRestaurantData()
        }
        async function getRestaurantData(){
            await axios.get(`https://zomatoclone-backend-s363.onrender.com/restaurantDetails?resName=${paramsMprtd["name"]}`)
            .then((resDetails)=>{
                console.log(resDetails,"resDetails")
                setrstrntDtls(resDetails.data)
            })
            .catch((e)=>{
                console.log("err",e)
                return console.error(e)
            })
        }
    },[paramsMprtd])

    let [menuData,setmenuData]=useState([])

    let [totalCost,setTotalCost]=useState(0)
    let [totalOrder,setTotalOrder]=useState([])

    let userOrderRef=useRef({})

    let gglPrflTknRef=useRef()
    let [userGglTkn,setUserGglTkn]=useState(null)
    let [userGglInfo,setUserGglInfo]=useState(null)

    let [accptdOrdr,setAccptdOrdr]=useState(null)


    useEffect(()=>{
        gglLgnNplcOrder()
        async function gglLgnNplcOrder(){
            let userOrderInfo=null
            if(userGglTkn){
                await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${userGglTkn.access_token}`,
                {
                    headers:
                    {
                    Authorization:`Bearer ${userGglTkn.access_token}`,
                    Accept: 'application/json'
                    }               
                }).then((y)=>{
                    console.log("gglPrflRes",y)
                    setUserGglInfo(y.data)
                    return y.data
                }).then((x)=>{
                    let contact_number=parseInt(prompt("Enter your contact number"))
                    let address=prompt("Enter your delivery address")
                    userOrderInfo={
                        name:x.name,
                        emailId:x.email,
                        contactNo:contact_number,
                        address:address,
                        userOrder:[...totalOrder],
                        totalPrice:Math.round(totalCost)
                    }
                    console.log("userOrderInfo",userOrderInfo)
                    // name:{type:String,required:true},
                    // emailId:String,
                    // contactNo:{type:Number,required:true},
                    // address:{type:String,required:true},
                    // userOder:{type:[menuItemSchema],required:true},
                    // totalPrice:{type:String,required:true},
                    // paid:{type:Boolean,default:false}
                }).catch((e)=>{
                    console.log("error",e)
                })
                // axios.get(`https://zomatoclone-backend-s363.onrender.com/userSpecificOrder?userOrderInfo=${JSON.stringify(userOrderInfo)}`)
                await axios.post(`https://zomatoclone-backend-s363.onrender.com/userSpecificOrder`,userOrderInfo)
                .then((x)=>{
                    console.log("orderResponse data",x.data)
                    setAccptdOrdr(x.data)
                    closeModalRef.current.click()
                })
                .catch((e)=>{
                    console.log('e',e)
                    return console.error(e)
                })
            }
        }
    },[userGglTkn])

    let closeModalRef=useRef()
    // let mprtdCntxRB=useContext(resCntxt)
    // console.log("mprtdCntxtRB",mprtdCntxRB)

    return(
        <div style={{
            width:"97%",
            margin:"auto",
            }}>
            <div className="googleInfo"
                 style={{display:(!userGglInfo)?`none`:`flex`}}>
                <div 
                style={{display:"flex",gap:`10px`}}>
                <h3 style={{
                    margin:"0px",
                    fontStyle:"unset"}}>Hi,&nbsp;{
                (userGglInfo)?
                userGglInfo.given_name:
                null
                }</h3>
                <img 
                src={(userGglInfo)?
                userGglInfo.picture:
                null}
                referrerPolicy="no-referrer"
                style={{height:`50px`,width:`50px`,borderRadius:`50%`}}/>
                </div>
                <input type="button" value={"logout"} 
                onClick={()=>{
                    googleLogout()
                    setUserGglInfo(null)
                }}
                style={{
                    height:"30px",
                    borderRadius:"10px",
                    marginTop:"8px",
                    backgroundColor:`transparent`,
                    color:"grey",
                    border:`1px solid grey`,
                }}
                />
            </div>
            <div 
            className="orderModalWindow"
            style={{display:(menuData.length===0)?"none":"block"}}>
            <div>                 
                <div className="menu menuHeading">
                    <h1 style={{color:"brown"}}>{paramsMprtd["name"]} Menu</h1>
                    <input 
                     style={{
                        height:"30px",
                        width:"30px",
                        borderRadius:"50%",
                        marginTop:"8px",
                        backgroundColor:`transparent`,
                        color:"grey",
                        border:`1px solid grey`
                    }}
                    ref={closeModalRef}
                     type="button"
                     value={"X"} onClick={()=>{
                        setmenuData([])
                    }}/>
                </div>
                    {
                    menuData.map((x)=>{
                        return (
                            <div className="menu">
                                <div className="menuContent">
                                    <img src={x.imgPath} />
                                    <div>
                                    <div className="menuItem"
                                        // attaching ref to grab the elm connected to its respective add button
                                        ref={(elm)=>{
                                            userOrderRef.current[x.foodName]=elm
                                        }}>
                                        {x["foodName"]}
                                    </div>
                                    <div className="menuItem menuItem1">
                                        ₹{x["price"]}
                                    </div>
                                    <div className="menuItem menuItem2">
                                        {x["description"]}
                                    </div>
                                    </div>
                                </div>
                                <div className="itemCountDiv">
                                    <input 
                                     type="button"
                                     value={
                                        (totalOrder.length===0)?`Add`:`+`}
                                        style={{
                                            fontSize:(totalOrder.length===0)?`large`:`x-large`,
                                            width:(totalOrder.length===0)?`70px`:`35px`,
                                            borderRadius:(totalOrder.length===0)?`10px`:`50%`
                                        }}
                                    //  style={{height:"35px",width:"35px",borderRadius:"50%"}}
                                     onClick={()=>{
                                        setTotalCost(totalCost+x["price"])
                                        setTotalOrder([...totalOrder,{
                                            foodName:x["foodName"],
                                            price:x["price"]
                                        }].sort((a,b)=>{
                                            return b.price-a.price
                                        }))

                                        let userOrdername=userOrderRef.current[x.foodName].innerHTML
                                        console.log("userOrdername",userOrdername)
                                     }}
                                    />
                                    <div style={
                                        {
                                            display:totalOrder.length===0?`none`:`block`,
                                            fontSize:`large`,
                                            marginTop:`5px`
                                        }
                                    }>
                                        {/* used to show the no of each items in the order */}
                                        {totalOrder.reduce((total,elm)=>{
                                            if(elm.foodName===x.foodName){
                                                return total+1
                                            }
                                            else{
                                                return total
                                            }
                                        },0)}
                                    </div>
                                    <input
                                     type="button"
                                     value={"-"}
                                     style={{display:(totalOrder.length===0)?`none`:`inline`}}
                                     onClick={()=>{
                                        let oldTotalOrder=totalOrder
                                        let newTotalOrder=[]
                                        if(oldTotalOrder.length>0){
                                            for(let i=0;i<oldTotalOrder.length;i++){
                                                // console.log("remove",oldTotalOrder[i],"prop",i)
                                                if(oldTotalOrder[i]["foodName"]===x["foodName"]){
                                                    newTotalOrder.push(
                                                        ...oldTotalOrder.slice(0,i),
                                                        ...oldTotalOrder.slice(i+1)
                                                        )
                                                    console.log("newOrder",newTotalOrder)
                                                    setTotalOrder(newTotalOrder)
                                                    setTotalCost(totalCost-x["price"])
                                                    break;
                                                }
                                            }
                                        }
                                     }}
                                     />
                                </div>
                            </div>
                        )
                    })
                    }
                <div className="menu menuHeading">
                    <h1 style={{color:"brown"}}>SubTotal ₹{Math.round(totalCost)}</h1>
                    <input 
                     className="orderBtn"
                     type="button"
                     value={"Pay Now"} onClick={()=>{
                        console.log("clicked Paynow")
                        if(userQryStt===null){
                            gglPrflTknRef.current.click()
                        }
                     }}/>
                </div>
                <div 
                style={{display:"none"}}
                className="googleDiv" 
                ref={gglPrflTknRef}
                onClick={useGoogleLogin({
                    onSuccess:(res)=>{
                        console.log(`googleRes`,res)
                        setUserGglTkn(res)
                    },
                    onError:(e)=>{
                        console.log("google error",e)
                    }
                })}></div>
                {/* {JSON.stringify(totalOrder)} */}
            </div>
            </div>
            <Carousel>
            {/* <img src="https://imageio.forbes.com/specials-images/imageserve/5d8d70aa53e9710008d8f11b/0x0.jpg?format=jpg&width=1200"/>
            <img src="https://imageio.forbes.com/specials-images/imageserve/5d8d70aa53e9710008d8f11b/0x0.jpg?format=jpg&width=1200"/>
            <img src="https://imageio.forbes.com/specials-images/imageserve/5d8d70aa53e9710008d8f11b/0x0.jpg?format=jpg&width=1200"/> */}
                <div>
                    <img src="https://imageio.forbes.com/specials-images/imageserve/5d8d70aa53e9710008d8f11b/0x0.jpg?format=jpg&width=1200"/>
                    {/* <p>food 1</p> */}
                </div>
                <div>
                    <img src="https://www.tastingtable.com/img/gallery/the-ingredients-youre-unlikely-to-find-in-traditional-indian-food/intro-1663259170.webp"/>
                    {/* <p>food 2</p> */}
                </div>
                <div>
                    <img src="https://static.india.com/wp-content/uploads/2017/04/Bengali_Fish_meal.jpg?impolicy=Medium_Widthonly&w=700&h=467"/>
                    {/* <p>food 3</p> */}
                </div>
            </Carousel>

            <div className="restaurantHeading">
                <h1>{paramsMprtd["name"]}</h1>                
                <span>
                    <input className="orderBtn" type="button" value={`Order`} onClick={async (event)=>{
                        event.preventDefault()
                        await axios.post("https://zomatoclone-backend-s363.onrender.com/menuDetails",{restaurant:paramsMprtd["name"]})
                        .then((x)=>{
                            console.log("menu",x)
                            setmenuData(x.data)
                        })
                        .catch((e)=>{
                            console.log("err",e)
                            return console.error(e)
                        })
                    }}/>
                </span>
            </div>

            <Tabs>
                <TabList>
                    <Tab><b>Overview</b></Tab>
                    <Tab><b>Details</b></Tab>
                </TabList>
                <TabPanel>
                    <h2>About this place</h2>
                    <b>Cuisine:</b>
                    {rstrntDtls.length>0?
                    rstrntDtls[0]["cuisine"].map((x)=>{
                        return <b> {x["name"]},</b>
                    }):
                    null}
                    <br/>
                    <b>Average Cost:</b>
                    <b>&nbsp;&nbsp;₹{paramsMprtd["costForTwo"]}</b>
                    <br/>
                    <b>Average Rating:</b>
                    <b>&nbsp;&nbsp;
                        {
                            rstrntDtls.length>0?
                            `${rstrntDtls[0].aggregate_rating} ★`:
                            null
                        }
                       &nbsp;
                       {
                        rstrntDtls.length>0?
                        rstrntDtls[0].rating_text:
                        null
                       }
                    </b>
                </TabPanel>
                <TabPanel>
                    <b>Locality:</b>
                    <b>&nbsp;&nbsp;{paramsMprtd["locality"]},{
                            rstrntDtls.length>0?
                            rstrntDtls[0].city:
                            null
                            }</b>
                    <br/>
                    <b>Contact number:</b>
                    <b>
                        &nbsp;&nbsp;{
                            rstrntDtls.length>0?
                            rstrntDtls[0].contact_number:
                            null
                            }
                    </b>
                </TabPanel>
            </Tabs>
            <br/>
            <br/>
            <accptdOrdrCntxt.Provider value={accptdOrdr} >
                <RazorPay/>
            </accptdOrdrCntxt.Provider>
            {/* {JSON.stringify(paramsMprtd)} */}
        </div>
    )
}

export default RestaurantPage;

import { useContext,useRef,useEffect, useState } from "react"
import logo from './logo.svg';
import "./App.css"

// import  useContext  from "react"
// import  useRef  from "react"
// import  useEffect  from "react"
// let useContext=require("")

import { accptdOrdrCntxt } from "./Restaurantpage"
import axios from "axios"


function RazorPay (){
    let imprtdAccptdOrdr=useContext(accptdOrdrCntxt)
    let razorPayLoad=useRef()
    useEffect(()=>{
        if(imprtdAccptdOrdr){
            console.log("imprtedAccptdOrderContext in Payment.js",imprtdAccptdOrdr)
            razorPayLoad.current.click()
        }
    },[imprtdAccptdOrdr])
    function loadRazorPayScript(srcUrl){
        return new Promise((resolve,reject)=>{
            let razorPayScript=document.createElement("script")

            document.body.appendChild(razorPayScript)
            console.log("razorPayScript1",razorPayScript)
            
            razorPayScript.addEventListener("load",()=>{
                console.log("sssssss")
                resolve(true)
            })
            razorPayScript.addEventListener("error",()=>{
                console.log("lllllll")
                reject(false)
                // resolve(true)
            })

            razorPayScript.src=srcUrl
            // razorPayScript.type="module"

            // when loading foreign scripts using script tag 
            // $body.append(el);
            // el.onload = function() { //...
            // el.src = script;


            // razorPayScript.onload=()=>{
            //     resolve(razorPayScript)
            // }

            // razorPayScript.onerror=()=>{
            //     reject(false)
            // }
        })
    }
    let [confirmedOrder,setConfirmedOrder]=useState([])
    let [paidPrice,setPaidPrice]=useState(0)

    async function attachNDisplayRazorPay(){
        try{
            // for processing paymentOrder of razorPay
            let response=await loadRazorPayScript("https://checkout.razorpay.com/v1/checkout.js")
            console.log("attachNDisplayRazorPay")
        }
        catch(e){
            console.log("e",e)
            return console.error(e)
        }
        // sending a post req to create a Payment Order
        await axios.post("https://zomatoclone-backend-s363.onrender.com/razorPayPayment/order",imprtdAccptdOrdr.yourOrder).then((x)=>{
            console.log("razorPayPost after Payment",x)
        let successOptions={
            amount:x.data.amount,
            key:x.data.razorpay_key,
            currency:x.data.currency,
            name:imprtdAccptdOrdr.yourOrder.name,
            description:"test order",//JSON.stringify(imprtdAccptdOrdr.yourOrder.userOrder)
            order_id:x.data.id,
            logo:logo,
            handler:async(response)=>{
                try{
                    let successResp=await axios.post("https://zomatoclone-backend-s363.onrender.com/razorPayPayment/success",{
                        razorpaySignature:response.razorpay_signature,
                        razorpayPaymentId:response.razorpay_payment_id,
                        orderCreation:x.data.id,
                        razorpayOrderId:response.razorpay_order_id,
                        placedOrder:imprtdAccptdOrdr.yourOrder
                    })

                    console.log("successResp",successResp)

                    alert(successResp.data.msg.toUpperCase())

                    setConfirmedOrder([...successResp.data.confirmed.userOrder])
                    setPaidPrice(successResp.data.confirmed.totalPrice)
                    orderPlacedRef.current.style.display="block"
                }
                catch(e){
                    console.log("payment success error",e)
                    alert("Payment failed")
                }
                
            },
            prefill:{
                name:imprtdAccptdOrdr.yourOrder.name,
                email:imprtdAccptdOrdr.yourOrder.emailId,
                contact_no:imprtdAccptdOrdr.yourOrder.contactNo
            },
            notes: {
                address: imprtdAccptdOrdr.yourOrder.address,
            },
            theme: {
                color: "#61dafb",
            }
        }

        let paymentWindow = new window.Razorpay(successOptions)

        paymentWindow.open()
        }).catch((e)=>{
            console.log("error",e)
            alert("connection to razorPay failed")
        })

    }
    let orderPlacedRef=useRef()
    return (
        <div>
        <button 
        id="razorPay" 
        ref={razorPayLoad} 
        onClick={(event)=>{
            // event.preventDefault()
            attachNDisplayRazorPay()
        }} 
        style={{display:"none"}}
        >Pay</button>

        {/* {JSON.stringify(imprtdAccptdOrdr)} */}

        <div ref={orderPlacedRef} className="orderPlacedDiv"
        style={{display:(confirmedOrder.length===0)?"none":"flex",justifyContent:"space-around"}}>
        <div style={{display:"flex",gap:"20px"}}>
        <h3>Your Order:</h3>
        <div>
        {confirmedOrder.map((x)=>{
            return <h5 key={Math.floor(Math.random()*1000)}>{x.foodName}</h5>
        })}
        </div>
        </div>
        <h3>Total Price:₹{paidPrice}</h3>
        </div>
        </div>

    )
}

export default RazorPay

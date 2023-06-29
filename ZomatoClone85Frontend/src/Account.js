import Login, { accContext } from "./login"
import { useContext } from "react"
import { useState,useEffect } from "react"
import axios from "axios";
// import { GoogleLogin } from "@react-oauth/google";
// import { useGoogleLogin } from "@react-oauth/google";
import { createContext } from "react";
import "./App.css"
// let gProfile=[]
export let gUserContext=createContext()
// export let gPrflDataContext=createContext()


function Account (){
    let mprtdAccContext=useContext(accContext)
    let [userInfo,setUserInfo]=useState({name:"",password:""})
    // let [gUser,setGUser]=useState([])
    // let [gProfile,setGProfile]=useState([])
    // console.log("gPrflDataContext in account",gPrflDataContext)
    // useEffect(()=>{
    //     if(gUser.length>0){
    //         getGProfile()
    //     }
    //     async function getGProfile(){
    //         await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${gUser[0].access_token}`,{
    //             headers:{
    //                 Authorization:`Bearer ${gUser[0].access_token}`,
    //                 Accept: 'application/json'
    //             }
    //         }).then((resGPrfl)=>{
    //             // gProfile=[resGPrfl]
    //             setGProfile([resGPrfl])
    //             console.log("gPrfl",gProfile)
    //         }).catch((err)=>{
    //             console.log("gProfileError",err)
    //         })
    //     }
    // },[gUser])

    // useEffect(()=>{
    //     if(gProfile){
    //         console.log("gProfile updated")
    //         // gPrflDataContext=createContext(gProfile)
    //     }
    // },[gProfile])

    return(
        <div className="accParent">
            {/* <h1>Hi</h1> */}
            <div className="accnt">
                <h1 style={{display:"flex",justifyContent:"center"}}>{mprtdAccContext}</h1>
                <div style={{display:"flex",justifyContent:"center"}}>
                    <input className="inpts" type="text" placeholder="Email" onChange={(event)=>{
                        event.preventDefault()
                        setUserInfo({...userInfo,name:event.target.value})
                    }}/> 
                </div>
                <div style={{display:"flex",justifyContent:"center"}}>
                    <input className="inpts" type="password" placeholder="Password" onChange={(event)=>{
                        event.preventDefault()
                        setUserInfo({...userInfo,password:event.target.value})
                    }}/>
                </div>
                <div className="accntBtnP">
                    <input type="button" value={mprtdAccContext} onClick={
                            async (event)=>{
                                event.preventDefault()
                                try{
                                    // disable event propagation
                                    console.log("mprtd",mprtdAccContext)
                                    let credRes=await axios.post(`https://zomatoclone-backend-s363.onrender.com/accountCrd/${mprtdAccContext}`,{...userInfo})
                                    console.log("credRes",credRes.data)
                                }
                                catch(e){
                                    console.log("e",e)
                                    return console.error(e)
                                }
                            }
                    }/>
                </div>
                <hr className="accHr"/>
                <div>
                    {userInfo.name}
                    
                    {userInfo.password}
                </div>
                <hr className="accHr"/>
                {/* <div className="googleDiv">
                    <button onClick={useGoogleLogin({
                        onSuccess:(response)=>{
                        console.log("response of gUser",response)
                        setGUser([response])
                        },
                        onError:(err)=>{
                            console.log("error on google signIn",err)
                        }
                    })}>Sign in with Google 🚀</button>

                </div> */}
                {/* <gUserContext.Provider value={gUser}>
                    <Login/>
                </gUserContext.Provider> */}
                {/* 
                G-Profile-Data-Context
                <div style={{display:"none"}} >
                    <gPrflDataContext.Provider value={gProfile[0]}>
                        <Login/>
                    </gPrflDataContext.Provider>
                </div> 
                */}
            </div>
        </div>
    )
}

// export default Account

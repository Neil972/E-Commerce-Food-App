import "./App.css"
import React from "react";
import { useState,useRef, useContext, useEffect } from "react";
import { createContext } from "react";
// import Account from "./Account"
// import { gUserContext } from "./Account";
import { useGoogleLogin,googleLogout } from "@react-oauth/google";
import axios from "axios";
// import { gPrflDataContext } from "./Account";

export let accContext=createContext()
let dfltLgn=[]
// let x=null
// LoginAndCrtAcc Bar

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
        <div className="accParent" onClick={(event)=>{
            event.preventDefault()
        }}>
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
                                    let credRes=await axios.post(`http://localhost:5000/accountCrd/${mprtdAccContext}`,{...userInfo})
                                    console.log("credRes data",credRes.data)
                                    dfltLgn=credRes.data
                                }
                                catch(e){
                                    console.log("e",e)
                                    return console.error(e)
                                }
                            }
                    }/>
                </div>
                <hr className="accHr"/>
                <hr className="accHr"/>
                <div>
                    {userInfo.name}
                    
                    {userInfo.password}
                </div>
                
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

export let userInfoExport=null
function Login(){
    let [lgnClk,setLgnClk]=useState([])
    let lgnAccH=useRef()
    let crtAccH=useRef()

    let [dfltPRfl,setdfltPrfl]=useState(null)
    let [gUser,setgUser]=useState([])
    let [gProfile,setgProfile]=useState(null)

    let mprtdAccContext=useContext(accContext)
    let [userInfo,setUserInfo]=useState({name:"",password:""})
    let XBtnLgnRef=useRef()
    // useEffect when dfltPrfl is updated
    useEffect(()=>{
        // setdfltPrfl(dfltLgn)
        console.log("dfltPrfl updated")
    },[dfltPRfl])

    useEffect(()=>{
        if(gUser.length>0){
            getProfile()
        }
        async function getProfile(){
            await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${gUser[0].access_token}`,{
                headers:{
                    Authorization:`Bearer ${gUser[0].access_token}`,
                    Accept: 'application/json'
                }
            }).then((gRes)=>{
                setgProfile(gRes)
                userInfoExport=gRes.data
                // x=gRes
                console.log("gProfile Updated",gRes)
            }).catch((e)=>{
                console.log("error in profile",e)
                return console.error(e)
            })
        }
    },[gUser])
    // function useForceUpdate(){
    //     const [value, setValue] = useState(0); // integer state
    //     return () => setValue(value => value + 1); // update state to force render
    //     // A function that increment 👆🏻 the previous state like here 
    //     // is better than directly setting `setValue(value + 1)`
    // }
    // let forceUpdateBtnRef=useRef()

    // useEffect(()=>{
    //     if(mprtdGprfl){
    //         console.log("mprtedGprfl ",mprtdGprfl)
    //         setLdGprfl([mprtdGprfl])
    //         console.log("ldGprfl updated")
    //     }
    // },[mprtdGprfl])

    // lgnAccH.current.addEventListener("click",()=>{
    //     setLgnClk([lgnAccH.current.innerHTML])
    //     setInterval(()=>{
    //         if(gPrflDataContext){
    //             let mprtdGprfl=useContext(gPrflDataContext)
    //             setLdGprfl(mprtdGprfl)
    //         }
    //     },1550)
    // })
    
        return (
        <div className="Login">
            <div id="gPrflElm" style={{display:gProfile?"flex":"none"}}>
                 {
                gProfile?
                <div>
                    <div style={{color:"white",fontSize:"20px"}}>Welcome  &nbsp;{gProfile.data.name}</div>
                    {/* &nbsp;&nbsp; */}
                    <div style={{display:'flex',alignItems:"center",marginTop:"10px",justifyContent:"flex-end"}}>
                        <img 
                        style={{height:"50px",width:"50px",borderRadius:"50%",marginRight:"10px"}} 
                        src={gProfile.data.picture}
                        referrerPolicy="no-referrer"
                        />
                        <button className="AccRBtn"
                        onClick={()=>{
                        googleLogout()
                        setgProfile(null)
                        }}>Logout</button>
                    </div>
                </div>
                :"Guest"
                }
            </div>
            {/* login and create Acc btn's */}
            <div style={{display:!gProfile?"flex":"none"}}>
                <button style={{display:!dfltPRfl?"inline":"none"}} ref={lgnAccH} 
                className="AccRBtn"
                onClick={(event)=>{
                    event.preventDefault()
                    setLgnClk([lgnAccH.current.innerHTML])
                    // forceUpdateBtnRef.current.click()
                }}
                >Login</button>
                <button style={{display:!dfltPRfl?"inline":"none"}} ref={crtAccH}
                className="AccRBtn"
                onClick={(event)=>{
                    event.preventDefault()
                    setLgnClk([crtAccH.current.innerHTML])
                    // forceUpdateBtnRef.current.click()
                }}
                >Create</button>
                {/* info and logout for default user */}
                <span style={{display:dfltPRfl?"inline":"none",color:"white"}}>
                    {
                        (dfltPRfl)?
                            (dfltPRfl["foundUser"][0]["emailID"])?
                            `Welcome ${dfltPRfl["foundUser"][0]["emailID"]}`:
                            `Enter the correct password`
                        :null
                    }
                </span>
                <button style={{display:dfltPRfl?"inline":"none"}}
                className="AccRBtn"
                onClick={()=>{
                    setdfltPrfl(null)
                }}>{
                    (dfltPRfl)?
                    (dfltPRfl["foundUser"][0]["emailID"])?`Logout`:`Click to go back to Home screen`:
                    null
                }</button>
                {/* <button ref={forceUpdateBtnRef} onClick={useForceUpdate()}></button> */}
            </div>
            <div style={{marginTop:"10px",display:!gProfile?"flex":"none"}} className="googleDiv">
                    <button
                     className="AccRBtn"
                     onClick={useGoogleLogin({
                        onSuccess:(response)=>{
                        console.log("response of gUser",response)
                        setgUser([response])
                        },
                        onError:(err)=>{
                            console.log("error on google signIn",err)
                        }
                    })}>Sign in with Google 🚀</button>

                    {/* <GoogleLogin onSuccess={(respose)=>{
                        console.log("google response on success",respose)
                    }}
                    onError={(e)=>{
                        console.log("error on google login",e)
                    }}
                    /> */}
            </div>
            <div>
                {/* theres only single element with value lgnAccH.current.innerHTML|| crtAccH.current.innerHTML*/}
                
                {lgnClk.map(()=>{
                    return (
                        <div className="accParent" key={1} onClick={(event)=>{
                            event.preventDefault()
                        }}>
                            {/* <h1>Hi</h1> */}
                            <div className="accnt">
                            {
                            (lgnClk.length>0)?
                            <button ref={XBtnLgnRef}
                            className="AccRBtn X" onClick={(event)=>{
                                    event.preventDefault()
                                    if(lgnClk.length>0){
                                    setLgnClk([])
                                }
                            }}>X</button>:
                            null
                            }
                                <h1 style={{display:"flex",justifyContent:"center"}}>{lgnClk[0]}</h1>
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
                                    <input type="button" value={lgnClk[0]} onClick={
                                            async (event)=>{
                                                event.preventDefault()
                                                try{
                                                    // disable event propagation
                                                    console.log(lgnClk[0])
                                                    let credRes=await axios.post(`http://localhost:5000/accountCrd/${lgnClk[0]}`,{...userInfo})
                                                    console.log("credRes data",credRes.data)
                                                    // dfltLgn=credRes.data
                                                    if(lgnClk[0]==="Login"){
                                                        setdfltPrfl(credRes.data)
                                                        XBtnLgnRef.current.click()
                                                    }

                                                }
                                                catch(e){
                                                    console.log("e",e)
                                                    return console.error(e)
                                                }
                                            }
                                    }/>
                                </div>
                                <hr className="accHr"/>
                                <hr className="accHr"/>
                                <div>
                                    {userInfo.name}
                                    &nbsp;
                                    {userInfo.password}
                                </div>
                                
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
                        // <accContext.Provider key={1} value={x}>
                        //     <Account/>
                        // </accContext.Provider>
                    )
                })}
                
            </div>
            {/* <p className="welcomeDiv">
                to change div value on profile load just use ternary operator
                {ldGprfl?ldGprfl.data.email:null}
            </p> */}
        </div>
        )
}

export default Login;
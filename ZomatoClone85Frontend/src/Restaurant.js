import React, { useContext } from "react";
import { useState,useEffect } from "react";
import { resCntxt } from "./App";
import "./App.css"
import { Link } from "react-router-dom";
import { createContext } from "react";

let ResContextB=createContext()
function Restaurant(){
    let mprtdCntxt=useContext(resCntxt)
    console.log("mprtdCntxt",mprtdCntxt)
    return(
        <div className="Restaurant">
            <img src={mprtdCntxt["imgPath"]} /> 
            <div>
                {mprtdCntxt["name"]}<br/><br/>
                {mprtdCntxt["locality"]}
            </div>
            <div>
                <Link style={{textDecoration:"none",color:"#993414"}}
                 to={`/RestaurantPage/${mprtdCntxt["name"]}/${mprtdCntxt["locality"]}/${mprtdCntxt["costForTwo"]}
                 ?userInfo=${JSON.stringify(mprtdCntxt.userInfo)}`}>
                    <h3 style={{fontWeight:"500",fontStyle:"unset"}} >Order</h3>
                </Link>
                {/* useParams hook for passing data while re-routing alternative to use Context */}
            </div>
        </div>
    )
}

export default Restaurant
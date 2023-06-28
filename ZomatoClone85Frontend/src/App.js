import logo from './logo.svg';
import './App.css';
import logoURL from "./images/logo2a58709c3f6a448d162222fe79b84f88.png"
import {useState,useEffect,createContext, useRef} from "react"
import axios from "axios"
import kfcImg from "./images/KFCgettyimages-458531057-612x612.jpg"
import Restaurant from './Restaurant';
import MealType from './mealType';
import Login from './login';
import {NavLink} from "react-router-dom";
import { userInfoExport } from './login';

export let resCntxt=createContext()
export let mealContext= createContext()

function App() {
  let count=0
  let [lctn,setLctn]=useState([])
  let [inpStt,setInpStt]=useState({select:null,inp:null})
  let [respData,setRespData]=useState([])
  let [mealType,setMealtype]=useState([])

  useEffect(()=>{
    getData()

    async function getData(){
      try{
        let respJson=await axios.post("http://localhost:5000",{needed:"getLocations"})
        console.log("respJson",respJson)
        await setLctn(respJson.data)
        // console.log("lctn",lctn)
        await setInpStt({...inpStt,select:`${respJson.data[0]},${respJson.data[1]}`})
        // console.log("inpStt",inpStt)
        // let respObj=await JSON.parse(respJson.data)
      }
      catch(e){
        return console.error(e)
      }
    }
  },[])
  useEffect(()=>{
    getMeals()

    async function getMeals(){
      try{
        let mealRes=await axios.get("http://localhost:5000/getMealTypes")
        console.log("mealRes",mealRes)
        setMealtype([...mealType,...mealRes.data.meals])
      }
      catch(e){
        return console.error(e)
      }
    }
  },[])
  let useSearch=(event)=>{
    event.preventDefault()
    dataAccInp()

    async function dataAccInp(){
      try{
        console.log("inpSttFor Search",inpStt)
        let response=await axios.post("http://localhost:5000/dataAccInp",inpStt)
        console.log("Search Response",response)
        let repData=response.data
        console.log("repData",repData)
        setRespData(repData)
      }
      catch(e){
        return console.error(e)
      }
    }
  }
  
  
  let resInfo={
    name:"KFC",
    imgPath:kfcImg,
    locality:"Shalimar Bagh"
  }
  let srchBtnRef=useRef()
  return (
 <div>   
  <div className={"bgDiv"}>
    <Login/> 
    <div className="logoDiv">
      <img src={logoURL}/>
    </div>
    <div className="logoDiv">
      <h1>Find The Best Restaurants Cafe's and Bars</h1>
    </div>
    <div className='logoDiv'>
      <div>
      <select className='select' onClick={(event)=>{
        setInpStt({...inpStt,select:event.target.value})
      }}>
        {
          lctn.map((x)=>{
            return (
              <option id={`${x[0]},${x[1]}`} key={`${x[0]},${x[1]}`} value={`${x[0]},${x[1]}`}>
                {`${x[0]},${x[1]}`}
              </option>
            )
          })
        }
      </select>
      <input type='text' placeholder='Type Your Restaurant name' className='select inp' onChange={(event)=>{
        setInpStt({...inpStt,inp:event.target.value})
        // srchBtnRef.current.click()
        setTimeout(()=>{
          // console.log("srchBtnRef",srchBtnRef)
          srchBtnRef.current.click()
          // console.log("timer",timer)
          // setTimer(timer=timer+timer)
        },500)
        // setTimer(timer=timer+timer)
        // console.log("timer",timer)
      }}/>
      <button className='srchBtn' style={{display:"none"}}  ref={srchBtnRef} onClick={useSearch}>Search</button>
      </div>
    </div>
    <div style={{color:"white",fontSize:"white"}}>
    {/* {JSON.stringify(inpStt)} */}
    </div>
    <div style={{color:"white"}}>
      {/* {JSON.stringify(respData)} */}
      {
        
        respData.map((x)=>{
          count++
          return (
            <resCntxt.Provider value={{
              name:x.name,
              locality:x.locality,
              imgPath:x.image,
              costForTwo:x.min_price,
              ttlDt:{...x},
              userInfo:userInfoExport
              }}
              key={count}>
              <Restaurant />
            </resCntxt.Provider>
          )
        })
      }
      {/* <resCntxt.Provider value={resInfo}>
        <Restaurant/>
      </resCntxt.Provider> */}
    </div> 
  </div>
    <div className='headings2'>
      <h2>Quick Searches</h2>
      <h5>Discover Restaurants By Type of Meal</h5>
    </div>
    <div className='container2' >
      {mealType.map((x)=>{
        // console.log("particular mealType",x)
        count++
        return(
          <mealContext.Provider key={count} value={x}>
            <NavLink className="navlink"
             style={{textDecoration:"none"}}
             to={`/filter?mealType=${JSON.stringify(x.meal_type)}&categoryName=${JSON.stringify(x.name)}`}>
              <MealType/>
            </NavLink>
          </mealContext.Provider>
        )
      })}
    </div>
 </div>   
  );
}

export default App;

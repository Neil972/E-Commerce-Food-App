import react, { useRef } from "react"
import { useEffect,useState } from "react";
import { useParams,useLocation, json,NavLink  } from "react-router-dom";
import axios from "axios";
import logoURL from "./images/logo2a58709c3f6a448d162222fe79b84f88.png"
import "./App.css"
import { userInfoExport } from "./login";
// import { resCntxt } from "./App";
function Filter(){
    let [qryPrmStt,setqryPrmStt]=useState(null)
    let [qryPrmObj,setqryPrmObj]=useState({mealType:null,categoryName:null})
    let [mealTypeArr,setMealtypeArr]=useState([])
    
    let qryParam =new URLSearchParams(useLocation().search)
    console.log("qryPrmStt1A",qryPrmStt)
    useEffect(()=>{
        console.log("mealTypeArr",mealTypeArr)
    },[mealTypeArr])
    useEffect(()=>{
        if(qryPrmStt){
            // console.log("qryPrmSttMealtype",qryPrmStt.get("mealType"))
            setqryPrmObj({
                ...qryPrmObj,
                mealType:JSON.parse(qryPrmStt.get("mealType")),
                categoryName:JSON.parse(qryPrmStt.get("categoryName"))
            })
        }
        else{
            setqryPrmStt(qryParam)
        }
    },[qryPrmStt])
    console.log(qryPrmObj)
    useEffect(()=>{

        if(qryPrmStt){
            getFoodAccToMealtype(JSON.parse(qryPrmStt.get("mealType")))
        }
        async function getFoodAccToMealtype(mealtypeVal){
            await axios.get(`http://localhost:5000/getMealAccToMealtype?mealType=${mealtypeVal}`).then((x)=>{
                console.log("getFoodAccToMealtype",x.data.foodAccMealtype)
                setMealtypeArr(x.data.foodAccMealtype)
            }).catch((e)=>{
                console.log("error",e)
                return console.error(e)
            })
        }
    },[qryPrmStt])

    let [lctn,setLctn]=useState([])
    
    useEffect(()=>{
        getLocation()
        async function getLocation(){
            await axios.post("http://localhost:5000",{needed:"getLocations"}).then((x)=>{
                console.log("locations in filter",x.data)
                setLctn(x.data)
            }).catch((e)=>{
                console.log("Error",e)
                return console.error(e)
            })
        }
    },[])

    let [price,setPrice]=useState(null)

    useEffect(()=>{
        if(price){
            gtMlsAccPrc()
        }

        async function gtMlsAccPrc(){
            await axios.get(`http://localhost:5000/gtMlsAccPrc?mealType=${qryPrmStt.get("mealType")}&prcRng=${price}`)
            .then((res)=>{
                console.log('meals acc to pric Res Data',res.data)
                setMealtypeArr(res.data)
            })
            .catch((e)=>{
                console.log("e",e)
                return console.error(e)
            })
        }
    },[price])

    let radioRef=useRef({})
    return (
        <div>
            <div className="logoDiv">
                <NavLink to="/" style={{textDecoration:"none"}}>
                    <img style={{height:"75px",width:"75px",borderRadius:"50%",marginTop:"15px"}} src={logoURL}/>
                </NavLink>
            </div>
            <h1 className="width80">{qryPrmObj.categoryName}</h1>
            <div className="width80 gridContainer1">
                <div style={{marginBottom:"15px"}}>
                <div style={{display:"flex",justifyContent:"center",paddingTop:"15px"}}>
                {/* {JSON.stringify(qryPrmObj)} */}
                    <select className='select' style={{width:"80%"}} onChange={
                        (event)=>{
                            console.log("select filter",event.target.value)

                            filterSelectPost(event.target.value)

                            for(let prpNm in radioRef.current){
                                // radio button set to false
                                radioRef.current[prpNm].checked=false
                            }
                            async function filterSelectPost(slctStr){
                                await axios.post("http://localhost:5000/filterSelect",
                                {option:slctStr.split(","),mealTypeId:qryPrmStt.get("mealType")}).then((j)=>{
                                    console.log("filterRes",j)
                                    setMealtypeArr(j.data)
                                }).catch((e)=>{
                                    console.log(e)
                                    return console.error(e)
                                })
                            }
                        }}>
                        <option>Select Location</option>
                        {lctn.map((y)=>{
                            return(
                                <option key={`${y[0]},${y[1]}`} 
                                value={`${y[0]},${y[1]}`}>{`${y[0]},${y[1]}`}</option>
                            )
                        })}
                    </select>
                </div>
                <div style={{width:"80%",margin:"auto"}}>
                        <h3 className="subHeadingFilter">Cost for two</h3>
                        <div>
                            <input id="l500" type="radio" value={500} name="prices"
                            ref={(elm)=>{
                                radioRef.current["l500"]=elm
                            }}
                            onClick={(event)=>{
                                // event.preventDefault()
                                console.log("price",event.target.value)
                                setPrice(event.target.value)
                            }}
                            />
                            <label htmlFor="l500">less than ₹500</label>
                        </div>
                        <div>
                            <input id="l1000" type="radio" value={1000} name="prices"
                            ref={(elm)=>{
                                radioRef.current["l1000"]=elm
                            }}
                            onClick={(event)=>{
                                // event.preventDefault()
                                console.log("price",event.target.value)
                                setPrice(event.target.value)
                            }}
                            />
                            <label htmlFor="l1000">₹500-₹1000</label>
                        </div>
                        <div>
                            <input id="l1500" type="radio" value={1500} name="prices"
                            ref={(elm)=>{
                                radioRef.current["l1500"]=elm
                            }}
                            onClick={(event)=>{
                                // event.preventDefault()
                                console.log("price",event.target.value)
                                setPrice(event.target.value)
                            }}                            
                            />
                            <label htmlFor="l1500">₹1000-₹1500</label>
                        </div>
                        <div>
                            <input id="l2000" type="radio" value={2000} name="prices"
                            ref={(elm)=>{
                                radioRef.current["l2000"]=elm
                            }}
                            onClick={(event)=>{
                                // event.preventDefault()
                                console.log("price",event.target.value)
                                setPrice(event.target.value)
                            }}
                            />
                            <label htmlFor="l2000">₹1500-₹2000</label>
                        </div>
                        <div>
                            <input id="l2500" type="radio"  value={2500} name="prices" 
                            ref={(elm)=>{
                                radioRef.current["l2500"]=elm
                            }}
                            onClick={(event)=>{
                                // event.preventDefault()
                                console.log("price",event.target.value)
                                setPrice(event.target.value)
                            }}/>
                            <label htmlFor="l2500">more than ₹2000</label>
                        </div>
                        <h3 className="subHeadingFilter">Sort</h3>
                        <div>
                            <input id="ascending" type="radio" value="Price: Low To High"
                            onClick={()=>{
                                
                                let InpArr=[...mealTypeArr]
                                let sortedMealArr=InpArr.sort((a,b)=>{
                                    return a["min_price"]-b["min_price"]
                                })
                                console.log("Asc sortedMealArr",sortedMealArr)
                                setMealtypeArr(sortedMealArr)
                            }}
                            name="sort"/>
                            <label htmlFor="ascending">Price: Low To High</label>
                        </div>
                        <div>
                            <input id="decending" type="radio" value="Price: High To Low"
                            onClick={()=>{
                                
                                let InpArr=[...mealTypeArr]
                                let sortedMealArr=InpArr.sort((a,b)=>{
                                    return b["min_price"]-a["min_price"]
                                })
                                console.log("Desc sortedMealArr",sortedMealArr)
                                setMealtypeArr(sortedMealArr)
                            }}
                            name="sort"/>
                            <label htmlFor="decending">Price: High To Low</label>
                        </div>

                    </div>
                </div>
                <div className="gridContainer2">
                    {
                        (mealTypeArr.length>0)?
                        mealTypeArr.map((y)=>{
                        return(
                            <NavLink key={Math.random()*10000} style={{textDecoration:"none",color:"black"}}
                             to={`/RestaurantPage/${y["name"]}/${y["locality"]}/${y["min_price"]}
                             ?userInfo=${JSON.stringify(userInfoExport)}`}>
                                <div className="boxShadow">
                                <div className="mealCard">
                                <img src={y.image}/>
                                <div>
                                    <div className="mealCardHeading">{y.name}</div>
                                    <div>{y.locality}</div>
                                    <div>{y.city}</div>
                                </div>
                                </div>
                                <br/>
                                <hr style={
                                    {
                                    backgroundColor:"grey",
                                    height:"1.5px",
                                    border:"none"}}/>
                                
                                <div className="mealCardInfo">
                                    <div>Cuisine:</div>
                                    <div>{y.cuisine.map((z)=>{
                                        return `${z.name}    `
                                    }).join(",")}</div>
                                    <div>Cost For Two:</div>
                                    <div>₹{y.min_price}</div>
                                </div>
                                <br/>
                                </div>
                            </NavLink>
                        )
                    }):
                    <h1 style={{fontWeight:"300",color:"darkgray"}}>...Looks like there's nothing here</h1>
                    }
                </div>
            </div>
        </div>

    )
}



export default Filter;
import { useContext } from "react"
import { mealContext } from "./App"
import "./App.css"
function MealType(){
    let mprtdMlCntxt=useContext(mealContext)
    return (
        <div className="mealtypeCard" >
            <img src={mprtdMlCntxt.image}/>
            <div>
                <div style={{fontFamily:"monospace",fontWeight:"bold",fontSize:"20px"}}>
                    {mprtdMlCntxt.name}
                </div>
                <div className="mealContent">
                    {mprtdMlCntxt.content}
                </div>
            </div>
            {/* {JSON.stringify(mprtdMlCntxt.name)} */}
        </div>
    )
}

export default MealType
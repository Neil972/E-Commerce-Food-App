import {BrowserRouter,Routes,Route} from "react-router-dom"
import App from "./App"
import RestaurantPage from "./Restaurantpage"
import Filter from "./filter"

function RoutesJS(){
    return(
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<App/>}/>
                    <Route path="/RestaurantPage/:name/:locality/:costForTwo" element={<RestaurantPage/>}/>
                    <Route path="/filter" element={<Filter/>}/>
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default RoutesJS
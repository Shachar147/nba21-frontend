import './App.css';

import { BrowserRouter, Route, Switch } from 'react-router-dom';
import {APP_BACKGROUND_COLOR} from "./helpers/consts";
import axios from "axios";
import PrivateRoute from "./components/PrivateRoute";
import {getToken} from "./helpers/auth";
import Settings from './pages/ThreePointsContest/Settings';
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import LogoutPage from "./pages/Logout";
import RegisterPage from "./pages/RegisterPage";
import OneOnOne from "./pages/OneOnOne/OneOnOne";
import RandomOld from "./pages/Random/Random";
import OneOnOneStats from "./activities/OneOnOne/OneOnOneStats";
import RealStats from "./pages/RealStats/RealStats";
import Random from "./pages/Random/Random";

function App() {

    axios.defaults.headers.Authorization = `Bearer ${getToken()}`;

    return (
        <div className={"wrapper"} style={{ backgroundColor: APP_BACKGROUND_COLOR, height: '100hv' }}>
            <BrowserRouter>
                <Switch>
                    <Route path="/login" component={LoginPage} />
                    <Route path="/register" component={RegisterPage} />
                    <Route path="/logout" component={LogoutPage} />
                    <PrivateRoute path ="/three-points/" component={Settings} />
                    <PrivateRoute exact path ="/1on1/" component={OneOnOne} />
                    <PrivateRoute path ="/1on1/stats" component={OneOnOneStats} />
                    <PrivateRoute path ="/real-stats/" component={RealStats} />
                    <PrivateRoute path ="/random/new" component={Random} />
                    <PrivateRoute path ="/random/" component={RandomOld} />
                    <PrivateRoute path ="/" component={MainPage} />
                </Switch>
            </BrowserRouter>
        </div>
    );
}

export default App;

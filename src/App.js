import './App.css';

import { BrowserRouter, Route, Switch } from 'react-router-dom';
import {APP_BACKGROUND_COLOR} from "./helpers/consts";
import axios from "axios";
import PrivateRoute from "./components/PrivateRoute";
import {getToken} from "./helpers/auth";
import Settings from './activities/ThreePointsContest/Settings';
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import LogoutPage from "./pages/Logout";
import RegisterPage from "./pages/RegisterPage";
import OneOnOne from "./pages/OneOnOne/OneOnOne";
import RealStats from "./pages/RealStats/RealStats";
import Random from "./pages/Random/Random";
import SyncPage from "./pages/SyncPage";
import Shootout from "./pages/Shootout/Shootout";

function App() {

    axios.defaults.headers.Authorization = `Bearer ${getToken()}`;

    return (
        <div className={"wrapper"} style={{ backgroundColor: APP_BACKGROUND_COLOR, height: '100hv' }}>
            <BrowserRouter>
                <Switch>
                    <Route path="/login" component={LoginPage} />
                    <Route path="/register" component={RegisterPage} />
                    <Route path="/logout" component={LogoutPage} />
                    <PrivateRoute exact path="/three-points/" component={Settings} />
                    <PrivateRoute path="/three-points/stats" component={Settings} data={{view_stats:true}} />
                    <PrivateRoute exact path="/1on1/" component={OneOnOne} />
                    <PrivateRoute path="/1on1/stats" component={OneOnOne} data={{view_stats:true}} />
                    <PrivateRoute path="/real-stats/" component={RealStats} />
                    <PrivateRoute exact path="/random" component={Random} />
                    <PrivateRoute path="/random/stats" component={Random} data={{view_stats:true}} />
                    <PrivateRoute exact path="/sync" component={SyncPage} />
                    <PrivateRoute exact path="/shootout" component={Shootout} />
                    <PrivateRoute path="/shootout/stats" component={Shootout} data={{view_stats:true}} />
                    <PrivateRoute path="/" component={MainPage} />
                </Switch>
            </BrowserRouter>
        </div>
    );
}

export default App;

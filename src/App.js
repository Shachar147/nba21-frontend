import './App.css';

import { BrowserRouter, Route, Switch } from 'react-router-dom';
import {APP_BACKGROUND_COLOR} from "./helpers/consts";
import axios from "axios";
import PrivateRoute from "@components/PrivateRoute";
import {getToken} from "@helpers/auth";
import Settings from '@activities/ThreePointsContest/Settings';
import LoginPage from "@pages/Login/LoginPage";
import MainPage from "@pages/MainPage";
import LogoutPage from "@pages/Logout";
import RegisterPage from "@pages/Register/RegisterPage";
import OneOnOne from "@activities/OneOnOne/OneOnOne";
import RealStats from "@pages/Real/RealStats";
import Random from "@activities/Random/Random";
import SyncPage from "@pages/SyncPage";
import Shootout from "@activities/Shootout/Shootout";
import Real from "@pages/Real/Real";
import RealInjured from "@pages/Real/RealInjured";
import RealInactive from "@pages/Real/RealInactive";
import UserSettings from "@pages/UserSettings/UserSettings";
import Tournament from "@activities/Tournament/Tournament";
import SpaceJam from "@activities/SpaceJam/SpaceJam";

const App = () => {

    axios.defaults.headers.Authorization = `Bearer ${getToken()}`;

    return (
        <div className={"wrapper"} style={{ backgroundColor: APP_BACKGROUND_COLOR, height: '100hv' }}>
            <BrowserRouter>
                <Switch>
                    <Route path="/login" component={LoginPage} />
                    <Route path="/register" component={RegisterPage} />
                    <Route path="/logout" component={LogoutPage} />

                    <PrivateRoute exact path="/three-points/" component={Settings} />
                    <PrivateRoute exact path="/three-points/stats" component={Settings} data={{view_stats:true}} />
                    <PrivateRoute path="/three-points/stats/:player" component={Settings} data={{view_stats:true, player_from_url:true}} />

                    <PrivateRoute exact path="/1on1/" component={OneOnOne} />
                    <PrivateRoute exact path="/1on1/stats" component={OneOnOne} data={{view_stats:true}} />
                    <PrivateRoute path="/1on1/stats/:player" component={OneOnOne} data={{view_stats:true, player_from_url:true}} />

                    <PrivateRoute exact path="/space-jam/" component={SpaceJam} />
                    <PrivateRoute exact path="/space-jam/stats" component={SpaceJam} data={{view_stats:true}} />
                    <PrivateRoute path="/space-jam/stats/:player" component={SpaceJam} data={{view_stats:true, player_from_url:true}} />

                    <PrivateRoute path="/real/injured/" component={RealInjured} />
                    <PrivateRoute path="/real/inactive/" component={RealInactive} />
                    <PrivateRoute path="/real/stats/" component={RealStats} />
                    <PrivateRoute exact path="/real/" component={Real} />

                    <PrivateRoute exact path="/random" component={Random} />
                    <PrivateRoute exact path="/random/stats" component={Random} data={{view_stats:true}} />
                    <PrivateRoute path="/random/stats/:player" component={Random} data={{view_stats:true, player_from_url:true}} />
                    <PrivateRoute exact path="/random/today_history" component={Random} data={{ view_today_games: true }} />

                    <PrivateRoute exact path="/shootout" component={Shootout} />
                    <PrivateRoute exact path="/shootout/stats" component={Shootout} data={{view_stats:true}} />
                    <PrivateRoute path="/shootout/stats/:player" component={Shootout} data={{view_stats:true,player_from_url:true }} />

                    <PrivateRoute exact path="/tournament" component={Tournament} />
                    <PrivateRoute exact path="/tournament/stats" component={Tournament} data={{view_stats:true}} />
                    <PrivateRoute exact path="/tournament/stats/:player" component={Tournament} data={{view_stats:true, player_from_url:true}} />

                    <PrivateRoute exact path="/sync" component={SyncPage} />
                    <PrivateRoute exact path="/user/settings" component={UserSettings} />
                    <PrivateRoute path="/" component={MainPage} />
                </Switch>
            </BrowserRouter>
        </div>
    );
}

export default App;

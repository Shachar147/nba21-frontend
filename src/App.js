// import logo from './logo.svg';
import './App.css';

import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Settings from './pages/ThreePointsContest/Settings';
import LoginPage from "./pages/LoginPage";
import PrivateRoute from "./components/PrivateRoute";
import MainPage from "./pages/MainPage";
import LogoutPage from "./pages/Logout";
import RegisterPage from "./pages/RegisterPage";
import axios from "axios";
import {getToken} from "./helpers/auth";
import OneOnOne from "./pages/OneOnOne/OneOnOne";

function App() {

    axios.defaults.headers.Authorization = `Bearer ${getToken()}`;

    return (
        <div className={"wrapper"}>
            <BrowserRouter>
                <Switch>
                    <Route path="/login" component={LoginPage} />
                    <Route path="/register" component={RegisterPage} />
                    <Route path="/logout" component={LogoutPage} />
                    <PrivateRoute path ="/three-points/" component={Settings} />
                    <PrivateRoute path ="/1on1/" component={OneOnOne} />
                    <PrivateRoute path ="/" component={MainPage} />
                </Switch>
            </BrowserRouter>
        </div>
    );
}

export default App;

// import logo from './logo.svg';
import './App.css';

import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Settings from './pages/ThreePointsContest/Settings';
import LoginPage from "./pages/LoginPage";
import axios from "axios";
import {getToken} from "./helpers/auth";
import PrivateRoute from "./components/PrivateRoute";
import MainPage from "./pages/MainPage";
import LogoutPage from "./pages/Logout";

function App() {

    const token = getToken();
    axios.defaults.headers.Authorization = `Bearer ${token}`;

    return (
        <div className={"wrapper"}>
            <BrowserRouter>
                <Switch>
                    <Route path="/login" component={LoginPage} />
                    <Route path="/logout" component={LogoutPage} />
                    <PrivateRoute path ="/three-points/" component={Settings} />
                    <PrivateRoute path ="/" component={MainPage} />
                </Switch>
            </BrowserRouter>
        </div>
    );
}

export default App;

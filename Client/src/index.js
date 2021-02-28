
import React from 'react';
import ReactDOM from 'react-dom'
import 'bootstrap/dist/css/bootstrap.css';

import Main from './components/Main.component';
import UserService from '../src/apiServices/UserService'

window.serverData = {};

let userService = new UserService();
userService.signOut().then(res =>
{
    ReactDOM.render( <Main />, document.getElementById("root"));
});

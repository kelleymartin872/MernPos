
import React from 'react';
import ReactDOM from 'react-dom'
import 'bootstrap/dist/css/bootstrap.css';

import './style.css';
import Main from './components/Main.component';
import UserService from './apiServices/UserService'
import Loading from './components/Popup_Components/Loading.component';


let overlayStyle = {
    position: "fixed",
    top:"0",
    left:"0",
    height:"100%",
    width:"100%",
    paddingTop: "100px",
    backgroundColor: "#303841"
};

window.serverData = {};

ReactDOM.render( 
    <div style={overlayStyle} > < Loading /> </div>, document.getElementById("root")
);

let userService = new UserService();
userService.signOut().then(res =>
{
    ReactDOM.render( <Main />, document.getElementById("root"));
});
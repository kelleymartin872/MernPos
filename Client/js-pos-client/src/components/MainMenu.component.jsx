
import React, { Component } from 'react';

import MenuButton from '../DTOs/MenuButton'

export default class MainMenu extends Component 
{
    buttons = [
        new MenuButton("7","Add Item", "add-item"),
        new MenuButton("1","Return Item", "return-item"),
        new MenuButton("2","Change Qty", "change-qty"),
        new MenuButton("3","Line Disc", "line-disc"),
        new MenuButton("4","Total Disc", "total-disc"),
        new MenuButton("5","Add Customer", "add-customer"),
        new MenuButton("6","Total Disc", "total-disc"),
    ];

    state = { buttons : this.buttons }

    mainStyle={ 
        overflowY:"auto",
        width: "100%",
        margin:0,
        padding:0,
        backgroundColor:"#a00",
        height:"100%"
    };

    btnStyle={ 
        margin:10,
        height: "60px",
        width: "60px",
        backgroundColor:"#444",
        borderRadius:"15%",
        color:"white"
    };



    render() 
    {
        return ( 
                
            <div style={this.mainStyle} className="row">
                { this.state.buttons.map( (button) => (
                    <button style={this.btnStyle} className="btn col-3"> {button.btnName} </button>
                ))}
            </div>
        );
    }
}



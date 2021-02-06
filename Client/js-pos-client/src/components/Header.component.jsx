
import React, { Component } from 'react';

export default class Header extends Component 
{
    state = {  }

    mainStyle={ 
        width: "100%",
        margin:0,
        padding:0,
        height:"10vh",
        backgroundColor:"#f16b52",
        color:"white"
    };

    headingStyle={ 
        fontWeight:500,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize:"30px",
    };
    
    btnStyle={ 
        margin:"10px px",
        backgroundColor: "#303841",
        color:"white"
    };

    render() 
    {
        return ( 
            <div style={{margin:"0px"}}  className="row"  >
                <div style={{padding:"0px"}}  className="col-12" >
                    <div className="row" style={this.mainStyle}>
                        <button  className="col-2 btn"  style={this.btnStyle}>Menu</button>
                        <div className="col-8" style={this.headingStyle} >
                            MERNPOS
                        </div>
                        <button className="col-2 btn" style={this.btnStyle}  >Sign Out</button>
                    </div>
                    </div>
                </div>
        );
    }
}



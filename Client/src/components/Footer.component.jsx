
import React, { Component } from 'react';

export default class Footer extends Component 
{
    state = {  }

    mainStyle={
        width: "100%",
        margin:0,
        padding:0,
        height:"10vh",
        backgroundColor:"#f16b52"
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
                        <button  className="col-2 btn"  style={this.btnStyle} > Back </button>
                        <div className="col-8" >
                            
                        </div>
                        <button className="col-2 btn" style={this.btnStyle} > Next </button>
                    </div>
                    </div>
                </div>
        );
    }
}



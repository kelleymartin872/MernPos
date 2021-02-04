
import React, { Component } from 'react';

export default class LineDetail extends Component 
{
    state = {  }

    mainStyle={ 
        width: "100%",
        margin:0,
        padding:0,
        height:"100%"
    };

    lineDetailStyle={
        padding:"0px",
        overflowY:"auto",
        height:"40vh", border: "1px solid black"
    };
    render() 
    {
        return ( 
            <div style={{margin:"0px"}}  className="row"  >
                <div style={this.lineDetailStyle} className="col-12" >
                        <div style={this.mainStyle}>
                            
                        </div>
                </div>
            </div>
        );
    }
}



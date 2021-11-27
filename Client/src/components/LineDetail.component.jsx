
import React from 'react';
import Constants from '../Utils/Constants'


const LineDetail = (props) => 
{
    const mainStyle={ 
        width: "100%",
        margin:0,
        padding:10,
        height:"100%"
    };
    
    const lineDetailStyle={
        padding:"0px",
        overflowY:"auto",
        height:"40vh", border: "1px solid black"
    };

    let txn = props.transaction;


    return ( 
        <div style={{margin:"0px"}}  className="row"  >
            <div style={lineDetailStyle} className="col-12" >
                <div style={mainStyle}>

                </div>
            </div>
        </div>
    );
}
 
export default LineDetail;
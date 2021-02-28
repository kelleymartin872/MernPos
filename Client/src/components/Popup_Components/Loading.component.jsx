
import React from 'react';
import loadingGif from '../../images/loading.gif'; 

const Loading = () => 
{
    let overlayStyle = {
        position: "fixed",
        top:"0",
        left:"0",
        height:"100%",
        width:"100%",
        paddingTop: "100px",
        backgroundColor: "#303841",
        opacity: .65
    };
    let loadingStyle = {
        position: "fixed",
        top:"45%",
        left:"45%",
        width: "10%"
    };

    return ( 
        <div style={overlayStyle} >
            <img src={loadingGif} style={loadingStyle}  alt="Loading..."  />
        </div> 
    );
}
 
export default Loading;

import React from 'react';

const Header = (props) => {   

    const mainStyle={ 
        width: "100%",
        margin:0,
        padding:0,
        height:"10vh",
        backgroundColor:"#f16b52",
        color:"white"
    };

    const headingStyle={ 
        fontWeight:500,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize:"30px",
    };
    
    const btnStyle={ 
        margin:"10px px",
        backgroundColor: "#303841",
        color:"white"
    };

    return ( 
        <div style={{margin:"0px"}}  className="row"  >
            <div style={{padding:"0px"}}  className="col-12" >
                <div className="row" style={mainStyle}>
                    <button  className="col-2 btn"  style={btnStyle}
                        onClick={() => props.onMenuClick()} >
                        Menu
                    </button>
                    <div className="col-8" style={headingStyle} >
                        MERNPOS
                    </div>
                    <button className="col-2 btn" style={btnStyle} 
                        onClick={() => props.onSignOff()} >
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
}


export default Header;
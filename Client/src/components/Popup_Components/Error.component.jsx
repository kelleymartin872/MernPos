
import React from 'react';
import Loading from './Loading.component';
import errorImg from '../../images/errorImg.png'; 

const Error = (props) => 
{

    let overlayStyle = {
        position: "fixed",
        top:"0",
        left:"0",
        height:"100%",
        width:"100%",
        paddingTop: "100px",
        backgroundColor: "#303841"
    };

    return ( 
    

        <div style={overlayStyle} >
     
            <div className="modal-dialog " role="document">
                <div className="modal-content">
                    <div key="modal-header" className="modal-header">
                        <img src={errorImg} alt="ERROR!" 
                            style={{margin:"auto", width:"100px"}} />
                    </div>
                    <div key="modal-body" className="modal-body">
                        <h3 className="modal-title" style={{margin:"auto", textAlign:"center"}}> 
                            Internal Server Error! 
                        </h3>
                        <hr/>
                        <div>
                            Please contact administrator. <br/>
                            Please check the console for error details
                        </div>
                    </div>
                    <div key="modal-footer" className="modal-footer">
                        <button
                            type="button" className="btn btn-success" 
                            id="signIn_FormSubmit" style={{width: "99%",backgroundColor:"#f16b52"}} 
                            onClick={() => props.onRefresh()} > 
                            Atempt to Reconnect
                        </button>
                    </div>
                </div>
            </div>
            
            { props.isLoading &&  <Loading/> }
        </div>
    );

}
 
export default Error;
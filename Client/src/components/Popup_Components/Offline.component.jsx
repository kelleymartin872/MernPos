
import React from 'react';
import Loading from './Loading.component';

const Offline = (props) => 
{
    let modalStyle = {
        height:"100%",
        width:"100%",
        paddingTop: "100px",
    }

    return ( 
    

        <div style={modalStyle} >
     
            <div className="modal-dialog " role="document">
                <div className="modal-content">
                    <div key="modal-header" className="modal-header">
                        <h3 className="modal-title" style={{margin:"auto"}}> Server is unreachable! </h3>
                    </div>
                    <div key="modal-body" className="modal-body">
                        <div>
                            Unable to get response from Server. <br/>
                            Please check your network & Try Again
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
 
export default Offline;
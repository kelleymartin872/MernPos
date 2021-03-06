
import React from 'react';
import AddItem from '../Popup_Components/AddItem.component';

const ModalPopup = (props) => 
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

    let innerlayStyle = {
        position: "fixed",
        top:"0",
        left:"0",
        height:"100%",
        width:"100%",
        paddingTop: "100px"
    };

    let returnModal =   <div>
                            <div className="modal-dialog " role="document">
                                <div className="modal-content">
                                    <div key="modal-header" className="modal-header">
                                        <h3 className="modal-title" style={{margin:"auto"}}>  Function Not Found! </h3>
                                    </div>
                                    <div key="modal-footer" className="modal-footer">
                                        <button
                                            type="button" className="btn btn-danger" 
                                            id="signIn_FormSubmit" style={{width: "99%",backgroundColor:"#f16b52"}} 
                                            onClick={() => props.onModalClose()}  > 
                                            OK
                                        </button>
                                    </div>
                                </div>
                            </div> 
                        </div> ;
    
    if(props.modalId === 1)
        returnModal = <AddItem  onCancel={() => props.onModalClose()} />

    return ( 
        <div  style={innerlayStyle} >
            <div style={overlayStyle} >
            </div> 
            { props.modalId > 0 &&  returnModal }
        </div>
    );
}
 
export default ModalPopup;
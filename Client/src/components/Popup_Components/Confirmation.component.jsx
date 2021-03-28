import React from 'react';


const Confirmation = (props) => {

    let returnModal =   <div>
            <div className="modal-dialog " role="document">
                <div className="modal-content">
                    <div key="modal-header" className="modal-header">
                        <h3 className="modal-title" style={{margin:"auto"}}>  {props.headerText} ?  </h3>
                    </div>
                    <div key="modal-body" className="modal-body">
                        Are you Sure you want to perform this Action?
                    </div>
                    <div key="modal-footer" className="modal-footer">
                        <button
                            type="button" className="btn btn-danger" 
                            id="signIn_FormSubmit" style={{width: "48%",backgroundColor:"#f16b52"}} 
                            onClick={() => props.doConfirm()}  > 
                            Yes
                        </button>
                        <button
                            type="button" className="btn btn-danger" 
                            id="signIn_FormSubmit" style={{width: "48%",backgroundColor:"#f16b52"}} 
                            onClick={() => props.doClose()}  > 
                            No
                        </button>
                    </div>

                </div>
            </div> 
        </div> ;

    return returnModal;
}
 
export default Confirmation;
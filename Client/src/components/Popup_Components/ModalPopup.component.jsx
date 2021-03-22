
import React from 'react';
import AddItem from '../Popup_Components/AddItem.component';
import ReturnItem from '../Popup_Components/ReturnItem.component';
import AddCustomer from '../Popup_Components/AddCustomer.component';
import Payment from './Payment.component';
import ChangeQty from './ChangeQty.component';
import Constants from '../../DTOs/Constants'

function CheckSelectedLine(selectedLineNmbr , transaction)
{
    try
    {
        if(selectedLineNmbr < 1) return null;

        const selectedObj = transaction.txnList.find(x => x.lineNumber === selectedLineNmbr);
        if(selectedObj && selectedObj.lineTypeID === Constants.TxnLineType.ItemLine)
        {
            return selectedObj;
        }
    }
    catch(e)
    {
        console.error(e);
    }
    return null;
}



const ModalPopup = (props) => 
{
    let overlayStyle = {
        position: "fixed",
        top:"0",
        left:"0",
        height:"100%",
        width:"100%",
        backgroundColor: "#303841",
        opacity: .65
    };

    let innerlayStyle = {
        position: "fixed",
        top:"0",
        left:"0",
        height:"100%",
        width:"100%",
        paddingTop: "5%"
    };
    
    let itemLineError =   <div>
                            <div className="modal-dialog " role="document">
                                <div className="modal-content">
                                    <div key="modal-header" className="modal-header">
                                        <h3 className="modal-title" style={{margin:"auto"}}>  Error! </h3>
                                    </div>

                                    <div key="modal-body" className="modal-body">
                                        <div>
                                            Please select an Item Line first. <br/>
                                        </div>
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

    if(props.modalId === Constants.MenuButtonID.AddItem)
        returnModal = <AddItem  onCancel={() => props.onModalClose()} />
    
    if(props.modalId === Constants.MenuButtonID.ReturnItem)
        returnModal = <ReturnItem  onCancel={() => props.onModalClose()} />
    
    if(props.modalId === Constants.MenuButtonID.AddCustomer)
        returnModal = <AddCustomer  onCancel={() => props.onModalClose()} />
    
    if(props.modalId === Constants.MenuButtonID.ChangeQty)
    {
        const itemObj = CheckSelectedLine(props.clientData.selectedLineNmbr , props.transaction);
        if(itemObj && itemObj!=null)
            returnModal = <ChangeQty itemObj={itemObj} onCancel={() => props.onModalClose()} />
        else
            returnModal = itemLineError;
    }
    
    if(props.modalId >= 100)
    {   
        returnModal = <Payment  onCancel={() => props.onModalClose()} 
                paymentTypeID = {props.modalId}
                serverData = {props.serverData} 
                transaction = {props.transaction}  /> 
    }
     
    return ( 
        <div  style={innerlayStyle} >
            <div style={overlayStyle} >
            </div> 
            { props.modalId > 0 &&  returnModal }
        </div>
    );
}
 
export default ModalPopup;

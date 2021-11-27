
import React from 'react';
import Form from './Form.component';
import Joi from 'joi-browser';
import TransactionService from '../../apiServices/TransactionService';
import ItemService from '../../apiServices/ItemService';
import Loading from './Loading.component';
import Swal from 'sweetalert2'
import Input from './Input.component';
import Constants from '../../Utils/Constants';

class ReturnReceipt extends Form 
{
    state = { 
        isLoading:false,
        formData: {
            TxnNmbr : 0,
            TxnDate : ""
        },
        formError : ""
    };

    schema = {
        TxnDate : Joi,
        TxnNmbr : Joi.number()
    };
    
    
    returnReceipt = () =>
    {   
        this.setState({ isLoading:true });
        
        let service = new TransactionService();
        let reqObj = {
            TxnDate: this.state.formData.TxnDate,
            TxnNmbr: this.state.formData.TxnNmbr 
        };

        service.returnReceipt(reqObj).then(res =>
        {
            if(res.data.flowSuccess === true)
            {
                let reqObj = {
                    state : Constants.PosState.payState
                };
                
                service.changeState(reqObj).then(res =>
                {
                    if(res.data.flowSuccess === true)
                    {
                        Swal.fire(
                            'Return receipt successful!','',
                            'success'
                        );
                        this.props.doClose();
                    }
                });

                this.setState({ formError : "", isLoading:false});
                return;
            }
            else
            {
                this.setState({ formError : res.data.errorMsg , isLoading:false})
            }
        });
    }


    render() { 
        let formData = this.state.formData;
        let formError = this.state.formError;

        let render = [];
        render.push(
            <div key="modal-header" className="modal-header">
                <h4 className="modal-title" style={{margin:"auto"}}> Return Receipt </h4> 
                
                <button type="button" style={{fontSize:"25px" , marginLeft:"0px" }} 
                    onClick={() => this.props.doClose()}  className="close" >
                    &times;
                </button>
            </div>
        );

        render.push(
            <div key="modal-body" className="modal-body">
                <form> 
                    <Input name="TxnDate" type="date" value={formData.TxnDate} onChange={this.handleInputChange}  />
                    <Input name="TxnNmbr" type="text" value={formData.TxnNmbr} onChange={this.handleInputChange}  />
                   </form>
            </div>
        );
        
        render.push(
            <div key="modal-footer" className="modal-footer">
                <button
                    type="button" className="btn btn-success" 
                    id="signIn_FormSubmit" style={{width: "99%",backgroundColor:"#f16b52"}} 
                    onClick={() => this.returnReceipt()} > 
                    Return Receipt
                </button>
            </div>
        );

        if(formError && formError !== "")
        {
            render.push(
                <div key="modal-error" className="list-group-item list-group-item-danger" > { formError } </div>
            );
        }

        return ( 
            <div style={{paddingTop: "100px"}}>
                <div className="modal-dialog " role="document">
                    <div className="modal-content">
                        {render}
                    </div>
                </div>
                { this.state.isLoading &&  <Loading/> }
            </div>
         );
    }


}
 
export default ReturnReceipt;
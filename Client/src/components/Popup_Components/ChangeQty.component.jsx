
import React from 'react';
import Form from './Form.component';
import Input from './Input.component';
import Joi from 'joi-browser';
import TransactionService from '../../apiServices/TransactionService';
import Loading from './Loading.component';
import PaymentService from '../../apiServices/PaymentService';
import ItemService from '../../apiServices/ItemService';

class ChangeQty extends Form 
{
    state = { 
        isLoading:false,
        formData: {
            itemQty : ""
        },
        formError : ""
    };

    schema = {
        itemQty: Joi.number()
    };

    constructor(props)
    {
        super(props);
        this.state.formData.itemQty = (this.props.itemObj.itemQty).toString();
    }

    submitForm = () =>
    {   
        try
        {  
            let inputQty = parseInt(this.state.formData.itemQty);
            let currQty = parseInt(this.props.itemObj.itemQty);
            if(inputQty === currQty)
            {
                this.props.doClose();
                return;
            }

            if((inputQty > 0 && currQty < 0))
            {
                this.setState({formError : "Quantity must be negative"});
                return;
            }
            if((currQty < 0 && inputQty > 0))
            {
                this.setState({formError : "Quantity must be positive"});
                return;
            }

            this.setState({ isLoading:true });
            
            let service = new ItemService();
            let reqObj = {
                lineNumber: parseInt(this.props.itemObj.lineNumber),
                itemQty: inputQty
            };
            
            service.setItemQty(reqObj).then(res =>
            {
                if(res.data.flowSuccess === true)
                {
                    this.setState({ isLoading:false });
                    this.props.doClose();
                }
                else
                {
                    this.setState({formError : res.data.errorMsg , isLoading:false})
                }
            });
        }
        catch(e)
        {
            console.error(e);
        }
        return;
    }

    render() 
    {
        let formData = this.state.formData;
        let formError = this.state.formError;

        let render = [];
        render.push(   
            <div key="modal-header" className="modal-header">
                <h3 className="modal-title" style={{margin:"auto"}}> Enter the Quantity</h3> 
            </div>
        );

        render.push(
            <div key="modal-body" className="modal-body">
                <form>
                    <Input name="itemQty" type="text" value={formData.itemQty} onChange={this.handleInputChange}  />
                </form>
            </div>
        );
        
        render.push(
            <div key="modal-footer" className="modal-footer">
                <button
                    type="button" className="btn btn-danger" 
                    id="signIn_FormSubmit" style={{width: "48%"}} 
                    onClick={() => this.props.doClose()}  > 
                    Cancel
                </button>
                <button
                    type="button" className="btn btn-success" 
                    id="signIn_FormSubmit" style={{width: "48%",backgroundColor:"#f16b52"}} 
                    onClick={() => this.handleFormSubmit()} > 
                    Confirm
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
        
            <div>
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
 
export default ChangeQty;
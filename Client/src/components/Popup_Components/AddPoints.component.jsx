
import React from 'react';
import Form from './Form.component';
import Input from './Input.component';
import Joi from 'joi-browser';
import Loading from './Loading.component';
import CustomerService from '../../apiServices/CustomerService';

class AddPoints extends Form 
{
    state = { 
        isLoading:false,
        formData: {
            Amount : 0
        },
        formError : ""
    };

    schema = {
        Amount : Joi
    };

    constructor(props)
    {
        super(props);
        this.state.formData.Amount = 0;
    }


    submitForm = () =>
    {   
        this.setState({ isLoading:true });
        
        let service = new CustomerService();
        let reqObj = {
            custID: this.props.customer.custID,
            points: this.state.formData.Amount
        };

        service.addPoints(reqObj).then(res => {
            if(res.data.flowSuccess === false)
            {
                console.error(res.data.errorMsg);
            }
            this.props.doClose(); 
        });
    }

    render() 
    {
        let formData = this.state.formData;
        let formError = this.state.formError;

        let render = [];
        render.push(   
            <div key="modal-header" className="modal-header">
                <h3 className="modal-title" style={{margin:"auto"}}> Add Customer Points </h3> 
            </div>
        );

        render.push(
            <div key="modal-body" className="modal-body">
                <form>
                    <Input name="Amount" type="number" value={formData.Amount} onChange={this.handleInputChange}  />
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
 
export default AddPoints;
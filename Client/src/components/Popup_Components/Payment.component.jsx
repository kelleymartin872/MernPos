
import React from 'react';
import Form from './Form.component';
import Input from './Input.component';
import Joi from 'joi-browser';
import Loading from './Loading.component';
import PaymentService from '../../apiServices/PaymentService';

class Payment extends Form 
{
    state = { 
        isLoading:false,
        payment: {},
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
        this.state.payment = this.props.serverData.payments.find(x => x.paymentTypeID === this.props.paymentTypeID);
        this.state.formData.Amount = this.props.transaction.amountOwed / this.state.payment.payExchangeRate;
        this.state.formData.Amount = parseFloat(this.state.formData.Amount).toFixed(2)

        if(this.state.formData.Amount === 0.00)
            this.state.formData.Amount = 0.01;
    }


    submitForm = () =>
    {   
        this.setState({ isLoading:true });
        
        let payService = new PaymentService();
        let reqObj = {
            paymentTypeID: this.props.paymentTypeID,
            amountPaid: this.state.formData.Amount
        };

        payService.performPayment(reqObj).then(res =>
        {
            if(res.data.flowSuccess === true)
            {
                if(res.txns[0].amountOwed === 0)
                {
                    this.props.endTxn();
                }
                else
                {
                    this.props.doClose();
                }
            }
            else
            {
                this.setState({formError : res.data.errorMsg , isLoading:false})
            }
        });
    }

    render() 
    {
        let formData = this.state.formData;
        let formError = this.state.formError;

        let render = [];
        render.push(   
            <div key="modal-header" className="modal-header">
                <h3 className="modal-title" style={{margin:"auto"}}> {this.state.payment.paymentName} </h3> 
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
 
export default Payment;
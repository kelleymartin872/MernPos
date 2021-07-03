
import React from 'react';
import Form from './Form.component';
import Input from './Input.component';
import Joi from 'joi-browser';
import Loading from './Loading.component';
import CouponService from '../../apiServices/CouponService';

class Payment extends Form 
{
    state = { 
        isLoading:false,
        formData: {
            couponNmbr : 0
        },
        formError : ""
    };

    schema = {
        couponNmbr : Joi
    };

    constructor(props)
    {
        super(props);
        this.state.formData.couponNmbr = "";
    }


    submitForm = () =>
    {   
        this.setState({ isLoading:true });
        
        let service = new CouponService();
        let reqObj = {
            couponNmbr: this.state.formData.couponNmbr
        };

        service.addCouponTxn(reqObj).then(res =>
        {
            if(res.data.flowSuccess === true)
            {
                this.props.doClose();
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
                <h3 className="modal-title" style={{margin:"auto"}}> Add a Coupon </h3> 
            </div>
        );

        render.push(
            <div key="modal-body" className="modal-body">
                <form>
                    <Input type="number" name="couponNmbr"
                            value={formData.Amount} onChange={this.handleInputChange}  />
                </form>
            </div>
        );
        
        render.push(
            <div key="modal-footer" className="modal-footer">
                <button type="button" className="btn btn-danger" 
                    style={{width: "48%"}} onClick={() => this.props.doClose()}  > 
                    Cancel
                </button>
                <button type="button" className="btn btn-success" 
                    style={{width: "48%",backgroundColor:"#f16b52"}}  onClick={() => this.handleFormSubmit()} > 
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
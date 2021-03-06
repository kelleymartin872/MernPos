
import React from 'react';
import Form from './Form.component';
import Input from './Input.component';
import Joi from 'joi-browser';
import UserService from '../../apiServices/UserService';
import Loading from './Loading.component';

class SignInForm extends Form 
{
    state = { 
        isLoading:false,
        formData: {
            Email : "",
            Password : ""
        },
        formError : ""
    };

    schema = {
        Email : Joi.string().required().email(),
        Password : Joi.string().required().min(6)
    };

    
    
    submitForm = () =>
    {   
        this.setState({ isLoading:true });
        
        let userService = new UserService();
        let reqObj = {
            email: this.state.formData.Email ,
            password: this.state.formData.Password
        };

        userService.signIn(reqObj).then(res =>
        {
            if(res.data.flowSuccess === true)
            {
                this.props.getNewTxn();
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
                <h3 className="modal-title" style={{margin:"auto"}}>Sign In</h3>
            </div>
        );

        render.push(
            <div key="modal-body" className="modal-body">
                <form>
                    <Input name="Email" type="text" value={formData.Email} onChange={this.handleInputChange}  />
                    <Input name="Password" type="Password" value={formData.Password} onChange={this.handleInputChange}  />
                </form>
            </div>
        );
        
        render.push(
            <div key="modal-footer" className="modal-footer">
                <button
                    type="button" className="btn btn-success" 
                    id="signIn_FormSubmit" style={{width: "99%",backgroundColor:"#f16b52"}} 
                    onClick={() => this.handleFormSubmit()} > 
                    Log In
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
 
export default SignInForm;
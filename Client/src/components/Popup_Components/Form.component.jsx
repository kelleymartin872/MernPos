
import { Component } from 'react';
import Joi from 'joi-browser';

class Form extends Component 
{
    state = { 
        formData: {},
        formError : ""
    };
    
    validate = () =>
    {
        const { error } = Joi.validate(this.state.formData, this.schema, { abortEarly : false} ) 
        if(!error) return "";
        return error.details[0].message;
    };

    handleFormSubmit = e =>
    {
        const formError = this.validate();
        this.setState({formError : formError});
        if (formError) return;
        
        this.submitForm();
    }

    handleInputChange = e =>
    {
        let input = e.currentTarget;
        const formData = this.state.formData;

        formData[input.name] = input.value;
        this.setState({formData: formData})
    }

}
 
export default Form;
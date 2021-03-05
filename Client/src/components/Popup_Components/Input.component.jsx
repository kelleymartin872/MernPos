import React from 'react';

const Input = (props) => 
{
    return ( 
        <div className="form-group">
            <label 
                htmlFor={props.name} 
                className="control-label"> 
                    {props.name} : 
            </label>  

            <input 
                autoFocus  
                type={props.type}
                name={props.name} 
                onChange={(e) => props.onChange(e)} 
                className="form-control" 
                value={props.value}  />
        </div>

     );
}
 
export default Input;
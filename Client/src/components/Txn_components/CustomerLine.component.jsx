import React  from 'react';

const CustomerLineComponent = (props) => 
{
    
    let customer = props.customer;

    const lineStyle={
        cursor: "pointer"
    };

    return (    
        <div style={lineStyle}  className="row">
            <div className="col-12"> <span style={{fontWeight:'bold'}} > Customer : </span>    {customer.custName} </div>
            <hr className="col-11" style={{margin:"5px"}} />
        </div>
    );
}
 
export default CustomerLineComponent;
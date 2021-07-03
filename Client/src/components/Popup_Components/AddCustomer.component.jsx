
import React from 'react';
import Form from './Form.component';
import Joi from 'joi-browser';
import CustomerService from '../../apiServices/CustomerService';
import Loading from './Loading.component';

class AddCustomer extends Form 
{
    state = { 
        isLoading:false,
        formData: {
            custName : "",
            phoneNumber : ""
        },
        customers: [],
        formError : ""
    };

    schema = {
        custName : Joi,
        phoneNumber : Joi
    };
    
    
    getCusts = () =>
    {
        this.setState({ formError : "",isLoading:true });
        
        let service = new CustomerService();
        let reqObj = {
            custName: this.state.formData.custName ,
            phoneNumber: this.state.formData.phoneNumber
        };

        service.getCustomers(reqObj).then(res =>
        {
            if(res.data.flowSuccess === true)
            {
                this.setState({ customers : res.data.customers , isLoading:false})
            }
            else
            {
                this.setState({ customers : res.data.customers, formError : res.data.errorMsg , isLoading:false})
            }
        });
    }
    
    addCust = (phoneNumber) =>
    {
        this.setState({ formError : "", isLoading:true });
        
        let service = new CustomerService();
        let reqObj = {
            phoneNumber: phoneNumber ,
            custName: ""
        };

        service.addCustomerTxn(reqObj).then(res =>
        {
            this.props.doClose();
        });
    }


    render() { 
        let formData = this.state.formData;

        let modalBody = <div key="modal-body" className="modal-body"  >
            <div className="row" style={{padding:"10px"}}>
                <label htmlFor="custName" className="col-2"> 
                        Name 
                </label>  
                <input autoFocus type="text" className="col-3"
                    onChange={(e) => this.handleInputChange(e)} 
                    name="custName"  value={formData.custName} />

                <label htmlFor="phoneNumber" className="col-2"> 
                        Phone No. 
                </label>  
                <input autoFocus type="text" className="col-3"
                    onChange={(e) => this.handleInputChange(e)} 
                    name="phoneNumber" value={formData.phoneNumber}  />
                
                <button className="btn searchBtn"
                    type="button" onClick={() => this.getCusts()} > 
                    Search
                </button>
            </div>

            <div style={{  padding:"10px"}} >
                <div className="row" style={{fontWeight:"600"}} >
                    <div className="col-4" style={{textAlign:"left"}} >  Customer Name  </div>  
                    <div className="col-3" style={{textAlign:"left"}} >  Phone No.  </div>  
                    <div className="col-3" style={{textAlign:"right"}} >  Points  </div>  
                    <hr className="col-11" style={{margin:"5px"}} />
                </div>

                <div style={{height:"320px" , overflowY:"auto", overflowX:"hidden"}}>
                { this.state.customers.map( (cust) =>
                        <div className="row" key={cust.phoneNumber} style={{cursor:"pointer"}} >
                            <div className="col-4" style={{textAlign:"left"}} >  {cust.custName}  </div>  
                            <div className="col-3" style={{textAlign:"left"}} > {cust.phoneNumber}  </div>  
                            <div className="col-3" style={{textAlign:"right"}} > { cust.points.toFixed(2) } </div>  
                            <button 
                                type="button" className="btn searchBtn"
                                onClick={() => this.addCust(cust.phoneNumber)} > 
                                Add
                            </button>
                            <hr className="col-11" style={{margin:"5px"}} />
                        </div>
                    )}
                </div>

            </div>

        </div>;

        if(this.props.isMobile)
        {
            modalBody = <div key="modal-body" className="modal-body"  >
            <div className="row" style={{padding:"10px"}}>
                <label htmlFor="custName" className="col-5"> 
                        Name 
                </label>  
                <input autoFocus type="text" className="col-6"
                    onChange={(e) => this.handleInputChange(e)} 
                    name="custName"  value={formData.custName} />

                <label htmlFor="phoneNumber" className="col-5"> 
                        Phone No. 
                </label>  
                <input autoFocus type="text" className="col-6"
                    onChange={(e) => this.handleInputChange(e)} 
                    name="phoneNumber" value={formData.phoneNumber}  />
                
                <button type="button" className="btn col-11 searchBtn"
                    onClick={() => this.getCusts()} > 
                    Search
                </button>
            </div>

            <div style={{  padding:"10px"}} >
                <div className="row" style={{fontWeight:"600"}} >
                    <div className="col-5" style={{textAlign:"left"}} > Name  </div>  
                    <div className="col-4" style={{textAlign:"left"}} >  Phone  </div>  
                    <div className="col-3" style={{textAlign:"right"}} >  Points  </div>  
                    <hr className="col-11" style={{margin:"5px"}} />
                </div>

                <div style={{height:"320px" , overflowY:"auto", overflowX:"hidden"}}>
                { this.state.customers.map( (cust) =>
                        <div className="row" key={cust.phoneNumber} style={{cursor:"pointer"}} >
                            <div className="col-5" style={{textAlign:"left"}} >  {cust.custName}  </div>  
                            <div className="col-4" style={{textAlign:"left"}} > {cust.phoneNumber}  </div>  
                            <div className="col-3" style={{textAlign:"right"}} > { cust.points.toFixed(2) } </div>  
                            <button 
                                type="button" className="btn col-11"
                                style={{backgroundColor:"#f16b52" , color:"White"}} 
                                onClick={() => this.addCust(cust.phoneNumber)} > 
                                Add
                            </button>
                            <hr className="col-11" style={{margin:"5px"}} />
                        </div>
                    )}
                </div>

            </div>

        </div>;
        }


        return ( 
        
            <div style={{ marginLeft:"5%", width:"90%"}} >
                            
                <div className="modal-lg" style={{width:"100%" , margin:"auto" ,fontSize:"18px"}}  >
          
                    <div className="modal-content" style={{width:"100%"}}>     
                        <div key="modal-header" className="modal-header">
                            <h4 className="modal-title" style={{margin:"auto"}}> Search for Customer </h4> 
                            <button type="button" style={{fontSize:"25px" , marginLeft:"0px" }} 
                                onClick={() => this.props.doClose()}  className="close" >
                                 &times;
                            </button>
                        </div>
                        
                        {modalBody}
                        
                        { this.state.formError !== "" &&
                            <div key="modal-error" className="list-group-item list-group-item-danger" > { this.state.formError } </div> 
                        }

                    </div>
                </div>
                
                { this.state.isLoading &&  <Loading/> }
            </div>
         );
    }

}
 
export default AddCustomer;
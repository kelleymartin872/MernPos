
import React from 'react';
import Form from './Form.component';
import Joi from 'joi-browser';
import ItemService from '../../apiServices/ItemService';
import Loading from './Loading.component';

class ReturnItem extends Form 
{
    state = { 
        isLoading:false,
        formData: {
            ItemID : "",
            ItemName : ""
        },
        ItemData: [],
        formError : ""
    };

    schema = {
        ItemID : Joi,
        ItemName : Joi
    };
    
    
    getItems = () =>
    {
        this.setState({ formError : "",isLoading:true });
        
        let service = new ItemService();
        let reqObj = {
            itemId: this.state.formData.ItemID ,
            itemName: this.state.formData.ItemName
        };

        service.getItems(reqObj).then(res =>
        {
            if(res.data.flowSuccess === true)
            {
                this.setState({ ItemData : res.data.items , isLoading:false})
            }
            else
            {
                this.setState({ ItemData : res.data.items, formError : res.data.errorMsg , isLoading:false})
            }
        });
    }
    
    addItem = (itemId) =>
    {
        this.setState({ formError : "", isLoading:true });
        
        let service = new ItemService();
        let reqObj = {
            itemId: itemId ,
            itemName: "",
            itemQty: -1
        };

        service.addItemTxn(reqObj).then(res =>
        {
            this.props.doClose();
        });
    }


    render() { 
        let formData = this.state.formData;

        return ( 
        
            <div style={{ marginLeft:"5%", width:"90%"}} >
                            
                <div className="modal-lg" style={{width:"100%" , margin:"auto" ,fontSize:"18px"}}  >
          
                    <div className="modal-content" style={{width:"100%"}}>     
                        <div key="modal-header" className="modal-header">
                            <h4 className="modal-title" style={{margin:"auto"}}> Search for item </h4> 
                            <button type="button" style={{fontSize:"25px" , marginLeft:"0px" }} 
                                onClick={() => this.props.doClose()}  className="close" >
                                 &times;
                            </button>
                        </div>
                        
                        <div key="modal-body" className="modal-body"  >
                            <div className="row" style={{padding:"10px"}}>
                                <label htmlFor="ItemID" className="col-2"> 
                                        Item ID 
                                </label>  
                                <input autoFocus type="text"  className="col-3"
                                    onChange={(e) => this.handleInputChange(e)} 
                                    name="ItemID"  value={formData.ItemID} />

                                <label htmlFor="ItemName" className="col-2"> 
                                        Item Name 
                                </label>  
                                <input autoFocus type="text" className="col-3" 
                                    onChange={(e) => this.handleInputChange(e)} 
                                    name="ItemName" value={formData.ItemName}  />
                                
                                <button 
                                    type="button" className="btn"
                                    style={{backgroundColor:"#f16b52" , marginLeft:"10px" , width:"15%"}} 
                                    onClick={() => this.getItems()} > 
                                    Search
                                </button>
                            </div>
                                <div style={{  padding:"10px"}} >
                                    <div className="row" style={{fontWeight:"600"}} >
                                        <div className="col-3" style={{textAlign:"left"}} >   Item ID  </div>  
                                        <div className="col-5" style={{textAlign:"left"}} >   Item Name  </div>  
                                        <div className="col-4" style={{textAlign:"left"}} >   Item Price  </div>  
                                        <hr className="col-11" style={{margin:"5px"}} />
                                    </div>

                                    <div style={{height:"320px" , overflowY:"auto", overflowX:"hidden"}}>
                                    { this.state.ItemData.map( (item) =>
                                            <div className="row" key={item.itemId} style={{cursor:"pointer"}} >
                                                <div className="col-3" style={{textAlign:"left"}} >  {item.itemId}  </div>  
                                                <div className="col-4" style={{textAlign:"left"}} > {item.itemName}  </div>  
                                                <div className="col-3" style={{textAlign:"right"}} > { item.itemPrice.toFixed(2) } </div>  
                                                <button 
                                                    type="button" className="btn"
                                                    style={{backgroundColor:"#f16b52" , width:"15%"}} 
                                                    onClick={() => this.addItem(item.itemId)} > 
                                                    Add
                                                </button>
                                                <hr className="col-11" style={{margin:"5px"}} />
                                            </div>
                                        )}
                                    </div>

                            </div>

                        </div>
                        
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
 
export default ReturnItem;
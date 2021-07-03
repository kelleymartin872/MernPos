
import React from 'react';
import Form from './Form.component';
import Joi from 'joi-browser';
import ItemService from '../../apiServices/ItemService';
import Loading from './Loading.component';

const SearchItem = (props) => 
{
    let formData = props.formData;
    let modalBody = <div key="modal-body" className="modal-body"  >
            <div className="row" style={{padding:"10px"}}>
                <label htmlFor="ItemID" className="col-2"> 
                        Item ID 
                </label>  
                <input autoFocus type="text"  className="col-3"
                    onChange={(e) => props.handleInputChange(e)} 
                    name="ItemID"  value={formData.ItemID} />

                <label htmlFor="ItemName" className="col-2"> 
                        Item Name 
                </label>  
                <input autoFocus type="text" className="col-3" 
                    onChange={(e) => props.handleInputChange(e)} 
                    name="ItemName" value={formData.ItemName}  />
                
                <button 
                    type="button" className="btn searchBtn"
                    onClick={() => props.getItems()} > 
                    Search
                </button>
            </div>

            <div style={{  padding:"10px"}} >
                <div className="row" style={{fontWeight:"600"}} >
                    <div className="col-3" style={{textAlign:"left"}} >   Item ID  </div>  
                    <div className="col-4" style={{textAlign:"left"}} >   Item Name  </div>  
                    <div className="col-3" style={{textAlign:"right"}} >   Item Price  </div>  
                    <hr className="col-11" style={{margin:"5px"}} />
                </div>

                <div style={{height:"320px" , overflowY:"auto", overflowX:"hidden"}}>
                { props.ItemData.map( (item) =>
                        <div className="row" key={item.itemId} style={{cursor:"pointer"}} >
                            <div className="col-3" style={{textAlign:"left"}} >  {item.itemId}  </div>  
                            <div className="col-4" style={{textAlign:"left"}} > {item.itemName}  </div>  
                            <div className="col-3" style={{textAlign:"right"}} > { item.itemPrice.toFixed(2) } </div>  
                            <button 
                                type="button" className="btn"
                                style={{backgroundColor:"#f16b52" , width:"15%", color:"white"}} 
                                onClick={() => props.addItem(item.itemId)} > 
                                Add
                            </button>
                            <hr className="col-11" style={{margin:"5px"}} />
                        </div>
                    )}
                </div>

            </div>

        </div>;
        
    if(props.isMobile)
    {
        modalBody = <div key="modal-body" className="modal-body"  >
            <div className="row" style={{padding:"10px"}}>
                <label htmlFor="ItemID" className="col-5"> 
                        Item ID 
                </label>  
                <input autoFocus type="text"  className="col-6"
                    onChange={(e) => props.handleInputChange(e)} 
                    name="ItemID"  value={formData.ItemID} />

                <label htmlFor="ItemName" className="col-5"> 
                        Item Name 
                </label>  
                <input autoFocus type="text" className="col-6" 
                    onChange={(e) => props.handleInputChange(e)} 
                    name="ItemName" value={formData.ItemName}  />
                
                <button type="button" className="btn col-11 searchBtn"
                    onClick={() => props.getItems()} > 
                    Search
                </button>
            </div>
                <div style={{  padding:"10px"}} >
                    <div className="row" style={{fontWeight:"600"}} >
                        <div className="col-3" style={{textAlign:"left"}} > ID  </div>  
                        <div className="col-4" style={{textAlign:"left"}} >  Name  </div>  
                        <div className="col-3" style={{textAlign:"right"}} >  Price  </div>  
                        <hr className="col-11" style={{margin:"5px"}} />
                    </div>

                    <div style={{height:"320px" , overflowY:"auto", overflowX:"hidden"}}>
                    { props.ItemData.map( (item) =>
                            <div className="row" key={item.itemId} style={{cursor:"pointer"}} >
                                <div className="col-3" style={{textAlign:"left"}} >  {item.itemId}  </div>  
                                <div className="col-4" style={{textAlign:"left"}} > {item.itemName}  </div>  
                                <div className="col-4" style={{textAlign:"right"}} > { item.itemPrice.toFixed(2) } </div>  
                                <button 
                                    type="button" className="btn col-11" 
                                    style={{backgroundColor:"#f16b52" , color:"white", width:"15%"}} 
                                    onClick={() => props.addItem(item.itemId)} > 
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
                        <h4 className="modal-title" style={{margin:"auto"}}> Search for item </h4> 
                        <button type="button" style={{fontSize:"25px" , marginLeft:"0px" }} 
                            onClick={() => props.doClose()}  className="close" >
                             &times;
                        </button>
                    </div>
                    
                    {modalBody}
                    
                    { props.formError !== "" &&
                        <div key="modal-error" className="list-group-item list-group-item-danger" > { props.formError } </div> 
                    }

                </div>
            </div>
            
            { props.isLoading &&  <Loading/> }
        </div>
     );

}
 
export default SearchItem;
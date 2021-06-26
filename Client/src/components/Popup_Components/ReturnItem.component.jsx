
import React from 'react';
import Form from './Form.component';
import Joi from 'joi-browser';
import ItemService from '../../apiServices/ItemService';
import Loading from './Loading.component';
import SearchItem from './SearchItem.component';

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
        
        return <SearchItem  
                        isLoading={this.state.isLoading} 
                        formData={this.state.formData} 
                        ItemData={this.state.ItemData} 
                        formError={this.state.formError} 
                        isMobile={this.props.isMobile} 
                        handleInputChange={this.handleInputChange}
                        doClose={() => this.props.doClose()}
                        getItems={() => this.getItems()}
                        addItem={(itemId) => this.addItem(itemId)}
                    />;
    }

}
 
export default ReturnItem;
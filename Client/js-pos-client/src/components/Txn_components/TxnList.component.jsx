
import React, { Component } from 'react';

import ItemLineComponent from './ItemLine.component';
import CustomerLineComponent from './CustomerLine.component'

export default class TxnList extends Component 
{

    state = {
        txn :  this.props.transaction
    };

    mainStyle={
        width: "98%"
    };
    lineStyle={
       cursor: "pointer"
    };
    rightAlign={
        textAlign: "right"
    };

    changeQty = (item,add) => {
        let items = this.state.txn.itemList;

        if(add)
            item.addQty();
        else
        {
            if(item.itemQty === 1)
                items.splice(items.indexOf(item), 1);
            else
                item.removeQty();
        }
        
        this.txn.itemList = items;
        this.txn.refreshTotal();
        this.setState({txn: this.txn});
    }

    deleteItem = (item) => {
        let items = this.state.txn.itemList;
        items.splice(items.indexOf(item), 1);

        this.txn.itemList = items;
        this.txn.refreshTotal();
        this.setState({txn:this.txn});
    }
    
    render()
    { 
        this.state.txn.refreshTotal();
        let items = this.state.txn.itemList;
        let self = this;
        
        let renderTxn = [];
        
        if(this.state.txn.header && this.state.txn.header.description)
        {
            renderTxn.push(    
                <div style={self.lineStyle}  className="row">
                    <div className="col-12" style={{textAlign:'center',fontWeight:'bold'}} > {this.state.txn.header.description} </div>
                    <hr className="col-10" style={{margin:"5px"}} />
                </div>
            );
        }
        if(this.state.txn.customer && this.state.txn.customer.custName)
        {
            renderTxn.push( <CustomerLineComponent key={this.state.txn.customer.custID} customer={this.state.txn.customer} /> );
        }

        if(items.length > 0)
        {
            renderTxn.push( 
                <div style={self.mainStyle} >
                    <div  className="row" style={{fontWeight:"550"}}>
                        <div className="col-5"> Description </div>
                        <div className="col-2 "> Qty </div>
                        <div className="col-2"  style={self.rightAlign}> Price </div>
                        <div className="col-3" style={self.rightAlign}> Total </div>
                    </div>
                    <hr className="col-11" style={{margin:"5px"}} />
                    { items.map( (item) => (
                        <ItemLineComponent key={item.itemId} item={item} />
                    ))}
                </div>
            );
        }
        else
        {
            renderTxn.push( 
                <div style={self.lineStyle} className="row" >
                    <div className="col-12" style ={{textAlign:'center',fontWeight:'bold'}} > No items in Txn </div>
                </div>
            );
        }

        if(this.state.txn.total && this.state.txn.total.finalPrice)
        {
            renderTxn.push(    
                <div style={self.lineStyle}  className="row">
                    <hr className="col-11" style={{margin:"5px"}} />
                    <div className="col-12"> 
                        <span style={{fontSize:"24px",fontWeight:'bold'}} > Final Price :</span> 
                        <span style={{fontSize:"24px",float:'right'}} > &#x20b9; {this.state.txn.total.finalPrice} </span> 
                    </div>
                </div>
            );
        }  
        if(this.state.txn.footer && this.state.txn.footer.description)
        {
            renderTxn.push(    
                <div style={self.lineStyle}  className="row">
                    <div className="col-12" style={{textAlign:'center',fontWeight:'bold'}} > {this.state.txn.footer.description} </div>
                    <hr className="col-10" style={{margin:"5px"}} />
                </div>
            );
        }

        return renderTxn;
    }

}
 

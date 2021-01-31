
import React, { Component } from 'react';

import ItemLine from '../DTOs/ItemLine'
import Transaction from '../DTOs/Transaction'

export default class TxnList extends Component 
{
    txn = new Transaction();
    constructor()
    {
        super();
        this.txn.itemList = this.fillItems();
    }

    state = {
        txn : this.txn
    };

    mainStyle={
        width: "98%"
    };
    lineStyle={
       cursor: "pointer"
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
        this.txn.refreshTotal();
        let items = this.state.txn.itemList;
        let self = this;
        
        let renderTxn = [];
        
        if(this.state.txn.header && this.state.txn.header.headerDesc)
        {
            renderTxn.push(    
                <div style={self.lineStyle}  className="row">
                    <div className="col-12" style={{textAlign:'center',fontWeight:'bold'}} > {this.state.txn.header.headerDesc} </div>
                    <hr className="col-10" style={{margin:"5px"}} />
                </div>
            );
        }
        if(this.state.txn.customer && this.state.txn.customer.custName)
        {
            renderTxn.push(    
                <div style={self.lineStyle}  className="row">
                    <div className="col-12"> <span style={{fontWeight:'bold'}} > Customer : </span>    {this.state.txn.customer.custName} </div>
                    <hr className="col-10" style={{margin:"5px"}} />
                </div>
            );
        }

        if(items.length > 0)
        {
            renderTxn.push( 
                <div style={self.mainStyle} >
                    <div  className="row" style={{fontWeight:"550"}}>
                        <div className="col-5"> Description </div>
                        <div className="col-2 "> Qty </div>
                        <div className="col-2"> Price </div>
                        <div className="col-3"> Edit </div>
                    </div>
                    <hr className="col-10" style={{margin:"5px"}} />
                    { items.map( (item) => (
                        <div>
                            <div key={item.key} style={self.lineStyle} className="row" >
                                <div className="col-5"> {item.itemName} </div>
                                <div className="col-2"> {item.itemQty} </div>
                                <div  className="col-2"> {item.itemTotalPrice} </div>
                                <div className="col-1 btn btn-success"
                                    onClick={()=>self.changeQty(item,true)} > 
                                    +
                                </div>
                                <div className="col-1 btn btn-info"
                                    onClick={()=>self.changeQty(item,false)} > 
                                    - 
                                </div>
                                <div onClick={()=>self.deleteItem(item)} 
                                    className="col-1 btn btn-danger"> 
                                    x
                                </div>
                            </div>
                            <div key={item.discount.discID} style={self.lineStyle} className="row" >
                                <div className="col-10"> {item.discount.discDesc} </div>
                                <div className="col-2"> {item.discount.discount} </div>
                            </div> 
                        </div>
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
                    <hr className="col-10" style={{margin:"5px"}} />
                    <div className="col-12"> <span style={{fontWeight:'bold'}} > Final Price :</span> <span style={{float:'right'}} > &#x20b9; {this.state.txn.total.finalPrice} </span> </div>
                </div>
            );
        }

        return renderTxn;
    }

    fillItems()
    {
        let items = [
            new ItemLine("1","Apples",100),
            new ItemLine("2","Mangos",200),
            new ItemLine("3","Carrots",35)
        ];

        let i = 4;
        while(i < 25)
        {
            items.push(
                new ItemLine(i.toString(),"Apples",100)
            );
            i += 1;
        }

        return items;
    }
}
 

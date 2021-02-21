
import React from 'react';

import ItemLineComponent from './ItemLine.component';
import CustomerLineComponent from './CustomerLine.component'
import Constants from '../../Constants';

const TxnList = (props) => 
{
    let clientData =  props.clientData;
    let transaction =  props.transaction;

    const rightAlign={
        textAlign: "right"
    };
    const isSelected={
        cursor: "pointer",
        backgroundColor: "#ffdd78",
        paddingLeft:10
    };
    const isNotSelected={
        cursor: "pointer",
        backgroundColor: "#ffffff",
        paddingLeft:10
    };
    
    let renderTxn = [];
    let headerPushed = false;
    
    transaction.txnList.forEach(txnLine => 
    {
        switch (txnLine.lineTypeID)
        {
            case(Constants.TxnLineType.HeaderLine):
            {
                renderTxn.push(    
                    <div key={txnLine.lineNumber} style={(txnLine.isSelected ? isSelected: isNotSelected)} 
                            onClick={() => props.onSelectLine(txnLine.lineNumber)}  className="row">
                        <div className="col-12" style={{textAlign:'center',fontWeight:'bold'}} > {this.state.txn.header.headerDesc} </div>
                        <hr className="col-10" style={{margin:"5px"}} />
                    </div>
                );
                break;
            }


            case(Constants.TxnLineType.CustomerLine):
            {
                renderTxn.push(   
                    <div key={txnLine.lineNumber} style={(txnLine.isSelected ? isSelected: isNotSelected)} 
                            onClick={() => props.onSelectLine(txnLine.lineNumber)}  className="row">
                        <div className="col-12"> 
                            <span style={{fontWeight:'bold'}} > Customer : </span>
                            {this.state.txn.customer.custName} 
                        </div>
                        <hr className="col-10" style={{margin:"5px"}} />
                    </div>
                );
                break;
            }


            case(Constants.TxnLineType.ItemLineType):
            {
                if(!headerPushed)
                {
                    headerPushed = true;
                    renderTxn.push( 
                        <div key={0} >
                            <div  className="row" style={{paddingLeft:10,fontWeight:"550"}}>
                                <div className="col-5"> Description </div>
                                <div className="col-2 "> Qty </div>
                                <div className="col-2"  style={rightAlign}> Price </div>
                                <div className="col-3" style={rightAlign}> Total </div>
                            </div>
                            <hr className="col-11" style={{margin:"5px"}} />
                        </div>
                    );
                }
    
                renderTxn.push( 
                    <div key={txnLine.lineNumber}  >
                        <div key={txnLine.lineNumber} 
                            style={(txnLine.isSelected ? isSelected: isNotSelected)} 
                            onClick={() => props.onSelectLine(txnLine.lineNumber)}>
                            <ItemLineComponent key={txnLine.lineNumber}  item={txnLine} />
                        </div>
                        <hr className="col-11" style={{margin:"5px",fontWeight:"bold"}} />
                    </div>
                    );
                break;
            }

            case(Constants.TxnLineType.TotalLineType):
            {
                renderTxn.push(    
                    <div key={txnLine.lineNumber} 
                        style={(txnLine.isSelected ? isSelected: isNotSelected)} 
                        onClick={() => props.onSelectLine(txnLine.lineNumber)}
                        className="row" >
                            
                        <div className="col-12"> 
                            <span style={{fontSize:"24px",fontWeight:'bold'}} > Final Price :</span> 
                            <span style={{fontSize:"24px",float:'right'}} > &#x20b9; {txnLine.finalPrice} </span> 
                        </div>
                        <hr className="col-11" style={{margin:"5px"}} />
                    </div>
                );
                break;
            }

            default:
            { 
                renderTxn.push(   
                    <div key={txnLine.lineNumber} >
                    <hr className="col-11" style={{margin:"5px"}} />
                        <div key={txnLine.lineNumber} style={(txnLine.isSelected? isSelected:isNotSelected)} className="row"
                            onClick={() => props.onSelectLine(txnLine.lineNumber)}  >
                            <div className="col-12" style={{textAlign:'center',fontWeight:'bold'}} > {txnLine.description} </div>
                        </div>
                        <hr className="col-11" style={{margin:"5px"}} />
                    </div>
                );
                break;
            }
        }
        

    });

    return renderTxn;
}
 

export default TxnList;
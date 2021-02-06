
import React from 'react';

import ItemLineComponent from './ItemLine.component';
import CustomerLineComponent from './CustomerLine.component'
import Constants from '../../constants';

const TxnList = (props) => 
{
    var transaction =  props.transaction;

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
        
        if(txnLine.lineTypeID === Constants.TxnLineType.CustomerLineType)
        {
            renderTxn.push( 
                <div key={txnLine.lineNumber} style={(txnLine.isSelected ? isSelected: isNotSelected)} 
                    onClick={() => props.onSelectLine(txnLine.lineNumber)}>
                    <CustomerLineComponent key={txnLine.lineNumber}  customer={txnLine}  />
                </div>
            );
        }

        else if(txnLine.lineTypeID === Constants.TxnLineType.ItemLineType)
        {
            if(!headerPushed)
            {
                headerPushed = true;
                renderTxn.push( 
                    <div key={0}  >
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
        }

        else if(txnLine.lineTypeID === Constants.TxnLineType.TotalLineType)
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
        }  
        
        else
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
        }

    });
    return renderTxn;
}
 

export default TxnList;
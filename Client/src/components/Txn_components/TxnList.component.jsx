
import React from 'react';

import ItemLineComponent from './ItemLine.component';
import Constants from '../../DTOs/Constants';

const TxnList = (props) => 
{
    let transaction =  props.transaction;
    let selectedLineNmbr = props.clientData.selectedLineNmbr;

    const rightAlign={
        textAlign: "right"
    };
    const selectedStyle={
        cursor: "pointer",
        backgroundColor: "#ffdd78",
        padding:"0px 10px"
    };
    const notSelectedStyle={
        cursor: "pointer",
        backgroundColor: "#ffffff",
        padding:"0px 10px"
    };
    
    let renderTxn = [];
    let headerPushed = false;

    
    transaction.txnList.forEach(txnLine => 
    {
        let isSelected = txnLine.lineNumber === selectedLineNmbr;

        switch (txnLine.lineTypeID)
        {
            case(Constants.TxnLineType.HeaderLine):
            {
                renderTxn.push(    
                    <div key={txnLine.lineNumber} style={(isSelected ? selectedStyle: notSelectedStyle)} 
                            onClick={() => props.onSelectLine(txnLine.lineNumber)}  className="row">
                        <div className="col-12" style={{textAlign:'center',fontWeight:'bold'}} > {txnLine.description} </div>
                        <hr className="col-10" style={{margin:"5px"}} />
                    </div>
                );
                break;
            }


            case(Constants.TxnLineType.CustomerLine):
            {
                renderTxn.push(   
                    <div key={txnLine.lineNumber} style={(isSelected ? selectedStyle: notSelectedStyle)} 
                            onClick={() => props.onSelectLine(txnLine.lineNumber)}  className="row">
                        <div className="col-12"> 
                            <span style={{fontWeight:'bold'}} > Customer : </span>
                            {txnLine.custName} 
                        </div>
                        <hr className="col-10" style={{margin:"5px"}} />
                    </div>
                );
                break;
            }


            case(Constants.TxnLineType.ItemLine):
            {
                if(!headerPushed)
                {
                    headerPushed = true;
                    renderTxn.push( 
                        <div key={0} >
                            <div  className="row" style={{padding:"0px 10px",fontWeight:"550"}}>
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
                            style={(isSelected ? selectedStyle: notSelectedStyle)} 
                            onClick={() => props.onSelectLine(txnLine.lineNumber)}>
                            <ItemLineComponent key={txnLine.lineNumber}  item={txnLine} />
                        </div>
                        <hr className="col-11" style={{margin:"5px",fontWeight:"bold"}} />
                    </div>
                    );
                break;
            }

            case(Constants.TxnLineType.TotalLine):
            {
                renderTxn.push(    
                    <div key={txnLine.lineNumber} 
                        style={(isSelected ? selectedStyle: notSelectedStyle)} 
                        onClick={() => props.onSelectLine(txnLine.lineNumber)}
                        className="row" >
                            
                        <div className="col-12"> 
                            <span style={{fontSize:"24px",fontWeight:'bold'}} > Total Price :</span> 
                            <span style={{fontSize:"24px",float:'right'}} > &#x20b9; {txnLine.totalPrice} </span> 
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
                        <div key={txnLine.lineNumber} style={(isSelected? selectedStyle:notSelectedStyle)} className="row"
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
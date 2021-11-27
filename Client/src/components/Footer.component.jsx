import React, { Component } from 'react';

import Constants from '../Utils/Constants' 
import TransactionService from '../apiServices/TransactionService';
import Loading from './Popup_Components/Loading.component';

export default class Footer extends Component 
{
    state = { isLoading : false}


    changeState = (currentState,next) =>
    {   
        this.setState({isLoading:true});

        let targetState = -1;
        if(next)
        {
            if(currentState === Constants.PosState.itemState)
                targetState = Constants.PosState.payState;
        }
        else
        {
            if(currentState === Constants.PosState.payState)
                targetState = Constants.PosState.itemState;
        }
        if(targetState === -1)
        {   
            this.setState({isLoading:false})
            return;
        }

        let service = new TransactionService();
        let reqObj = {
            state : targetState
        };

        service.changeState(reqObj).then(res =>
        {
            this.setState({isLoading:false})
            if(res.data.flowSuccess === true)
            {
                this.props.onChangeState();
            }
        });
    }

    checkReturnReceipt()
    {
        let backDisabled = false;
        try
        {
            let headerLine = this.props.transaction.txnList.find(x => x.lineTypeID === Constants.TxnLineType.HeaderLine);
            if(headerLine && headerLine.orgTxnNumber)
            {
                backDisabled = true;
            }
        }
        catch(ex)
        {
            backDisabled = false;
            console.error(ex);
        }
        return backDisabled;
    }

    render() 
    { 
        let currentState = this.props.serverData.posState;
        let nextDisabled = currentState !== Constants.PosState.itemState;
        let backDisabled = currentState !== Constants.PosState.payState;
        
        backDisabled = this.checkReturnReceipt();

        const mainStyle={ 
            width: "100%",
            margin:0,
            padding:0,
            height:"10vh",
            backgroundColor:"#f16b52",
            color:"white"
        };

        const headingStyle={ 
            fontWeight:500,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize:"30px",
        };
        
        const btnStyle={ 
            margin:"10px px",
            backgroundColor: "#303841",
            color:"white"
        };

        return ( 
            <div>
                <div style={{margin:"0px"}}  className="row"  >
                    <div style={{padding:"0px"}}  className="col-12" >
                        <div className="row" style={mainStyle}>
                            <button  className="col-2 btn"  style={btnStyle}
                                disabled={backDisabled}
                                onClick={() => this.changeState(currentState,false)} > 
                                Back
                            </button>
                            <div className="col-8" style={headingStyle} >
                                
                            </div>
                            <button className="col-2 btn" style={btnStyle}
                                disabled={nextDisabled}
                                onClick={() => this.changeState(currentState,true)} > 
                                Next
                            </button>
                        </div>
                    </div>
                </div>

                { this.state.isLoading &&  <Loading/> }
            </div>
        );
    }
}



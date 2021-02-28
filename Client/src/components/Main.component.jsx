
import React, { Component } from 'react';
import { withResizeDetector } from 'react-resize-detector';

import Transaction from '../DTOs/Transaction'
import Constants from '../Constants' 

import SignInForm from './Popup_Components/SignInForm.component';
import Offline from './Popup_Components/Offline.component';
import Error from './Popup_Components/Error.component';
import TxnList from './Txn_components/TxnList.component';
import Header from './Header.component';
import LineDetail from './LineDetail.component';
import MainMenu from './MainMenu.component';
import Footer from './Footer.component';

import TransactionService from '../apiServices/TransactionService';
import UserService from '../apiServices/UserService';
import loadingGif from '../images/loading.gif'; 

class MainComponent extends Component 
{
    mobileWidth = 765;

    state = { 
        clientData : {  width:window.innerWidth, height:window.innerHeight, 
                        isMobile: window.innerWidth < this.mobileWidth , selectedLineNmbr : -1,
                        isLoading:false , internalError: false
                    },
        serverData : window.serverData.data,
        transactions : window.serverData.txns
    };

    makeSelection = lineNumber => 
    {
        try
        {
            let clientData = this.state.clientData;
            //Transaction.selectLine(transaction, lineNumber);

            clientData.selectedLineNmbr[0] = lineNumber[0];

            this.setState({ 
                clientData : clientData
            });
        }
        catch(ex)
        {
            this.state.clientData.internalError = true;
            this.setState({ 
                clientData : this.state.clientData
            });
        }
    }
    
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

    deleteItem = (item) => {
        let items = this.state.txn.itemList;
        items.splice(items.indexOf(item), 1);

        this.txn.itemList = items;
        this.txn.refreshTotal();
        this.setState({txn:this.txn});
    }

    componentDidUpdate(prevProps) 
    {
        const { width, height } = this.props;

        if (height !== prevProps.height || width !== prevProps.width) 
        {
            this.setState({ 
                clientData : {width:width, height:height, isMobile : window.innerWidth < this.mobileWidth }
            });
        }
    }

    refreshUI(clientData = this.state.clientData)
    {
        try
        {
            let serverData = {};
            let transactions = [];

            if(window.serverData.data)
                serverData = window.serverData.data

            if(window.serverData.txns)
                transactions = window.serverData.txns

            this.setState({
                clientData : clientData,
                serverData : serverData,
                transactions : transactions
            });
        }
        catch(ex)
        {
            this.state.clientData.internalError = true;
            this.setState({ 
                clientData : this.state.clientData
            });
        }
    }

    getNewTxn = async() => 
    {
        try
        {
            let service = new TransactionService();
            await service.newTxn();
            
            this.state.clientData.isLoading = false;
            this.refreshUI(this.state.clientData);
        }
        catch(ex)
        {
            this.state.clientData.internalError = true;
            this.setState({ 
                clientData : this.state.clientData
            });
        }
    };

    signOff = async() => 
    {
        try
        {
            this.state.clientData.internalError = false;
            this.state.clientData.isLoading = true;
            this.refreshUI(this.state.clientData);

            let service = new UserService();
            await service.signOut();
            
            this.state.clientData.isLoading = false;
            this.refreshUI(this.state.clientData);
        }
        catch(ex)
        {
            this.state.clientData.internalError = true;
            this.setState({ 
                clientData : this.state.clientData
            });
        }
    };

    render() 
    { 
        try
        {  
            let height = this.state.clientData.height;
            let mainStyle={
                fontSize:20
            };
            
            let TotalPriceStyle = {
                padding:10,
                color : "white",
                width:"50%",
                backgroundColor:"#f16b52",
                position:"absolute",
                bottom: height-(height - (0.10*height))
            }

            let txnListStyle= {
                width:"50%",
                overflowY:"auto",
                overflowX:"hidden",
                borderRight: "2px solid black",
                padding:0,
                height:"70vh"
            };

            let RightSideStyle = {width:"50%",padding:"0px"}

            let modalStyle = {
                backgroundColor:"#303841",
                height:"100vh"
            }
            
            
            if(this.state.clientData.isMobile) 
            {
                RightSideStyle.display = "none";
                txnListStyle.width = "100%";
                TotalPriceStyle.width = "100%";
                txnListStyle.marginBottom = "10vh";
            }

            if(this.state.serverData.isOffline) 
            {
                return (

                    <div style={modalStyle}  >
                        <Offline onRefresh = {this.signOff} isLoading={this.state.clientData.isLoading} />
                    </div> 
                );
            }

            if(this.state.serverData.posState === Constants.PosState.signedOff) 
            {
                return (
                    <div style={modalStyle}  >
                        <SignInForm getNewTxn = {this.getNewTxn} isLoading={this.state.clientData.isLoading} />
                    </div> 
                );
            }

            if(this.state.clientData.internalError) 
            {
                return ( 
                    <Error onRefresh = {this.signOff} />
                );
            }
            
            let transaction = this.state.transactions[0];
            return ( 
                <div  style={mainStyle}  >
                    <Header/> 

                    <div style={{margin:"0px"}} className="row"  >
                        <div style={txnListStyle}   >
                            <TxnList onSelectLine={this.makeSelection} 
                                clientData={this.state.clientData} 
                                serverData={this.state.serverData} 
                                transaction={transaction} /> 
                    
                        </div>

                        <div style={TotalPriceStyle} >
                            <span style={{fontSize:"30px",fontWeight:'bold'}} > Final Price :</span> 
                            <span style={{fontSize:"30px",float:'right'}} > &#x20b9; {transaction.finalPrice} </span> 
                        </div>

                        <div style={RightSideStyle} >
                            <LineDetail onSelectLine={this.makeSelection} 
                                clientData={this.state.clientData} 
                                serverData={this.state.serverData} 
                                transaction={transaction}  /> 
                            <MainMenu  
                                clientData={this.state.clientData} 
                                serverData={this.state.serverData} 
                                transaction={transaction}  /> 
                        </div>
                    </div>

                    <Footer/> 
                </div>

            );
              
        }
        catch(ex)
        {
            return ( 
                <Error onRefresh = {this.signOff} />
            );
        }
    }

}

const AdaptiveWithDetector = withResizeDetector(MainComponent);
const Main = () => {
    return (
        <AdaptiveWithDetector />
    );
};
  
export default Main;
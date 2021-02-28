
import React, { Component } from 'react';
import { withResizeDetector } from 'react-resize-detector';

import Transaction from '../DTOs/Transaction'
import Constants from '../Constants' 

import SignInForm from './Popup_Components/SignInForm.component';
import Offline from './Popup_Components/Offline.component';
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
                        isMobile: window.innerWidth < this.mobileWidth , 
                        isLoading:false
                    },
        serverData : window.serverData.data
    };

    makeSelection = lineNumber => 
    {
        let clientData = this.state.clientData;
        let serverData = this.state.serverData;
        let transaction = serverData.txns[0];

        Transaction.selectLine(transaction, lineNumber);

        clientData.selectedLineNmbr = lineNumber;
        serverData.txns[0] = transaction;

        this.setState({ 
            clientData : clientData,
            serverData : serverData
        });
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
        let serverData = {};
        if(window.serverData.data)
            serverData = window.serverData.data

        this.setState({
            clientData : clientData,
            serverData : serverData
        });
    }

    getNewTransaction = async() => 
    {
        let service = new TransactionService();
        await service.newTxn();

        
        this.refreshUI();
    };

    signOff = async() => 
    {
        this.state.clientData.isLoading = true;
        this.refreshUI(this.state.clientData);

        let service = new UserService();
        await service.signOut();
        
        this.state.clientData.isLoading = false;
        this.refreshUI(this.state.clientData);
    };

    render() 
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
                    <SignInForm signInSuccess = {this.getNewTransaction} isLoading={this.state.clientData.isLoading} />
                </div> 
            );
        }

        return ( 
            <div  style={mainStyle}  >
                <Header/> 

                <div style={{margin:"0px"}} className="row"  >
                    <div style={txnListStyle}   >
                        <TxnList onSelectLine={this.makeSelection} 
                            clientData={this.state.clientData} 
                            serverData={this.state.serverData} 
                            transaction={this.state.transaction} /> 
                 
                    </div>

                    <div style={TotalPriceStyle} >
                        <span style={{fontSize:"30px",fontWeight:'bold'}} > Final Price :</span> 
                        <span style={{fontSize:"30px",float:'right'}} > &#x20b9; {this.state.transaction.finalPrice} </span> 
                    </div>

                    <div style={RightSideStyle} >
                        <LineDetail onSelectLine={this.makeSelection} 
                            clientData={this.state.clientData} 
                            serverData={this.state.serverData} 
                            transaction={this.state.transaction}  /> 
                        <MainMenu  
                            clientData={this.state.clientData} 
                            serverData={this.state.serverData} 
                            transaction={this.state.transaction}  /> 
                    </div>
                </div>

                <Footer/> 
            </div>

        );

    }

}

const AdaptiveWithDetector = withResizeDetector(MainComponent);
const Main = () => {
    return (
        <AdaptiveWithDetector />
    );
};
  
export default Main;
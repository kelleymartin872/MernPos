
import React, { Component } from 'react';
import { withResizeDetector } from 'react-resize-detector';
import Swal from 'sweetalert2'

import Constants from '../Utils/Constants' 

import SignInForm from './Popup_Components/SignInForm.component';
import Offline from './Popup_Components/Offline.component';
import Error from './Popup_Components/Error.component';
import ModalPopup from './ModalPopup.component';
import TxnList from './Txn_components/TxnList.component';
import Header from './Header.component';
import LineDetail from './LineDetail.component';
import MainMenu from './MainMenu.component';
import Footer from './Footer.component';

import TransactionService from '../apiServices/TransactionService';
import UserService from '../apiServices/UserService';

class MainComponent extends Component 
{
    mobileWidth = 765;

    state = { 
        clientData : {  width:window.innerWidth, height:window.innerHeight, 
                        isMobile: window.innerWidth < this.mobileWidth , 
                        isMobileMenuOpen : false,
                        selectedLineNmbr : -1 ,
                        isLoading:false , internalError: false,
                        modalPopupId : -1
                    },
        serverData : window.serverData.data,
        transactions : window.serverData.txns
    };

    makeSelection = lineNumber => 
    {
        try
        {
            let clientData = this.state.clientData;
            if(clientData.selectedLineNmbr == lineNumber)
            clientData.selectedLineNmbr = -1;
            else
                clientData.selectedLineNmbr = lineNumber;

            this.setState({ 
                clientData : clientData
            });
        }
        catch(ex)
        {
            console.error(ex);
            this.state.clientData.internalError = true;
            this.setState({ 
                clientData : this.state.clientData
            });
        }
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
            console.error(ex);
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
            console.error(ex);
            this.state.clientData.internalError = true;
            this.setState({ 
                clientData : this.state.clientData
            });
        }
    };

    endTxn = async() => 
    {
        try
        {
            let txnService = new TransactionService();
            txnService.endTxn().then(res =>
            {
                if(res.data.flowSuccess === true)
                {
                    Swal.fire(
                        'Transaction complete!','',
                        'success'
                    );
                    
                    txnService.newTxn().then(res =>
                    {
                        this.state.clientData.isLoading = false;
                        this.state.clientData.modalPopupId = -1;
                        this.refreshUI(this.state.clientData);
                    });
                }
            });

        }
        catch(ex)
        {
            console.error(ex);
            this.state.clientData.internalError = true;
            this.setState({ 
                clientData : this.state.clientData
            });
        }
    };

    reconnect = async() => 
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
            console.error(ex);
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
            Swal.fire({
                title: 'Sign Out?',
                text: "Are you sure you want to Sign Out ?",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes!'
            }).then( async(res) => {
                if(res.isConfirmed) 
                {
                    this.state.clientData.internalError = false;
                    this.state.clientData.isLoading = true;
                    this.refreshUI(this.state.clientData);
        
                    let service = new UserService();
                    await service.signOut();
                    
                    this.state.clientData.isLoading = false;
                    this.refreshUI(this.state.clientData);
                }
            });
            
        }
        catch(ex)
        {
            console.error(ex);
            this.state.clientData.internalError = true;
            this.setState({ 
                clientData : this.state.clientData
            });
        }
    };
    
    toggleMenu = () =>
    {
        this.state.clientData.isMobileMenuOpen = ! this.state.clientData.isMobileMenuOpen;
        this.refreshUI(this.state.clientData);
    }

    showModal = (functionId) => 
    {
        try
        {
            this.state.clientData.modalPopupId = functionId;
            this.refreshUI(this.state.clientData);
        }
        catch(ex)
        {
            console.error(ex);
            this.state.clientData.internalError = true;
            this.setState({ 
                clientData : this.state.clientData
            });
        }
    };
    
    closeModal = () => 
    {
        try
        {
            this.state.clientData.modalPopupId = -1;
            this.refreshUI(this.state.clientData);
        }
        catch(ex)
        {
            console.error(ex);
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
                        <Offline onRefresh = {this.reconnect} isLoading={this.state.clientData.isLoading} />
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
                Swal.fire({
                    type: 'error',
                    text: 'Internal server error occured.'
                });
            }
            
            let transaction = this.state.transactions[0];
            return ( 
                <div  style={mainStyle}  >
                    <Header onSignOff = {this.signOff} onMenuClick = {this.toggleMenu} /> 

                    <div style={{margin:"0px"}} className="row"  >
                        <div style={txnListStyle}   >
                            <TxnList onSelectLine={this.makeSelection} 
                                clientData={this.state.clientData} 
                                serverData={this.state.serverData} 
                                transaction={transaction} /> 
                    
                        </div>

                        <div style={TotalPriceStyle} >
                            <span style={{fontSize:"30px",fontWeight:'bold'}} > Amount Owed :</span> 
                            <span style={{fontSize:"30px",float:'right'}} > &#x20b9; {transaction.amountOwed} </span> 
                        </div>

                        <div style={RightSideStyle} >
                            <LineDetail
                                clientData={this.state.clientData} 
                                serverData={this.state.serverData} 
                                transaction={transaction}  /> 
                            <MainMenu  
                                clientData={this.state.clientData} 
                                serverData={this.state.serverData} 
                                transaction={transaction} 
                                onModalShow={this.showModal} /> 
                        </div>
                    </div>

                    <Footer
                        clientData={this.state.clientData} 
                        serverData={this.state.serverData} 
                        transaction={transaction} 
                        onChangeState={() => this.refreshUI()} /> 
                    
                    
                    { this.state.clientData.isMobile && 
                        <MainMenu clientData={this.state.clientData} 
                                serverData={this.state.serverData} 
                                transaction={transaction} 
                                onModalShow={this.showModal} /> 
                    }

                    { this.state.clientData.modalPopupId > 0 && 
                        <ModalPopup modalId={this.state.clientData.modalPopupId} 
                            onModalClose={this.closeModal} endTxn={this.endTxn}  
                            clientData={this.state.clientData} 
                            serverData={this.state.serverData} 
                            transaction={transaction} 
                            /> 
                    }

                </div>

            );
              
        }
        catch(ex)
        {
            console.error(ex);
            return ( 
                <Error onRefresh = {this.reconnect} />
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
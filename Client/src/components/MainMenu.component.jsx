
import React, { Component } from 'react';

import MenuButton from '../Utils/MenuButton'
import Constants from '../Utils/Constants'
import PaymentService from '../apiServices/PaymentService'
import Loading from './Popup_Components/Loading.component';

export default class MainMenu extends Component 
{
    state = { buttonDict: [] , isLoading: false}

    menuStyle={ 
        overflowY:"auto",
        width: "100%",
        margin:0,
        padding:0,
        backgroundColor:"#f16b52",
        height:"100%"
    };

    btnStyle={ 
        margin:10,
        fontSize:16,
        height: "60px",
        width: "140px",
        backgroundColor:"#303841",
        color:"white"
    };
    lineDetailStyle={
        padding:"0px",
        overflowY:"auto",
        height:"40vh", border: "1px solid black"
    };

    componentDidUpdate(prevProps)
    {
        if(!this.props.transaction)
            return;
        if(this.props.transaction.posState === prevProps.transaction.posState)
            return;

        this.setState();
    }

    preparePaymentButtons(payList)
    {
        let payBtns = [];

        payList.forEach(pay => {
            payBtns.push(new MenuButton(pay.paymentTypeID, pay.paymentName, pay.paymentName));
        });
        return payBtns;
    }


    componentDidMount()
    {
        let buttons = [
            new MenuButton(Constants.MenuButtonID.AddItem,"Add Item", "add-item"),
            new MenuButton(Constants.MenuButtonID.ReturnItem,"Return Item", "return-item"),
            new MenuButton(Constants.MenuButtonID.ChangeQty,"Change Qty", "change-qty"),
            new MenuButton(Constants.MenuButtonID.LineDisc,"Line Disc", "line-disc"),
            new MenuButton(Constants.MenuButtonID.TotalDisc,"Total Disc", "total-disc"),
            new MenuButton(Constants.MenuButtonID.AddCustomer,"Add Customer", "add-customer"),
            new MenuButton(Constants.MenuButtonID.RemoveLine,"Remove Line", "remove-line"),
            new MenuButton(Constants.MenuButtonID.ReturnReceipt,"Return Receipt", "return-receipt"),
            new MenuButton(Constants.MenuButtonID.AbortTxn,"Abort Txn", "abort-txn"),
            new MenuButton(Constants.MenuButtonID.AddPoints,"Add Points", "add-points"),
            new MenuButton(Constants.MenuButtonID.AddCoupon,"Add Coupon", "add-coupon"),
        ]; 

        let buttonDict = [[],[],[],[],[],[]];

        buttonDict[Constants.PosState.signedOff] = [];
        buttonDict[Constants.PosState.signedOn] = buttons;
        buttonDict[Constants.PosState.itemState] = buttons;
        buttonDict[Constants.PosState.payState] = buttons;

        let service = new PaymentService();
        service.getAllPayments().then(res =>
        {
            buttonDict[Constants.PosState.payState] = this.preparePaymentButtons(res.data.payments);
            this.setState({buttonDict:buttonDict , isLoading: false});
        });
    }

  
    render() 
    {
        const buttons = this.state.buttonDict[this.props.transaction.posState];

        let returnRender =  <Loading/>;
        

        if(!this.state.isLoading && buttons)
        {
            returnRender = 
            <div style={this.menuStyle} >
                { buttons.map( (button) => (
                    <button key={button.key} style={this.btnStyle} 
                            onClick={() => this.props.onModalShow(button.btnId) } >
                        {button.btnName}
                    </button>
                ))}
            </div>;
        }

        let mainStyle = {
            margin:"0px"
        };
        if(this.props.clientData.isMobile)
        {
            mainStyle.position = "fixed";
            if(this.props.clientData.isMobileMenuOpen)  
                mainStyle.bottom = "10vh";
        }

        return ( 
            <div style={mainStyle}  className="row"  >
                <div  style={this.lineDetailStyle}  className="col-12" >
                    {returnRender}
                </div>
            </div>
        );
       
    }
}



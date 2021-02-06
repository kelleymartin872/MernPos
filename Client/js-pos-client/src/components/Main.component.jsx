
import React, { Component } from 'react';

import TxnList from './Txn_components/TxnList.component';
import Header from './Header.component';
import LineDetail from './LineDetail.component';
import MainMenu from './MainMenu.component';
import Footer from './Footer.component';
import Transaction from '../DTOs/Transaction'

import { withResizeDetector } from 'react-resize-detector';


class MainComponent extends Component 
{
    mobileWidth = 765;
    state = { 
        data : { width : window.innerWidth, height:window.innerHeight, isMobile : window.innerWidth < this.mobileWidth },
        Txn : new Transaction()
    }

    mainStyle={
        fontSize:20
    };

    makeSelection = lineNumber => 
    {
        let Txn = this.state.Txn;
        Txn.makeSelection(lineNumber);
        this.setState({ 
            data : this.state.data,
            Txn : Txn
        });
    }


    componentDidUpdate(prevProps) {
        const { width, height } = this.props;

        if (height !== prevProps.height || width !== prevProps.width) 
        {
            this.setState({ 
                data : {width:width, height:height, isMobile : window.innerWidth < this.mobileWidth },
                Txn : this.state.Txn
            });
        }
      }

    render() 
    {
        let height = this.state.data.height;
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
 
        if(this.state.data.isMobile) 
        {
            RightSideStyle.display = "none";
            txnListStyle.width = "100%";
            TotalPriceStyle.width = "100%";
            txnListStyle.marginBottom = "10vh";
        }

        return ( 
            <div  style={this.mainStyle}  >
                <Header/> 

                <div style={{margin:"0px"}} className="row"  >
                    <div style={txnListStyle}   >
                        <TxnList onSelectLine={this.makeSelection} data={this.state.data} transaction={this.state.Txn} /> 
                 
                    </div>
                    <div style={TotalPriceStyle} >
                        <span style={{fontSize:"30px",fontWeight:'bold'}} > Final Price :</span> 
                        <span style={{fontSize:"30px",float:'right'}} > &#x20b9; {this.state.Txn.finalPrice} </span> 
                    </div>
                    <div style={RightSideStyle} >
                            <LineDetail data={this.state.data} transaction={this.state.Txn} /> 
                            <MainMenu/> 
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
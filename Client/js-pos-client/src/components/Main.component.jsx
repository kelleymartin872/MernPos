
import React, { Component } from 'react';

import TxnList from './TxnList.component';
import Header from './Header.component';
import LineDetail from './LineDetail.component';
import MainMenu from './MainMenu.component';
import Footer from './Footer.component';

export default class Main extends Component 
{
    state = {  }

    mainStyle={
        fontSize:20
    };

    txnListStyle={
        overflowY:"auto",
        borderRight: "2px solid black",
        height:"80vh"
    };

    
    lineDetailStyle={
        padding:"0px",
        overflowY:"auto",
        height:"40vh", border: "1px solid black"
    };

    render() 
    {
        return ( 
            <div  style={this.mainStyle}  >
                <div style={{margin:"0px"}}  className="row"  >
                    <div style={{padding:"0px"}}  className="col-12" >
                        <Header/> 
                    </div>
                </div>

                <div style={{margin:"0px"}} className="row"  >
                    
                    <div style={this.txnListStyle}   className="col-sm-6" >
                        <TxnList/> 
                    </div>
                    
                    <div className="col-sm-6" style={{padding:"0px"}} >
                        <div style={{margin:"0px"}}  className="row"  >
                            <div style={this.lineDetailStyle} className="col-12" >
                                <LineDetail/> 
                            </div>
                        </div>
                        <div style={{margin:"0px"}}  className="row"  >
                            <div  style={this.lineDetailStyle}  className="col-12" >
                                <MainMenu/> 
                            </div>
                        </div>
                    </div>
                </div>
                
                <div style={{margin:"0px"}}  className="row"  >
                    <div style={{padding:"0px"}}  className="col-12" >
                        <Footer/> 
                    </div>
                </div>
            </div>
            );

    }

}
 
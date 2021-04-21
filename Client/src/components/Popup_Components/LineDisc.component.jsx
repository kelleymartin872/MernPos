
import React from 'react';
import Form from './Form.component';
import Input from './Input.component';
import Joi from 'joi-browser';
import Loading from './Loading.component';
import ItemService from '../../apiServices/ItemService';

class LineDisc extends Form 
{
    state = { 
        isLoading:false,
        activeTab:0,
        formData: {
            percentage : 0,
            price : 0
        },
        formError : ""
    };

    schema = {
        percentage: Joi.number(),
        price: Joi.number()
    };

    toggleDiscTab(discTab)
    {
        this.setState({ activeTab:discTab.id });
        return;
    }

    submitForm = () =>
    {   
        try
        {  
            let maxVal = this.props.itemObj.itemPrice;
            let inputPrice = parseFloat(this.state.formData.price);
            let inputPerc = parseFloat(this.state.formData.percentage);
            let discountAmt = 0;

            if(this.state.activeTab == 0)
            {
                if(inputPerc === 0)
                {
                    this.props.doClose();
                    return;
                }
                if(inputPerc < 0 || inputPerc > 99)
                {
                    this.setState({formError : "Invalid input!"});
                    return;
                }
                discountAmt = (maxVal * inputPerc / 100);
            }
            else 
            {
                if(inputPerc < 0 || inputPerc > maxVal)
                {
                    this.setState({formError : "Invalid input!"});
                    return;
                }
                if(this.state.activeTab == 1)
                {       
                    if(inputPrice === 0)
                    {
                        this.props.doClose();
                        return;
                    }
                    discountAmt = inputPrice;
                }
                if(this.state.activeTab == 2)
                {       
                    if(inputPrice === maxVal)
                    {
                        this.props.doClose();
                        return;
                    }
                    discountAmt = maxVal - inputPrice;
                }
            }
            
            this.setState({ isLoading:true });
            
            let service = new ItemService();
            let reqObj = {
                lineNumber: parseInt(this.props.itemObj.lineNumber),
                discountAmt: -1 * parseFloat(discountAmt).toFixed(2)
            };
            service.lineDiscount(reqObj).then(res =>
            {
                if(res.data.flowSuccess === true)
                {
                    this.setState({ isLoading:false });
                    this.props.doClose();
                }
                else
                {
                    this.setState({formError : res.data.errorMsg , isLoading:false})
                }
            });
        }
        catch(e)
        {
            console.error(e);
        }
        return;
    }

    render() 
    {
        let formData = this.state.formData;
        let formError = this.state.formError;

        let render = [];
        render.push(   
            <div key="modal-header" className="modal-header">
                <h3 className="modal-title" style={{margin:"auto"}}>  Line Discount </h3> 
            </div>
        );
        
        let tabBtns = [];
        tabBtns.push( {key:"percent", id:0, text:"Percentage", } );
        tabBtns.push( {key:"redPrice", id:1, text:"Reduce Price", } );
        tabBtns.push( {key:"setPrice", id:2, text:"Set Price", } );
        
        let tabBtnRender = [];
        
        tabBtns.forEach(tabBtn => {
            if(tabBtn.id === this.state.activeTab)
            {
                tabBtnRender.push(
                    <li key={tabBtn.id} className="nav-item">
                        <button key={tabBtn.id} className="nav-link active"  style={{fontSize:"16px"}}
                                type="button" onClick={() => this.toggleDiscTab(tabBtn)} >  
                            {tabBtn.text} 
                        </button>
                    </li>
                );
            }
            else
            {
                tabBtnRender.push(
                    <li key={tabBtn.id} className="nav-item">
                        <button key={tabBtn.id} className="nav-link" style={{fontSize:"16px"}}
                                type="button" onClick={() => this.toggleDiscTab(tabBtn)} >  
                            {tabBtn.text} 
                        </button>
                    </li>
                );
            }
        });
        
        let tabContentRender =  <form>
                <Input key={this.state.activeTab} name="price" type="number" min="0.00" step="0.01" value={formData.price} onChange={this.handleInputChange}  />
            </form>;
            
        if(this.state.activeTab == 0)
        {
            tabContentRender =  <form>
                    <Input key={this.state.activeTab} name="percentage" type="number" min="0.00"  step="0.01" value={formData.percentage} onChange={this.handleInputChange}  />
                </form>;
        }


        render.push(
            <div key="modal-body" className="modal-body">
                <ul className="nav nav-tabs" id="myTab" >
                    {tabBtnRender}
                </ul>
                <hr/>
                <div>
                    {tabContentRender}
                </div>
            </div>
        );
        
        render.push(
            <div key="modal-footer" className="modal-footer">
                <button
                    type="button" className="btn btn-danger" 
                    id="signIn_FormSubmit" style={{width: "48%"}} 
                    onClick={() => this.props.doClose()}  > 
                    Cancel
                </button>
                <button
                    type="button" className="btn btn-success" 
                    id="signIn_FormSubmit" style={{width: "48%",backgroundColor:"#f16b52"}} 
                    onClick={() => this.handleFormSubmit()} > 
                    Confirm
                </button>
            </div>
        );

        if(formError && formError !== "")
        {
            render.push(
                <div key="modal-error" className="list-group-item list-group-item-danger" > { formError } </div>
            );
        }

        return ( 
        
            <div>
                <div className="modal-dialog " role="document">
                    <div className="modal-content">
                        {render}
                    </div>
                </div>
                { this.state.isLoading &&  <Loading/> }
            </div>
         );
    }

}
 
export default LineDisc;
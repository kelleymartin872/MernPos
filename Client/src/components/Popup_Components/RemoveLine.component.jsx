
import React, { Component } from 'react';
import Constants from '../../Utils/Constants'
import TransactionService from '../../apiServices/TransactionService';
import Swal from 'sweetalert2'


class RemoveLine extends Component 
{
    state = { confirm : true , voidFail : false }

    
    async removeLine(selectedLineNmbr)
    {   
        try
        {    
            if(selectedLineNmbr < 1) 
            {
                this.setState({voidFail : true });
                return false;
            }
            let transaction = this.props.transaction;
            const selectedObj = transaction.txnList.find(x => x.lineNumber === selectedLineNmbr);
            if(!selectedObj) 
            {
                this.setState({voidFail : true });
                return false;
            }

            if(selectedObj.lineTypeID !== Constants.TxnLineType.ItemLine
                && selectedObj.lineTypeID !== Constants.TxnLineType.CustomerLine
                && selectedObj.lineTypeID !== Constants.TxnLineType.CouponLine)
            {
                this.setState({voidFail : true });
                return false;
            }

            let service = new TransactionService();
            let reqObj = {
                selectedLineNmbr: parseInt(selectedLineNmbr),
            };
            
            service.removeLine(reqObj).then(res =>
            {
                if(res.data.flowSuccess === true)
                {
                    this.props.doClose();
                    return true;
                }
                else
                {
                    this.setState({voidFail : true });
                    return false;
                }
            });
        }
        catch(e)
        {
            console.error(e);
            this.setState({voidFail : true });
            return false;
        }
    }


    render() 
    { 
        const selectedLineNmbr = this.props.selectedLineNmbr;

        Swal.fire({
            title: 'Remove Line?',
            text: "Are you sure you want to remove the selected line ?",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes!'
          }).then((res) => {
            if(res.isConfirmed) 
            {
                if (this.removeLine(selectedLineNmbr)) 
                {
                    Swal.fire(
                        'Line removed!','',
                        'success'
                    );
                }
                else
                {
                    Swal.fire({
                        type: 'error',
                        text: 'Selected line could not be removed.'
                    });
                }
            }
            else
                this.props.doClose();
          });

          return (<div/>);
    }
}
 
export default RemoveLine;
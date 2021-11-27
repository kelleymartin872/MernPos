
import React, { Component } from 'react';
import Constants from '../../Utils/Constants'
import TransactionService from '../../apiServices/TransactionService';
import Swal from 'sweetalert2'

class AbortTxn extends Component 
{

    async callAbortTxn()
    {   
        try
        {    
            let service = new TransactionService();
            
            service.abortTxn().then(res =>
            {
                if(res.data.flowSuccess === true)
                {
                    this.props.doClose();
                    return true;
                }
                else
                {
                    console.error(res.data.errorMsg)
                    return false;
                }
            });
        }
        catch(e)
        {
            console.error(e);
            return false;
        }
    }


    render() 
    { 
        const selectedLineNmbr = this.props.selectedLineNmbr ;

        Swal.fire({
            title: 'Abort Transaction?',
            text: "Are you sure you want to abort the current transaction ?",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
            confirmButtonColor: '#3a3'
          }).then((res) => {
            if(res.isConfirmed) 
            {
                if (this.callAbortTxn()) 
                {
                    Swal.fire(
                        'Transaction aborted!','',
                        'success'
                    );
                }
                else
                {
                    Swal.fire({
                        type: 'error',
                        text: 'Transaction could not be aborted!'
                    });
                }
            }
            else
                this.props.doClose();
          });

          return (<div/>);
    }
}
 
export default AbortTxn;
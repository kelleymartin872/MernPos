
import Constants from '../Constants';
import axios from 'axios';

export default class CustomerService
{
    constructor()
    {
        this.url = Constants.APIUrl.base + Constants.APIUrl.customerService;
    }

    getCustomers(reqObj={})
    {
        /* Request structure
        reqObj = {
            "custName": "Teja",
            "phoneNumber": ""
        };
        */

        const reqUrl = this.url + "getCustomers";
        
        return Promise(function(resolve,reject)
        {
            axios.post(reqUrl, reqObj)
                .then(res => {
                    window.posData.customers = res.data;
                    resolve(res.data);
                })
                .catch(err => {
                    window.posData.error = err.response.data;
                    console.log(err);
                    reject(err);
                });
        });
    }

    addCustomerTxn(reqObj={})
    {
        /* Request structure
        reqObj = {
            "custName": "Teja",
            "phoneNumber": ""
        };
        */

        const reqUrl = this.url + "addCustomerTxn";
        
        return Promise( function(resolve,reject)
        {
            axios.post(reqUrl, reqObj)
                .then(res => {
                    window.posData = res.data;
                    resolve(res.data);
                })
                .catch(err => {
                    window.posData.error = err.response.data;
                    console.log(err);
                    reject(err);
                });
        });
    }

    addNewCustomer(reqObj={})
    {
        /* Request structure
        reqObj = {
            "custName": "Tejaaa",
            "phoneNumber": "4223352123"
        };
        */

        const reqUrl = this.url + "addNewCustomer";
        
        return Promise( function(resolve,reject)
        {
            axios.post(reqUrl, reqObj)
                .then(res => {
                    window.posData.msg = res.data;
                    console.log(res.data);
                    resolve(res.data);
                })
                .catch(err => {
                    window.posData.error = err.response.data;
                    console.log(err);
                    reject(err);
                });
        });
    }

}

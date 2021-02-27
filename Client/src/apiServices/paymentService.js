
import Constants from '../Constants';
import axios from 'axios';

export default class PaymentService
{
    constructor()
    {
        this.url = Constants.APIUrl.base + Constants.APIUrl.paymentService;
    }

    getAllPayments(reqObj={})
    {
        /* Request structure
        reqObj = { };
        */
        const reqUrl = this.url + "getAllPayments"
        
        return Promise(function(resolve,reject)
        {
            axios.post(reqUrl, reqObj)
                .then(res => {
                    window.posData.payments = res.data;
                    resolve(res.data);
                })
                .catch(err => {
                    window.posData.error = err.response.data;
                    console.log(err);
                    reject(err);
                });
        });
    }

    performPayment(reqObj={})
    {
        /* Request structure
        reqObj = {
            "paymentTypeID": 100,
            "amountPaid": 100
        };
        */

        const reqUrl = this.url + "performPayment"
        
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

}

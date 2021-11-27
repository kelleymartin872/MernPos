
import Constants from '../Utils/Constants';
import ApiService from './ApiService';

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
        let apiService = new ApiService("GET", reqUrl , reqObj );
        return apiService.getResponse();
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
        let apiService = new ApiService("POST", reqUrl , reqObj );
        return apiService.getResponse();
    }

}

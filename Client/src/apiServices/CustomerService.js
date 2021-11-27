
import Constants from '../Utils/Constants';
import ApiService from './ApiService';

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
        let apiService = new ApiService("POST", reqUrl , reqObj);
        return apiService.getResponse();
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
        let apiService = new ApiService("POST", reqUrl , reqObj);
        return apiService.getResponse();
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
        let apiService = new ApiService("POST", reqUrl , reqObj);
        return apiService.getResponse();
    }

    addPoints(reqObj={})
    {
        /* Request structure
        reqObj = {
            "custID": "123456",
            "points": "100"
        };
        */

        const reqUrl = this.url + "addPoints";
        let apiService = new ApiService("POST", reqUrl , reqObj);
        return apiService.getResponse();
    }
}

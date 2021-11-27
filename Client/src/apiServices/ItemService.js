
import Constants from '../Utils/Constants';
import ApiService from './ApiService';

export default class ItemService
{
    constructor()
    {
        this.url = Constants.APIUrl.base + Constants.APIUrl.itemService;
    }


    getItems(reqObj={})
    {
        /* Request structure
        reqObj = {
             "itemId": "111003",
             "itemName": ""
        };
        */

        const reqUrl = this.url + "getItems";
        let apiService = new ApiService("POST", reqUrl , reqObj);
        return apiService.getResponse();
    }

    addItemTxn(reqObj={})
    {
        /* Request structure
        reqObj = {
            "itemId": "111002",
            "itemName": "",
            "itemQty": 2
        };
        */

        const reqUrl = this.url + "addItemTxn";
        let apiService = new ApiService("POST", reqUrl , reqObj );
        return apiService.getResponse();
    }

    setItemQty(reqObj={})
    {
        /* Request structure
        reqObj = {
            "lineNumber": "3",
            "itemQty": 2
        };
        */

        const reqUrl = this.url + "setItemQty";
        let apiService = new ApiService("POST", reqUrl , reqObj );
        return apiService.getResponse();
    }

    lineDiscount(reqObj={})
    {
        /* Request structure
        reqObj = {
            "lineNumber": "3",
            "discountAmt": 20.5
        };
        */

        const reqUrl = this.url + "lineDiscount";
        let apiService = new ApiService("POST", reqUrl , reqObj );
        return apiService.getResponse();
    }
    
}


import Constants from '../Constants';
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

}

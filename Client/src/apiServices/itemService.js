
import Constants from '../Constants';
import axios from 'axios';

export default class ItemService
{
    constructor()
    {
        this.url = Constants.APIUrl.base + Constants.APIUrl.paymentService;
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
        
        return Promise( function(resolve,reject)
        {
            axios.get(reqUrl, reqObj)
                .then(res => {
                    window.posData.items = res.data;
                    resolve(res.data);
                })
                .catch(err => {
                    window.posData.error = err.response.data;
                    resolve(err.response.data);
                });
        });
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

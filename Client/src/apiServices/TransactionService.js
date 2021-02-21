
import Constants from '../Constants';
import axios from 'axios';

export default class UserService
{
    constructor()
    {
        this.url = Constants.APIUrl.base + Constants.APIUrl.transactionService;
    }

    newTxn(reqObj={})
    {
        /* Request structure 
        reqObj = { };
        */
        const reqUrl = this.url + "newTxn";
        
        return new Promise( function(resolve,reject)
        {
            axios.post(reqUrl, reqObj)
                .then(res => {
                    window.posData = res.data;
                    resolve(res.data);
                })
                .catch(err => {
                    window.posData.error = err;
                    console.log(err);
                    reject(err);
                });
        });
    }

    removeLine(reqObj={})
    {
        /* Request structure 
        reqObj = {
            "selectedLineNmbr":3
        };
        */
       
        const reqUrl = this.url + "removeLine";
        
        return new Promise( function(resolve,reject)
        {
            axios.post(reqUrl, reqObj)
                .then(res => {
                    window.posData = res.data;
                    resolve(res.data);
                })
                .catch(err => {
                    window.posData.error = err;
                    console.log(err);
                    reject(err);
                });
        });
    }

    changeState(reqObj={})
    {
        /* Request structure 
        reqObj = {
            "state":3
        };
        */

        const reqUrl = this.url + "changeState";
        
        return new Promise( function(resolve,reject)
        {
            axios.post(reqUrl, reqObj)
                .then(res => {
                    window.posData = res.data;
                    resolve(res.data);
                })
                .catch(err => {
                    window.posData.error = err;
                    console.log(err);
                    reject(err);
                });
        });
    }

    endTxn(reqObj={})
    {
        /* Request structure 
        reqObj = { };
        */

        const reqUrl = this.url + "endTxn";
        
        return new Promise( function(resolve,reject)
        {
            axios.post(reqUrl, reqObj)
                .then(res => {
                    window.posData = res.data;
                    resolve(res.data);
                })
                .catch(err => {
                    window.posData.error = err;
                    console.log(err);
                    reject(err);
                });
        });
    }
    
}

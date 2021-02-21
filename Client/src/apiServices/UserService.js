
import Constants from '../Constants';
import axios from 'axios';

export default class UserService
{
    constructor()
    {
        this.url = Constants.APIUrl.base + Constants.APIUrl.userService;
    }

    signIn(reqObj={})
    {
        /* Request structure
        reqObj = {
            "email":"tjadhav95@gmail.com",
            "password":"Tejas2304"
        };
        */

        const reqUrl = this.url + "signIn";
        
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

    signOut(reqObj={})
    {
        /* Request structure 
        reqObj = { };
        */

        const reqUrl = this.url + "signOut";
        
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

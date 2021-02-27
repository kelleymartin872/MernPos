
import Constants from '../Constants';
import axios from 'axios';

export default class CustomerService
{
    constructor()
    {
        this.url = Constants.APIUrl.base + Constants.APIUrl.couponService;
    }

    addCouponTxn(reqObj={})
    {
        /* Request structure
        reqObj = {
            "couponNmbr": "12341234"
        };
        */

        const reqUrl = this.url + "addCouponTxn";
        
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

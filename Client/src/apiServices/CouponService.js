
import Constants from '../Utils/Constants';
import ApiService from './ApiService';

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
        let apiService = new ApiService("POST", reqUrl , reqObj);
        return apiService.getResponse();
    }
}


import Constants from '../Utils/Constants';
import ApiService from './ApiService';

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
        let reqUrl = this.url + "signIn";
        let apiService = new ApiService("POST", reqUrl , reqObj );
        return apiService.getResponse();
    }

    signOut(reqObj={})
    {
        /* Request structure 
        reqObj = { };
        */
        let reqUrl = this.url + "signOut";
        let apiService = new ApiService("POST", reqUrl , reqObj );
        return apiService.getResponse();
    }


}

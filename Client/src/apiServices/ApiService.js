
import Constants from '../Utils/Constants';
import axios from 'axios';

export default class ApiService
{
    constructor(reqMethod,reqUrl,reqObj)
    {
        this.reqMethod = reqMethod;
        this.reqUrl = reqUrl;
        this.reqObj = reqObj;
    }

    getResponse()
    {
        const reqUrl = this.reqUrl;
        const reqObj = this.reqObj;

        switch(this.reqMethod)
        {
            case "GET":
            { 
                return new Promise( function(resolve,reject)
                {
                    axios.get(reqUrl, reqObj)
                        .then(res => {
                            window.serverData = res.data;
                            resolve(window.serverData);
                        })
                        .catch(err => {
                            if(err.response && err.response.data)
                                window.serverData = err.response.data;
                            else
                            {
                                window.serverData = {
                                    data:
                                    {
                                        isOffline:true,
                                        errorMsg:"Server is Unreachable!"
                                    }
                                };
                            }
                            resolve(window.serverData);
                    });
                });
            }

            case "POST":
            { 
                return new Promise( function(resolve,reject)
                {
                    axios.post(reqUrl, reqObj)
                        .then(res => {
                            window.serverData = res.data;
                            resolve(window.serverData);
                        })
                        .catch(err => {
                            if(err.response && err.response.data)
                                window.serverData = err.response.data;
                            else
                            {
                                window.serverData = {
                                    data:
                                    {
                                        isOffline:true,
                                        errorMsg:"Server is Unreachable!"
                                    }
                                };
                            }
                            resolve(window.serverData);
                        });
                });
            }
        }
        
    }
}

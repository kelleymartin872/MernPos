
import Constants from '../Constants';
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
                            resolve(res.data);
                        })
                        .catch(err => {
                            window.serverData = err.response.data;
                            resolve(err.response.data);
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
                            resolve(res.data);
                        })
                        .catch(err => {
                            window.serverData = err.response.data;
                            resolve(err.response.data);
                        });
                });
            }
            case "PUT":
            { 
                return new Promise( function(resolve,reject)
                {
                    axios.put(reqUrl, reqObj)
                        .then(res => {
                            window.serverData = res.data;
                            resolve(res.data);
                        })
                        .catch(err => {
                            window.serverData = err.response.data;
                            resolve(err.response.data);
                        });
                });
            }
            case "DELETE":
            { 
                return new Promise( function(resolve,reject)
                {
                    axios.delete(reqUrl, reqObj)
                        .then(res => {
                            window.serverData = res.data;
                            resolve(res.data);
                        })
                        .catch(err => {
                            window.serverData = err.response.data;
                            resolve(err.response.data);
                        });
                });
            }
        }
        
    }
}

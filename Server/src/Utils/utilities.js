
const fs = require('fs');

class Utilities
{
		
	static pad(number, length) 
	{
		var str = '' + number;
		while (str.length < length) {
			str = '0' + str;
		}
		return str;
	}

	static DateToString(date) 
	{
		var yyyy = date.getFullYear().toString();
		var MM = this.pad(date.getMonth() + 1,2);
		var dd = this.pad(date.getDate(), 2);
		var hh = this.pad(date.getHours(), 2);
		var mm = this.pad(date.getMinutes(), 2)
		var ss = this.pad(date.getSeconds(), 2)

		return yyyy + MM + dd+  hh + mm + ss;
	}

	
    static logMsg(srcFile, funcName , message = "")
    {
		srcFile = srcFile.substring(srcFile.indexOf("MernPos\\Server\\src"));
        let log = "\n--> "+ this.DateToString(new Date()) + " || " + srcFile + " || "+ funcName +" || " + message;

        let fileName = "ServerLog";// + Utilities.DateToString(new Date()).substring(0,8);
        let dir = "./data/" ;
        let path = dir + fileName + ".log";
        
        if (!fs.existsSync(path))
        { 
            fs.mkdir(dir, async (mkErr) => 
            { 
                if (mkErr)
                    console.error(mkErr);

                return fs.writeFile(path, log, function (err) 
                {
                    console.error(err);
                });
            });
        }
        else
        { 
			return fs.appendFile(path, log, function (err) {
				if (err) 
					console.error(err);
			});
        }

    }

}

module.exports.Utilities = Utilities;

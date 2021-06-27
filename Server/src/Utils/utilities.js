


function pad(number, length) 
{
	var str = '' + number;
	while (str.length < length) {
		str = '0' + str;
	}
	return str;
}

DateToString = function(date) 
{
	var yyyy = date.getFullYear().toString();
	var MM = pad(date.getMonth() + 1,2);
	var dd = pad(date.getDate(), 2);
	var hh = pad(date.getHours(), 2);
	var mm = pad(date.getMinutes(), 2)
	var ss = pad(date.getSeconds(), 2)

	return yyyy + MM + dd+  hh + mm + ss;
};

module.exports.DateToString = DateToString;

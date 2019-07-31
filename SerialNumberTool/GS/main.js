function refreshSearches() {
    var ss = SpreadsheetApp.getActiveSheet();
    var lastRow = ss.getLastRow() - 2; // remove two since we aren't starting at the top row.
    
    // Make the serials into a flattened map
    var serials = ss.getRange(3, 1, lastRow, 1).getValues().map(function(i) {return i[0]});
  
    var locations = retrieveSerialNumberLocations(serials).map(function(i) {return [i]});
    
    ss.getRange(3,2,lastRow,1).setValues(locations);
  }
  
  function retrieveSerialNumberLocations(serials) {
    var baseUrl = 'https://3916530-sb2.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=757&deploy=1';
    // Options for the request.
    var header = getAuthHeader(baseUrl, 'POST');
    var options = {
          'method':'post',
          'contentType':'application/json',
          'headers':header,
          'muteHttpExceptions':true,
          'payload': JSON.stringify(serials)
        };
    
    try {
      var response = UrlFetchApp.fetch(baseUrl, options);
      return JSON.parse(response);
    } catch(e) {
    // Don't delete all data if bad!
      Logger.log("Error: "+e);
    }
  }
  
  function getAuthHeader(url, method) {
    // Get parameters of url
    var baseUrl = url.substr(0, url.indexOf("?")),
        params = url.substr(url.indexOf("?")+1).split("&");
  
    //set credentials
    // TODO: Change where these credentials come from.
    var consumer_key = "df259f21c92b6a6c83c5ba87a35b300fd2dd0b6d1eb799360edfe5c14a54d9c6",
        consumer_secret = "0faae6f9fa3b3b6319897c2c86c5db586835405c4162eb8d9e0bb7b27dfe62fe",
        token = "c81c3033ef86aa746e03d592d6876fd2e2712db885242dea4a32d658a64c1bd0",
        token_secret = "90205ce4a8c56e54fcfecaea8fc8e075a80854ecee4fdc50e79acd8d7057e9fc",
        realm = "3916530_SB2",
        sig_method = "HMAC-SHA256";
    
    // Generate nonce and timestamp.
    
    // a NONCE is a uniquely generated code.
    var nonce = generateNonce(10),
       timestamp = Math.floor((new Date()).getTime()/1000);
  
    // Get credentials
    params.push("oauth_consumer_key="+consumer_key);
    params.push("oauth_token="+ token);
    params.push("oauth_nonce="+nonce);
    params.push("oauth_signature_method="+sig_method);
    params.push("oauth_timestamp="+timestamp);
    params.push("oauth_version=1.0");
  
    // Sort the parameters alphabetically and combine the string.
    var sortedParams = params.sort();
    for(var i=0; i < sortedParams.length; i++) {
      var half = sortedParams[i].split("=");
      sortedParams[i] = encodeURIComponent(half[0])+"="+encodeURIComponent(half[1]);
    }
    // Join all parameters together
    var fullString = sortedParams.join("&");
    var baseString = method+"&"+encodeURIComponent(baseUrl)+"&"+encodeURIComponent(fullString);
    
    Logger.log("Basestring: "+baseString);
    var key = encodeURIComponent(consumer_secret)+"&"+encodeURIComponent(token_secret);
    
    Logger.log("KEY: "+key);
    var hmac = Utilities.computeHmacSha256Signature(baseString, key);
    
    Logger.log("HMAC: "+hmac);
    var signature = Utilities.base64Encode(Utilities.computeHmacSha256Signature(baseString, key));
    
    Logger.log("Signature: "+ signature);
    
    //return {'Authorization': 'OAuth realm="'+realm+'",oauth_consumer_key="'+consumer_key+'",oauth_token="'+token+'",oauth_signature_method="'+sig_method+'",oauth_nonce="'+nonce+'",oauth_timestamp="'+timestamp+'",oauth_version="1.0",oauth_signature="'+encodeURIComponent(signature)+'"'}
  }
  
  function generateNonce(length) {
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      for(var i = 0; i < length; i++) {
          text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return text;
  }
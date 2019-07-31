# Needed to install packages
install.packages("digest")
install.packages()
library(digest)

oauthConsumerKey = "df259f21c92b6a6c83c5ba87a35b300fd2dd0b6d1eb799360edfe5c14a54d9c6"
consumerSecret = "0faae6f9fa3b3b6319897c2c86c5db586835405c4162eb8d9e0bb7b27dfe62fe"
# Change 1: I used Sys.time() instead, and formatted time from there...
# really just did that because I had an issue with the now() function in my version of R
oauth_timestamp = ceiling(as.numeric(as.POSIXct(format(Sys.time()))))
oauth_token = "c81c3033ef86aa746e03d592d6876fd2e2712db885242dea4a32d658a64c1bd0"
TokenSecret = "90205ce4a8c56e54fcfecaea8fc8e075a80854ecee4fdc50e79acd8d7057e9fc"
oauth_version = "1.0"
searchId = "customsearch_pel_dispatch_track_searches"
realm = "3916530_SB2"
sig_method = "HMAC-SHA256"
BaseUrl = "GET&https%3A%2F%2F3916530-sb2.restlets.api.netsuite.com%2Fapp%2Fsite%2Fhosting%2Frestlet.nl"
Nonce <- ceiling(runif(1, 0, 10) *100000000000)
# Changed the ampersand after the baseUrl to not be encoded
# NOTE that this is using a baseString with searchId == customsearch_pel_dispatch_track_searches
# and script id = 757
URLParams = paste0("GET&https%3A%2F%2F3916530-sb2.restlets.api.netsuite.com%2Fapp%2Fsite%2Fhosting%2Frestlet.nl&deploy%3D1%26oauth_consumer_key%3Ddf259f21c92b6a6c83c5ba87a35b300fd2dd0b6d1eb799360edfe5c14a54d9c6%26oauth_nonce%3D",Nonce,"%26oauth_signature_method%3DHMAC-SHA256%26oauth_timestamp%3D",oauth_timestamp,"%26oauth_token%3Dc81c3033ef86aa746e03d592d6876fd2e2712db885242dea4a32d658a64c1bd0%26oauth_version%3D1.0%26script%3D757%26searchId%3D",searchId)
Key <- paste0(consumerSecret,"&",TokenSecret,sep="")


Hash = hmac(object=URLParams, key =Key,algo="sha256",serialize=FALSE)
# This library is causing issues on my machine...think you have the wrong input here
# will see if I can figure out tomorrow
Base64 = base64encode(Hash)
print(Base64)
Signature2 <- data.frame(Base64,oauth_timestamp,oauthConsumerKey,consumerSecret,oauth_token,TokenSecret,oauth_version,searchId,realm,sig_method,Nonce)
print(Signature)
Test <- GET("https://3916530-sb2.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=757&deploy=1&searchId=customsearch_pel_dispatch_track_searches", add_headers(Authorization = paste0("OAuth realm=",realm,"OAuth oauth_consumer_key=",oauthConsumerKey,"oauth_token=",oauth_token,"oauth_nonce=",Nonce,"oauth_timestamp=",oauth_timestamp,"oauth_signature_method=",sig_method,"oauth_version=1.0","oauth_signature=",encodeURI(Base64))))
                
print(paste0("OAuth realm=",realm,"OAuth oauth_consumer_key=",oauthConsumerKey,"oauth_token=",oauth_token,"oauth_nonce=",Nonce,"oauth_timestamp=",oauth_timestamp,"oauth_signature_method=",sig_method,"oauth_version=1.0","oauth_signature=",Base64))
​
print(Test)d
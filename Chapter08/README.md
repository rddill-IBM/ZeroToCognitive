#Chapter 8: Watson Discovery

[Return to Table of Contents](../README.md)

This is an update to the previous Chapter 8, where we used Alchemy. Much of this chapter is unchanged, however you will see changes in the following three files: 
## Server Side changes
 - **controller/features/discovery.js**
 This file is new and has two routines exported from it, one is intended to be informative, but is not used. That's the 'getID' function. The other is, appropriately, 'getNews', which is explained in the javascript file nearly line by line. 
 - **controller/router.js**
 There are two changes to this file, one is the necessary statements for the new get and post commands. The other is a routine which logs to the terminal window each request to the server. I've started adding this to all of my demonstrations, primarily to help me both understand and explain what is going on between the client (browser) and the server. 
 That code is the following: 
 ```javascript
 var count = 0;
router.use(function(req, res, next) {
  count++;
  console.log('['+count+'] at: '+format.asString('hh:mm:ss.SSS', new Date())+' Url is: ' + req.url);
  next(); // make sure we go to the next routes and don't stop here
});
```
   - the count variable increments for every call and enables simple sequence tracking. 
   - format.asString takes the current date and provides a timestamp on the request
   - req.url is the inbound request from the browser to the server.

## Client (Browser) changes
 - **z2c-alchemy.js**
 For purposes of simplicity, this file name remains unchanged, although it could be called z2c-discoveryNews.js just as easily. In the original file, we made api calls directly from the browser to the alchemy service; so one of the responsibilities of the browser javascript code was to correctly format the alchemy request url. We are now using a server side routine to handle that, so the following changes have been made: 
   - The browser code now takes the data from the browser page and sends it directly to the server. 
   - The browser code now determines the start and end date, rather than passing the number of days. While we could, still, just pass the number of days, the code to calculate the current and offset date is identical regardless of where we execute it. 
   - The browser code now executes a POST command to request the news information where previously it issued a GET command
   - We have one new line of code in the display routine, which now includes the summary text of the returned articles in the accordion.
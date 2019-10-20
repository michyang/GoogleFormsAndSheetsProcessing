function generateOutput() {
  var mainApp = SpreadsheetApp.openById("10-HtSndOiarIzWz7a7J_jlaYYCx7NNtHFFMDmPmJjQo");
  var responseSheet = mainApp.getSheetByName('Form responses 1');
  var userInfoSheet = mainApp.getSheetByName('UserInfo');
  var outputSheet = mainApp.getSheetByName('FullResponse');
  
  //response data
  var lastRow = responseSheet.getLastRow();
  var lastColumn = responseSheet.getLastColumn();
  var inputRange = responseSheet.getRange(lastRow, 2); 
  var email = inputRange.getValue();
  
  var inputData = [];
  for(var i = 3; i<= lastColumn; i++){
    inputData.push(responseSheet.getRange(lastRow, i).getValue());
  }
   
  //user info
  var range = userInfoSheet.getRange("A1:A");
  var emails = range.getValues();
  
  var i = [];
  for (var y = 0; y < emails.length; y++) {
   if(emails[y] == email)
   {
      i.push(y);
   }
  }
  if(i.length == 0){
    sendEmail(email, "Pilgrimage to Mordor");
    return;
  }
  var userRow = Number(i)+Number(range.getRow());
  var numUserColumns = userInfoSheet.getLastColumn();
  
  var userInfo = [];
  for(var i = 1; i<= numUserColumns; i++){
    userInfo.push(userInfoSheet.getRange(userRow, i).getValue());
  }
  Logger.log(userInfo);
  Logger.log(inputData);
  var combinedData = userInfo.concat(inputData);
  
  var output = [];
  for(var i = 0; i<combinedData.length; i++){
    output.push(combinedData[i]);
  }
  
  //Write to FullResponse
  var regRow = userAlreadyRegistered(email);
  Logger.log("Registered Row: "+regRow);
  if(regRow == -1 ){
    outputSheet.appendRow(output);
  }
  else{
    var numOutputColumns = outputSheet.getLastColumn();
    outputSheet.getRange(regRow, 1, 1, numOutputColumns).setValues([output]);
  }
}

/**
 * check if user has already registered
 * @param {string} email is the email address to check in registration sheet
 */
function userAlreadyRegistered(email) {
  var mainApp = SpreadsheetApp.openById("10-HtSndOiarIzWz7a7J_jlaYYCx7NNtHFFMDmPmJjQo");
  var outputSheet = mainApp.getSheetByName('FullResponse');
  var range = outputSheet.getRange("A1:A");
  var emails = range.getValues();
  var i = [];
  for (var y = 0; y < emails.length; y++) {
   if(emails[y] == email)
   {
      i.push(y);
   }
  }
 
  if(i.length == 0){
    return -1;
  }
  else
  {
    return Number(i)+Number(range.getRow());
  }
}

/**
 * send email from GmailApp service
 * @param {string} recipient is the email address to send email to
 * @param {string} eventName is the subject of the email
 */
function sendEmail(recipient, eventName) {
  var body = "Registration Failed: Email Address does not exist in our database. Please contact your system administrator."
  GmailApp.sendEmail(
    recipient,
    eventName, 
    "",
    {
      htmlBody: body
    }
  );
}

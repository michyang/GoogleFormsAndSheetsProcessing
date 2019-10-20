function generateOutput() {
  var mainApp = SpreadsheetApp.openById("10-HtSndOiarIzWz7a7J_jlaYYCx7NNtHFFMDmPmJjQo");
  var responseSheet = mainApp.getSheetByName('Form responses 1');
  var userInfoSheet = mainApp.getSheetByName('UserInfo');
  var outputSheet = mainApp.getSheetByName('FullResponse');
  var logSheet = mainApp.getSheetByName('Log');
  
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
    sendEmail(email);
    return;
  }
  var userRow = Number(i)+Number(range.getRow());
  var numUserColumns = userInfoSheet.getLastColumn();
  
  var userInfo = [];
  for(var i = 1; i<= numUserColumns; i++){
    userInfo.push(userInfoSheet.getRange(userRow, i).getValue());
  }
  
  var combinedData = userInfo.concat(inputData);
  
  var output = [];
  for(var i = 0; i<combinedData.length; i++){
    output.push(combinedData[i]);
  }
  Logger.log(output);
  
  //Write to full response
  outputSheet.appendRow(output);
}

/**
 * send email from GmailApp service
 * @param {string} recipient is the email address to send email to
 * @param {string} body is the html body of the email
 * @return {object} new date object to write into spreadsheet to confirm email sent
 */
function sendEmail(recipient) {
  
  GmailApp.sendEmail(
    recipient,
    "Your Email Is Not Registered", 
    "",
    {
      htmlBody: "Please contact your administrator to register your email address"
    }
  );
  
  return new Date();
}

exports.handler = async (event, context, callback) => {
  const request = event.Records[0].cf.request;

  var filename = event.Records[0].cf.uri;
  var fileExt = filename.split('.').pop();
  if (fileExt == "pdf") {
    console.log('PDF HANDLED');
  }

  else {
    console.log("Pass");
  }

}
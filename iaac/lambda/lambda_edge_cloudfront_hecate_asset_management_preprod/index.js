const axios = require('axios');
const FormData = require('form-data');

exports.handler = async (event, context, callback) => {
  //console.log('-- EVENT --');
  //console.log(JSON.stringify(event));
  const request = event.Records[0].cf.request;
  //console.log('-- REQUEST --');
  //console.log(JSON.stringify(request));

  var filename = request.uri;
  var fileExt = filename.split('.').pop();
  if (fileExt == "pdf") {
    console.log('PDF HANDLED');

    var data = new FormData();
    var clean_uri = request.uri.replace('/s3fs-public/','');
    data.append('uri', clean_uri);
    console.log("clean URI");
    console.log(clean_uri);

    var config = {
      method: 'post',
      url: 'https://finance-admin-v2.ppr-aws2.hermes.com/api/check-pdf-access',
      headers: {
        ...data.getHeaders()
      },
      data : data
    };

    await axios(config)
        .then(function (response) {
          console.log("API RESPONSE");
          console.log(response.data);
          if (response.data && response.data[Object.keys(response.data)[0]].access == 0 ) {
            const redirectResponse = createRedirect403();
            callback(null, redirectResponse);
          }
          else {

            console.log("Pass PDF OK");
            callback(null, request);
          }

        })
        .catch(function (error) {
          console.log('error');
          console.log(error);
        });



  }

  else {
    console.log("Pass");
    callback(null, request);
  }
};

function createRedirect403() {
  const content = `
        <\!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8">
            <title>Access Denied by the Origin Server</title>
          </head>
          <body>
            <h1>Access Denied by the Origin Server</h1>
          </body>
        </html>
        `;

  const response = {
    status: "403",
    statusDescription: "Forbidden",
    body: content
  };
  return response;
}
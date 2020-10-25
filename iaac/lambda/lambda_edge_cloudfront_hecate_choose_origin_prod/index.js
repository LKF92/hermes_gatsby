exports.handler = async (event, context, callback) => {
  const request = event.Records[0].cf.request;
  console.log('--- ORIGIN EVENT ---');
  console.log(JSON.stringify(event));
  console.log('--- ORIGIN REQUEST ---');
  console.log(JSON.stringify(request));

  const s3DomainName = 'hecate-prod.s3-eu-west-1.amazonaws.com';

  if (request.origin.s3.customHeaders.mode[0].value == "switch"){

    //console.log("---- Custom Headers ----");
    //console.log(request.origin.s3.customHeaders);

    var dateFR = new Date().toLocaleString("fr-FR", {timeZone: "Europe/Paris"})
    var currentTimestamp = Date.now(dateFR);
    currentTimestamp = currentTimestamp/1000;
    if (currentTimestamp > request.origin.s3.customHeaders.switch_timestamp[0].value) {
      request.origin = {
        s3: {
          domainName: s3DomainName,
          region: 'eu-west-1',
          authMethod: 'origin-access-identity',
          path: '/' + request.origin.s3.customHeaders.switch_id[0].value + '_' + request.origin.s3.customHeaders.switch_timestamp[0].value,
          customHeaders: {}
        }
      };
    }else {
      request.origin = {
        s3: {
          domainName: s3DomainName,
          region: 'eu-west-1',
          authMethod: 'origin-access-identity',
          path: '/current',
          customHeaders: {}
        }
      };
    }

  }

  const headers = request.headers;
  if (headers['x-forwarded-host'] !== "undefined") {
    var host = headers['x-forwarded-host'][0].value;
    host = host.replace('https://', '');
    var aHost = host.split('.');
    var build_ts = aHost[0].split('-');
    if (build_ts[0] == 'prev') {
      var build_ID = build_ts[1];
      var timestamp = build_ts[2];
      if (build_ID.length > 0 && timestamp.length > 0) {
        request.origin = {
          s3: {
            domainName: s3DomainName,
            region: 'eu-west-1',
            authMethod: 'origin-access-identity',
            path: '/' + build_ID + '_' + timestamp,
            customHeaders: {}
          }
        }
      }
    }

  }

  console.log('return request');
  console.log(request.origin.s3)

  // Extract the URI from the request
  var olduri = request.uri;

  // Match any '/' that occurs at the end of a URI. Replace it with a default index
  var newuri = olduri.replace(/\/$/, '\/index.html');
  // Log the URI as received by CloudFront and the new URI to be used to fetch from origin
  console.log("Old URI: " + olduri)
  console.log("New URI: " + newuri)
  // Replace the received URI with the URI that includes the index page
  request.uri = newuri;

  callback(null, request);
}
const redirects = require('./redirects.json').map(
    ({ source, destination }) => ({
      source: new RegExp('^' + source + '$'),
      destination
    })
);

exports.handler = async(event, context, callback)  => {
  const request = event.Records[0].cf.request;
  var headers = request.headers;

  console.log('--- EVENT ---');
  console.log(JSON.stringify(event));
  console.log('--- REQUEST ---');
  console.log(JSON.stringify(request));

  // Force user redirect to /
  var last_char_uri = request.uri.slice(-1)
  if (last_char_uri !== "/" && request.uri.includes('.') === false) {
    return {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{ value: request.uri + '/' }]
      }
    };
  }

  request.headers['x-forwarded-host'] = [
    { key: 'X-Forwarded-Host', value: request.headers.host[0].value }
  ]

  for (const { source, destination } of redirects) {
    if (source.test(request.uri)) {
      return {
        status: '302',
        statusDescription: 'Found',
        headers: {
          location: [{ value: destination }]
        }
      };
    }
  }

  // list of good users
  var getAuthList = function() {
    return [
      { authUser: 'dropteam', authPass: 'pass4dropteam' },
      { authUser: 'hecate', authPass: 'h3rm3s!!!' },
    ];
  }

  // search function
  var isAuth = function(puser) {
    return (headers.authorization[0].value == 'Basic ' + Buffer.from(puser.authUser + ':' + puser.authPass).toString('base64'));
  }

  try {
    // Configure authentication
    // basic auth
    var authUsersList = getAuthList();
    // cookie
    var goodCookieName = "saberfeedback";
    var cookieFound = false;
    if (headers.cookie) {
      for (let i = 0; i < headers.cookie.length; i++) {
        if (headers.cookie[i].value.indexOf(goodCookieName) >= 0) {
          console.log("////// saberfeedback cookie detected");
          cookieFound = true;
          break;
        }
      }
    }
    if (!cookieFound) {
      if (typeof headers.authorization == 'undefined' || !authUsersList.find(isAuth)) {
        var body = 'Unauthorized';
        var response = {
          status: '401',
          statusDescription: 'Unauthorized',
          body: body,
          headers: {
            'www-authenticate': [{ key: 'WWW-Authenticate', value: 'Basic' }]
          },
        };
        console.log(">>>>>> appel callback() unauthorized avec response = " + response);
        callback(null, response);
        return;
      }
    }
    console.log(">>>>>> appel callback() try avec request = " + request);
    callback(null, request);
  }
  catch (_error) {
    console.log(">>>>>> appel callback() catch avec request = " + request);
    callback(null, request);
  }

  return callback(null, request)
};
/**
 * Allow CORS
 */

module.exports = function(req, res, next){
  res.set('Access-Control-Allow-Origin', req.headers.origin);
  res.set('Access-Control-Allow-Methods', 'GET');
  res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
  res.set('Access-Control-Allow-Credentials', true);

  // Respond OK if the method is OPTIONS
  if(req.method === 'OPTIONS') {
    return res.send(200);
  } else {
    return next();
  }
}
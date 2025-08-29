// simple logger middleware
// it will show time, method, url and how long it take
module.exports = function (req, res, next) {
  var start = Date.now();
  res.on('finish', function () {
    var time = Date.now() - start;
    console.log(new Date().toISOString(), req.method, req.url, time + "ms");
  });
  next();
};

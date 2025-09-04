// Simple logger that shows method, URL, and response time
module.exports = function (req, res, next) {
  const start = Date.now();
  res.on("finish", () => {
    const time = Date.now() - start;
    console.log(
      new Date().toISOString(),
      req.method,
      req.url,
      `${time}ms`
    );
  });
  next();
};

var connect = require('connect'),
    serveStatic = require('serve-static');

var app = connect();

app.use(serveStatic("./app"));
app.listen(process.env.PORT || 3000);

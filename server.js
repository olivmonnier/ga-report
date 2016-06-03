var browserSync = require('browser-sync');

browserSync({
  port: process.env.PORT || 3000,
  server: "app",
  files: ["app/*.html", "app/*.js", "node_modules/**/*"]
});

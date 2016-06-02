var browserSync = require('browser-sync');

browserSync({
    server: "app",
    files: ["app/*.html", "app/*.js", "node_modules/**/*"]
});

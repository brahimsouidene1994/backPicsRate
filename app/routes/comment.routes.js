const controller = require("../controllers/comment.controller");
const { authJwt } = require("../middlewares");
module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });
  
    app.post(
      "/api/comment/add",
      [authJwt.verifyToken],
      controller.createComment
    );
    app.post(
        "/api/comment/getAllCommentByPicture",
        [authJwt.verifyToken],
        controller.getAllCommentsByPicture
      );
  };
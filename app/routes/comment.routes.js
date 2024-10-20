const controller = require("../controllers/comment.controller");
const { authJwt,extractToken } = require("../middlewares");
const keycloak = require("../config/keycloak");
const getCurrentUser = require("../middlewares/getCurrentUser");

module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "Authorization, Origin, Content-Type, Accept"
      );
      next();
    });
  
    app.post(
      "/api/comment/add",
      // [authJwt.verifyToken],
      [keycloak.protect(),extractToken,getCurrentUser],
      controller.createComment
    );
    app.get(
        "/api/comment/getAllCommentByPicture/:idPicture",
        // [authJwt.verifyToken],
        [keycloak.protect(),extractToken],
        controller.getAllCommentsByPicture
      );
  };
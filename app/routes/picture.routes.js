const controller = require("../controllers/picture.controller");
const { isAdmin, extractToken } = require("../middlewares");
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
      "/api/picture/add",
      //[authJwt.verifyToken],
      [keycloak.protect(),extractToken,getCurrentUser],
      controller.createPicture
    );
    
    app.patch(
      "/api/picture/update/:id",
      //[authJwt.verifyToken],
      [keycloak.protect(),extractToken],
      controller.updatePicture
    );
    app.patch(
      "/api/picture/updatestatus/:id",
      //[authJwt.verifyToken],
      [keycloak.protect(),extractToken],
      controller.updatePictureStatus
    );

    app.delete(
      "/api/picture/delete/:id",
      //[authJwt.verifyToken],
      [keycloak.protect(),extractToken],
      controller.deletePicture
    );

    app.get(
        "/api/picture/getOnePicture/:id",
        //[authJwt.verifyToken],
        [keycloak.protect(),extractToken],
        controller.getOnePicture
      );
    
    app.get(
      "/api/picture/getOneRandomPicture",
      //[authJwt.verifyToken],
      [keycloak.protect(),extractToken,getCurrentUser],
      controller.getRandomPictureForVoting
    );
    app.get(
        "/api/picture/getAllByUser",
        //[authJwt.verifyToken],
        [keycloak.protect(),extractToken,getCurrentUser],
        controller.getAllPictures
      );
    app.get(
      "/api/picture/test-access",
      //[authJwt.verifyToken],
      [keycloak.protect()],
      controller.test
    )
    app.get(
      "/api/picture/test",
      //[authJwt.verifyToken],
      controller.test
    )
  };
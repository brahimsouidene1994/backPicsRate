const controller = require("../controllers/picture.controller");
const { isAdmin, extractToken } = require("../middlewares");
const keycloak = require("../config/keycloak");

module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });
  
    app.post(
      "/api/picture/add",
      //[authJwt.verifyToken],
      [keycloak.protect(),extractToken],
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
      "/api/picture/getOneRandomPicture/:idUser",
      //[authJwt.verifyToken],
      [keycloak.protect(),extractToken],
      controller.getRandomPictureForVoting
    );
    app.post(
        "/api/picture/getAllByUser",
        //[authJwt.verifyToken],
        [keycloak.protect(),extractToken],
        controller.getAllPictures
      );
  };
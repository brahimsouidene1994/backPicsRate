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
      [keycloak.protect(),extractToken,getCurrentUser],
      controller.createPictureFb
    );
    // app.post(
    //   "/api/picture/addFB",
    //   // [keycloak.protect(),extractToken,getCurrentUser],
    //   controller.createPictureFb
    // );
    
    app.patch(
      "/api/picture/update/:id",
      [keycloak.protect(),extractToken],
      controller.updatePicture
    );
    app.patch(
      "/api/picture/updatestatus/:id",
      [keycloak.protect(),extractToken],
      controller.updatePictureStatus
    );

    app.delete(
      "/api/picture/delete/:id",
      [keycloak.protect(),extractToken],
      controller.deletePictureFb
    );
    app.get(
        "/api/picture/getOnePicture/:id",
        [keycloak.protect(),extractToken],
        controller.getOnePicture
      );
    
    app.get(
      "/api/picture/getOneRandomPicture",
      [keycloak.protect(),extractToken,getCurrentUser],
      controller.getRandomPictureForVoting
    );
    app.get(
        "/api/picture/getAllByUser",
        [keycloak.protect(),extractToken,getCurrentUser],
        controller.getAllPictures
      );
    // app.get(
    //   "/api/picture/test-access",
    //   keycloak.protect(),
    //   extractToken,
    //   getCurrentUser,
    //   controller.testAccess
    // )
    // app.get(
    //   "/api/picture/test",
    //   controller.test
    // )
  };
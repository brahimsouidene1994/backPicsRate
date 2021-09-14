const controller = require("../controllers/picture.controller");
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
      "/api/picture/add",
      [authJwt.verifyToken],
      controller.createPicture
    );
    
    app.patch(
      "/api/picture/update/:id",
      [authJwt.verifyToken],
      controller.updatePicture
    );
    app.patch(
      "/api/picture/updatestatus/:id",
      [authJwt.verifyToken],
      controller.updatePictureStatus
    );

    app.delete(
      "/api/picture/delete/:id",
      [authJwt.verifyToken],
      controller.deletePicture
    );

    app.get(
        "/api/picture/getOnePicture/:id",
        [authJwt.verifyToken],
        controller.getOnePicture
      );
    
    app.post(
      "/api/picture/getOneRandomPicture",
      [authJwt.verifyToken],
      controller.getRandomPictureForVoting
    );
    app.post(
        "/api/picture/getAllByUser",
        [authJwt.verifyToken],
        controller.getAllPictures
      );
  };
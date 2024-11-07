const db = require("../models");
const multer = require("multer");
const path = require('path');
const fbApp = require("firebase/app");
const fbStorage = require("firebase/storage");
const fbConfig = require("../config/firebase.config");

const Picture = db.picture;
const commentController = require('./comment.controller');

const {
    UPLOAD_IMAGE_URL
} = process.env;

//Initialize a firebase application
fbApp.initializeApp(fbConfig);
// Initialize Cloud Storage and get a reference to the service
const fbStore = fbStorage.getStorage();

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "uploads/userPictures");
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now()
            + path.extname(file.originalname))
        // file.fieldname is name of the field (image)
        // path.extname get the uploaded file extension
    }
    // filename: (req, file, callback) => {
    //   callback(null, Date.now() + ".jpg");
    // },
});

const upload = multer({
    storage: storage,
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg|jpeg|)$/)) {
            // upload only png and jpg format
            return cb(new Error('Please upload a Image'))
        }
        cb(undefined, true)
    }
    // fileFilter: (req, file, callback) => {
    //   if (file.mimetype === "jpeg/jpg") callback(null, true);
    //   else callback(new Error("cannot upload File type"), false);
    // },
});

const fbUpload = multer({ storage: multer.memoryStorage() });

exports.createPicture = (req, res) => {
    const uploadResult = upload.single("photo");
    uploadResult(req, res, async function (err) {
        const { _id } = req.currentUser
        const { context, category, commentsStatus } = req.body;
        console.log(" createPicture(): data -> ");
        console.log(req.body);
        if (req.file) {
            if (!err) {
                const path = `${UPLOAD_IMAGE_URL}/uploads/userPictures/` + req.file.filename;
                const pictureToSave = new Picture({
                    category: category,
                    contextPic: context,
                    createdAt: Date.now(),
                    path: path,
                    status: true,
                    commentsStatus: commentsStatus,
                    owner: _id,
                    voters: []
                });
                try {
                    const savePicture = await pictureToSave.save();
                    res.status(200).json({
                        err: false,
                        message: "PICTURE SAVED WITH SUCCESS",
                        object: savePicture
                    });
                    console.log("savePicture -> ", savePicture);
                } catch (err) {
                    res.json({ message: err });
                };
            }
        } else {
            res.status(200).json({
                err: true,
                message: "GOOD REQUEST BUT THERE IS NO IMAGE TO UPLOAD",
            });
        }
    });
};

exports.createPictureFb = (req, res) => {
    const uploadResult = fbUpload.single("photo");
    uploadResult(req, res, async function (err) {
        const { _id } = req.currentUser
        const { context, category, commentsStatus } = req.body;
        if (req.file) {
            if (!err) {
                const metadata = {
                    contentType: req.file.mimetype,
                };

                const storageRef = fbStorage.ref(fbStore, `pictures/${_id}/${req.file.fieldname + '_' + Date.now() + path.extname(req.file.originalname)}`);

                const snapshot = await fbStorage.uploadBytesResumable(storageRef, req.file.buffer, metadata);

                const downloadURL = await fbStorage.getDownloadURL(snapshot.ref);

                const pictureToSave = new Picture({
                    category: category,
                    contextPic: context,
                    createdAt: Date.now(),
                    path: downloadURL,
                    status: true,
                    commentsStatus: commentsStatus,
                    owner: _id,
                    voters: []
                });
                try {
                    const savePicture = await pictureToSave.save();
                    res.status(200).json({
                        err: false,
                        message: "PICTURE SAVED WITH SUCCESS",
                        object: savePicture
                    });
                    console.log("savePicture -> ", savePicture);
                } catch (err) {
                    res.json({ message: err });
                };
            }
        } else {
            res.status(200).json({
                err: true,
                message: "GOOD REQUEST BUT THERE IS NO IMAGE TO UPLOAD",
            });
        }
    });
};

exports.updatePicture = async (req, res) => {
    const { contextPic, path, description, status, owner } = req.body;
    try {
        const picture = await Picture.updateOne(
            { _id: req.params.id },
            {
                $set: {
                    contextPic: contextPic,
                    description: description,
                    path: path,
                    status: status,
                    owner: owner
                }
            });
        res.status(200).json({
            err: false,
            message: "PICTURE SAVED WITH SUCCESS",
            object: picture
        });
    } catch (err) {
        res.json({ message: err });
    };
};

exports.getOnePicture = async (req, res) => {
    try {
        const picture = await Picture.findById(req.params.id);
        if (picture) res.json(picture);
        else res.json(null)
    } catch (err) {
        res.json({ message: err });
    };
};

exports.deletePicture = async (req, res) => {
    try {
        const deletedPicture = await Picture.deleteOne({ _id: req.params.id });
        commentController.deleteAllCommentOfPicture(req.params.id);
        res.json(deletedPicture);
    } catch (err) {
        res.json({ message: err });
    };
};

exports.deletePictureFb = async (req, res) => {
    try {
        const pictureId = req.params.id;

        // Validate ID
        if (!pictureId) {
            return res.status(400).json({ message: "Picture ID is required." });
        }

        // Find picture in the database
        const picture = await Picture.findById(pictureId);
        if (!picture) {
            return res.status(404).json({ message: "Picture not found." });
        }

        // Define file path in Firebase Storage
        const fileRef = fbStorage.ref(fbStore, picture.path);

        // Check if file exists in Firebase Storage
        try {
            await fbStorage.getMetadata(fileRef);
        } catch (error) {
            if (error.code === 'storage/object-not-found') {
                return res.status(404).json({ message: "File not found in Firebase Storage." });
            } else {
                console.error("Error checking file existence in Firebase Storage:", error);
                return res.status(500).json({ message: "Error accessing Firebase Storage." });
            }
        }

        // Attempt to delete the file in Firebase Storage
        try {
            await fbStorage.deleteObject(fileRef);
            console.log(`File ${picture.path} deleted successfully.`);
        } catch (error) {
            console.error("Error deleting file in Firebase Storage:", error);
            return res.status(500).json({ message: "Failed to delete file in Firebase Storage." });
        }

        // Delete the picture from the database
        const deletedPicture = await Picture.deleteOne({ _id: pictureId });
        
        // Delete associated comments
        await commentController.deleteAllCommentOfPicture(pictureId);

        // Send successful response
        return res.status(200).json({
            message: "Picture and associated comments deleted successfully.",
            deletedPicture,
        });
        
    } catch (error) {
        console.error("Error in deletePictureFb function:", error);
        return res.status(500).json({ message: "Server error occurred." });
    }
};

exports.getAllPictures = async (req, res) => {
    let pictures;
    const { _id } = req.currentUser
    try {
        const allPicturesOfUser = await Picture.find({ "owner": `${_id}` });
        if (allPicturesOfUser.length > 0) {
            pictures = allPicturesOfUser;
            res.json(pictures);
        }
        else {
            pictures = [];
            res.json(pictures);
        }

    } catch (err) {
        res.json({ message: err })
    }
};

exports.updatePictureStatus = async (req, res) => {
    const { status } = req.body;
    try {
        const picture = await Picture.updateOne(
            { _id: req.params.id },
            {
                $set: {
                    status: status,
                }
            });
        res.status(200).json({
            err: false,
            message: "PICTURE Upda WITH SUCCESS",
            object: picture
        });
    } catch (err) {
        res.json({ message: err });
    };
};

exports.getRandomPictureForVoting = async (req, res) => {
    const { _id } = req.currentUser;

    console.log("getRandomPictureOfOthers()", _id)
    try {
        const allPictureDiffOwner = await Picture.find({
            $and: [
                { "owner": { $ne: _id } },
                { "status": true },
                { "voters": { $nin: [_id] } }
            ]
        }
        );
        let randomPicture = allPictureDiffOwner[Math.floor(Math.random() * allPictureDiffOwner.length)];
        if (randomPicture) res.json(randomPicture)
        else res.json(null)
    }
    catch (err) {
        res.json({ message: err })
    }
}
exports.test = async (req, res) => {
    console.log("api test normal")
    res.json({ message: "api test normal" })
}

exports.testAccess = async (req, res) => {
    const { _id } = req.currentUser;
    console.log("api testAccess", _id)
    res.json({ message: "api testAccess" })
}

const db = require("../models");
const multer = require("multer");
const path = require('path');

const Picture = db.picture;
const commentController = require('./comment.controller');

const {
    UPLOAD_IMAGE_URL
  } = process.env;

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

exports.createPicture = (req, res) => {
    const uploadResult = upload.single("photo");
    uploadResult(req, res, async function (err) {
        const {_id} = req.currentUser
        const{context,category,commentsStatus}=req.body;
        console.log(" createPicture(): data -> ");
		console.log(req.body);
        if(req.file){
            if(!err){
                const path = `${UPLOAD_IMAGE_URL}/uploads/userPictures/` + req.file.filename;
                const pictureToSave = new Picture({
                    category : category,
                    contextPic: context,
                    createdAt : Date.now(),
                    path: path,
                    status : true,
                    commentsStatus : commentsStatus,
                    owner : _id,
					voters : []
                });
                try{
                    const savePicture = await pictureToSave.save();
                    res.status(200).json({
						err: false,
						message : "PICTURE SAVED WITH SUCCESS",
						object : savePicture
						});
                    console.log("savePicture -> ",savePicture);
                }catch(err){
                    res.json({message : err});
                };
            }
        }else{
            res.status(200).json({
                err: true,
                message: "GOOD REQUEST BUT THERE IS NO IMAGE TO UPLOAD",
            });
        }
    });
  };

exports.updatePicture = async (req, res) =>{
    const {contextPic, path,description, status, owner}= req.body;
    try{
        const  picture = await Picture.updateOne(
            {_id : req.params.id},
            {
                $set: {
                    contextPic: contextPic,
                    description : description,
                    path: path,
                    status : status,
                    owner : owner
                }
            });
         res.status(200).json({
						err: false,
						message : "PICTURE SAVED WITH SUCCESS",
						object : picture
				});
     }catch(err){
         res.json({message : err});
     };
};

exports.getOnePicture = async (req, res)=>{
    try{
       const  picture = await Picture.findById(req.params.id);
        if (picture) res.json(picture);
        else res.json(null)
    }catch(err){
        res.json({message : err});
    };
};

exports.deletePicture = async (req, res)=>{
    try{
        const deletedPicture = await Picture.deleteOne({_id : req.params.id});
        commentController.deleteAllCommentOfPicture(req.params.id);
        res.json(deletedPicture);
    }catch(err){
        res.json({message : err});
    };
};

exports.getAllPictures = async (req, res)=>{
	let pictures;
	const {_id} = req.currentUser
    try{
        const allPicturesOfUser = await Picture.find({"owner":`${_id}`});
		if(allPicturesOfUser.length > 0){
			pictures = allPicturesOfUser;
			res.json(pictures);
		}
		else{
			pictures = [];
			res.json(pictures);
		}
        
    }catch(err){
        res.json({message : err})
    }
};

exports.updatePictureStatus = async (req, res) =>{
    const {status}= req.body;
    try{
        const  picture = await Picture.updateOne(
            {_id : req.params.id},
            {
                $set: {
                    status : status,
                }
            });
         res.status(200).json({
            err: false,
            message : "PICTURE Upda WITH SUCCESS",
            object : picture
            });
     }catch(err){
         res.json({message : err});
     };
};

exports.getRandomPictureForVoting = async (req, res)=>{
	const {_id} = req.currentUser;

    console.log("getRandomPictureOfOthers()", _id)
    try{
        const allPictureDiffOwner = await Picture.find({$and:[
            { "owner" : { $ne : _id } },
            { "status" : true},
            { "voters" : { $nin : [_id]}}
        ]}
        );
        let randomPicture = allPictureDiffOwner[Math.floor(Math.random()*allPictureDiffOwner.length)];
        if(randomPicture)res.json(randomPicture)
        else res.json(null)
    }
    catch(err){
        res.json({message: err})
    }
}
exports.test = async (req, res)=>{
    console.log("api test normal")
    res.json({message: "api test normal"})
}

exports.testAccess = async (req, res)=>{
    const {_id} = req.currentUser;
    console.log("api testAccess",_id)
    res.json({message: "api testAccess"})
}
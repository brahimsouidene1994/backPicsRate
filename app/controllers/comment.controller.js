const db = require("../models");

const Comment = db.comment;
const Picture = db.picture;

exports.createComment = async (req, res) => {
    const { userId, pictureId, message , v1,v2,v3 } = req.body;
    if(!message || message === null){
        const commentToSave = new Comment({
            picture: pictureId,
            voter: userId,
            message: null,
            voteOne:v1,
            voteTwo:v2,
            voteThree:v3,
            createdAt: new Date()
        });

        try {
            const savedComment = await commentToSave.save();
            res.status(200).json({
                err: false,
                message: "Comment SAVED WITH SUCCESS",
                object: savedComment
            });
            updateAndAddNewVoter(pictureId, userId)
                .then(()=>{
                    console.log('voter added')
                })
                .catch((error)=>console.log(error));
        } catch (err) {
            res.json({ message: err });
        };
    }else{
        const commentToSave = new Comment({
            picture: pictureId,
            voter: userId,
            message: message,
            voteOne:v1,
            voteTwo:v2,
            voteThree:v3,
            createdAt: new Date()
        });
        try {
            const savedComment = await commentToSave.save();
            res.status(200).json({
                err: false,
                message: "Comment SAVED WITH SUCCESS",
                object: savedComment
            });
            updateAndAddNewVoter(pictureId, userId)
                .then(()=>{
                    console.log('voter added')
                })
                .catch((error)=>console.log(error));
        } catch (err) {
            res.json({ message: err });
        };
    }
}

exports.getAllCommentsByPicture = async (req, res)=>{
	const {idPicture} = req.body.data;
    try{
        const allComments = await Comment.find({"picture":idPicture});
        res.json(allComments);
    }catch(err){
        res.json({message : err})
    }
};

const updateAndAddNewVoter = async (idPicture, idVoter) =>{
   try{
        await Picture.updateOne(
           {_id : idPicture},
           {
               $push: {
                   voters : idVoter,
               }
           });
    }catch(err){
        console.log(err);
    };
};

exports.deleteAllCommentOfPicture = async (idPicture)=>{
    try{
        await Comment.deleteMany({picture : idPicture});
    }catch(err){
        res.json({message : err});
    };
};
const db = require("../models");

const Comment = db.comment;
const Picture = db.picture;

exports.createComment = async (req, res) => {
    const {_id} = req.currentUser
    const { pictureId, message , voteOne,voteTwo,voteThree } = req.body;
    if(!message || message === null){
        const commentToSave = new Comment({
            picture: pictureId,
            voter: _id,
            message: null,
            voteOne:voteOne,
            voteTwo:voteTwo,
            voteThree:voteThree,
            createdAt: new Date()
        });

        try {
            const savedComment = await commentToSave.save();
            res.status(200).json({
                err: false,
                message: "Comment SAVED WITH SUCCESS",
                object: savedComment
            });
            updateAndAddNewVoter(pictureId, _id)
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
            voter: _id,
            message: message,
            voteOne:voteOne,
            voteTwo:voteTwo,
            voteThree:voteThree,
            createdAt: new Date()
        });
        try {
            const savedComment = await commentToSave.save();
            res.status(200).json({
                err: false,
                message: "Comment SAVED WITH SUCCESS",
                object: savedComment
            });
            updateAndAddNewVoter(pictureId, _id)
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
	const idPicture = req.params.idPicture;
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
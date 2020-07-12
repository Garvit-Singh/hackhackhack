const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer')
const checkAuth = require('../Middleware/check-auth');
const Users = require('../Model/UserSchema');

const storage = multer.diskStorage({
    destination: function ( req, file , cb) {
        cb(null, './uploads/')
    },
    filename: function (req , file , cb) {
        cb( null , file.originalname)
    }
});

const fileFilter = (req, file ,cb ) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null,true)
    } else {
        cb(null, false)
    }
}

const upload = multer({storage: storage , limits: {
    fileSize: 1024*1024*2
    },
    fileFilter: fileFilter
})

//GET All NGO
router.get('/', (req,res,next) => {
  Users.find()
  .sort({ _id: -1})
  .exec()
  .then((docs) => {
      const response = {
          count: docs.length,
          users: docs
      };
      res.set("X-Total-Count", docs.length).status(200).json(response);
  })
  .catch((err) => {
      console.log(err);
      res.status(500).json({
          error: err
      });
  });
});

// GET NGO BY CATEGORY
router.get('/:ngoCategory', (req,res,next) => {
  const ngoCategory = req.params.ngoCategory;
  Users.find({ngoCategory})
  .exec()
  .then((docs) => {
      console.log('From Database', docs);
      if(docs.length !== 0) {
          const response = {
              count: docs.length,
              users: docs
          };
          res.set("X-Total-Count", docs.length).status(200).json(response);
      } else{
          res.status(404).json({
              message: "No Valid Entry for the given ID"
          });
      }
  })
  .catch((err) => {
      console.log(err);
      res.status(500).json({
          error: err
      });
  });    
});

// GETTING ONE NGO
router.get('/ngo/:ngoId', (req,res,next) => {
  const _id = req.params.ngoId;
  Users.findById(_id)
  .exec()
  .then((doc) => {
      console.log('From Database', doc);
      if(doc) {
          res.status(200).json({
              user: doc
          });
      } else{
          res.status(404).json({
              message: "No Valid Entry for the given ID"
          });
      }
  })
  .catch((err) => {
      console.log(err);
      res.status(500).json({
          error: err
      });
  });
});

//PATCH User
router.patch('/details/:ngoId',(req,res,next) => {
    const _id = req.params.ngoId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
        console.log(ops.propName, ops.value);
    }
    Users.update({ _id },{ $set: updateOps })
    .exec()
    .then((result) => {
        res.status(200).json({
            message: 'User Updated'
        });
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

// ADD NEW REVIEW
router.post('/reviews/:ngoId',(req,res,next)=>{
    const _id = req.params.ngoId;
    Users.findById(_id).then(result => {
        console.log(result);
        result.ngoReviews.push({
            _id: new mongoose.Types.ObjectId(),
            title: req.body.title,
            description: req.body.description
        });
        result
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                result: result
            });
        })
        .catch(err => {
            console.log('error in patch' +err);
            res.status(500).json(err);
        });
    });
})

// ADD NEW ngo_Recent_Activities
router.post('/ngo_Recent_Activities/:ngoId',checkAuth,upload.single('activityImage'),(req,res,next)=>{
  console.log(req.file)
  const _id = req.params.ngoId;
  Users.findById(_id).then(result => {
      console.log(result);
      result.ngo_Recent_Activities.push({
          _id: new mongoose.Types.ObjectId(),
          title: req.body.title,
          description: req.body.description,
          activityImage: req.file.path
      });
      result
      .save()
      .then(result => {
          console.log(result);
          res.status(201).json({
              result: result
          });
      })
      .catch(err => {
          console.log('error in patch' +err);
          res.status(500).json(err);
      });
  });
})

module.exports = router
// actual
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const Users = require('../Model/UserSchema')

router.post('/signup',(req,res,next)=> { 
  Users.find({email: req.body.email}).exec()
      .then( user => {
        // CHECKING UNIQUE ID FOR USER
          if( user.length >=1 ) {
              return res.status(422).json({message: 'User exist account is already created'})
          } else {
            // HASHING PASSWORD
              bcrypt.hash(req.body.password,10,(err,hash) => {
                      if( err ) {
                          return res.status(500).json({ error: err})
                      } else {
                        // CREATING NEW USER WITH JSON BODY
                          const user = new Users({
                              _id: new mongoose.Types.ObjectId(),
                              ngoName: req.body.ngoName,
                              email: req.body.email,
                              password: hash,
                              ngoAim: req.body.ngoAim,
                              ngoDescription: req.body.ngoDescription,
                              ngoCategory: req.body.ngoCategory,
                              contact_Info: {
                                link: req.body.contact_Info.link,
                                Address: req.body.contact_Info.Address,
                                contact_No: req.body.contact_Info.contact_No
                              },
                              ngo_Authorization_Id : req.body.ngo_Authorization_Id
                          });
                          // SAVING THAT USER
                          user.save()
                              .then( response => {
                                  console.log(response)
                                  res.status(201).json({result: response})
                              })
                              .catch( err => {
                                  res.status(500).json({ error : err })
                              })
                      }
              })
          }
      })
})
// requires email and password only
router.post('/login',(req,res,next) => {
    Users.find({email: req.body.email}).exec()
        .then( user => {
          // CHECKING IF USER EXISTS
            if( user.length < 1 ){
               return res.status(404).json({ message: 'Auth Failed'})
            } 
            // CHECKNIG PASSWORD
            bcrypt.compare(req.body.password , user[0].password , ( err , result) => {
                if( err ) {
                    return res.status(401).json({ message: 'Auth Failed'})
                }
                if( result ) {
                    const token = jwt.sign(
                    {
                      // PARAMETERS FOR TOKEN GENERATION
                        email: user[0].email,
                        userId: user[0]._id
                    },"hackathonSeCert",
                    {
                        expiresIn: "1h"
                    })
                    return res.status(200).json({ message: 'Auth Success', token: token , user : user[0]})
                }
            })
        })
        .catch( err => {
            res.status(500).json({err})
        })
})

router.delete('/:userId',(req,res,next)=> {
    Users.remove({_id: req.params.userId}).exec()
        .then( result => {
            res.status(200).json({message: 'User Deleted', user : result})
        })
        .catch( err => {
            res.status(200).json({message: 'User can not be deleted', err})
        });
})

module.exports = router
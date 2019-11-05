const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const cryptage_engine = require('../../crypt/cryptage');
const jwt = require("jsonwebtoken");
const uuid = require('uuid');


const User = require("../models/user").User;
//  route to signup
router.post("/signup", (req, res, next) => {
  // we have to encrypt our password
  let req_email = req.body.email
  let req_password = req.body.password
  let crypt_pass = cryptage_engine.encrypt(req_password)
  let req_first_name = req.body.first_name
  let req_last_name = req.body.last_name
  let req_phone_number = req.body.phone_number
  let req_birthday = req.body.birthday
  let req_about = req.body.about
  let req_cv_link = req.body.cv_link
  let req_experience = req.body.experience
  let req_location = req.body.location
  let req_projects = req.body.projects
  User.find({
      email: req.body.email
    })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(200).json({
          stat: true,
          message: "mail_exists"
        });
      } else {
        console.log("yo")
        const user = new User({
          _id: new mongoose.Types.ObjectId(),
          first_name: req_first_name,
          last_name: req_last_name,
          phone_number: req_phone_number,
          birthday: req_birthday,
          about: req_about,
          cv_link: req_cv_link,
          experience: req_experience,
          location: req_location,
          projects: req_projects,
          email: req_email,
          password: crypt_pass
        });
        user
          .save()
          .then(result => {
            console.log(result);
            res.status(200).json({
              stat: true,
              message: "user_created"
            });
          })
          .catch(err => {
            console.log(err);
            res.status(500).json({
              error: err
            });
          });
      }
    });
});


//route for auth
router.post("/login", (req, res, next) => {
  let req_email = req.body.email
  let req_password = req.body.password
  let crypt_pass = cryptage_engine.encrypt(req_password)

  User.find({
      email: req_email
    }).exec()
    .then(user => {
      console.log(user)
      if (user) {
        console.log("we have a backdata");
        //we verifie the password into the DB and the password passed into form
        if ((crypt_pass === user[0].password)) {
          let tokeni = uuid.v4();
          user[0].token = tokeni;
          user[0].save().then(r => {
            return res.status(200).json({
              stat: true,
              message: "auth_success",
              token: tokeni,
              _id: user[0]._id
            })
          }).catch(err => {
            return res.status(200).json({
              stat: false,
              message: "no_token_created"
            })
          })
        } else {
          return res.status(200).json({
            stat: false,
            message: "auth_fail"
          })
        }
      } else {
        return res.status(200).json({
          stat: false,
          message: "auth_fail"
        })
      }
    })

    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err,
        message: "auth_fail"
      });
    });

})

//route for getting all  users in the  data base
router.get("/getuser", (req, res, next) => {
  User.find()
    .select("email first_name last_name phone_number birthday about cv_link experience location projects _id")
    .exec()
    .then(result => {
      res.status(200).json({
        count: result.length,
        users: result.map(result => {
          return {
            _id: result._id,
            email: result.email,
            // password,
            first_name: result.first_name,
            last_name: result.last_name,
            phone_number: result.phone_number,
            birthday: result.birthday,
            about: result.about,
            cv_link: result.cv_link,
            experience: result.experience,
            location: result.location,
            projects: result.projects

          }
        })

      })
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    })
})

// route  for finding  by  id  users

router.get("/:userId", (req, res, next) => {
  User.findById(req.params.userId)
    //.select("email first_name last_name phone_number birthday about cv_link experience location projects _id")
    .exec()
    .then(users => {
      if (!users) {
        return res.status(404).json({
          message: "no user found"
        })
      }
      users.password = null;
      users.token = null;
      res.status(200).json({
        stat: true,
        user_found: users
      })
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    })
})

//route to delete user by id now
router.delete("/:userId", (req, res, next) => {
  User.remove({
      _id: req.params.userId
    })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "User deleted"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

// update user
router.patch("/:userId", (req, res) => {
  const id = req.params.userId;
  console.log("Updating -> " + id);
  console.log("Data -> ")
  console.log(req.body);

  User.update({
      _id: id
    }, {
      $set: req.body
    })
    .exec()
    .then(result => {
      if (result) {
        res.status(200).json({
          message: "update_success",
          //valeur: ops.value
        })
      } else {
        res.status(200).json({
          message: "err",
        })
      }


    })
    .catch(err => {
      console.log("ERROR WE GOT")
      console.log(err)
      throw err;
    })
})

module.exports = router;
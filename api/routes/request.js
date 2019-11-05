const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Offer = require("../models/offer");
const Request = require("../models/request");
const User = require("../models/user").User;

//  route for getting requests

router.get("/", (req, res, next) => {
  Request.find()
    .exec()
    .then(docs => {
      console.log(docs);
      res.status(200).json({
        message: "get_request_successful",
        requests_list: docs
      })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      })

    })
})
// route for postule offers
router.post("/:offerId", (req, res, next) => {
  let user_id = req.body.user_id;
  let user_token = req.body.user_token
  const request = new Request({
    _id: new mongoose.Types.ObjectId,
    user_id: user_id,
    offer_id: req.params.offerId,
    stat: 'open'
  })
  console.log(request);
  User.findById(user_id, (err, user) => {
    if (err) throw err
    if (user && user._id == user_id && user.token == user_token) {
      // check offer still up
      Offer.findById(req.params.offerId, (err, of ) => {
        if (err) throw err
        if ( of && of ._id == req.params.offerId) {
          // save req
          request
            .save()
            .then(result => {
              console.log(result);
              res.status(200).json({
                message: "offer_postule_successfully",
              })

            })
            .catch(err => {
              console.log(err)
              res.status(500).json({
                error: err
              });
            });
        }
      })
    } else {
      res.send({
        message: "no_valid"
      })
    }
  })
});

// getting a specific req by id
router.get("/:reqId", (req, res, next) => {
  const id = req.params.reqId;
  Request.findById(id)
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json(doc);
      } else {
        res
          .status(404)
          .json({
            message: "No valid entry found for provided ID"
          });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});
// get by user
router.get("/user/:userId", (req, res, next) => {
  const id = req.params.userId;
  Request.find({
      "user_id": id
    })
    .exec()
    .then(docs => {
      console.log("From database", docs);
      if (docs) {
        res.status(200).json({
          stat: true,
          reqs: docs
        });
      } else {
        res
          .status(404)
          .json({
            message: "No valid entry found for provided ID"
          });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

// get by company

router.get("/company/:companyId", (req, res, next) => {
  const id = req.params.companyId;
  Request.find({
      "user_id": id
    })
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          stat: true,
          reqs: docs
        });
      } else {
        res
          .status(404)
          .json({
            message: "No valid entry found for provided ID"
          });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

// update by id
router.patch("/:offerId", (req, res, next) => {
  const id = req.params.offerId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Offer.update({
      _id: id
    }, {
      $set: updateOps
    })
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.delete("/:offerId", (req, res, next) => {
  const id = req.params.offerId;
  Offer.remove({
      _id: id
    })
    .exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});


module.exports = router;
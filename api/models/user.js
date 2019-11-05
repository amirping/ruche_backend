const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var userSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  phone_number: {
    type: String
  },
  birthday: {
    type: String
  },
  about: {
    type: String
  },
  looking_for: {
    type: String
  },
  cv_link: {
    type: String
  },
  experience: {
    type: [
      {
        company_name: {
          type: String
        },
        job: {
          type: String
        },
        start_date: {
          type: String
        },
        end_date: {
          type: String
        },
        dscrp: {
          type: String
        }
      }
    ]
  },
  location: {
    type: String
  },
  projects: {
    type: [
      {
        title: {
          type: String
        },
        link: {
          type: String
        },
        date: {
          type: String
        },
        dscrp: {
          type: String
        }
      }
    ]
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  },
  password: {
    type: String,
    required: true
  },
  education: {
    type: [
      {
        degree: {
          type: String
        },
        start_date: {
          type: String
        },
        end_date: {
          type: String
        },
        dscrp: {
          type: String
        },
        instut: {
          type: String
        }
      }
    ]
  },
  skills: {
    type: [
      {
        name: {
          type: String
        },
        value: {
          type: Number
        }
      }
    ]
  },
  token: {
    type: String
  },
  title: {
    type: String
  }
});
var User = mongoose.model("user", userSchema);
module.exports = {
  User: User
};

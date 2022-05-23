const { Schema, model } = require("mongoose");

// DEFINING THE SCHEMA FOR ADMIN
const adminRegisterSchema = new Schema({
  fullName: { type: String, require: [true, "Your Full Name is required."] },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    validate: {
      validator: function (v) {
        const re =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(v).toLowerCase());
      },
      required: [true, "Email is not valid. Please enter a valid email."],
    },
  },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: [true, "Please enter your address"] },
  password: { type: String, required: [true] },
  date: { type: Date, default: Date.now },
  resetPasswordToken: { type: String, default: "" },
  resetPasswordExpires: { type: Date },
  image: { type: String },
  admin: { type: Boolean, default: false },
});

const Admin = model("Admin", adminRegisterSchema);

module.exports = Admin;

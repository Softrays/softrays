const { Schema, model } = require("mongoose");

// DEFINING THE SCHEMA
const registerSchema = new Schema(
  {
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
    nationality: {
      type: String,
      required: [true, "Please enter your nationality"],
    },
    state: {
      type: String,
      required: [true, "Please enter your state of origin"],
    },
    gender: { type: String, required: [true, "Please select a gender"] },
    qualification: {
      type: String,
      required: [true, "Please enter a qualification"],
    },
    course: { type: String, required: [true, "Please select a course"] },

    price: { type: Number, required: [true] },
    duration: { type: String, required: [true] },
    password: { type: String, required: [true] },
    date: { type: Date, default: Date.now },
    resetPasswordToken: { type: String, default: "" },
    resetPasswordExpires: { type: Date },
    image: { type: String },
    reference: { type: Schema.Types.Mixed, default: {} },
  },
  { minimize: false }
);

const Student = model("Student", registerSchema);

module.exports = Student;

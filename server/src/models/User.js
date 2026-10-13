const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      select: false,
      minlength: 8,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    picture: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

userSchema.pre("validate", function () {
  if (!this.password && !this.googleId) {
    this.invalidate("password", "A password or Google account is required.");
  }
});

module.exports = mongoose.model("User", userSchema);

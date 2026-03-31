const mongoose = require("mongoose");

const DEPARTMENTS = [
  "Automobile Engineering",
  "Biomedical Engineering",
  "Civil Engineering",
  "Computer Science and Engineering",
  "Computer Science and Engineering (AI and ML)",
  "Electrical and Electronics Engineering",
  "Electronics and Communication Engineering",
  "Instrumentation and Control Engineering",
  "Mechanical Engineering",
  "Metallurgical Engineering",
  "Production Engineering",
  "Robotics and Automation",
  "Bio Technology",
  "Fashion Technology",
  "Information Technology",
  "Textile Technology",
  "Mechanical Engineering (Sandwich)",
  "Applied Science",
  "Computer Systems and Design",
  "Applied Mathematics [2 Years]",
  "Cyber Security - Integrated [5 Years Integrated]",
  "Data Science [5 Years Integrated]",
  "Software Systems [5 Years Integrated]",
  "Theoretical Computer Science [5 Years Integrated]",
  "Fashion Design & Merchandising [5 Years Integrated]",
];

const MemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Member name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email ID is required"],
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: (v) => /^[0-9]{2}[a-zA-Z]{1,2}[0-9]{2,3}@psgtech\.ac\.in$/.test(v),
      message: (props) =>
        `${props.value} is not a valid PSG Tech email (e.g. 24z365@psgtech.ac.in)`,
    },
  },
  rollNumber: {
    type: String,
    required: [true, "Roll number is required"],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    trim: true,
    validate: {
      validator: (v) => /^[6-9]\d{9}$/.test(v),
      message: "Please enter a valid 10-digit Indian phone number",
    },
  },
});

const TeamSchema = new mongoose.Schema(
  {
    teamName: {
      type: String,
      required: [true, "Team name is required"],
      trim: true,
      unique: true,
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      enum: DEPARTMENTS,
    },
    yearOfStudy: {
      type: Number,
      required: [true, "Year of study is required"],
      min: 1,
      max: 5,
    },
    teamSize: {
      type: Number,
      required: true,
      enum: [1, 2],
    },
    members: {
      type: [MemberSchema],
      validate: {
        validator: (v) => v.length >= 1 && v.length <= 2,
        message: "Team must have 1 or 2 members",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Team", TeamSchema);
module.exports.DEPARTMENTS = DEPARTMENTS;

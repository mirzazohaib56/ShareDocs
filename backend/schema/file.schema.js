import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    title:       { type: String, default: "Untitled" },
    description: { type: String, default: "No description" },
    tags:        { type: [String], default: ["untagged"] },
    url:         { type: String, required: true },
    publicId:    { type: String, required: true },
    fileType:    { type: String },
    size:        { type: Number },
    uploadedBy:  { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("File", fileSchema);
import { Schema, model } from "mongoose";
import UserInfo from "./userDetails.js";

const requestSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "UserInfo",
    },
    documentId: {
      type: Schema.Types.ObjectId,
      ref: "PdfDetails",
    },
    content: String,
    requestStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "UserInfo",
    },
  },
  { timestamps: true }
);

export default model("Request", requestSchema);

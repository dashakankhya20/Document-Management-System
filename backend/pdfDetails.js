import mongoose from "mongoose";

const PdfDetailsSchema = new mongoose.Schema(
  {
    pdf: String,
    docName: String,
    docNumber: String,
    department: String,
    remarks: {
      type: String,
      default: "",
    },
    version: {
      type: String,
      default: "01",
    },
    accessControl: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
  },
  { collection: "PdfDetails", timestamps: true }
);

const PdfDetails = mongoose.model("PdfDetails", PdfDetailsSchema);

export default PdfDetails;

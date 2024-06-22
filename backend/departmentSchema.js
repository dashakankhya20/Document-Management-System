import { model, Schema } from "mongoose";

const departmentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    manager: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Department = model("Department", departmentSchema);
export default Department;

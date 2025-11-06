import axios from "axios";
import { API_URL } from "./constants";

export const makeAPIPrediction = async (formData) => {
  try {
    const response = await axios.post(API_URL, { ...formData });
    return { success: true, data: response.data };
  } catch (err) {
    console.error("API Error:", err);
    if (err.response) {
      return {
        success: false,
        error:
          err.response.data.detail ||
          `HTTP Error: ${err.response.status} - ${
            err.response.statusText || "No Detail"
          }`,
      };
    }
    return {
      success: false,
      error:
        "Failed to connect to the backend server (Check Docker status and Port 8800).",
    };
  }
};

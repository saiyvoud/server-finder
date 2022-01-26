import cloudinary from "../config/cloudinary.js";

const UploadImage = async (img) => {
  try {
    if (!img) return "";
    const res_upload = await cloudinary.uploader.upload(img, null, {
      public_id: `${Date.now()}`,
      resource_type: "auto",
    });
    return res_upload.url;
  } catch (err) {
      return ''
  }
};

export default UploadImage;

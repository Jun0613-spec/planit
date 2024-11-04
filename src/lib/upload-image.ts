import cloudinary from "cloudinary";

export const uploadImage = async (imageFile: File) => {
  const arrayBuffer = await imageFile.arrayBuffer();
  const b64 = Buffer.from(arrayBuffer).toString("base64");

  const dataURI = `data:${imageFile.type};base64,${b64}`;

  const res = await cloudinary.v2.uploader.upload(dataURI);

  return res.url;
};

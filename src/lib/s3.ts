import AWS from "aws-sdk";

export async function uploadToS3(file: File) {
  try {
    AWS.config.update({
      accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY,
    });

    const s3 = new AWS.S3({
      params: {
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
      },
      region: process.env.NEXT_PUBLIC_S3_REGION,
    });

    const file_key =
      "uploads/" + Date.now().toString() + file.name.replace(" ", "_");

    const params = {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
      Key: file_key,
      Body: file,
    };

    const upload = s3
      .putObject(params)
      .on("httpUploadProgress", (progress) => {
        console.log(
          "uploading...",
          (progress.loaded / progress.total) * 100 + "%"
        );
      })
      .promise();

    await upload.then(() => {
      console.log("file uploaded to S3", file_key);
    });

    return Promise.resolve({
      fileKey: file_key,
      fileName: file.name,
    });
  } catch (error) {
    console.error(error);
  }
}

export function getS3Url(file_key: string) {
  const url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_S3_REGION}.amazonaws.com/${file_key}`;
  return url;
}

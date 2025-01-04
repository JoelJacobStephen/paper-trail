import axios from "axios";

export async function uploadToS3WithPresignedUrl(file: File) {
  try {
    // Get the presigned URL
    const response = await axios.post("/api/get-upload-url", {
      filename: file.name,
    });

    const { presignedUrl, file_key } = response.data;

    // Upload the file using the presigned URL
    await axios.put(presignedUrl, file, {
      headers: {
        "Content-Type": "application/pdf",
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total!
        );
        console.log("uploading...", percentCompleted + "%");
      },
    });

    console.log("file uploaded to S3", file_key);

    return {
      fileKey: file_key,
      fileName: file.name,
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}

export function getS3Url(file_key: string) {
  const url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_S3_REGION}.amazonaws.com/${file_key}`;
  return url;
}

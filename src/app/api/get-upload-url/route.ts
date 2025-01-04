import { NextResponse } from "next/server";
import AWS from "aws-sdk";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { filename } = await req.json();

    AWS.config.update({
      accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY,
      region: process.env.NEXT_PUBLIC_S3_REGION,
    });

    const s3 = new AWS.S3();
    const file_key = `uploads/${Date.now().toString()}_${filename.replace(
      " ",
      "_"
    )}`;

    const presignedUrl = await s3.getSignedUrlPromise("putObject", {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
      Key: file_key,
      Expires: 300, // URL expires in 5 minutes
      ContentType: "application/pdf",
    });

    return NextResponse.json({
      presignedUrl,
      file_key,
    });
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return NextResponse.json(
      { error: "Error generating upload URL" },
      { status: 500 }
    );
  }
}

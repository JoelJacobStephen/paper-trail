"use client";

import axios from "axios";
import React, { useRef, useEffect } from "react";

type Props = { file_key: string };

const PDFViewer = ({ file_key }: Props) => {
  const [, setPresignedUrl] = React.useState<string | null>(null);
  const refIframe = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const getPresignedUrl = async () => {
      try {
        const response = await axios.post("/api/get-pdf-url", {
          file_key,
        });
        const url = response.data.presignedUrl;
        setPresignedUrl(url);
        if (refIframe.current) {
          refIframe.current.setAttribute("src", url);
        }
      } catch (error) {
        console.error("Error getting presigned URL:", error);
      }
    };

    if (file_key) {
      getPresignedUrl();
    }
  }, [file_key]);

  return (
    <div className="w-full h-screen">
      <iframe
        ref={refIframe}
        style={{
          width: "100%",
          height: "100vh",
          border: "none", // Remove border
          overflow: "hidden", // Prevent scrollbars
        }}
        allowFullScreen
        title="PDF Viewer"
      />
    </div>
  );
};

export default PDFViewer;

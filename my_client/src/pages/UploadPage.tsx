import { useState } from "react";
import { buttonStyle } from "../styles/savedStyles";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFile = event.target.files[0]; //there is just one file
      if (selectedFile.size > MAX_FILE_SIZE) {
        setError("File is too large. Maximum size is 10MB.");
        return;
      }
      setFile(selectedFile);
      setError(null); // Reset error when a new file is selected
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("No file selected!");
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append("file", file); //adds the selected file to the information being sent

      const response = await fetch("http://localhost:3010/csv/upload-csv", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setSuccess(true);
        console.log("File uploaded successfully!");
      } else {
        const errorData = await response.json(); // read the error message from the server
        const errorMessage = errorData.error || "Unknown error occurred."; // make sure there is a fallback
        setError(`Upload failed: ${errorMessage}`);
        console.error("Error uploading file:", errorMessage);
      }
    } catch (error) {
      setError(`Error uploading file: ${error}`);
      console.error("Error uploading file:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Upload CSV</h1>
      <div className="border-4 border-[#f1e3dd] rounded-[100px] bg-[#bccad6] w-2/4 h-72 py-20 px-10 mx-auto my-28 flex flex-col items-center justify-center space-y-10">
        <input
          className="ml-12"
          type="file"
          accept=".csv"
          onChange={handleFileChange}
        />
        {uploading && <p>Uploading...</p>}
        {success && (
          <p className="text-green-500">File uploaded successfully!</p>
        )}
        {error && <p className="text-red-500">{error}</p>}
        <button
          className={`${buttonStyle} mt-24`}
          onClick={handleUpload}
          disabled={!file || uploading}
        >
          Upload
        </button>
      </div>
    </div>
  );
}

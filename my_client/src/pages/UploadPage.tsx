import { useState } from "react";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (file) {
      console.log("Uploading:", file.name);

      // יצירת אובייקט FormData
      const formData = new FormData();
      formData.append("file", file);

      try {
        // שליחת הבקשה לשרת
        const response = await fetch("http://localhost:3010/csv/upload-csv", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          console.log("File uploaded successfully!");
        } else {
          console.error("Error uploading file:", response.statusText);
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };
  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-4">Upload CSV</h1>
      <div className=" border-4 w-2/4 h-96 p-10 justify-between">
        <input type="file" accept=".csv" onChange={handleFileChange} />
        <button
          className="bg-blue-500 text-white px-4 py-2 mt-4"
          onClick={handleUpload}
          disabled={!file}
        >
          Upload
        </button>
      </div>
    </div>
  );
}

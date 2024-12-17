const express = require("express");
const multer = require("multer"); //to work with file uploads to the server
const { processCsvFile } = require("../services/csvService");

const router = express.Router();

const upload = multer({ dest: "uploads/" }); //defines the temporary folder where uploaded files will be saved 

// upload CSV invoice file
router.post("/upload-csv", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path; //storing the path of the uploaded file (temporarily saved in the uploads folder)
    const message = await processCsvFile(filePath);//the function processes the file interprets the data and saves it to the database
    res.status(200).json({ message });
  } catch (error) {
    console.error("Error processing CSV file:", error);
    res.status(400).json({ error: error });
  }
});

module.exports = router;


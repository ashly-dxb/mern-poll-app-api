const FileUpload = require("../models/fileupload");

const express = require("express");
const router = express.Router();

// file upload
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.cwd() + "/uploaded");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// file delete
var fs = require("fs");

// ###########################################################################################
/* List of files */
router.get("/list", async (req, res) => {
  try {
    const files = await FileUpload.find().sort({ uploadedDate: -1 }).exec(); // .limit(5)
    res.send(files);
  } catch (error) {
    res.send(error);
  }
});

// ###########################################################################################
/* Details of a file */
router.get("/details/:id", async (req, res) => {
  const fileID = req.params.id;

  try {
    const fileDetails = await FileUpload.findOne({ _id: fileID }).lean().exec();
    res.send(fileDetails);
  } catch (error) {
    res.send(error);
  }
});

// ###########################################################################################
/* preview */
router.get("/preview/:filename", function (req, res) {
  res.sendFile(process.cwd() + "\\uploaded\\" + req.params.filename);
});

// ###########################################################################################
/* Download a file */
router.get("/download/:filename", async (req, res) => {
  const filePath = process.cwd() + "\\uploaded\\" + req.params.filename;

  res.download(filePath, req.params.filename, (err) => {
    if (err) {
      res.send({
        error: err,
        msg: "Error in downloading the file",
      });
    }
  });
});

// ###########################################################################################
/* upload a file */
router.post("/uploadfile", upload.array("uploadedfiles"), (req, res) => {
  // res.json({ files: req.files, desc: req.body.description });

  var fileData = new FileUpload({
    filename: req.files[0].filename,
    originalname: req.files[0].originalname,
    description: req.body.description,
  });

  fileData
    .save()
    .then((response) => {
      let responseJSON = JSON.stringify(response, (_, value) =>
        typeof value === "bigint" ? value.toString() : value
      );
      let responseJSON2 = responseJSON.replace(/\\"/g, '"');
      let responseJSON3 = JSON.parse(responseJSON2);
      res.json(responseJSON3);
    })
    .catch((error) => {
      res.send(error);
    });
});

// ###########################################################################################
/* Update a file details completely */
router.put("/modifyfull/:fileID", async (req, res) => {
  const fileID = req.params.fileID;
  const updateObj = req.body;
  console.log("PUT", updateObj);

  try {
    const fileDetails = await FileUpload.findOneAndUpdate(
      { _id: fileID },
      updateObj
    );
    res.send({ success: true });
  } catch (error) {
    res.send(error);
  }
});

// ###########################################################################################
/* Update a file desc */
router.patch("/modify/:fileID", async (req, res) => {
  console.log("START patch call");
  const fileID = req.params.fileID;
  const updateObj = req.body;
  console.log("PATCH", updateObj);

  try {
    const fileDetails = await FileUpload.findOneAndUpdate(
      { _id: fileID },
      updateObj
    );
    res.send({ success: true });
  } catch (error) {
    res.send(error);
  }

  /*
  FileUpload.findOneAndUpdate({ _id: fileID }, req.body)
    .then((response) => {
      res.send({ success: true });
    })
    .catch((error) => {
      res.send(error);
    });
    */
});

// ###########################################################################################
/* Delete a file */
router.delete("/delete/:fileID", (req, res) => {
  let fileID = req.params.fileID;
  FileUpload.findOneAndRemove({ _id: fileID })
    .then((response) => {
      fs.rmSync(process.cwd() + "/uploaded/" + response.filename, {
        force: true,
      });

      res.send({ success: true });
    })
    .catch((error) => {
      res.send(error);
    });
});
// ###########################################################################################

module.exports = router;

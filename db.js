const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const { GridFsStorage } = require('multer-gridfs-storage');
const multer = require('multer');

const dbURI = 'mongodb://localhost:27017/egzaminteoretycznydb'; // Replace with your MongoDB URI

// Connect to MongoDB
mongoose.connect(dbURI)
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

const conn = mongoose.connection;
let gfsBucket;

conn.once('open', () => {
  gfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {bucketName: "fs"});
});

// Create storage engine for multer-gridfs-storage
const storage = new GridFsStorage({
  url: dbURI,
  file: (req, file) => {
    return {
      bucketName: 'fs', // Collection name
      filename: file.originalname
    };
  }
});

const upload = multer({ storage });

module.exports = {
  mongoose,
  gfsBucket: () => gfsBucket,
  upload
};
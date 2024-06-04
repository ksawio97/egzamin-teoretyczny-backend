const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const { GridFsStorage } = require('multer-gridfs-storage');
const multer = require('multer');

const {
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  DB_NAME,
} = process.env;


const login = (() => {
  if (!DB_USER || !DB_PASSWORD)
      return '';
  return `${DB_USER}:${DB_PASSWORD}@`;
})();

// Replace with your MongoDB URI
const dbURI = `mongodb://${login}${DB_HOST || 'localhost'}:${DB_PORT || '27017'}/${DB_NAME || 'egzaminteoretycznydb'}?authSource=admin`;

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
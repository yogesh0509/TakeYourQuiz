const multer = require("multer");
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
require("dotenv").config();

let s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.S3_BUCKET_REGION
});

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'takeyourquiz',
        ACL: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, Object.assign({}, req.body));
        },
        key: function (req, file, cb) {
            cb(null, file.originalname)
        }
    }),
    limits: {
        filesize: 1024 * 1024 * 50
    },
    fileFilter: function (req, file, cb) {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        }
        else {
            cb(null, false);
        }
    }
});
// upload to local

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, '../Quiz Project/client/static/uploads/');
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.originalname);
//     }
// });

// const fileFilter = (req, file, cb) => {
//     // reject a file
//     // if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
//     //     cb(null, true);}
//     if(file.mimetype === 'application/pdf'){
//         cb(null, true);
//     }
//     else {
//         cb(null, false);
//     }
// };

// const upload = multer({
//     storage: storage,
//     limits: {
//         fileSize: 1024 * 1024 * 50
//     },
//     fileFilter: fileFilter
// });

// module.exports = upload.fields(
//     [
//         {
//             name: 'question_file',
//             maxCount: 10
//         },
//         {
//             name: 'solution_file',
//             maxCount: 10
//         },
//     ]
// );

module.exports = upload.single('question_file');

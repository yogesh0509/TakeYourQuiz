const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../Quiz Project/client/static/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    // reject a file
    // if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    //     cb(null, true);}
    if(file.mimetype === 'application/pdf'){
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 50
    },
    fileFilter: fileFilter
});

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

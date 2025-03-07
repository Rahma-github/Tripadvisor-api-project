const multer = require('multer');
const fs = require('fs')
// Multer Configuration
const storage = multer.diskStorage({
    
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const fileFilter = (_, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
        return cb(new Error('Unsupported file format!'));
    }
};

if(!fs.existsSync('uploads')){
    fs.mkdirSync('uploads');
}
const upload = multer({
     storage:storage,
     fileFilter: fileFilter
    });

module.exports = upload; 


import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    const uniqueName = uuidv4(); 
    cb(null,uniqueName + path.extname(file.originalname)); 
  },
});


const upload = multer({ storage });

export default upload;

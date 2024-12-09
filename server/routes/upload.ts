import express from 'express';
import { upload } from '../services/uploadService';
import { auth } from '../middleware/auth';

const router = express.Router();

router.post('/images', auth, upload.array('images', 5), (req, res) => {
  try {
    const files = req.files as Express.MulterS3.File[];
    const urls = files.map(file => file.location);
    res.json({ urls });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

export default router;
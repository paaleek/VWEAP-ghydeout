import { Request, Response, NextFunction } from "express";
import formidable, { File } from "formidable";
import path from "path";
import fs from "fs";

export interface RequestWithFiles extends Request {
  filePath?: string;
}

const uploadMiddleware = (fieldName: string, uploadPath: string) => {
  return (req: RequestWithFiles, res: Response, next: NextFunction) => {
    if (!req.headers["content-type"]?.startsWith("multipart/form-data;")) {
      res.status(422).json({ error: "Only accepts form-data!" });
      return;
    }

    // Resolve full directory path
    const dir = path.join(__dirname, `../public${uploadPath}`);

    // Ensure directory exists
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Configure formidable
    const form = formidable({
      uploadDir: dir,
      filename(name, ext, part, form) {
        return `${Date.now()}_${part.originalFilename}`;
      },
    });

    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error("File upload error:", err);
        return res.status(500).json({ error: "Error uploading file" });
      }

      // Extract the uploaded file info
      const uploadedFile = files[fieldName] as File[];

      if (!uploadedFile || uploadedFile.length === 0) {
        req.filePath = undefined; // No file uploaded, just continue
        return next();
      }

      // Store file path in request object
      req.filePath = `${uploadPath}/${uploadedFile[0].newFilename}`;

      // Pass request to the next middleware
      next();
    });
  };
};

export default uploadMiddleware;

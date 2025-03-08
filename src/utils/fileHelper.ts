import fs from "fs";
import path from "path";

/**
 * Deletes a file at the specified path inside the /public directory.
 * @param filePath The relative path to the file (e.g., "/profiles/1741429807160_8VJZTDeG.jpg")
 */
const deleteFile = (filePath: string) => {
  if (!filePath) return;

  // Resolve the full path to the file inside /public
  const fullPath = path.join(__dirname, `../public${filePath}`);

  // Check if file exists before deleting
  if (fs.existsSync(fullPath)) {
    fs.unlink(fullPath, (err) => {
      if (err) {
        console.error(`Failed to delete file: ${filePath}`, err);
      } else {
        console.log(`File deleted: ${filePath}`);
      }
    });
  }
};

export default deleteFile;

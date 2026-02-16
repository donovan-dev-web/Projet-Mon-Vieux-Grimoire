const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const IMAGES_DIR = path.join(__dirname, '../images');

const ensureImagesFolderExists = () => {
  if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR);
  }
};

const saveImage = async (fileBuffer, filenameBase) => {
  ensureImagesFolderExists();

  const filename = `${filenameBase}_${Date.now()}.webp`;
  const outputPath = path.join(IMAGES_DIR, filename);

  console.log('Attempting to save image at:', outputPath); // log de debug

  try {
    await sharp(fileBuffer)
      .resize({ width: 600 })
      .webp({ quality: 80 })
      .toFile(outputPath);
  } catch (err) {
    console.error('Sharp error:', err);
    throw new AppError(
      'Impossible de sauvegarder l’image',
      500,
      'IMAGE_SAVE_FAIL'
    );
  }

  console.log('Image saved successfully:', filename);
  return filename;
};

const deleteImage = (imageUrl) => {
  const filename = imageUrl.split('/images/')[1];

  if (!filename) return;

  const filePath = path.join(IMAGES_DIR, filename);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

module.exports = {
  saveImage,
  deleteImage,
};

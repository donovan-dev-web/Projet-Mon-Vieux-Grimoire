const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
const AppError = require('../utils/app-error');

const IMAGES_DIR = path.join(__dirname, '../images');

const ensureImagesFolderExists = async () => {
  try {
    await fs.mkdir(IMAGES_DIR, { recursive: true });
  } catch (err) {
    throw new AppError(
      'Impossible de créer le dossier images',
      500,
      'IMAGE_FOLDER_FAIL'
    );
  }
};

const saveImage = async (fileBuffer, filenameBase) => {
  await ensureImagesFolderExists();
  const filename = `${filenameBase}_${Date.now()}.webp`;
  const outputPath = path.join(IMAGES_DIR, filename);

  try {
    await sharp(fileBuffer)
      .resize({ width: 600 })
      .webp({ quality: 80 })
      .toFile(outputPath);
  } catch (err) {
    throw new AppError(
      'Impossible de sauvegarder l’image',
      500,
      'IMAGE_SAVE_FAIL'
    );
  }

  return filename;
};

const deleteImage = async (imageUrl) => {
  const filename = imageUrl.split('/images/')[1];
  if (!filename) return;

  const filePath = path.join(IMAGES_DIR, filename);
  try {
    await fs.unlink(filePath);
  } catch (err) {
    if (err.code !== 'ENOENT') console.error('Erreur suppression image:', err);
  }
};

module.exports = {
  saveImage,
  deleteImage,
};

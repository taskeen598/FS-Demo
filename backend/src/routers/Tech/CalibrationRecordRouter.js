const express = require('express');
const router = express.Router();
const Calibration = require('../../models/Tech/CalibrationRecordModel');
const Equipment = require('../../models/Tech/EquipmentModel');
require('dotenv').config()
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const upload = multer();
const authMiddleware = require('../../middleware/auth');
const { rgb, degrees, PDFDocument, StandardFonts } = require('pdf-lib');
router.use(authMiddleware);

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret
});

// Function to add the company logo and information to the first page
const addFirstPage = async (page, logoImage, Company) => {
  const { width, height } = page.getSize();

  const pdfDoc = await PDFDocument.create();
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const logoDims = { width: 300, height: 300 };
  const centerTextX = width / 2;
  page.drawImage(logoImage, { x: centerTextX - logoDims.width / 2, y: height - 400, width: logoDims.width, height: logoDims.height });
  // Add company name (centered)
  const companyNameText = Company.CompanyName;
  const companyNameTextWidth = (helveticaFont.widthOfTextAtSize(companyNameText, 25));
  page.drawText(companyNameText, { x: centerTextX - companyNameTextWidth / 2, y: height - 420, color: rgb(0, 0, 0), fontSize: 25 });
  // Add company contact (centered)
  const companyContactText = `Contact # ${Company.PhoneNo}`;
  const companyContactTextWidth = (helveticaFont.widthOfTextAtSize(companyContactText, 25));
  page.drawText(companyContactText, { x: centerTextX - companyContactTextWidth / 2, y: height - 450, color: rgb(0, 0, 0), fontSize: 25 });
  // Add company email (centered)
  const companyEmailText = `${Company.Email}`;
  const companyEmailTextWidth = (helveticaFont.widthOfTextAtSize(companyEmailText, 25));
  page.drawText(companyEmailText, { x: centerTextX - companyEmailTextWidth / 2, y: height - 480, color: rgb(0, 0, 0), fontSize: 25 });
};

const uploadToCloudinaryImg = (buffer) => {
  try {

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'auto' },
        (error, result) => {
          if (error) {
            reject(new Error('Failed to upload file to Cloudinary'));
          } else {
            resolve(result);
          }
        }
      );

      uploadStream.end(buffer);
    });
  } catch (error) {
    console.log('from inside of function' + error);
  }
};

// * POST route to add a Calibration Record
router.post('/addCalibration/:EquipmentId', upload.fields([{ name: 'Image' }, { name: 'exCertificate' }, { name: 'masterCertificate' }, { name: 'Certificate' }]), async (req, res) => {
  console.log(req.body);
  console.log(req.files);
  try {

    const EquipmentId = req.params.EquipmentId;
    const caliberateBy = req.user.Name

    if (!EquipmentId) {
      return res.status(404).json({ error: 'Please Provide Machine ID' });
    }

    // Get the Equipment by ID
    const equipment = await Equipment.findById(EquipmentId);

    if (!equipment) {
      return res.status(404).json({ error: 'Equipment not found' });
    }

    let ImageURL = '';
    let CertificateURL = '';
    let exCertificateURL = '';
    let masterCertificateURL = '';

    if (req.files['Image']) {
      // Get the file buffers of the uploaded image and document
      const imageBuffer = req.files['Image'][0].buffer;

      // Upload the image buffer to Cloudinary and obtain the URL
      ImageURL = await uploadToCloudinaryImg(imageBuffer).then((res) => {
        return res.secure_url;
      }).catch((err) => {
        console.log('from outside of function ' + err);
      });

    }

    if (req.files['Certificate']) {
      const fileBuffers = req.files['Certificate'][0].buffer;

      const response = await axios.get(req.user.Company.CompanyLogo, { responseType: 'arraybuffer' });
      const pdfDoc = await PDFDocument.load(fileBuffers);
      const logoImage = Buffer.from(response.data);
      const logoImageDataUrl = `data:image/jpeg;base64,${logoImage.toString('base64')}`;
      const isJpg = logoImageDataUrl.includes('data:image/jpeg') || logoImageDataUrl.includes('data:image/jpg');
      const isPng = logoImageDataUrl.includes('data:image/png');
      let pdfLogoImage;
      if (isJpg) {
        pdfLogoImage = await pdfDoc.embedJpg(logoImage);
      } else if (isPng) {
        pdfLogoImage = await pdfDoc.embedPng(logoImage);
      }
      const firstPage = pdfDoc.insertPage(0);
      addFirstPage(firstPage, pdfLogoImage, req.user.Company);
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      pdfDoc.getPages().slice(1).forEach(async (page) => {
        const { width, height } = page.getSize();
        const watermarkText = 'Powered By Feat Technology';
        const watermarkFontSize = 20;
        const watermarkTextWidth = (helveticaFont.widthOfTextAtSize(watermarkText, watermarkFontSize));
        const centerWatermarkX = width / 2 - watermarkTextWidth / 2;
        const centerWatermarkY = height / 2 + 150;
        page.drawText(watermarkText, { x: centerWatermarkX, y: centerWatermarkY, fontSize: 20, color: rgb(0, 0, 0), opacity: 0.35, rotate: degrees(-45) });
      });
      // Save the modified PDF
      const modifiedPdfBuffer = await pdfDoc.save();

      CertificateURL = await uploadToCloudinaryImg(modifiedPdfBuffer).then((res) => {
        return res.secure_url;
      }).catch((err) => {
        console.log('from outside of function ' + err);
      });
    }

    if (req.files['exCertificate']) {
      const fileBuffers = req.files['exCertificate'][0].buffer;

      const response = await axios.get(req.user.Company.CompanyLogo, { responseType: 'arraybuffer' });
      const pdfDoc = await PDFDocument.load(fileBuffers);
      const logoImage = Buffer.from(response.data);
      const logoImageDataUrl = `data:image/jpeg;base64,${logoImage.toString('base64')}`;
      const isJpg = logoImageDataUrl.includes('data:image/jpeg') || logoImageDataUrl.includes('data:image/jpg');
      const isPng = logoImageDataUrl.includes('data:image/png');
      let pdfLogoImage;
      if (isJpg) {
        pdfLogoImage = await pdfDoc.embedJpg(logoImage);
      } else if (isPng) {
        pdfLogoImage = await pdfDoc.embedPng(logoImage);
      }
      const firstPage = pdfDoc.insertPage(0);
      addFirstPage(firstPage, pdfLogoImage, req.user.Company);
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      pdfDoc.getPages().slice(1).forEach(async (page) => {
        const { width, height } = page.getSize();
        const watermarkText = 'Powered By Feat Technology';
        const watermarkFontSize = 20;
        const watermarkTextWidth = (helveticaFont.widthOfTextAtSize(watermarkText, watermarkFontSize));
        const centerWatermarkX = width / 2 - watermarkTextWidth / 2;
        const centerWatermarkY = height / 2 + 150;
        page.drawText(watermarkText, { x: centerWatermarkX, y: centerWatermarkY, fontSize: 20, color: rgb(0, 0, 0), opacity: 0.35, rotate: degrees(-45) });
      });
      // Save the modified PDF
      const modifiedPdfBuffer = await pdfDoc.save();

      exCertificateURL = await uploadToCloudinaryImg(modifiedPdfBuffer).then((res) => {
        return res.secure_url;
      }).catch((err) => {
        console.log('from outside of function ' + err);
      });
    }

    if (req.files['masterCertificate']) {
      const fileBuffers = req.files['exCertificate'][0].buffer;

      const response = await axios.get(req.user.Company.CompanyLogo, { responseType: 'arraybuffer' });
      const pdfDoc = await PDFDocument.load(fileBuffers);
      const logoImage = Buffer.from(response.data);
      const logoImageDataUrl = `data:image/jpeg;base64,${logoImage.toString('base64')}`;
      const isJpg = logoImageDataUrl.includes('data:image/jpeg') || logoImageDataUrl.includes('data:image/jpg');
      const isPng = logoImageDataUrl.includes('data:image/png');
      let pdfLogoImage;
      if (isJpg) {
        pdfLogoImage = await pdfDoc.embedJpg(logoImage);
      } else if (isPng) {
        pdfLogoImage = await pdfDoc.embedPng(logoImage);
      }
      const firstPage = pdfDoc.insertPage(0);
      addFirstPage(firstPage, pdfLogoImage, req.user.Company);
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      pdfDoc.getPages().slice(1).forEach(async (page) => {
        const { width, height } = page.getSize();
        const watermarkText = 'Powered By Feat Technology';
        const watermarkFontSize = 20;
        const watermarkTextWidth = (helveticaFont.widthOfTextAtSize(watermarkText, watermarkFontSize));
        const centerWatermarkX = width / 2 - watermarkTextWidth / 2;
        const centerWatermarkY = height / 2 + 150;
        page.drawText(watermarkText, { x: centerWatermarkX, y: centerWatermarkY, fontSize: 20, color: rgb(0, 0, 0), opacity: 0.35, rotate: degrees(-45) });
      });
      // Save the modified PDF
      const modifiedPdfBuffer = await pdfDoc.save();

      masterCertificateURL = await uploadToCloudinaryImg(modifiedPdfBuffer).then((res) => {
        return res.secure_url;
      }).catch((err) => {
        console.log('from outside of function ' + err);
      });
    }

    // Create a new Calibration record
    const calibrationRecord = new Calibration({
      Equipment: EquipmentId,
      lastCallibrationDate: new Date(Date.parse(req.body.lastDate.replace(/^"(.*)"$/, '$1'))),
      nextCallibrationDate: new Date(Date.parse(req.body.nextDate.replace(/^"(.*)"$/, '$1'))),
      CaliberateBy: caliberateBy,
      User: req.user._id,
      CaliberatDate: new Date(),
      dateType: req.body.dateType,
      callibrationType: req.body.callibrationType,
      CR: req.body.CR,
      comment: req.body.comment,
      measuredReading: {
        firstReading: req.body.firstReading,
        secondReading: req.body.secondReading,
        thirdReading: req.body.thirdReading
      },
      internal: {
        ImageURL,
        CertificateURL,
        masterCertificateURL,
      },
      external: {
        companyName: req.body.companyName,
        masterReference: req.body.masterReference,
        exCertificateURL
      }

    });

    console.log('saving this object' + calibrationRecord);

    // Save the Calibration record
    try {
      await calibrationRecord.save();
      console.log('Calliobration record saved successfully');
      res.status(200).json({ message: 'Callibration record added successfully' });
    } catch (err) {
      console.error('Error while saving the Callibration record: ', err);
      res.status(500).json({ error: 'Server Error' });
    }

  } catch (error) {
    return res.status(500).json({ error: 'Failed to add Calibration Record', message: error.message });
  }
});

// * GET All Machinery Data From MongooDB Database
router.get('/readAllCalibration', async (req, res) => {
  try {

    const callibration = await Calibration.find().populate('Equipment').populate('User');

    const callibrationsToSend = callibration.filter((Obj) => {
      if (Obj.User.Department.equals(req.user.Department)) {
        console.log('got Equal');
        return Obj
      }
    });

    res.status(201).send({ status: true, message: "The following are Callibration!", data: callibrationsToSend, });

  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Callibration', message: error.message });
  }
});

// * GET route to fetch callibration by equipment ID
router.get('/readCalibrationByEquipmentId/:equipmentId', async (req, res) => {
  try {

    const equipmentId = req.params.equipmentId;
    if (!equipmentId) {
      return res.status(404).json({ error: 'Please Provide Machine ID' });
    }

    const calibration = await Calibration.find({ equipment: equipmentId }).populate('Equipment');
    if (!calibration) {
      return res.status(404).json({ error: 'calibration not found' });
    }

    res.status(201).send({ status: true, message: "The following calibration!", data: calibration });

  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch calibration', message: error.message });
  }
});
module.exports = router;
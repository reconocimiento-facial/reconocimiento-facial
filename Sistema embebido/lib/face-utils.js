const async = require('async');
const cv = require('opencv4nodejs');
const fr = require('face-recognition').withCv(cv);
const path = require('path');
const fs = require('fs');
const recognizer = fr.AsyncFaceRecognizer();
const detector = fr.AsyncFaceDetector();
const config = require('../config');
const vCap = new cv.VideoCapture(config.CAMPORT, 1);

function loadModels() {
    const modelState = require('../models/models.json');
    recognizer.load(modelState);
}
function checkFaceByImage(pathDir){
    const faceImg = fr.loadImage(pathDir);
    return recognizer.predictBest(faceImg, unknownThreshold);
}
function addFaces(pathDir){
   return new Promise((resolve, reject) => {
        const dataPath = path.resolve(pathDir);
        const allFiles = fs.readdirSync(dataPath)
                        .map(f => path.join(dataPath, f));
        const allImgs = allFiles.map(image => fr.loadImage(image));
        let i = 0;
        const detectFace = (img, next) => {
            i++;
            detector.detectFaces(img)
            .then((faceImages) => {
                if(faceImages && faceImages[0]) {
                    fr.saveImage(pathDir + `-face/${i}.png`, faceImages[0]);
                    next();
                }
            })
            .catch((error) => {
                console.error(error);
                next();
            });
        }
        const endFaces = () => {
            console.log("Fin procesar imagenes de " + pathDir);
            resolve();
        }
        async.eachSeries(allImgs, detectFace, endFaces)
    });
}
function createModel(pathDir, classname) {
    return addFaces(pathDir)
        .then(() => {
            const dataPath = path.resolve(pathDir + '-face');
            const allFiles = fs.readdirSync(dataPath).map(f => path.join(dataPath, f));
            const allImgs = allFiles.map(image => fr.loadImage(image));
            const numJitters = 10;

            return recognizer.addFaces(allImgs, classname, numJitters)
                .then(() => {
                    const modelState = recognizer.serialize();
                    return fs.writeFileSync('./models/models.json', JSON.stringify(modelState));
                });
        });
}

function checkFaceByFrame(frame) {
    const cvImg = fr.CvImage(frame)
    const imageRgb = fr.cvImageToImageRGB(cvImg);

    return detector.detectFaces(imageRgb)
        .then((faces) => {
            if(!faces || faces.length == 0 || faces.length > 1) {
                return {className: 'unknown'};
            }
            return recognizer.predictBest(faces[0], config.unknownThreshold);
        })
}

function checkFace() {
    let frame = vCap.read();
	const intvl = setInterval(() => {
	    let otherframe = vCap.read();
	    if (otherframe.empty) {
	      vCap.reset();
	      return clearInterval(intvl);
	    }
	    const key = cv.waitKey(10);
	    done = key !== -1 && key !== 255;
	    if (done) {
	      return clearInterval(intvl);
	    }
  	}, 0);
    return checkFaceByFrame(frame);
}
module.exports = {
    createModel,
    checkFaceByImage,
    checkFaceByFrame,
    loadModels,
    addFaces,
    checkFace
}

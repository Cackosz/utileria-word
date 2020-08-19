// Helpers
const utilsDocx = require('./utils-docx');
/**
 * Obtiene las propiedades que puede tener la img
 * @param {imagen del nodo img tanto del head como de los section} image 
 */
function getProperties(image) {
    let properties = {};
    if (image) {
        if (image._attributes) {
            properties = {
                width: image._attributes.width ? image._attributes.width : 250,
                height: image._attributes.height ? image._attributes.height : 250,
                vertical: image._attributes.vertical ? image._attributes.vertical : 3000000,
                horizontal: image._attributes.horizontal ? image._attributes.horizontal : 2550000,
                flujo: 1
            }
        } else {
            properties = {
                flujo: 0,
                width: 200,
                height: 200,
            };
        }
    }
    return properties;
}
/**
 * Obtiene la imagen del docx
 * @param {documento a agregar la imagen} doc 
 * @param {imagen a agregar} images 
 */
module.exports.getImage = (doc, images) => {
    let imagen;
    if (doc && images) {
        if (images.img) {
            const properties = getProperties(images.img);
            if (images.img._text) {
                imagen = utilsDocx.addImage(doc, images.img._text, properties);
            }
        }
    }
    return utilsDocx.addParagraph(imagen);
}


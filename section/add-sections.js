

// Helpers 
const utilsDocx = require('../utils-doc/utils-docx');
const alineacion = 'justified';
const utilsTable = require('../utils-doc/utils-table');
const utilsImage = require('../utils-doc/utils-image');
const { isArray } = require('util');
const space = ' ';
/**
 * Obtiene le titulo de la seccion
 * @param {seccion del xml} section 
 */
function getTitles(section) {
    const title = section.title;
    const head = title._attributes.letter ? utilsDocx.head(title._attributes.letter) : '';
    const paragraphTitle = {
        text: title._text,
        heading: head
    }
    return paragraphTitle;
}
/**
 * Obtiene tipo de letra bold
 * @param {tag text del xml} text 
 */
function getTypeLetter(text) {
    const paragraphs = [];
    let textRun = {};
    let typeLetter = text._attributes ? utilsDocx.typeLetter(text._attributes.letter) : utilsDocx.typeLetter('');
    let subrayar = text._attributes ? utilsDocx.getUnderlines(text._attributes.underline) : utilsDocx.getUnderlines('');
    if (text._text) {
        textRun = { text: text._text.concat(space), underline: subrayar, bold: typeLetter, font: 'Arial', size: 22 };
    }
    paragraphs.push(utilsDocx.addTextRun(textRun));
    return paragraphs;
}
/**
 * Obtiene el texto que tiene cada tag
 * @param {tag text del xml} tagText 
 */
function getText(tagText) {
    const paragraph = { alignment: utilsDocx.alignment(alineacion), children: [] };
    let renglon = {};
    if (isArray(tagText)) {
        tagText.forEach(text => {
            renglon = getTypeLetter(text);
            renglon.forEach(data => {
                console.log('data', data);
                paragraph.children.push(data);
            });
        });
    } else {
        renglon = getTypeLetter(tagText);
        renglon.forEach(data => {
            console.log('data', data);
            paragraph.children.push(data);
        });
    }
    return utilsDocx.addParagraph(paragraph);
}

/**
 * Procesa la secciones del xml
 * @param {seccion del xml} section 
 * @param {documento a agregar imagen} doc 
 */
async function procesandoSeccion(section, doc) {
    const childrenPrincipal = [];
    if (section.title) {
        const paragraphTitle = getTitles(section);
        childrenPrincipal.push(utilsDocx.addParagraph(paragraphTitle));
    }
    let tagText = {};
    if (section.p) {
        if (isArray(section.p)) {
            section.p.forEach(p => {
                tagText = p.text;
                if (tagText) {
                    const paragraph = getText(tagText);
                    childrenPrincipal.push(paragraph);
                }
            });
        } else {
            tagText = section.p.text;
            if (tagText) {
                const paragraph = getText(tagText);
                childrenPrincipal.push(paragraph);
            }
        }
    }
    if (section.tables) {
        const tbl = utilsTable.generarTabla(section.tables);
        tbl.forEach(table => {
            childrenPrincipal.push(table);
        });
    }
    if (section.images) {
        childrenPrincipal.push(await utilsImage.getImage(doc, section.images));
    }
    return childrenPrincipal;
}

/**
 * Agrega una seccion
 * @param {secciones del xml} section
 * @param {documento a agregar imagenes} doc
 */
module.exports.agregarSeccion = async (section, doc) => {
    let childrenPrincipal = [];
    let executeProcess = {};
    if (section) {
        if (isArray(section)) {
            console.log('Existe varias secciones');
            for (let i = 0; i < section.length; i++) {
                executeProcess = await procesandoSeccion(section[i], doc);
                executeProcess.forEach(data => {
                    childrenPrincipal.push(data)
                });
            }
        } else {
            console.log('Solo existe una seccion');
            executeProcess = await procesandoSeccion(section, doc);
            executeProcess.forEach(data => {
                childrenPrincipal.push(data)
            });
        }
    }
    return childrenPrincipal;
}
/**
 * Genera una tabla de contenidos desde docx
 * @param {nodo document del xml} document 
 */
module.exports.agregarTablaContenido = (document) => {
    let content = {};
    if (document.tableContent) {
        if (document.tableContent.title) {
            content = utilsDocx.tableContents(document.tableContent.title)
        }
    }
    return content;
}


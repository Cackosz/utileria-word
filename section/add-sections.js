

// Helpers 
const utilsDocx = require('../utils-doc/utils-docx');
const alineacion = 'justified';
const utilsTable = require('../utils-doc/utils-table');
const utilsImage = require('../utils-doc/utils-image');
const { isArray } = require('util');
const space = ' ';


function getTitles(section) {
    const title = section.title;
    const head = title._attributes.letter ? utilsDocx.head(title._attributes.letter) : '';
    const paragraphTitle = {
        text: title._text,
        heading: head
    }
    return paragraphTitle;
}

function getTypeLetter(text) {
    const paragraphs = [];
    let textRun = {};
    let typeLetter = text._attributes ? utilsDocx.typeLetter(text._attributes.letter) : utilsDocx.typeLetter('');
    if (text._text) {
        textRun = { text: text._text.concat(space), bold: typeLetter, font: 'Arial', size: 22 };
    }
    paragraphs.push(utilsDocx.addTextRun(textRun));
    return paragraphs;
}

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
        const table = utilsTable.generarTabla(section.tables);
        table.forEach(table => {
            childrenPrincipal.push(table);
        });
    }
    if (section.images) {
        childrenPrincipal.push(await utilsImage.getImage(doc, section.images));
    }
    return childrenPrincipal;
}

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

module.exports.agregarTablaContenido = (table) => {
    let content = {};
    if (table.tableContent) {
        if (table.tableContent.title) {
            content = utilsDocx.tableContents(table.tableContent.title)
        }
    }
    return content;
}


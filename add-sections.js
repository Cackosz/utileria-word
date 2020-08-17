

const utilsDocx = require('./utils-docx');
const space = ' ';
const { isArray } = require('util');
const alineacion = 'justified';

function getTitles(section) {
    const title = section.title;
    const head = title._attributes.letter === 'title' ? utilsDocx.head(title._attributes.letter) : '';
    const paragraphTitle = {
        text: title._text,
        heading: head
    }
    return paragraphTitle;
}

function getTypeLetter(text) {
    const paragraphs = [];
    let typeLetter = text._attributes ? utilsDocx.typeLetter(text._attributes.letter) : utilsDocx.typeLetter('');
    let textRun = { text: text._text.concat(space), bold: typeLetter, font: 'Arial', size: 22};
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

function procesandoSeccion(section) {
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
    return childrenPrincipal;
}

module.exports.agregarSeccion = (section) => {
    let childrenPrincipal = [];
    let executeProcess = {};
    if (section) {
        if (isArray(section)) {
            console.log('Existe varias secciones');
            for (let i = 0; i < section.length; i++) {
                executeProcess = procesandoSeccion(section[i]);
                executeProcess.forEach(data => {
                    childrenPrincipal.push(data)
                });
            }
        } else {
            console.log('Solo existe una seccion');
            executeProcess = procesandoSeccion(section);
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


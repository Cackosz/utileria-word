const utilsDocx = require('./utils-docx');
const utilsTable = require('./utils-table');
const defaultHead = require('./default-header');

function getHeaderFromXMl(document, img) {
    let tables = {};
    if (document) {
        if (document.head) {
            tables = utilsTable.generarTabla(document.head);
        }
    }
    return tables;
}

function getFooterFromXMl(document) {
    let tables = {};
    if (document) {
        if (document.foot) {
            tables = utilsTable.generarTabla(document.foot);
        }
    }
    return tables;
}

function getHeader(document, doc) {
    let children = [];
    let getTables = getHeaderFromXMl(document);
    if (Object.keys(getTables).length === 0) {
        children.push(defaultHead.defaultHeader());
    } else {
        getTables.forEach(table => {
            children.push(utilsDocx.addParagraph({ text: ' ', children: [table] }));
        });
    }
    if (document.head.img) {
        const img = utilsDocx.defaultImg(doc, document.head.img._text);
        children.push(utilsDocx.addParagraph({ children: [img] }));
    }
    const header = {
        default: utilsDocx.addHeader({
            children
        }),
    };
    return header;
}

function getFooter(document) {
    let children = [];
    let getTables = getFooterFromXMl(document);
    if (Object.keys(getTables).length === 0) {
        children.push(defaultHead.defaultHeader());
    } else {
        getTables.forEach(table => {
            children.push(utilsDocx.addParagraph({ text: ' ', children: [table] }))
        });
    }
    const footer = {
        default: utilsDocx.addFooter({
            children
        }),
    };
    return footer;
}

module.exports.getHeaders = (data, headers, doc) => {
    let result = {};
    if (data) {
        result = {
            headers: getHeader(headers, doc) ? getHeader(headers, doc) : '',
            footers: getFooter(headers) ? getFooter(headers) : '',
            children: data
        }
    }
    return result;
}

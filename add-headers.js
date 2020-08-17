const utilsDocx = require('./utils-docx');
const utilsTable = require('./add-table');

function defaultHeader() {
    const defaults = utilsDocx.addParagraph({
        children: [
            utilsDocx.addTextRun("Coin Cloud "),
            utilsDocx.addTextRun({ children: ["Número de página: ", utilsDocx.getPageNumber()], }),
            utilsDocx.addTextRun({ children: [" hasta ", utilsDocx.getTotalPages()] })
        ]
    })
    return defaults;
}

function getHeaderFromXMl(document) {
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
function getHeader(document) {
    let children = [];
    let getTables = getHeaderFromXMl(document);
    if (Object.keys(getTables).length === 0) {
        children.push(defaultHeader());
    } else {
        getTables.forEach(table => {
            children.push(utilsDocx.addParagraph({ text: ' ', children: [table] }));
        });
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
        children.push(defaultHeader());
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

module.exports.getHeaders = (data, headers) => {
    let result = {};
    if (data) {
        result = {
            headers: getHeader(headers) ? getHeader(headers) : '',
            footers: getFooter(headers) ? getFooter(headers) : '',
            children: data
        }
    }
    return result;
}

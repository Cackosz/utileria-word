const { isArray } = require('util');
const utilsDocx = require('./utils-docx');
const defaultHead = require('./default-header');
const space = ' ';

function getAtributosCell(attr, children) {
    let objCell = {};
    if (attr) {
        objCell = {
            children: children,
            margins: {
                top: attr.top ? attr.top : '',
                bottom: attr.bottom ? attr.bottom : '',
                left: attr.left ? attr.left : '',
                right: attr.right ? attr.right : '',
            },
            columnSpan: attr.columnSpan ? attr.columnSpan : '',
            rowSpan: attr.rowSpan ? attr.rowSpan : '',
        }
    }
    return objCell;
}

function getTableCell(cell) {
    if (Object.entries(cell).length !== 0) {
        const childrenCell = [];
        if (cell.text._text) {
            if (cell._attributes) {
                if (cell._attributes.pages) {
                    childrenCell.push(defaultHead.defaultHeader());
                } else {
                    childrenCell.push(utilsDocx.addParagraph(cell.text._text));
                }
                const tableCell = getAtributosCell(cell._attributes, childrenCell);
                console.log('tableCell', tableCell)
                return utilsDocx.generateTableCell(tableCell, cell._attributes.width);
            } else {
                childrenCell.push(utilsDocx.addParagraph(cell.text._text));
                return utilsDocx.generateTableCell({ children: childrenCell });
            }
        }

    }
};

function getRow(row) {
    if (row) {
        const childrenRows = [];
        if (isArray(row.cell)) {
            for (let j = 0; j < row.cell.length; j++) {
                childrenRows.push(getTableCell(row.cell[j]));
            };
        } else if (row.cell) {
            childrenRows.push(getTableCell(row.cell));
        }
        return utilsDocx.generateTableRow(childrenRows);
    }
};

function agregarTabla(tableXml) {
    const rowsTable = [];
    let table = {};
    if (isArray(tableXml.row)) {
        for (let i = 0; i < tableXml.row.length; i++) {
            rowsTable.push(getRow(tableXml.row[i]));
            console.log('rowsTable', rowsTable);
        }
    } else if (tableXml.row) {
        rowsTable.push(getRow(tableXml.row));
    }
    if (rowsTable.length > 0) {
        if (tableXml._attributes) {
            table = utilsDocx.generateTable(rowsTable, tableXml._attributes);
        } else {
            table = utilsDocx.generateTable(rowsTable);
        }

    }
    return table;
};

function recorrerTablas(tablesXml) {
    let table = [];
    if (isArray(tablesXml.table)) {
        console.log('Entro a recorrer varias tablas', tablesXml);
        tablesXml.table.forEach(tableXml => {
            table.push(agregarTabla(tableXml));
        });
    } else {
        console.log('Entro a recorrer solo una tabla', tablesXml)
        table.push(agregarTabla(tablesXml.table));
    }
    return table;
};

function buildTable(tablesXml) {
    console.log('tablesXml')
    let table = {};
    if (tablesXml) {
        table = recorrerTablas(tablesXml)
    }
    return table;
};

module.exports.generarTabla = (tables) => {
    const table = buildTable(tables);
    const children = [];
    if (table) {
        table.forEach(table => {
            children.push(utilsDocx.addParagraph({
                text: space,
                children: [table]
            }));
        });
    }
    return children;
}
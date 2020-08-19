// Helpers
const { isArray } = require('util');
const utilsDocx = require('./utils-docx');
const defaultHead = require('./default-header');
const space = ' ';
/**
 * Obtiene las propiedades de la celda
 * @param {propiedades de la celda} attr 
 * @param {informacion de la celda} children 
 */
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
/**
 * Genera la celda de la tabla desde docx
 * @param {celda a agregar} cell 
 */
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
                return utilsDocx.generateTableCell(tableCell, cell._attributes.width);
            } else {
                childrenCell.push(utilsDocx.addParagraph(cell.text._text));
                return utilsDocx.generateTableCell({ children: childrenCell });
            }
        }

    }
};
/**
 * Genera una fila desde docx
 * @param {fila de la tabla} row 
 */
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
/**
 * Agrega una tabla
 * @param {tabla del xml ya sea del head, footer o section} tableXml 
 */
function agregarTabla(tableXml) {
    const rowsTable = [];
    let table = {};
    if (isArray(tableXml.row)) {
        for (let i = 0; i < tableXml.row.length; i++) {
            rowsTable.push(getRow(tableXml.row[i]));
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
/**
 * Recorre todas las tablas de un arreglo de tables
 * @param {tablas encontrado en caso de ser arreglo} tablesXml 
 */
function recorrerTablas(tablesXml) {
    let table = [];
    if (isArray(tablesXml.table)) {
        tablesXml.table.forEach(tableXml => {
            table.push(agregarTabla(tableXml));
        });
    } else {
        table.push(agregarTabla(tablesXml.table));
    }
    return table;
};
/**
 * Construye la tabla
 * @param {tablas del xml} tablesXml 
 */
function buildTable(tablesXml) {
    let table = {};
    if (tablesXml) {
        table = recorrerTablas(tablesXml)
    }
    return table;
};
/**
 * Genera las tablas del xml al documento
 * @param {tablas del xml} tables 
 */
module.exports.generarTabla = (tables) => {
    const children = [];
    if (tables) {
        const table = buildTable(tables);
        if (table) {
            table.forEach(table => {
                children.push(utilsDocx.addParagraph({
                    text: space,
                    children: [table]
                }));
            });
        }
    }
    return children;
}
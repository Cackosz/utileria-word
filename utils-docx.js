const docx = require('docx');
const fs = require('fs');
module.exports.addTextRun = (obj) => {
    if (!obj) {
        console.log('Ocurrio un error en agregar un TextRun desde docx');
        return null;
    }
    return new docx.TextRun(obj);
}

module.exports.addParagraph = (paragraph) => {
    if (!paragraph) {
        console.log('Ocurrio un error en agregar un Paragraph desde docx');
        return null;
    }
    return new docx.Paragraph(paragraph);
}

module.exports.alignment = (alinear) => {
    let alineacion = {};
    if (alinear) {
        if (alinear.toUpperCase() === 'JUSTIFIED') {
            alineacion = docx.AlignmentType.JUSTIFIED;
        }
    }
    return alineacion;
}

module.exports.head = (type) => {
    let encabezado = {};
    if (type) {
        if (type === 'title') {
            encabezado = docx.HeadingLevel.HEADING_1;
        }
    }
    return encabezado;
}

module.exports.typeLetter = (letter) => {
    let type = false;
    if (letter) {
        if (letter === 'bold') {
            type = true
        }
    }
    return type;
};

module.exports.generateTableCell = (childrenCell, attr) => {
    let respuesta = {};
    if (!childrenCell) {
        console.log('Error en generar tables cell desde docx');
        return null;
    }
    if (attr) {
        childrenCell.width = {
            size: attr.width,
            type: docx.WidthType.DXA,
        }
        return new docx.TableCell(childrenCell);
    } else {
        return new docx.TableCell(childrenCell);
    }
}

module.exports.generateTableRow = (childrenRows) => {
    if (!childrenRows) {
        console.log('Errir en generar tables row desde docx')
    }
    return new docx.TableRow({ children: childrenRows })
}
module.exports.generateTable = (rowsTable, attr) => {
    let respuesta = {};
    if (!rowsTable) {
        console.log('Error en generar tabla desde docx');
        return null;
    }
    if (attr) {
        respuesta = new docx.Table({
            rows: rowsTable, width: {
                size: attr.width,
                type: docx.WidthType.DXA,
            }
        });
    } else {
        respuesta = new docx.Table({
            rows: rowsTable
        });
    }
    return respuesta;
}

module.exports.addHeader = (children) => {
    if (!children) {
        console.log('No se agregaron childrens al encabezado docx');
        return null;
    }
    return new docx.Header(children);
};

module.exports.addFooter = (children) => {
    if (!children) {
        console.log('No se agregaron childrens al footer docx');
        return null;
    }
    return new docx.Footer(children);
}

module.exports.getPageNumber = () => {
    return docx.PageNumber.CURRENT;
}

module.exports.getTotalPages = () => {
    return docx.PageNumber.TOTAL_PAGES;
}

module.exports.getPageNumberFormat = () => {
    return docx.PageNumberFormat.DECIMAL;
}
module.exports.createDocument = (documento) => {
    if (!documento) {
        console.log('Ocurrio un error en crear el documento desde docx');
        return new docx.Document();
    }
    // Crear informacion del documento
    const doc = {
        title: documento.title._text,
        description: documento.description._text,
        revision: documento.revision._text,
    };
    return new docx.Document(doc);
}

module.exports.tableContents = (titulo) => {
    console.log('titulo', titulo)
    if (!titulo) {
        console.log('Ocurrio un error al generar tabla de contenido desde docx');
        return null;
    }
    const info = {
        hyperlink: true,
        headingStyleRange: "1-5",
    }
    return new docx.TableOfContents(titulo._text, info);
}

module.exports.generacionDoc = async (doc) => {
    // Se genera el documento
    await docx.Packer.toBuffer(doc).then((buffer) => {
        fs.writeFileSync("SAR-test-node.docx", buffer);
    }).catch((err) => {
        console.log('Ocurrio un error en generar doc', err);
    });
}

module.exports.generacionDocBase64 = async (doc) => {
    const response = await docx.Packer.toBase64String(doc).then((string) => {
        return string;
    }).catch((err) => {
        console.log('Error en obtener el base64', err);
    });
    return response;
}
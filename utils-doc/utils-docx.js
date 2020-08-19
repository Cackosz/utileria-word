const docx = require('docx');
const fs = require('fs');
const atob = require('atob');
/**
 * Agrega un nuevo TextRun
 * @param {Objeto para crear textRun} obj 
 */
module.exports.addTextRun = (obj) => {
    if (!obj) {
        console.log('Ocurrio un error en agregar un TextRun desde docx');
        return null;
    }
    return new docx.TextRun(obj);
}
/**
 * Agrega un nuevo parrafo
 * @param {Objeto para agregar como parrafo} paragraph 
 */
module.exports.addParagraph = (paragraph) => {
    if (!paragraph) {
        console.log('Ocurrio un error en agregar un Paragraph desde docx');
        return null;
    }
    return new docx.Paragraph(paragraph);
}
/**
 * Realiza una alineación solo sera justificada
 * @param {Tipo de alineación} alinear 
 */
module.exports.alignment = (alinear) => {
    let alineacion = {};
    if (alinear) {
        if (alinear.toUpperCase() === 'JUSTIFIED') {
            alineacion = docx.AlignmentType.JUSTIFIED;
        }
    }
    return alineacion;
}
/**
 * Asigna el tipo de header para cada title
 * @param {tipo de header} type 
 */
module.exports.head = (type) => {
    let encabezado = {};
    if (type) {
        switch (type) {
            case 'title':
                encabezado = docx.HeadingLevel.HEADING_1;
                break;
            case 'title2':
                encabezado = docx.HeadingLevel.HEADING_2;
                break;
            case 'title3':
                encabezado = docx.HeadingLevel.HEADING_3;
                break;
            case 'subtitle4':
                encabezado = docx.HeadingLevel.HEADING_4;
                break;
            case 'subtitle5':
                encabezado = docx.HeadingLevel.HEADING_5;
                break;
            default:
                encabezado = docx.HeadingLevel.HEADING_6;
                break;
        }
    }
    return encabezado;
}
/**
 * Asigna bold al texto
 * @param {Atributo que llega del tag text como 'bold'} letter 
 */
module.exports.typeLetter = (letter) => {
    let type = false;
    if (letter) {
        if (letter === 'bold') {
            type = true
        }
    }
    return type;
};
/**
 * Agrega una celda a una tabla
 * @param {Celdas a agregar} childrenCell 
 * @param {Propiedades de la celd} attr 
 */
module.exports.generateTableCell = (childrenCell, attr) => {
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
/**
 * Agrega una fila a una tabla
 * @param {Filas de la tabla} childrenRows 
 */
module.exports.generateTableRow = (childrenRows) => {
    if (!childrenRows) {
        console.log('Errir en generar tables row desde docx')
    }
    return new docx.TableRow({ children: childrenRows })
}
/**
 * Agrega una tabla
 * @param {Filas a agregar a una tabla} rowsTable 
 * @param {Propiedades de la tabla} attr 
 */
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
/**
 * Agrega header al documento
 * @param {Parrafos a agregar al header} children 
 */
module.exports.addHeader = (children) => {
    if (!children) {
        console.log('No se agregaron childrens al encabezado docx');
        return null;
    }
    return new docx.Header(children);
};
/**
 * Agrega footer al documento
 * @param {Parrafos a agregar al footer} children 
 */
module.exports.addFooter = (children) => {
    if (!children) {
        console.log('No se agregaron childrens al footer docx');
        return null;
    }
    return new docx.Footer(children);
}
/**
 * Obtiene el numero página
 */
module.exports.getPageNumber = () => {
    return docx.PageNumber.CURRENT;
}
/**
 * Obtiene le total de paginas
 */
module.exports.getTotalPages = () => {
    return docx.PageNumber.TOTAL_PAGES;
}
/**
 * Agrega una imagen al documento
 * @param {Documento a agregar la imagen} doc 
 * @param {Imagen del xml} imageBase64Data 
 * @param {Propiedades de la imagen} properties 
 */
module.exports.addImage = (doc, imageBase64Data, properties) => {
    if (!doc && imageBase64Data && properties) {
        console.log('Ocurrio un error en agrega la img desde docx');
        return null;
    }
    let image = {};
    if (properties.flujo === 0) {
        image = docx.Media.addImage(doc, Uint8Array.from(atob(imageBase64Data), c => c.charCodeAt(0)), parseFloat(properties.width), parseFloat(properties.height));
    } else {
        const ancho = parseInt(properties.width);
        const altura = parseInt(properties.height);
        image = docx.Media.addImage(doc, Uint8Array.from(atob(imageBase64Data), c => c.charCodeAt(0)), ancho, altura, {
            floating: {
                horizontalPosition: {
                    offset: parseFloat(properties.horizontal),
                },
                verticalPosition: {
                    offset: parseFloat(properties.vertical),
                },
                // Se queda por default
                wrap: {
                    type: docx.TextWrappingType.TOP_AND_BOTTOM,
                    side: docx.TextWrappingSide.BOTH_SIDES,
                },
            },
        });
    }
    return image;
}
/**
 * 
 * @param {Documento a agregar imagen} doc 
 * @param {Imagen del xml} img 
 */
module.exports.defaultImg = (doc, img) => {
    const image1 = docx.Media.addImage(doc, Uint8Array.from(atob(img), c => c.charCodeAt(0)), 60, 50, {
        floating: {
          horizontalPosition: {
            offset: 1500000,
          },
          verticalPosition: {
            offset: 480000,
          },
        },
      });
      return image1;
}/**
 * Genera un nuevo documento
 * @param {Propiedades del documento del xml} documento 
 */
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
/**
 * Agrega una tabla de contenido
 * @param {Titulo de la tabla de contenido} titulo 
 */
module.exports.tableContents = (titulo) => {
    if (!titulo) {
        console.log('Ocurrio un error al generar tabla de contenido desde docx');
        return null;
    }
    const info = {
        hyperlink: true,
        headingStyleRange: "1-6",
    }
    return new docx.TableOfContents(titulo._text, info);
}
/**
 * Genera el documento y lo guarda
 * @param {Documento a generar} doc 
 */
module.exports.generacionDoc = async (doc) => {
    // Se genera el documento
    await docx.Packer.toBuffer(doc).then((buffer) => {
        fs.writeFileSync("SAR-test-node.docx", buffer);
    }).catch((err) => {
        console.log('Ocurrio un error en generar doc', err);
    });
}
/**
 * Genera documento en base64
 * @param {Documento a generar eb base64} doc 
 */
module.exports.generacionDocBase64 = async (doc) => {
    const response = await docx.Packer.toBase64String(doc).then((string) => {
        return string;
    }).catch((err) => {
        console.log('Error en obtener el base64', err);
    });
    return response;
}
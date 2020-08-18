// Modulos
const utilsDoc = require('./utils-docx');
const utilsSection = require('./add-sections');
const utilsTable = require('./add-table');
const utilsXml = require('./read-xml');
const utilsHeaders = require('./add-headers');

module.exports.hello = async event => {
  // XML  de prueba desde string 
  // const xmlTest = '<?xml version="1.0"?><document><tableContent><title>Mi tabla de contenido</title></tableContent><doc><title>Documento Ejemplo SAR</title><description>Este es un documento de prueba</description><revision>10</revision></doc><section><title letter="title">What is Lorem Ipsum?</title><p><text letter="bold">Inicia parte 1</text></p></section></document>';
  // Abrir archivo xml
  const jsonData = utilsXml.readXml('');
  if (!jsonData) {
    console.log('Ocurrio un error leer el xml');
    return null;
  }
  // Crear información del documento
  let doc = {};
  if (jsonData.document.doc) {
    doc = utilsDoc.createDocument(jsonData.document.doc);
  } else {
    doc = utilsDoc.createDocument();
  }
  // Se valida que exista doc
  if (!doc) {
    console.log('error en la creación del documento');
    return null;
  }
  // Se agrega una tabla de contenido
  const tableContent = utilsSection.agregarTablaContenido(jsonData.document, doc);
  doc.addSection({ children: [tableContent] });
  // Se agrega una sección o secciones dependiendo el xml con encabezados
  const childrenPrincipal = utilsSection.agregarSeccion(jsonData.document.section);
  doc.addSection(utilsHeaders.getHeaders(childrenPrincipal, jsonData.document.headers));
  // // Ejecutar tabla basica en nueva página
  // const table = utilsTable.generarTabla(jsonData.document.tables);
  // doc.addSection(utilsHeaders.getHeaders(table, jsonData.document.headers));
  // Se genera el doc
  await utilsDoc.generacionDoc(doc);
  // Se genera documento en base64
  const docBase64 = await utilsDoc.generacionDocBase64(doc);
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        docBase64: docBase64,
      },
      null,
      2
    ),
  };
};

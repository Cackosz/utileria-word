// Helpers
const utilsDocx = require('./utils-doc/utils-docx');
const utilsXml = require('./xml/read-xml');
const utilsHeaders = require('./utils-doc/utils-headers');
// Seccion a agregar
const section = require('./section/add-sections');


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
    doc = utilsDocx.createDocument(jsonData.document.doc);
  } else {
    doc = utilsDocx.createDocument();
  }
  // Se valida que exista doc
  if (!doc) {
    console.log('error en la creación del documento');
    return null;
  }
  // Se agrega una tabla de contenido
  
  const tableContent = section.agregarTablaContenido(jsonData.document, doc);
  doc.addSection({ children: [tableContent] });
  // Se agrega una sección o secciones dependiendo el xml con encabezados
  const childrenPrincipal = await section.agregarSeccion(jsonData.document.section, doc);
  console.log('Información a colocar en el documento', childrenPrincipal);
  doc.addSection(await utilsHeaders.getHeaders(childrenPrincipal, jsonData.document.headers, doc));
  // Se genera el doc
  await utilsDocx.generacionDoc(doc);
  // Se genera documento en base64
  const docBase64 = await utilsDocx.generacionDocBase64(doc);
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

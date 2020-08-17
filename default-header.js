const utilsDocx = require('./utils-docx');
module.exports.defaultHeader = () => {
    const defaults = utilsDocx.addParagraph({
        children: [
            utilsDocx.addTextRun({ children: ["Page ", utilsDocx.getPageNumber()], font: 'Arial' }),
            utilsDocx.addTextRun({ children: [" of ", utilsDocx.getTotalPages()], font: 'Arial' })
        ]
    })
    return defaults;
}
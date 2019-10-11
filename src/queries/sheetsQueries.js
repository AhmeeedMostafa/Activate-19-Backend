const GoogleSpreadSheet = require('google-spreadsheet');
const { promisify } = require('util');

const chooseWorksheet = (worksheets, lc) => {
    let n = -1;
    worksheets.some(worksheet => {
        n++;
        return worksheet.title.toLowerCase() === lc.toLowerCase()
    });
    return worksheets[n];
}

const updateOnSpreadsheet = async (lc, status, documentId) => {
    const doc = new GoogleSpreadSheet('12zWd4QELoNX63KoVrjftFTEKBEUXj8KfrcfgYILp1pQ');
    await promisify(doc.useServiceAccountAuth)(creds);
    const info = await promisify(doc.getInfo)();

    const sheet = chooseWorksheet(info.worksheets, lc);
    const rows = await promisify(sheet.getRows)({
        query: `documentid = ${documentId}`
    });
    rows[0].status = status;
    rows[0].save();
};

module.exports = updateOnSpreadsheet;
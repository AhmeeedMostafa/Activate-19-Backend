const GoogleSpreadSheet = require('google-spreadsheet');
const { promisify } = require('util');

const creds = {
    type: process.env.type,
    project_id: process.env.project_id,
    private_key_id: process.env.private_key,
    private_key: process.env.private_key.replace(/\\n/g, '\n'),
    client_email: process.env.client_email,
    client_id: process.env.client_id,
    auth_uri: process.env.auth_uri,
    token_uri: process.env.token_uri,
    auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
    client_x509_cert_url: process.env.client_x509_cert_url
};

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
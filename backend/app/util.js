// import { Parser } from 'json2csv';
const {Parser} = require('json2csv')

const downloadResource = (res, fileName, fields, data) => {
  const json2csv = new Parser({ fields });
  const csv = json2csv.parse(data);
  res.setHeader('Content-disposition', 'attachment; filename=' + fileName);
  res.header('Content-Type', 'text/csv');
  return res.send(csv);
}

module.exports = downloadResource
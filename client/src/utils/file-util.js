
export async function parseXLS(file) {
    return new Promise((resolve, reject) => {
        var reader = new FileReader();
        reader.onload = function (e) {
            var data = e.target.result;
            var workbook = XLSX.read(data, {
                type: 'binary'
            });


            var xlsRows = workbook.SheetNames.reduce((acc, sheetName) => {
                var rows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                return acc.concat(rows);
            }, []);

            resolve(xlsRows);

        };

        reader.onerror = reject;

        reader.readAsBinaryString(file);
    });
};
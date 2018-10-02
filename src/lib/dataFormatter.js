export function formatDataForReactAggrid(input) {
    const data = input;
    var output = {columnDefs:[],rowData:[]};
    var curRow = [];
    var rows = [];
    var columns = [];
    var fieldCount = 0;
    if(data.length>0){
        data[0].forEach(function(d) {
            columns.push({headerName: d, field: "field"+fieldCount++, editable:true});
        })
    }
    if(columns.length>0) {
        for (var i = 1; i < data.length; i++) {
            curRow = {};
            var count = 0;
            data[i].forEach(function (d) {
                curRow[columns[count].field] = d;
                count++;
            });
            if (curRow != {}) {
                rows.push(curRow);
            }
        }
    } else {
        alert('The specific sheet does not provide column names in the first row. Therefore, it can\'t be proccessed');
    }
    output={columnDefs:columns, rowData:rows};
    return (output);
};
export function formatDataForXLSX(input){
    var curRow = [];
    var output = [];
    var columnDefs = input.columnDefs;
    var rowData = input.rowData;
    columnDefs.forEach(column=>{
        curRow.push(column.headerName);
    })
    output.push(curRow);
    rowData.forEach(row=>{
        curRow = [];
        for(var col in row){
            curRow.push(row[col]);
        }
        output.push(curRow);
    });
    return output;
}
function encodeFile(data, title) {
    let csv = '';
    // add title
    csv += `"${title}"\n`;
    // add cards
    data.forEach((card) => {
        csv += `"${card[0]}","${card[1]}"\n`;
    });
    return csv;
}

function decodeFile(csv) {
    let table = [];
    csv.split('\n').forEach((line) => {
        if (line === "") return; // skip empty / feed lines
        let row = [];
        line = line.slice(1,-1);
        line.split('","').forEach((cell) => {
            row.push(cell);
        })
        table.push(row);
    })
    const title = table.shift()[0]; // remove title line
    return [ table, title ];
}
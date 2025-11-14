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
    // outdated code below
    /*
    csv.split('\n').forEach((line) => {
        if (line === "") return; // skip empty / feed lines (we don't need them)
        let row = [];
        line = line.slice(1,-1);
        line.split('","').forEach((cell) => {
            row.push(cell);
        })
        table.push(row);
    })
    */
   csv.split('\n').forEach((line) => {
        if (line === "") return; // skip empty / feed lines
        // Match all quoted or non-quoted cells
        const rowMatches = line.match(new RegExp('"[^"]*"|[^,]*','g'));
        if (rowMatches) {
            let row = [];
            rowMatches.forEach((cell) => {
                if (cell === '' || cell === undefined) return; // skip empty cells
                // Check if the cell starts and ends with a quote
                if (cell.startsWith('"') && cell.endsWith('"')) {
                    // If so, remove the surrounding quotes
                    row.push(cell.slice(1, -1));
                    return;
                }
                row.push(cell);
            });
            table.push(row);
        }
    });
    const title = table.shift()[0]; // remove title line
    return [ table, title ];
}
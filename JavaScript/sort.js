function createSortArr(data) {
    let sortArr = [];
    let sortSelects = data.getElementsByTagName('select');

    for (let i = 0; i < sortSelects.length; i++) {
        let keySort = sortSelects[i].value;
        if (keySort === "NO") {
            continue;
        }
        let checkboxName = (i === 0) ? 'first_level' : (i === 1) ? 'second_level' : 'third_level';
        let checkbox = document.querySelector(`input[name="${checkboxName}"]`);
        let desc = checkbox ? checkbox.checked : false;
        sortArr.push({
            column: keySort,
            order: desc
        });
    }
    return sortArr;
}

function sortTable(idTable, data) {
    let sortArr = createSortArr(data);
    let table = document.getElementById(idTable);
    let rowData = Array.from(table.rows);
    let header = rowData.shift();

    rowData.sort((a, b) => {
        for(let param of sortArr) {
            let aValue, bValue;
            let aCell = a.cells[getColumnIndex(param.column)];
            let bCell = b.cells[getColumnIndex(param.column)];
            
            if(['price', 'capitalization', 'pe', 'ps'].includes(param.column)) {
                aValue = Number(aCell.textContent);
                bValue = Number(bCell.textContent);
            } else {
                aValue = aCell.textContent.toLowerCase();
                bValue = bCell.textContent.toLowerCase();
            }
            
            if(aValue > bValue) return param.order ? -1 : 1;
            if(aValue < bValue) return param.order ? 1 : -1;
        }
        return 0;
    });

    clearTable(idTable);
    rowData.unshift(header);
    rowData.forEach(row => table.append(row));
}

function getColumnIndex(column) {
    const columns = {
        'name': 0,
        'sector': 1,
        'price': 2,
        'change': 3,
        'index': 4,
        'capitalization': 5,
        'pe': 6,
        'ps': 7
    };
    return columns[column];
}
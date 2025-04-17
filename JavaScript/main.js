const btnFilter = document.getElementById('Filterbutton');
const btnClearFilter = document.getElementById('ClearFilter');
const btnSort = document.getElementById('btnSort');
const btnClearSort = document.getElementById('btnClearSort');

const lvl1 = document.getElementById('lvl1');
const lvl2 = document.getElementById('lvl2');
const lvl3 = document.getElementById('lvl3');
const cb2 = document.querySelector('input[name="second_level"]');
const cb3 = document.querySelector('input[name="third_level"]');

let originalData = [...stocks];
let currentDisplayedData = [...stocks];
let currentSortParams = null;

document.addEventListener('DOMContentLoaded', function() {
    createTable(originalData, 'table');
    lvl1.addEventListener('change', updateLevels);
    lvl2.addEventListener('change', updateLevels);
    updateLevels();
});

btnFilter.addEventListener('click', function() {
    currentDisplayedData = getFilteredData(originalData);
    createTable(currentDisplayedData, 'table');
    
    if (currentSortParams) {
        applySortToCurrentTable();
    }
});

btnClearFilter.addEventListener('click', function() {
    resetFilterFields();
    currentDisplayedData = [...originalData];
    createTable(currentDisplayedData, 'table');
    
    if (currentSortParams) {
        applySortToCurrentTable();
    }
});

btnSort.addEventListener('click', function() {
    if (!lvl1 || lvl1.value === 'NO') {
        currentSortParams = null;
        createTable(originalData, 'table');
        return;
    }
    currentSortParams = createSortArr(document.getElementById('sort'));
    sortTable('table', document.getElementById('sort'));
});

btnClearSort.addEventListener('click', function() {
    resetSortFields();
    currentSortParams = null;
    updateLevels()
    createTable(currentDisplayedData, 'table');
});

function updateLevels() {
    if (lvl1.value !== 'NO') {
        lvl2.disabled = false;
        cb2.disabled = false;
    } else {
        lvl2.value = 'NO';
        lvl2.disabled = true;
        cb2.checked = false;
        cb2.disabled = true;

        lvl3.value = 'NO';
        lvl3.disabled = true;
        cb3.checked = false;
        cb3.disabled = true;
    }

    if (lvl2.value !== 'NO') {
        lvl3.disabled = false;
        cb3.disabled = false;
    } else {
        lvl3.value = 'NO';
        lvl3.disabled = true;
        cb3.checked = false;
        cb3.disabled = true;
    }
}

// Сбрасываем поля фильтра
function resetFilterFields() {
    document.getElementById('name').value = '';
    document.getElementById('sector').value = '';
    document.getElementById('index').value = '';
    document.getElementById('priceFrom').value = '';
    document.getElementById('priceTo').value = '';
    document.getElementById('capFrom').value = '';
    document.getElementById('capTo').value = '';
    document.getElementById('peFrom').value = '';
    document.getElementById('peTo').value = '';
    document.getElementById('psFrom').value = '';
    document.getElementById('psTo').value = '';
}

// Сбрасываем поля сортировки
function resetSortFields() {
    document.querySelectorAll('#sort select').forEach(select => {
        select.value = 'NO';
    });
    document.querySelectorAll('#sort input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
}

// Применяем сортировку к текущей таблице
function applySortToCurrentTable() {
    if (!currentSortParams) return;
    
    let table = document.getElementById('table');
    let rowData = Array.from(table.rows);
    let header = rowData.shift();

    rowData.sort((a, b) => {
        for(let param of currentSortParams) {
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

    clearTable('table');
    rowData.unshift(header);
    rowData.forEach(row => table.append(row));
}
function createTable(data, idTable) {
    let table = document.getElementById(idTable);
    table.innerHTML = '';

    // Заголовок таблицы
    let tr = document.createElement('tr');
    let headers = ['Название компании', 'Сектор', 'Цена акции (₽)', 'Изменение за день (%)', 
                  'Биржевой индекс', 'Капитализация (млрд ₽)', 'P/E', 'P/S'];
    
    headers.forEach(header => {
        let th = document.createElement('th');
        th.append(header);
        tr.append(th);
    });
    table.append(tr);

    // Данные таблицы
    data.forEach(item => {
        let tr = document.createElement('tr');
        Object.values(item).forEach(value => {
            let td = document.createElement('td');
            td.append(value);
            tr.append(td);
        });
        table.append(tr);
    });
}

let clearTable = (idTable) => {
    let table = document.getElementById(idTable);
    table.innerHTML = "";
}
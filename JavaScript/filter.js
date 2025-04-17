function getFilteredData(data) {
    let values = {
        name: document.getElementById('name').value,
        sector: document.getElementById('sector').value,
        index: document.getElementById('index').value,
        priceFrom: document.getElementById('priceFrom').value,
        priceTo: document.getElementById('priceTo').value,
        capFrom: document.getElementById('capFrom').value,
        capTo: document.getElementById('capTo').value,
        peFrom: document.getElementById('peFrom').value,
        peTo: document.getElementById('peTo').value,
        psFrom: document.getElementById('psFrom').value,
        psTo: document.getElementById('psTo').value
    };
    
    let outputData = [];
    
    data.forEach(item => {
        let flag = true;
        
        if(values.name && !item.name.toLowerCase().includes(values.name.toLowerCase())) flag = false;
        if(values.sector && !item.sector.toLowerCase().includes(values.sector.toLowerCase())) flag = false;
        if(values.index && !item.index.toLowerCase().includes(values.index.toLowerCase())) flag = false;
        if(values.priceFrom && item.price < Number(values.priceFrom)) flag = false;
        if(values.priceTo && item.price > Number(values.priceTo)) flag = false;
        if(values.capFrom && item.capitalization < Number(values.capFrom)) flag = false;
        if(values.capTo && item.capitalization > Number(values.capTo)) flag = false;
        if(values.peFrom && item.pe < Number(values.peFrom)) flag = false;
        if(values.peTo && item.pe > Number(values.peTo)) flag = false;
        if(values.psFrom && item.ps < Number(values.psFrom)) flag = false;
        if(values.psTo && item.ps > Number(values.psTo)) flag = false;
        
        if(flag) outputData.push(item);
    });
    
    return outputData;
}
export function formatDate(date) {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return `${year}-${month}-${day}`;
}



export function handleClick(event) {
    const selected = event.target.getAttribute('data-selected');
    event.target.setAttribute('data-selected', selected === 'true' ? 'false' : 'true');
}


export function addLoader() {
    alert(4)
    const loader = window.document.querySelector('.loading-container');
    loader.classList.remove('hidden');
}

export function Test() {
    alert(5)
}
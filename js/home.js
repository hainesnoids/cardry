function goToCardURL(csv) {
    const b64string = toBinary(csv);
    window.location.href = `${window.location.origin}/card?d=${b64string}`;
}
document.addEventListener('DOMContentLoaded',() => {
    /*
    document.querySelector('#import-button').addEventListener('click', () => {
        const textData = document.querySelector('#input').value;
        goToCardURL(textData);
    });
    */
    document.querySelector('#csv-import').addEventListener('click', () => {
        let fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'text/csv';
        fileInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            const fileReader = new FileReader();
            fileReader.readAtText(file, 'utf-8');
            fileReader.addEventListener('load', (e) => {
                const csv = e.target.result;
                goToCardURL(csv);
            })
            fileReader.addEventListener('error',() => {
                fileInput.remove();
            })
        })
        fileInput.click();
    });
})
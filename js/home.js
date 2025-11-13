document.addEventListener('DOMContentLoaded',() => {
    document.querySelector('#import-button').addEventListener('click', () => {
        const textData = document.querySelector('#input').value;
        goToCardURL(textData);
    });
})
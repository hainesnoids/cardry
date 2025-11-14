let cardTitle = "";
let cards = [];
let cardIndex = 0;

function importCards(data) {
    const d = decodeFile(data);
    cards = d[0];
    cardTitle = d[1];

    // change document title
    document.querySelector('title').innerHTML = `${cardTitle} - Cardry`;
    document.querySelector('.cardry-page-title').innerText = cardTitle;

    // render entries
    renderEntries();

    // render cards
    renderCards();
}
function renderEntries() {
    const chipContainer = document.querySelector('.entries chips');
    chipContainer.innerHTML = '';
    cards.forEach((card) => {
        let chip = document.createElement('chip');
        let name = document.createElement('name');
        name.innerText = card[0];
        let desc = document.createElement('desc');
        desc.innerText = card[1];
        chip.appendChild(name);
        chip.appendChild(desc);
        chipContainer.appendChild(chip);
    });
}
function renderCards() {
    const cardContainer = document.querySelector('cards');
    cardContainer.innerHTML = '';
    let i = 0;
    cards.forEach((card) => {
        let cardElement = document.createElement('card');
        let nameCard = document.createElement('div');
        nameCard.classList.add('name');
        let name = document.createElement('name');
        name.innerText = card[0];
        nameCard.appendChild(name);
        let descCard = document.createElement('div');
        descCard.classList.add('desc');
        let desc = document.createElement('desc');
        desc.innerText = card[1];
        descCard.appendChild(desc);
        cardElement.appendChild(nameCard);
        cardElement.appendChild(descCard);
        cardContainer.appendChild(cardElement);
        cardElement.setAttribute('data-index', String(i));
        cardElement.setAttribute('data-priority', String(i));
        cardElement.setAttribute('data-flipped','init');
        i++;
    });
    document.querySelector('.card-index').innerText = '1'; // you always start on the first card
    document.querySelector('.total-cards').innerText = String(cards.length);
}
function changeCard(offset) {
    cardIndex = (cardIndex + offset) % cards.length;
    let animations = true;
    if (cardIndex < 0) {
        cardIndex = cards.length - 1;
        animations = false;
    }
    const cardsOnPage = document.querySelectorAll('card');
    for (let idx = 0; idx < cardsOnPage.length; idx++) {
        const itm = cardsOnPage[idx];
        const cardOffset = idx - cardIndex;
        itm.setAttribute('data-priority', String(cardOffset));
        if (itm.getAttribute('data-position') === 'in-left') {
            itm.setAttribute('data-position', 'in');
        }
        if (cardOffset <= -1) {
            itm.setAttribute('data-position', 'out-left');
        } else if (cardOffset >= 3) {
            itm.setAttribute('data-position', 'out-right');
        } else if (cardOffset == 0 && offset < 0 && animations) {
            itm.setAttribute('data-position', 'in-left');
        } else {
            itm.setAttribute('data-position', 'in');
        }
        itm.setAttribute('data-flipped', 'false');
    }
    document.querySelector('.card-index').innerText = String(cardIndex + 1);
    if (cardIndex === 0) { // first card

    }
}
function flipCard() {
    const itm = document.querySelectorAll('card')[cardIndex];
    let isFlipped = itm.getAttribute('data-flipped') === 'true';
    itm.setAttribute('data-flipped',!isFlipped);
}
function exportCards() {
    const csv = encodeFile(cards, cardTitle);
    const b64string = toBinary(csv);
    document.querySelector('#export-url').value = `${window.location.origin}/card?d=${b64string}`;
    //document.querySelector('#cardry-export-dialog').showModal();
}
function download() {
    url = `data:text/csv;utf8,${encodeFile(cards, cardTitle)}`;
    filename = `Cardry - ${cardTitle}.csv`;
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    link.remove();
}
document.addEventListener('DOMContentLoaded', () => {
    // init importing scheme
    let urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('d')) {
        importCards(fromBinary(urlParams.get('d')));
    }

    // card handling
    document.querySelector('.prev').addEventListener('click', () => {
        changeCard(-1);
    })
    document.querySelector('.flip').addEventListener('click', () => {
        flipCard();
    })
    document.querySelector('.next').addEventListener('click', () => {
        changeCard(1);
    })

    document.body.addEventListener('keydown',(e) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            changeCard(-1);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            changeCard(1);
        } else if (e.key === ' ') {
            e.preventDefault();
            flipCard();
        }
    })

    document.querySelector('.font-select select').addEventListener('change',(e) => {
        document.querySelector('cards').setAttribute('font',e.target.value);
    })
    document.querySelector('#copy-link').addEventListener('click',() => {
        const csv = encodeFile(cards, cardTitle);
        const b64string = toBinary(csv);
        try {
            navigator.clipboard.writeText(`${window.location.origin}/card?d=${b64string}`);
            document.querySelector('#copy-link span').innerHTML = 'check';
            setTimeout(() => {
                document.querySelector('#copy-link span').innerHTML = 'content_copy';
            },3000)
        } catch(e) {
            document.querySelector('#copy-link span').innerHTML = 'exclamation';
            setTimeout(() => {
                document.querySelector('#copy-link span').innerHTML = 'content_copy';
            },3000);
        }
    })
    /*document.querySelector('#export').addEventListener('click', exportCards);
    document.querySelector('#cardry-export-close').addEventListener('click',() => {
        document.querySelector('#cardry-export-dialog').close();
    })*/
    document.querySelector('#download').addEventListener('click',download);
    exportCards();
})
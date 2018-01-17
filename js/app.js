// Put in array the object symbols that will be compared
let symbols = ['bicycle', 'leaf', 'cube', 'anchor', 'paper-plane-o', 'bolt', 'bomb', 'diamond'];
// Duplicate the object symbols and shuffle it 
symbols = symbols.concat(symbols);

// Get the deck class from the DOM in order to append the created elements
const deck = document.querySelector('.deck');
const moveCount = document.querySelector('.moves');

// Set the variables that will be used in the matching the cards
let moves = 0;
let openCards = 0;
let cardOpen = [];
let gameStarts = false;

// Set the variables for the game timer
let gameTimer = document.querySelector('.gameTimer');
let seconds = 0;
let mseconds = 0;
let minutes = 0;
let hours = 0;


// Select the UL element with star class
const ratings = document.querySelector('.stars');

// Empty the deck of cards
HTMLElement.prototype.empty = function() {
    var that = this;
    while (that.hasChildNodes()) {
        that.removeChild(that.lastChild);
    }
};

//Re-initialize all variables to restart the game
function varInit() {
    moves = 0;
    openCards = 0;
    cardOpen = [];
    gameStarts = false;
    seconds = 0;
    minutes = 0;
    cards = [];
    // Remove all child elements in deck 
    deck.empty();
    deck.removeEventListener('click', eventHandler, false); // Remove the event listeners
    //Reset the user stats
    ratings.innerHTML = '<li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li>';
    moveCount.innerHTML = "# of Moves";
    gameTimer.innerHTML = 'Time Lapse: 0 min 0 sec';
}


// Restarts the game 
const restart = document.querySelector('.restart');
restart.addEventListener('click', restartGame, false);

function restartGame() {
    varInit();
    gameInit();;
}

// Display the game stats on modal window
function populateStats() {

    let stars = document.createElement('i');
    let message = '';

    // Check the number of li ratings
    if (ratings.children.length === 0) {
        message = ' You have no stars';
    } else {
        for (let x = 0; x < ratings.children.length; x++) {
            message = message + '<i class="fa fa-star"></i>';
        }
        stars.innerHTML = message;
    };

    //Display the user stats
    modalContent[0].innerHTML = "<h3>Moves: " + moves + "</h3><h3>Stars: " + message + "</h3>";
    modalContent[1].innerHTML = "<h3>" + gameTimer.textContent + "</h3>";

}

function openModal() {
    modal.style.display = 'flex';
    populateStats();
}

// Close the cards if unmatched
function closeCards() {
    cardOpen[0].className = "card close";
    cardOpen[1].className = "card close";
}

// Remove the number of stars based on the ratings
function removeStars() {
    const rStars = ratings.firstElementChild;
    ratings.firstElementChild.remove(rStars);
}


// Config for the user stats once the game finishes
let modal = document.querySelector('.modal');
let closeModal = document.querySelector('.closeModal');
let btnPlay = document.querySelector(".btnPlay");
let modalContent = document.querySelectorAll('p');
btnPlay.addEventListener('click', function() {
    closeWindow();
    varInit();
    gameInit();

});

// Compare the cards if matched
function compareCards() {
    if (cardOpen[0].children[0].className === cardOpen[1].children[0].className) {
        cardOpen[0].className = "card open show matched lock";
        cardOpen[1].className = "card open show matched lock";
        openCards++; // add to count the number of cards opened
    } else {
        setTimeout(closeCards(), 3000); // close the cards if unmatched
    }

    // Check if all cards has already been open  
    if (openCards == 8) {
        gameStarts = false;
        openModal(); // Open the game stats window
    }

    // Update the star ratings.  Decrease the number of stars for every move count
    switch (moves) {
        case 15:
            {
                removeStars();
                break;
            }
        case 30:
            {
                removeStars();
                break;
            }
    }

    // Empty the card array for another selections 
    cardOpen = [];
}

// Set the timer once the game starts
function playTimer() {

    if (seconds >= 60) {
        seconds = 0;
        minutes++;
    }

    if (minutes >= 60) {
        minutes = 0;
        hours++;
    }

    //Update the game timer 
    gameTimer.textContent = "Time Lapse: " + minutes + " min " + seconds + " sec";
    if (gameStarts) {
        startTime();
    } else {
        //openModal();
    }
    seconds++;
}

// Start the game timer
function startTime() {
    setTimeout(playTimer, 1000);
}

// Add the EventListeners for the cards
let eventHandler = function(evt) {

    // Check if the game has already started if not start timer 
    if (gameStarts != true) {
        startTime();
        gameStarts = true;
    }

    //Check if the user is clicking only the LI element
    if (evt.target.nodeName === 'LI') { 
        if (cardOpen.length === 0) {
            evt.target.setAttribute('class', 'card open show');
            cardOpen.push(evt.target);
        } else {
            // If the cardOpen > 1 add to array 
            // Do nothing if the user is clicking the same card
            if (cardOpen[0].id != evt.target.id) {
                cardOpen.push(evt.target);
                evt.target.setAttribute('class', 'card open show');
                // Compare the cards
                setTimeout(compareCards, 300);
                //update the number of moves in the html
                moves++;
            }
        }
        moveCount.innerHTML = moves + " Moves";
    }
}


//Initialize the game by spreading the deck
function gameInit() {
    const cards = shuffle(symbols);
    
    for (let x = 0; x < cards.length; x++) {
        const li = document.createElement('li');
        const i = document.createElement('i');
        li.id = 'cardId-' + x;
        li.className = "card";
        i.className = 'fa fa-' + cards[x];
        deck.appendChild(li);
        li.appendChild(i);
    }
    deck.addEventListener('click', eventHandler, false);
}

// Shuffle the cards 
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// function to close the modal window
function closeWindow() {
    modal.style.display = 'none';
}

// Event listener that will close the modal once X has been clicked
closeModal.addEventListener('click', closeWindow, false);

// Start the game 
gameInit();
const diceWindow = document.querySelector('.dicePanel');
const buttons = document.querySelectorAll('button');
document.querySelector('#roll').disabled = true;
const pointsLabel = document.querySelector('.lbl_points');
const roundsLabel = document.querySelector('.lbl_rounds');
const scoreLabel = document.querySelector('.lbl_score');
let highscores = []; //high scores
let storedScores;
let div = document.querySelector('.tenScores');
let msg = document.querySelector('.finalScore');
let prevHighScore = document.querySelector('.highScore');
// save high scores to local storage.

const dice = [[5],[1,9],[1,5,9],[1,3,7,9],[1,3,5,7,9],[1,3,4,6,7,9]];
const numDice = dice.length;
const STATE_AVAILABLE = 0, STATE_SELECTED = 1, STATE_HELD = 2;
let value = 1, state = STATE_AVAILABLE;
let newPoints=0, points=0, round=1, score=0;
const diceList = 
        [
            {
                label: 'die1',
                position: 0,
                value: 0,
                state: 'available'
            },
            {
                label: 'die2',
                position: 0,
                value: 0,
                state: 'available'
            },
            {
                label: 'die3',
                position: 0,
                value: 0,
                state: 'available'
            },
             {
                label: 'die4',
                position: 0,
                value: 0,
                state: 'available'
            },
            {
                label: 'die5',
                position: 0,
                value: 0,
                state: 'available'
            },
            {
                label: 'die6',
                position: 0,
                value: 0,
                state: 'available'
            }
        ]

let body = document.querySelector('.gameBoard');
let info = document.querySelector('#info')
let gameRules = document.querySelector('.gameRules');
gameRules.addEventListener('click', (e)=>{
    info.style.display = 'block';
});
let active = false, currentX, currentY, initialX, initialY, xOffset = 0, yOffset = 0;

info.addEventListener('touchstart', dragStart, {
    capture: true,
    passive: true
});
info.addEventListener('touchend', dragEnd, {
    capture: true,
    passive: true
});
info.addEventListener('touchmove', drag, {
    capture: true,
    passive: true
});

info.addEventListener('mousedown', dragStart, {
    capture: true,
    passive: true
});
info.addEventListener('mouseup', dragEnd, {
    capture: true,
    passive: true
});
info.addEventListener('mousemove', drag, {
    capture: true,
    passive: true
});

function dragStart(e) {
    if(e.type === 'touchstart'){
        initialX = e.touches[0].clientX - xOffset;
        initialY = e.touches[0].clientY - yOffset;
    }else{
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
    }
    let target = (e.target.parentElement.dataset['info']) ? e.target.parentElement : e.target;
    if(target === info) {
        active = true;
    }
}

function dragEnd(e) {
    initialX = currentX;
    initialY = currentY;
    active = false;
}

function drag(e) {
    if(active){
        //e.preventDefault();
        if(e.type === 'touchmove') {
            currentX = e.touches[0].clientX - initialX;
            currentY = e.touches[0].clientY - initialY;
        }else{
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
        }
        xOffset = currentX;
        yOffset = currentY;

        setTranslate(currentX, currentY, info);
    }
}

function setTranslate(xPos, yPos, el){
    el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
}


// modal
// Get the modal
let modal = document.getElementById('theModal');
let modalContent = document.querySelector('.modal-content');

// Get the <span> element that closes the modal
let span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
document.querySelector('.close').addEventListener('click', ()=>{
    modal.style.display = "none";
    msg.innerHTML = ' ';
    div.innerHTML = ' ';
});

// when user clicks the <span> (x) </span>, close the game rules window
document.querySelector('#info__close').addEventListener('click', ()=>{
    info.style.display = 'none';
});

// when user clicks the <span> (x) </span>, close the winners window
document.querySelector('.close__top10').addEventListener('click', ()=>{
    let winner = document.querySelector('.top10');
    let ul = document.querySelector('.top10__ul');
    ul.innerHTML = ' ';
    winner.style.display = 'none';
});

document.querySelector('.winnersCircle').addEventListener('click', ()=>{
    let top = document.querySelector('.top10');
    top.style.display = 'block';
    let htmlList = '';
    storedScores = JSON.parse(localStorage.getItem('highscores'));
    storedScores.reverse();
    storedScores.forEach((elem, index) => {
        htmlList += `<li><span>${index+1}</span>. <span>${elem}</span></li>`
    });

    document.querySelector('.top10__ul').insertAdjacentHTML('afterbegin', htmlList);
     
});

function updateHighScores() {
     highscores.sort();
     if(highscores.length < 10 && !highscores.includes(score)){
         highscores.push(score);
     }else{
          highscores.reverse();
         // if score is greater than other scores, insert score and remove lowest score
         let temp = highscores[highscores.length-1];
         if(!(highscores.includes(score)) && (score > temp)){
             highscores.pop();
             highscores.push(score);
         }
     }
     highscores.sort();
     // set to local storage
     localStorage.setItem('highscores', JSON.stringify(highscores));
     getScoreStats();
     // add previous highscore to the game board
     prevHighScore.innerText = storedScores[0];
}

function getScoreStats() {
    highscores.sort();
    
    if(localStorage.hasOwnProperty('highscores')){
        highscores = JSON.parse(localStorage.getItem('highscores'));
    }
    let htmlList = '';
    // get scores from local storage and list in reverse order
    storedScores = JSON.parse(localStorage.getItem('highscores'));
    storedScores.sort();
    console.log('in getScoreStats: ' + storedScores);
    storedScores.reverse();
    storedScores.forEach((elem, index) => {
        htmlList += `<li><span>${index+1}.</span> <span>${elem}</span></li>`
    });

    div.insertAdjacentHTML('afterbegin', htmlList);
    // message to player
    let message = '';
     message += `<div class="msg">You scored ${score} points!</div>`
    if (highscores.includes(score)) {
        document.querySelector('.topTen__msg').textContent = `Congratulations, Your score has been added to the top 10 list! Please play again.`
    } else {
        document.querySelector('.topTen__msg').textContent =`Good job! Please play again.`;
    }

    msg.insertAdjacentHTML('afterbegin', message);

}

// add event listener to each button
buttons.forEach((elem)=>{
    elem.addEventListener('click', (e)=>{
        let txt = e.target.innerText;
        if(txt === 'Roll'){
            updatePoints();
            rollRemainingDice();
            document.querySelector('#roll').disabled = true;
        }else if(txt === 'End Round'){
            if(isValidSelection() && newPoints > 0){
                score += points + newPoints;
            }
            points = 0; 
            newPoints = 0; 
            pointsLabel.textContent = 0;
            scoreLabel.textContent = score;
            if(round < 10){
                round++;
                roundsLabel.textContent = round;
                rollAllDice();
            }else{
                 // update scores
                 updateHighScores();
                modal.style.display = "block";
                score = 0;
                round = 1; 
                scoreLabel.textContent = 0;
                roundsLabel.textContent = 1;
                rollAllDice();
            }
        }
    });
});

/**
 * updatePoints
 * updates the points label
 */
function updatePoints() {
    points += newPoints;
    pointsLabel.textContent = points;
    newPoints = 0;
}

function rollAllDice() {
    diceList.forEach((elem)=>{
        elem.state = 'available';
        // generate a random number
        let num = roll();
        // set new value of die
        elem.value = num;
        let div = buildDie(elem);
        // remove children of div representing the current die
        diceWindow.childNodes[elem.position + 1].remove();
        diceWindow.insertBefore(div, diceWindow.childNodes[elem.position + 1]);
         div.addEventListener('click', () => {
             changeStatus(elem.position);
             clickedDie();
         });
    });
    document.querySelector('#roll').disabled = true;
}

function rollRemainingDice(){
    let count = 0;
    diceList.forEach((elem)=>{
        if(elem.state === 'selected'){
            elem.state = 'held';
        }else if(!(elem.state === 'held')){
            // generate a random number
            let num = roll();
            // set new value of die
            elem.value = num;
            let div = buildDie(elem);
            // remove children of div representing the current die
            diceWindow.childNodes[elem.position + 1].remove();
            // addeventlisteners
            diceWindow.insertBefore(div, diceWindow.childNodes[elem.position + 1]);
            count++;
            div.addEventListener('click', () => {
                changeStatus(elem.position);
                clickedDie();
            });
        }
    });
    if(count === 0){
        rollAllDice();
    }
}

/**
 * returns a randome number between 1 and 6 corresponding the faces of a dice
 * @param {int} num 
 */
function roll() {
    let rNumber = Math.floor(Math.random() * 6) + 1;
    return rNumber;
}

/**
 * used in creating each die
 * @param {obj} elem 
 */
const buildDie = (elem)=>{
    let div = document.createElement('div');
    div.setAttribute('class', `dicer ${diceList[elem.position].label}`);
    div.dataset.pos = elem.position;
    let dieArray = dice[elem.value - 1];
    for (let i = 1; i < 10; i++) {
        let dots = document.createElement('div');
        dots.setAttribute('class', 'dot');
        if (dieArray.includes(i)) {
            dots.classList.add('black');
        }
        div.appendChild(dots);
    }
    return div;
}

function clickedDie() {
    if(isValidSelection()){
        document.querySelector('#roll').disabled = false;
    }else{
        document.querySelector('#roll').disabled = true;
    }
    pointsLabel.textContent = points + newPoints;
}

const isValidSelection = ()=>{
    const count = [0,0,0,0,0,0];
    let totalCount = 0;
    let valid = true;
    newPoints = 0;
    diceList.forEach((elem)=>{
        if(elem.state === 'selected'){
            let value = elem.value;
            count[value-1]++;
            totalCount++;
        }
    });
    if(totalCount === 0){
        valid = false;
    }else if(count[0]===1 && count[1]===1 && count[2]===1 && 
             count[3]===1 && count[4]===1 && count[5]===1 &&count[6]===1)
    {
        newPoints += 250;
    }else{
        for(let i=0; i < count.length; i++){
            switch (count[i]) {
                case 1:
                    if(i===0){
                        newPoints += 10;
                    }else if(i===4){
                        newPoints += 5;
                    }else{
                        valid = false;
                    }
                    break;
                case 2:
                    if(i === 0){
                        newPoints += 20;
                    }else if(i === 4){
                        newPoints += 10;
                    }else{
                        valid = false;
                    }
                    break;
                case 3: 
                    if(i===0){
                        newPoints += 100;
                    }else{
                        newPoints += (10*(i+1));
                    }
                    break;
                case 4: 
                    newPoints += 200;
                    break;
                case 5: 
                    newPoints += 300;
                    break;
                case 6: 
                    newPoints += 500;
                    break;
            }
        }
    }
    return valid;
}

function repaint(pos) {
    let status = diceList[pos].state;
    let label = diceList[pos].label;
    switch (status) {
        case 'available':
            document.querySelector(`.${label}`).style.backgroundColor = 'white';
            break;
        case 'selected':
            document.querySelector(`.${label}`).style.backgroundColor = 'red';
            break;
        case 'held':
            document.querySelector(`.${label}`).style.backgroundColor = 'light gray';
            break;
    }
}

/**
 * change state of clicked element to available vs selected
 * @param {obj} elem 
 */
function changeStatus(pos) {
    if(diceList[pos].state === 'available'){
        diceList[pos].state = 'selected';
        repaint(pos);
    }else if(diceList[pos].state === 'selected'){
        diceList[pos].state = 'available';
        repaint(pos);
    }else if(diceList[pos].state === 'held'){
        diceList[pos].state = 'held';
        // update die color
        repaint(pos);
    }
}

let tools = {
    init: ()=>{
        tools.main();

    }, 
    main: ()=>{
        diceList.forEach((elem, index)=>{
            let randNum = roll();
            elem.position = index;
            elem.value = randNum;
        });
        pointsLabel.textContent = points;
        roundsLabel.textContent = round;
        scoreLabel.textContent = score;
        tools.draw();
        // get stored high scores
        if (localStorage.hasOwnProperty('highscores')) {
            highscores = JSON.parse(localStorage.getItem('highscores'));
            highscores.sort();
            highscores.reverse();
            prevHighScore.innerText = highscores[0];
        }
        console.log(highscores);
    }, 
    draw: ()=> {
        diceList.forEach((elem)=>{
            diceWindow.appendChild(buildDie(elem));
        });
        // add event listener to each die
        const dicer = document.querySelectorAll('.dicer');
        dicer.forEach((el) => {
            el.addEventListener('click', (e) => {
                let pos = (e.target.parentElement.dataset['pos']) ? e.target.parentElement.dataset['pos'] : e.target.dataset['pos'];
                changeStatus(pos);
                clickedDie();
                //console.log(pos);
            });
        });
    }
}

window.onload = tools.init;

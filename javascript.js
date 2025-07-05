
//player one: X.
//player two: O.

// player: one / two.
let turn = 'one';

let adjustingSize = false;

let columnsAndRowsLength = 3;
let amount = reAssignAmount();
let places = Array(amount).fill(0);
let placesTakenCounter = 0;

let playerOne_Score = 0, playerTwo_Score = 0;
let maxScore = 5;

let disablePlaying = false;

const main = document.querySelector('main');
const header = document.querySelector('header');

const texts_WhenHitAnUnPlayableSize = document.querySelectorAll('#texts_WhenHitAnUnPlayableSize span');

const winningAndRestartingDiv = document.getElementById('winningAndRestartingDiv');

let winningAndRestartingDivIsVisible = false;
let popIn_winningAndRestartingDivAfterWidthAndHeightAreProvided = false;

/*let current_element_under_the_mouse;
document.addEventListener('mouseover', e=> current_element_under_the_mouse = e.target);*/

this.addEventListener('resize', reAssign_main_size);

const placeID_span = document.getElementById('placeID');
const turn_span = document.getElementById('turnSpan');

this.addEventListener('keydown', e=> {
    handlePlaying(undefined, e);
}); 


function handlePlaying(square_div, e, particleColor) {
    if(adjustingSize) {
        return;
    }
    let value = e.key;
    if(disablePlaying) {
        if(value != undefined && winningAndRestartingDivIsVisible && (value.toLowerCase() == 'c' || value == 'Enter')) {
            _continue();
        }
        return;
    }
    if(square_div != undefined) {
        create_clickEffect(e, particleColor);
    }
    if(value != 'Enter' && placeID_span.textContent[0] == '0') {
        placeID_span.textContent = placeID_span.textContent.substring(1);
    }
    let wantedPosition;
    if(square_div == undefined) {
        wantedPosition = Number(placeID_span.textContent);
    } else {
        wantedPosition = Number(square_div.id.toString().substring(3));
    } 
    if(wantedPosition.toString().includes('NaN') && square_div == undefined) {
        alert('Invalid index: [' + placeID_span.textContent + ']');
        placeID_span.textContent = '';
        return;
    }
    if(value == 'Backspace' && placeID_span.textContent.length > 0) {
        placeID_span.textContent = placeID_span.textContent.substring(0, placeID_span.textContent.length - 1);
    } else if(value == 'Enter' || square_div != undefined) {
        if(placeID_span.textContent == '' && square_div == undefined) {
            return;
        }
        else if(places[wantedPosition] != 0) {
            alert('Requested place ['+wantedPosition+'] is already taken. choose another one.');
            placeID_span.textContent = '';
            return;
        } else {
            let player = turn + '';
            let requestedPositions_div;
            if(square_div == null || square_div == undefined) {
                requestedPositions_div = document.querySelector('main #div'+ wantedPosition);
            } else {
                requestedPositions_div = square_div;
                //console.log(wantedPosition);
            }
            if(turn == 'one') {
                let Xstyle = 'left: '+requestedPositions_div.clientWidth/2+'; top:  '+ requestedPositions_div.clientHeight/2 + '; transform: translate(-50%, -50%) ';
                const rotate_1 = 'rotate(-45deg);';
                const rotate_2 = 'rotate(45deg);';
                requestedPositions_div.innerHTML += '<div class="X-style_1" style="' + Xstyle + rotate_1 + '"></div>'
                                                        +'<div class="X-style_2" style="' + Xstyle + rotate_2 + '"></div>';
                places[wantedPosition] = 1;
                placesTakenCounter++;
                turn = 'two';
            } else if(turn == 'two') {
                requestedPositions_div.innerHTML += '<div class="O-style"></div>';
                places[wantedPosition] = 2;
                turn = 'one';
                placesTakenCounter++;
            }
            placeID_span.textContent = '';
            turn_span.textContent = 'Player ' + turn;
            checkForWinner(player, wantedPosition);
        }
    }
    if(!(value >=0 && value <= 9)) {
        return;
    }
    placeID_span.textContent += value;
    if(Number(placeID_span.textContent) >= amount) {
        placeID_span.textContent = amount - 1;
    }
}

function createSquares() {
    main.innerHTML = '';
    main.style.gridTemplateColumns = 'repeat('+columnsAndRowsLength+', 1fr)';
    main.style.gridTemplateRows = 'repeat('+columnsAndRowsLength+', 1fr)';
    for(let i = 0; i < amount; i++) {
        let square = document.createElement('div');
        square.id = 'div'+i;
        square.addEventListener('click', e=> {
            let particleColor;
            /*if(turn == 'one') {
                particleColor = 'brown';
            } else {
                particleColor = 'rgb(55, 55, 204)';
            }*/
            particleColor = 'brown';
            handlePlaying(square, e, particleColor);
        });
        let index_span = document.createElement('span');
        index_span.className = 'square_index_span-style';
        index_span.textContent = i;
        square.appendChild(index_span);
        main.appendChild(square);
        /*main.innerHTML += '<div id="div'+i+'"">'
        +'<span>'+i+'</span>'
        +'</div>';*/
    }
    reAssign_main_size();

}
function setup() {
    createSquares();
}
setup();

/*function addEventListener_click_ToSquares() {
    document.querySelectorAll('main div').forEach(square=> {
        square.addEventListener('click', e=> {
            handlePlaying(square, e);
        });
    });    
}*/

async function checkForWinner(player, lastMoveIndex) {
    let number = player == 'one'?1:2;
    let answerX = check_X(number, lastMoveIndex);
    let answerY = check_Y(number, lastMoveIndex);
    let answerZ_1 = check_Z_1(number, lastMoveIndex);
    let answerZ_2 = check_Z_2(number, lastMoveIndex);
    let hasAchievemedTheMaximumScoreForOneGame = number == 1? playerOne_Score >= maxScore - 1: playerTwo_Score >= maxScore - 1;
    if(answerX.winFlag) {
        handleWinner(number, answerX.startIndex, answerX.finishIndex, hasAchievemedTheMaximumScoreForOneGame);
    }
    else if(answerY.winFlag) {
        handleWinner(number, answerY.startIndex, answerY.finishIndex, hasAchievemedTheMaximumScoreForOneGame);
    }
    else if(answerZ_1.winFlag) {
        handleWinner(number, answerZ_1.startIndex, answerZ_1.finishIndex, hasAchievemedTheMaximumScoreForOneGame);
    }
    else if(answerZ_2.winFlag) {
        handleWinner(number, answerZ_2.startIndex, answerZ_2.finishIndex, hasAchievemedTheMaximumScoreForOneGame);
    }
    else if(placesTakenCounter == amount) {
        sleep(10);
        restart();
    }
    /*if(check_Y(number, lastMoveIndex) || check_X(number, lastMoveIndex)) {
        console.log('we have a winner!!!');
    }*/
}

function restart() {
    disablePlaying = true;
    winningAndRestartingDiv_popIn(0, 'restart');
}

async function handleWinner(playerNumber, startIndex, finishIndex, hasAchievemedTheMaximumScoreForOneGame) {
    disablePlaying = true;
    if(playerNumber == 1) {
        playerOne_Score++;
    } else if(playerNumber == 2) {
        playerTwo_Score++;
    }
    //console.log('player number: ' + playerNumber + ' has won!! congratulations!!!');
    drawWinnerLine(startIndex, finishIndex);
    await sleep(1000);
    winningAndRestartingDiv_popIn(playerNumber, undefined, hasAchievemedTheMaximumScoreForOneGame);
}

//main elements: main, header
function elements_blur_toggle(elements) {
    elements.forEach(element=> {
        element.classList.toggle('blured-element');
    });
}

const winningAndRestartingDiv_restartEverythingButton = document.querySelector('#winningAndRestartingDiv #restartButton');
const winningAndRestartingDiv_continueButton = document.querySelector('#winningAndRestartingDiv #continueButton');

//let informations_winning_styles_AreToggled = false;

let score_playerOne = document.getElementById('score_playerOne');
let score_playerTwo = document.getElementById('score_playerTwo');

const informations_sideTexts_textShadow = '1px 1px 10px rgba(206, 201, 201, 0.5)';

//action: restart / winning
function winningAndRestartingDiv_popIn(winnerNumber, action, hasAchievemedTheMaximumScoreForOneGame) {
    winningAndRestartingDivIsVisible = true;
    score_playerOne.textContent = playerOne_Score;
    score_playerTwo.textContent = playerTwo_Score;

    elements_blur_toggle([main, header]);

    let mainScore = document.getElementById('mainScore');

    let information_spans = document.querySelectorAll('#informations span');
    let informationsContainer = document.querySelector('#informations');

    /*if(informations_winning_styles_AreToggled) {
        //informationsContainer.classList.toggle('informations_winning');
        informations_winning_styles_AreToggled = false;
    }*/
    if(action == 'restart') {
        let textShadow = '1px 1px 6px red';
        information_spans[0].style.textShadow = textShadow;
        information_spans[0].textContent = 'The game is over and no one has won!';
        information_spans[1].textContent = '';
        information_spans[2].textContent = '';

        winningAndRestartingDiv_restartEverythingButton.style.display = 'none';
        winningAndRestartingDiv_continueButton.style.display = 'block';
    } else {
        if(hasAchievemedTheMaximumScoreForOneGame) {
            winningAndRestartingDiv_restartEverythingButton.style.display = 'block';
            winningAndRestartingDiv_continueButton.style.display = 'none';
            let playerColor, textShadowColor;
            if(winnerNumber == 1) {
                playerColor = 'blue';
                textShadowColor = 'rgba(0, 0, 230, 0.4)';
                information_spans[1].textContent = ' One ';
            } else {
                playerColor = 'maroon';
                textShadowColor = 'rgba(90, 0, 0, 0.4)';
                information_spans[1].textContent = ' Two ';
            }
            information_spans[0].style.textShadow = '1px 1px 10px ' + playerColor;
            information_spans[1].style.color = playerColor;
            information_spans[1].style.textShadow = '1.5px 1.5px 10px ' + textShadowColor;
            information_spans[2].style.textShadow = '1px 1px 10px ' + playerColor;

            //informations_winning_styles_AreToggled = true;
            information_spans[0].textContent = 'Player';
            information_spans[2].textContent = 'is the winner!';
        } else {
            /*const ordinalNumbers = [
                'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth'
                , 'tenth', 'eleventh', 'thirteenth', 'fourteenth', 'fifteenth', 'sixteenth', 'seventeenth'
                , 'eighteenth', 'nineteenth', 'twentieth'
            ];*/
            
            information_spans[0].style.textShadow = informations_sideTexts_textShadow;
            information_spans[2].style.textShadow = informations_sideTexts_textShadow;

            winningAndRestartingDiv_restartEverythingButton.style.display = 'none';
            winningAndRestartingDiv_continueButton.style.display = 'block';
            information_spans[0].textContent = 'Player'
            if(winnerNumber == 1) {
                information_spans[1].textContent = 'one';
                information_spans[1].style.textShadow = '1px 1px 10px blue';
                information_spans[2].textContent = reAssignSpan_2(playerOne_Score);
            } else {
                information_spans[1].textContent = 'two';
                information_spans[1].style.textShadow = '1px 1px 10px maroon';
                information_spans[2].textContent = reAssignSpan_2(playerTwo_Score);
            }
            information_spans[1].style.color = 'white';
            //information_spans[2].textContent = 'has won. Congratulations!';
        }
    }
    mainScore.textContent = playerOne_Score + ' - ' + playerTwo_Score;

    winningAndRestartingDiv.style.animation = 'slideIn 1s ease-in forwards';

}

const oridinal = [
    '', 'st', 'nd', 'rd', 'th'
];

function reAssignSpan_2(score) {
    let span_2 = 'just won for the ';
    if(score > 3) {
        span_2 += score + 'th ';
    } else {
        if(score == 1) {
            span_2 += 'first ';
        } else {
            span_2 += score + oridinal[score] + ' ';
        }
    }
    span_2+= 'time!';
    return span_2;
}

function winningAndRestartingDiv_popOut() {

    winningAndRestartingDiv.style.animation = 'slideOut 0.7s ease-out forwards';
    elements_blur_toggle([main, header]);
    createSquares();
    resetVariables(false);
    disablePlaying = false;
    turn_span.textContent = 'Player one';
    turn = 'one';
}

winningAndRestartingDiv_continueButton.addEventListener('click', _continue);

function _continue() {
    if(!winningAndRestartingDivIsVisible) {
        return;
    }
    winningAndRestartingDiv_popOut();
    winningAndRestartingDivIsVisible = false;
}

function sleep(milliSeconds) {
    return new Promise(resolve => {
        setTimeout(resolve, milliSeconds);
    });
}

function check_X(playerNumber, index) {
    let goLeft = false, i = 0, counter = 0, currentIndex;
    let currentRow_lastIndex = index + columnsAndRowsLength - (index % columnsAndRowsLength) - 1;
    for(i; i < 3; i++) {
       currentIndex = index + i;
        if(currentIndex > currentRow_lastIndex || places[currentIndex] != playerNumber) {
            goLeft = true;
            break;
        } else {
            counter++;
        }
    }
    if(counter == 3) {
        return createAnswer(true, currentIndex, index);
    }
    if(!goLeft) {
        return createAnswer(false);
    }
    let newIndex = currentIndex - 1, currentRow_firstIndex = index - index % columnsAndRowsLength;
    for(i = 0; i < 3; i++) {
        currentIndex = newIndex - i;
        if(currentIndex < currentRow_firstIndex || places[currentIndex] != playerNumber) {
            return createAnswer(false);
        }
    }
    return createAnswer(true, currentIndex, index);
}

function check_Y(playerNumber, index) {
    let goDown = false, i = 0, counter = 0;
    let currentIndex;
    for(i; i < 3; i++) {
       currentIndex = index + i * columnsAndRowsLength;
        if(currentIndex > places.length - 1 || places[currentIndex] != playerNumber) {
            goDown = true;
            break;
        } else {
            counter++;
        }
    }
    if(counter == 3) {
        return createAnswer(true, index, currentIndex);
    }
    if(!goDown) {
        return createAnswer(false);
    }
    //console.log('');
    let newIndex = index + (i - 1) * columnsAndRowsLength;
    for(i = 0; i < 3; i++) {
        currentIndex = newIndex - i * columnsAndRowsLength;
        if(currentIndex < 0 || places[currentIndex] != playerNumber) {
            return createAnswer(false);
        }
    }
    return createAnswer(true, newIndex, currentIndex);
}

function check_Z(playerNumber, index) {
    return check_Z_1(playerNumber, index) || check_Z_2(playerNumber, index);
}

function check_Z_1(playerNumber, mainIndex) {
    let i = 0, goTopLeft = false, counter = 0;
    let currentIndex;
    for(i; i < 3; i++) {
        currentIndex = mainIndex + i * (columnsAndRowsLength + 1);
        if(places[currentIndex] != playerNumber || currentIndex > places.length - 1 
            || (currentIndex % columnsAndRowsLength <= mainIndex % columnsAndRowsLength && currentIndex != mainIndex)) {
            goTopLeft = true;
            break;
        } else {
            counter++;
        }
    }
    if(counter == 3) {
    //console.log('z_1_1');
        return createAnswer(true, mainIndex, currentIndex);
    }
    if(!goTopLeft) {
        return createAnswer(false);
    }
    let newMainIndex = mainIndex + (i - 1) * (columnsAndRowsLength + 1);
    let currentLine_columnIndex, previusLine_columnIndex;
    for(i = 0; i < 3; i++) {
        currentIndex = newMainIndex - i * (columnsAndRowsLength + 1);
        currentLine_columnIndex = Math.floor(currentIndex / columnsAndRowsLength);
        if(currentIndex < 0 || places[currentIndex] != playerNumber
            || (currentLine_columnIndex == previusLine_columnIndex && currentIndex != mainIndex)) {
            return createAnswer(false);
        }
        previusLine_columnIndex = currentLine_columnIndex;
    }
    //console.log('z_1_2');
    return createAnswer(true, newMainIndex, currentIndex);
}

function check_Z_2(playerNumber, mainIndex) {
    let i = 0, goTopRight = false, counter = 0;
    let currentIndex;
    for(i; i < 3; i++) {
        currentIndex = mainIndex + i * (columnsAndRowsLength - 1);
        if(places[currentIndex] != playerNumber || currentIndex > places.length - 1 
            || (currentIndex % columnsAndRowsLength >= mainIndex % columnsAndRowsLength && currentIndex != mainIndex)) {
                goTopRight = true;
            break;
        } else {
            counter++;
        }
    }
    if(counter == 3) {
        //console.log('z_2_1');
        return createAnswer(true, currentIndex, mainIndex);
    }
    if(!goTopRight) {
        return createAnswer(false);
    }
    let newMainIndex = mainIndex + (i - 1) * (columnsAndRowsLength - 1);
    //console.log(newMainIndex);
    let currentLine_columnIndex, previusLine_columnIndex;
    /*console.log('');
    console.log('');*/
    for(i = 0; i < 3; i++) {
        currentIndex = newMainIndex - i * (columnsAndRowsLength - 1);
        /*console.log('current index: ' + currentIndex);
        console.log('previusLine_columnIndex: ' + previusLine_columnIndex);
        console.log('');*/
        currentLine_columnIndex = Math.floor(currentIndex / columnsAndRowsLength);
        if(currentIndex < 0 || places[currentIndex] != playerNumber
            || (currentLine_columnIndex == previusLine_columnIndex && currentIndex != mainIndex)) {
            return createAnswer(false);
        }
        previusLine_columnIndex = currentLine_columnIndex;
    }
    //console.log('z_2_2');
    return createAnswer(true, currentIndex, newMainIndex);
}

function reAssignAmount() {
    return Math.pow(columnsAndRowsLength, 2);
}

function reAssign_main_size() {
    //let mainWidth_before = main.style.width;
    main.style.transition = '0s';
    if(window.innerWidth > window.innerHeight) {
        main.style.height = window.innerHeight/1.6;
        main.style.width = main.style.height;
        reAssign_mainDiv_sizes(window.innerHeight);
    } else {
        main.style.width = window.innerWidth/1.6;
        main.style.height = main.style.width;
        reAssign_mainDiv_sizes(window.innerWidth);
    }
    reAssign_texts_forUnPlayableSize(window.innerWidth, window.innerHeight);
    //const texts_WhenHitAnUnPlayableSizeContainer = document.querySelector('#texts_WhenHitAnUnPlayableSize');
}

function reAssign_texts_forUnPlayableSize(currentWidth, currentHeight) {
    const minWidth = 372, minHeight = 250;

    if(currentWidth < minWidth && currentHeight < minHeight) {
        texts_WhenHitAnUnPlayableSize[0].textContent = 'Provide more Width and Height in order to play';
        check_and_change_status_of_winningDivAndRestartingDiv_popInAnimation();
    }
    else if(currentWidth < minWidth) {
        texts_WhenHitAnUnPlayableSize[0].textContent = 'Provide more Width in order to play';
        check_and_change_status_of_winningDivAndRestartingDiv_popInAnimation();
    }
    else if(currentHeight < minHeight) {
        texts_WhenHitAnUnPlayableSize[0].textContent = 'Provide more Height in order to play';
        check_and_change_status_of_winningDivAndRestartingDiv_popInAnimation();
    } else if(popIn_winningAndRestartingDivAfterWidthAndHeightAreProvided) {
        winningAndRestartingDiv.style = '';
        winningAndRestartingDiv.style.opacity = 1;
        winningAndRestartingDiv.style.pointerEvents = 'auto'
        void winningAndRestartingDiv.offsetWidth;
        winningAndRestartingDiv.style.display = 'flex';
        winningAndRestartingDiv.style.animation = 'popInElementFromCenter 0.3s ease-in-out forwards';
        popIn_winningAndRestartingDivAfterWidthAndHeightAreProvided = false;
    }
    
    winningAndRestartingDiv.style.left = currentWidth / 2;
    winningAndRestartingDiv.style.top = currentHeight / 2;
}

function check_and_change_status_of_winningDivAndRestartingDiv_popInAnimation() {
    if(winningAndRestartingDivIsVisible) {
        popIn_winningAndRestartingDivAfterWidthAndHeightAreProvided = true;
    }
}

function reAssign_mainDiv_sizes(dependedOn_value) {
    let newFontSize = 2.5 / 10 * dependedOn_value / 1.6 / columnsAndRowsLength;
    if(newFontSize < 10) {
        newFontSize = 10;
    }
    document.querySelectorAll('main div').forEach(square=> {
        let span = square.querySelector('span');
        if(span != null) {
            span.style.fontSize = newFontSize;
        }
        let drawings = square.querySelectorAll('div');
        drawings.forEach((drawing, index)=> {
            let half_the_width = square.clientWidth / 2
                , half_the_height = square.clientHeight / 2;
            drawing.style.left = half_the_width;
            drawing.style.top = half_the_height;

            let drawing_className = drawing.className.toString();

            if(drawing_className.startsWith('line')) {
                let main_className = drawing_className.substring(5);
                //console.log(main_className);
                /*let main_classNames = [
                    'top_to_down', 'left_to_Right', 'downLeft_to_topRight', 'topLeft_to_downRight'
                ];*/
                handle_WinningLine_styles(square, drawing, main_className);
                
            } else {
                drawing.style.transform = 'translate(-50%, -50%)';
                if(drawing_className[0] == 'X') {
                    if(drawing_className.charAt(drawing_className.length - 1) == '1') {
                        drawing.style.transform+= ' rotate(-45deg)';
                    } else {
                        drawing.style.transform+= ' rotate(45deg)';
                    }
                }
            }
        });
    });
    /*document.querySelectorAll('main div span').forEach(span=> {
       
    });*/
    function handle_WinningLine_styles(square, drawing, main_className) {

        let main_transformOrigin = drawing.style.transformOrigin;

        //top_to_down
        if(/*main_className[0] == 't' && */main_className[main_className.length - 1] == 'n') {
            const yDimension = ['top', 'bottom'];
            let index = checkIfLineIsNotUsingThisProperty(drawing.style.bottom) ? 0 : 1;
            //console.log(index);
            drawing.style.cssText = `
                ` + yDimension[index] + `: -3px;
                ` + yDimension[1 - index] + `: unset;
                transform: 'translateX(-50%)';
                width: 4%;
                height: ` + get_straightLine_width(square) + `px;
            `;
        } 
        //left_to_right
        else if(main_className[0] == 'l') {
            const xDimension = ['left', 'right'];
            let index = checkIfLineIsNotUsingThisProperty(drawing.style.right) ? 0 : 1;
            drawing.style.cssText = `
            ` + xDimension[index] + `: -2px;
            ` + xDimension[1 - index] + `: unset;
                transform: translateY(-50%);
                width: ` + get_straightLine_width(square) + `px;
                height: 4%;
            `;
        } 
        //downLeft_to_topRight
        else if(main_className[0] == 'd') {
            const xDimension = ['left', 'right'], yDimension = ['top', 'bottom'];
            let xIndex = checkIfLineIsNotUsingThisProperty(drawing.style.right) ? 0 : 1;
            let yIndex = checkIfLineIsNotUsingThisProperty(drawing.style.bottom) ? 0 : 1;
            drawing.style.cssText = `
                ` + yDimension[yIndex] + `: -2.5px;
                ` + xDimension[xIndex] + `: 1.5px;
                ` + yDimension[1 - yIndex] + `: unset;
                ` + xDimension[1 - xIndex] + `: unset;
                transform: rotate(-45deg);
                width: `+ get_rotatedLine_width(square) + `px;
                height: 4%;
            `;
        } 
        //topLeft_to_downRight
        else if(main_className[0] == 't') {
            const xDimension = ['left', 'right'], yDimension = ['top', 'bottom'];
            let xIndex = checkIfLineIsNotUsingThisProperty(drawing.style.right) ? 0 : 1;
            let yIndex = checkIfLineIsNotUsingThisProperty(drawing.style.bottom) ? 0 : 1;
            console.log(drawing.style.top);
            drawing.style.cssText = `
                ` + yDimension[yIndex] + `: -3px;
                ` + xDimension[xIndex] + `: -0.4px;
                ` + yDimension[1 - yIndex] + `: unset;
                ` + xDimension[1 - xIndex] + `: unset;
                transform: rotate(45deg);
                width: ` + get_rotatedLine_width(square) + `px;
                height: 4%;
            `;
        }
        drawing.style.cssText+= 'transform-origin: ' + main_transformOrigin + ';';
    }

    function checkIfLineIsNotUsingThisProperty(property) {
        return property == '' || property.toString()[0] == 'u';
    }
}

/*class style_elements {
    constructor(top, left, bottom, transform, width) {
        this.top = top;
        this.left = left;
        this.bottom = bottom;
        this.transform = transform;
        this.width = width;
    }
}*/

class Answer {
    constructor(winFlag, startIndex, finishIndex) {
        this.winFlag = winFlag;
        this.startIndex = startIndex;
        this.finishIndex = finishIndex;
    }
}
function createAnswer(winFlag, startIndex, finishIndex) {
    return new Answer(winFlag, startIndex, finishIndex);
}

function drawWinnerLine(startIndex, finishIndex) {
    let startToFinish = true;
    if(startIndex > finishIndex) {
        let temp = startIndex;
        startIndex = finishIndex;
        finishIndex = temp;
        startToFinish = false;
    }
    let startDiv = document.querySelector('main #div' + startIndex);
    let finishDiv = document.querySelector('main #div' + finishIndex);
    //startDiv.innerHTML += '<div class="winnerLine"></div>';
    let lineDiv = document.createElement('div');

    if(finishIndex - startIndex < columnsAndRowsLength) {
        lineDiv.className = 'line-left_to_Right';
        if(startToFinish) {
            lineDiv.style.transformOrigin = 'left';
        } else {
            lineDiv.style.transformOrigin = 'right';
        }
        lineDiv.style.width = get_straightLine_width(startDiv);
        startDiv.appendChild(lineDiv);
    } else if(startIndex % columnsAndRowsLength > finishIndex % columnsAndRowsLength) {
        lineDiv.className = 'line-downLeft_to_topRight';
        const xPosition = '1.5px', yPosition = '-2.5px';
        if(startToFinish) {
            lineDiv.style.transformOrigin = 'top right';
            lineDiv.style.right = xPosition;
            lineDiv.style.top = yPosition;
            lineDiv.style.width = get_rotatedLine_width(startDiv);
            startDiv.appendChild(lineDiv);
        } else {
            lineDiv.style.transformOrigin = 'bottom left';
            lineDiv.style.left = xPosition;
            lineDiv.style.bottom = yPosition;
            lineDiv.style.width = get_rotatedLine_width(finishDiv);
            finishDiv.appendChild(lineDiv);
        }
    } else if(startIndex % columnsAndRowsLength < finishIndex % columnsAndRowsLength) {
        lineDiv.className = 'line-topLeft_to_downRight';
        const xPosition = '-0.4px', yPosition = '-3px';
        if(startToFinish) {
            lineDiv.style.transformOrigin = 'right bottom';
            lineDiv.style.right = xPosition;
            lineDiv.style.bottom = yPosition;
            lineDiv.style.width = get_rotatedLine_width(finishDiv);
            finishDiv.appendChild(lineDiv);
        } else {
            lineDiv.style.transformOrigin = 'left';
            lineDiv.style.left = xPosition;
            lineDiv.style.top = yPosition;
            lineDiv.style.width = get_rotatedLine_width(startDiv);
            startDiv.appendChild(lineDiv);
        }
    } else {
        lineDiv.className = 'line-top_to_down';
        if(startToFinish) {
            lineDiv.style.transformOrigin = 'bottom';
        } else {
            lineDiv.style.transformOrigin = 'top';
        }
        lineDiv.style.height = get_straightLine_width(startDiv);
        startDiv.appendChild(lineDiv);
    }
    //lineDiv.style.animation = '';
}

let mainSizeContainerIsVisible = false;
const mainSizeContainer = document.querySelector('mainSizeContainer');
const size_showButton = document.getElementById('size_showButton');
const size_mainContentDiv = document.querySelector('mainSizeContainer #newSizeDiv');
size_showButton.addEventListener('mouseover', () => {
    if(mainSizeContainerIsVisible) {
        return;
    }
    mainSizeContainer.style.animation = 'popIn_some 0.1s ease-in forwards';
});
size_showButton.addEventListener('mouseout', () => {
    if(mainSizeContainerIsVisible) {
        return;
    }
    mainSizeContainer.style.animation = 'popOut_some 0.3s ease-out forwards';
});
size_showButton.addEventListener('click', ()=> {
    if(size_showButton.textContent == '>') {
        mainSizeContainer_popIn();
    } else {
        mainSizeContainer_popOut();
    }
});

/*document.addEventListener('click', e=> {
    console.log(e.target);
});*/

function mainSizeContainer_popIn() {
    mainSizeContainer.style.animation = 'popIn 0.5s ease forwards';
    size_mainContentDiv.style.left = '0%';
    size_mainContentDiv.style.pointerEvents = 'auto';
    size_showButton.textContent = '<';
    mainSizeContainerIsVisible = true;
}

function mainSizeContainer_popOut() {
    mainSizeContainer.style.animation = 'popOut 0.5s ease forwards';
    size_mainContentDiv.style.left = '-100%';
    size_mainContentDiv.style.pointerEvents = 'none';
    size_showButton.textContent = '>';
    mainSizeContainerIsVisible = false;
}


const newSize_dropDownList = document.getElementById('size_Adjust');
const otherSize_input = document.getElementById('otherSize');
const apply_newSize_button = document.getElementById('saveNewSize_button');

newSize_dropDownList.addEventListener('change', ()=> {
    let selectedIndex = newSize_dropDownList.selectedIndex;
    if(selectedIndex == 2) {
        otherSize_input.style.visibility = 'visible';
        return;
    }
    otherSize_input.style.visibility = 'hidden';
});

otherSize_input.addEventListener('focusin', ()=> {
    adjustingSize = true;
});
otherSize_input.addEventListener('focusout', ()=> {
    adjustingSize = false;
    sizeValidation(true);
});


otherSize_input.addEventListener('input', () => {
    if(otherSize_input.value == '') {
        return;
    }
    const minValue = 3, maxValue = 10, numbers = '0123456789';
    let input = otherSize_input.value;
    let lastInput = input.substring(0, input.length - 1);
    if(!numbers.includes(lastInput)) {
        otherSize_input.value = input.substring(0, input.length - 1);
    }
    if(Number(input) > maxValue) {
        otherSize_input.value = maxValue;
    }
});


function sizeValidation(checkEmpty) {
    const minValue = 3, maxValue = 10;
    let input = otherSize_input.value;
    if(input == '' && checkEmpty) {
        otherSize_input.value = minValue;
        return;
    }
    let value = Number(input);
    if(value.toString().includes('NaN')) {
        otherSize_input.value = minValue;
        return;
    }
    if(value < minValue) {
        otherSize_input.value = minValue;
    } else if(value > maxValue) {
        otherSize_input.value = maxValue;
    }
}
otherSize_input.addEventListener('keyup', e => {
    if(e.key != 'Enter') {
        return;
    }
    sizeValidation(true);
    checkAndApplyNewSize();
});
apply_newSize_button.addEventListener('click', checkAndApplyNewSize);

function checkAndApplyNewSize() {
    if(otherSize_input.style.visibility == 'visible' && otherSize_input.value == '') {
        return;
    }
    let size_dropDownListSelectedIndex = newSize_dropDownList.selectedIndex;
    let newLength;
    if(size_dropDownListSelectedIndex == 0) {
        newLength = 3;
    } else if(size_dropDownListSelectedIndex == 1) {
        newLength = 5;
    } else {
        newLength = Number(otherSize_input.value);
    }
    if(newLength == columnsAndRowsLength) {
        return;
    }
    columnsAndRowsLength = newLength;
    resetVariables(true);
    placeID_span.textContent = '';
    createSquares();
}
function resetVariables(restartEverything) {
    if(restartEverything) {
        amount = reAssignAmount();
        places = Array(amount).fill(0);
    } else {
        places = places.fill(0);
    }
    placesTakenCounter = 0;
}

function restartEverything() {
    score_playerOne.textContent = 0;
    playerOne_Score = 0;
    playerTwo_Score = 0;
    score_playerTwo.textContent = 0;
    winningAndRestartingDiv_popOut();
}

winningAndRestartingDiv_restartEverythingButton.addEventListener('click', restartEverything);

document.addEventListener('click', e=> {
    if(e.clientX == 0 && e.clientY == 0) {
        return;
    }
    //console.log('nodeName: ' + e.target.nodeName);
    //console.log('id: ' + e.srcElement.id);
    let target = e.target || e.srcElement;
    let target_nodeName = target.nodeName, targetID = target.id;
    let particleColor = undefined;


    for(let loopToMakeSkippingPossible = 0; loopToMakeSkippingPossible < 1; loopToMakeSkippingPossible++) {
        if(mainSizeContainer.contains(target)) {
            particleColor = 'white';
        } else if(mainSizeContainerIsVisible/* && !mainSizeContainer.contains(current_element_under_the_mouse)*/) {
            mainSizeContainer_popOut();
        }
        if(main.contains(target)) {
            return;
        }
        if(target_nodeName == 'SELECT') {
            particleColor = 'blue';
            break;
        }
        if(disablePlaying) {
            if(target_nodeName != 'SCORE') {
                return;
            }
            particleColor = 'white';
            break;
        }
        const nodeNames_for_elements_with_disabled_clickEffect = ['INPUT', 'BUTTON', 'SPAN'];
        for(let nodeName of nodeNames_for_elements_with_disabled_clickEffect) {
            if(target_nodeName == nodeName) {
                return;
            }
        }
        
    }
    //console.log('X: ' + e.clientX, 'Y: ' + e.clientY);
    create_clickEffect(e, particleColor);
});

function create_clickEffect(e, particleColor) {
    let currentX = e.clientX, currentY = e.clientY;

    let container = createDiv_andBindClassNameToIt('particles');

    sign_top_and_left(container, currentX, currentY);

    let topBottom = createDiv_andBindClassNameToIt('topBottom');
    let top = createDiv_andBindClassNameToIt('top');
    let bottom = createDiv_andBindClassNameToIt('bottom');
    appendChilds(topBottom, [top, bottom]);

    let leftRight = createDiv_andBindClassNameToIt('leftRight');
    let left = createDiv_andBindClassNameToIt('left');
    let right = createDiv_andBindClassNameToIt('right');

    appendChilds(leftRight, [left, right]);

    particle_color_organizer([top, bottom, left, right], particleColor);

    appendChilds(container, [topBottom, leftRight]);
    
    document.body.appendChild(container);
    
    applyAnimation([top, bottom], 'top_and_bottom_show 0.1s ease-in forwards');
    applyAnimation([left, right], 'left_and_right_show 0.1s ease-in forwards');

    applyAnimation([topBottom, leftRight], 'increase_grid_gap 0.2s ease-in forwards 0.05s');
    applyAnimation([container], 'decrease_opacity 0.2s ease-in forwards 0.1s');

    setTimeout(() => {
        document.body.removeChild(container);
    }, 500);

}


function newDiv() {
    return document.createElement('div');
}
function bindClassName(element, classNameToBind) {
    element.className = classNameToBind;
}
function createDiv_andBindClassNameToIt(classNameToBind) {
    let div = newDiv();
    bindClassName(div, classNameToBind);
    return div;
}

function appendChilds(parent, childs) {
    childs.forEach(child=> {
        parent.appendChild(child);
    });
}
function sign_top_and_left(element, left, top) {
    element.style.left = left;
    element.style.top = top;
}

function applyAnimation(elements, animation) {
    elements.forEach(element=> {
        element.style.animation = animation;
    });
}

function particle_black_color(elementsToAffect) {
    elementsToAffect.forEach(element=> {
        element.style.backgroundColor = 'black';
    });
}
function particle_click_on_specific_target_colorCustomization(elementsToAffect, color) {
    elementsToAffect.forEach(element=> {
        element.style.backgroundColor = color;
    });
}
function particle_color_organizer(elementsToAffect, color) {
    if(color == undefined) {
        particle_black_color(elementsToAffect);
    } else {
        particle_click_on_specific_target_colorCustomization(elementsToAffect, color);
    }
}

let enable_mouse_div = false;

const mouse_div = document.querySelector('#mouse_div');
document.addEventListener('mousemove', reset_mouse_div_position);

function reset_mouse_div_position(e) {
    if(!enable_mouse_div) {
        return;
    }
    let currentX = e.clientX, currentY = e.clientY;
    mouse_div.style.left = currentX;
    mouse_div.style.top = currentY;
}

/*const mainOpacityAdjustmentContainer = document.querySelector('mainOpacityAdjustmentContainer');
const opacityCircle = document.querySelector('mainOpacityAdjustmentContainer #circle');

opacityCircle.addEventListener('mousedown', adjustOpacity);

let lastX;

function adjustOpacity(e) {
    let currentX = e.clientX;
    let maxWidth = mainOpacityAdjustmentContainer.clientWidth;
    let availableWidth = window.innerWidth;
    console.log('currentX: ' + currentX);
    console.log(availableWidth);
    let newX = (currentX / availableWidth * 100);
    opacityCircle.style.left = newX + '%';
}
function devide_two_pixeled_numbers(firstNumber, secondNumber) {
    return get_main_number_fromAnPixeledNumber(firstNumber) / get_main_number_fromAnPixeledNumber(secondNumber);
}*/

function get_main_number_fromAnPixeledNumber(pixeledNumber) {
    return Number(pixeledNumber.substring(0, pixeledNumber.length - 2));
}

function get_straightLine_width(square) {
    return Number(square.getBoundingClientRect().width) * 3 + get_additionalWidth();
}

function get_rotatedLine_width(square) {
    return Math.pow(2, 0.5) * Number(square.getBoundingClientRect().width) * 3 + get_additionalWidth();
}
function get_additionalWidth() {
    return Math.pow(2, 0.5) * 4 + 6;
}
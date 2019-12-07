// https://segmentfault.com/a/1190000009826648

var chessBoard = []; //儲存棋盤上落子的情況

var me = true;
var over = false;

// 保存所有贏法的陣列
var wins = [];
//贏法的統計陣列
var myWin = [];
var computerWin = [];

for (var i = 0; i < 15; i++) {
    chessBoard[i] = [];
    for (var j = 0; j < 15; j++) {
        chessBoard[i][j] = 0;
    }
}

for (var i = 0; i < 15; i++) {
    wins[i] = [];
    for (var j = 0; j < 15; j++) {
        wins[i][j] = [];
    }
}

//所有橫線的贏法
var count = 0;
for (var i = 0; i < 15; i++) {
    for (var j = 0; j < 11; j++) {
        for (var k = 0; k < 5; k++) {
            wins[i][j + k][count] = true;
        }
        count++;
    }
}
//所有直線
for (var i = 0; i < 15; i++) {
    for (var j = 0; j < 11; j++) {
        for (var k = 0; k < 5; k++) {
            wins[j + k][i][count] = true;
        }
        count++;
    }
}

//所有斜線
for (var i = 0; i < 11; i++) {
    for (var j = 0; j < 11; j++) {
        for (var k = 0; k < 5; k++) {
            wins[i + k][j + k][count] = true;
        }
        count++;
    }
}

//所有反斜線
for (var i = 0; i < 11; i++) {
    for (var j = 14; j > 3; j--) {
        for (var k = 0; k < 5; k++) {
            wins[i + k][j - k][count] = true;
        }
        count++;
    }
}
console.log(count);

for (var i = 0; i < count; i++) {
    myWin[i] = 0;
    computerWin[i] = 0;
}

var canvas = document.getElementById("canvas");
canvas.width = 450;
canvas.height = 450;
var cxt = canvas.getContext("2d");

cxt.strokeStyle = "black";

for (var i = 0; i < 15; i++) {
    cxt.moveTo(15 + i * 30, 15);
    cxt.lineTo(15 + i * 30, 435);
    cxt.stroke();
    cxt.moveTo(15, 15 + i * 30);
    cxt.lineTo(435, 15 + i * 30);
    cxt.stroke();
}

oneStep = function (i, j, me) {
    //i,j ＝棋盤上索引, me 黑棋或白棋
    cxt.beginPath();
    cxt.arc(15 + i * 30, 15 + j * 30, 13, 0, 2 * this.Math.PI);
    cxt.closePath();
    var gradient = cxt.createRadialGradient(
        15 + i * 30 + 2,
        15 + j * 30 - 2,
        13,
        15 + i * 30 + 2,
        15 + j * 30 - 2,
        0
    );
    if (me) {
        gradient.addColorStop(0, "#0a0a0a");
        gradient.addColorStop(1, "#636766");
    } else {
        gradient.addColorStop(0, "#D1D1D1");
        gradient.addColorStop(1, "#F9F9F9");
    }

    cxt.fillStyle = gradient;
    cxt.fill();
};

canvas.onclick = function (e) {
    if (over) {
        return;
    }
    if (!me) {
        return;
    }
    var x = e.offsetX;
    var y = e.offsetY;
    var i = Math.floor(x / 30);
    var j = Math.floor(y / 30);

    if (chessBoard[i][j] === 0) {
        oneStep(i, j, me);

        chessBoard[i][j] = 1;

        for (var k = 0; k < count; k++) {
            if (wins[i][j][k]) {
                if (chessBoard[i][j] == 1) {
                    myWin[k]++;
                    computerWin[k] = 6;
                    if (myWin[k] === 5) {
                        window.alert("你贏了");
                        over = true;
                    }
                } else {
                    myWin[k] = 6;
                    computerWin[k]++;
                    if (computerWin[k] == 5) {
                        window.alert("電腦贏了");
                        over = true;
                    }
                }
            }
        }
        if (!over) {
            me = !me;
            computerAI();
        }
    }
};

var computerAI = function () {
    var myScore = [];
    var computerScore = [];
    var max = 0;
    var u = 0;
    var v = 0;

    for (var i = 0; i < 15; i++) {
        myScore[i] = [];
        computerScore[i] = [];
        for (var j = 0; j < 15; j++) {
            myScore[i][j] = 0;
            computerScore[i][j] = 0;
        }
    }
    for (var i = 0; i < 15; i++) {
        for (var j = 0; j < 15; j++) {
            if (chessBoard[i][j] == 0) {
                for (var k = 0; k < count; k++) {
                    if (wins[i][j][k]) {
                        if (myWin[k] == 1) {
                            myScore[i][j] += 200;
                        } else if (myWin[k] == 2) {
                            myScore[i][j] += 400;
                        } else if (myWin[k] == 3) {
                            myScore[i][j] += 2000;
                        } else if (myWin[k] == 4) {
                            myScore[i][j] += 10000;
                        }
                        if (computerWin[k] == 1) {
                            computerScore[i][j] += 220;
                        } else if (computerWin[k] == 2) {
                            computerScore[i][j] += 420;
                        } else if (computerWin[k] == 3) {
                            computerScore[i][j] += 2100;
                        } else if (computerWin[k] == 4) {
                            computerScore[i][j] += 20000;
                        }
                    }
                }



            }

            if (myScore[i][j] > max) {
                max = myScore[i][j];
                u = i;
                v = j;
            } else if (myScore[i][j] == max) {
                if (computerScore[i][j] > computerScore[u][v]) {
                    if (myScore[i][j] > myScore[u][v]) {
                        u = i;
                        v = j;
                    }
                }
            }
        }
    }
    oneStep(u, v, false);
    chessBoard[u][v] = 2;
    for (var k = 0; k < count; k++) {
        if (wins[u][v][k]) {

            computerWin[k]++;
            myWin[k] = 6;
            if (computerWin[k] === 5) {
                window.alert("電腦贏了");
                over = true;
            }

        }
    }
    if (!over) {
        me = !me;

    }


};
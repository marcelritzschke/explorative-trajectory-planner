function clearCanvas() {
    var c = document.getElementById("mainView");
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
}

function drawDiagonal() {
    var c = document.getElementById("mainView");
    var ctx = c.getContext("2d");
    ctx.moveTo(0, 0);
    ctx.lineTo(c.width, c.height);
    ctx.stroke();
}

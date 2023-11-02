

export const sketch = (div) => {
    const sk = new Object()

    // Get the canvas element and its context
    sk.canvas = document.getElementById(div);
    console.log("canvas:",sk.canvas)
    sk.context = sk.canvas.getContext("2d");
    console.log("context",sk.context)

    sk.isDrawing = false;

    // Drawing parms
    sk.context.font = "30px Arial";
    sk.context.fillStyle = "black";
    sk.context.fillText("Hello, Canvas!", 50, 350); // (text, x, y)
    sk.context.strokeStyle = "blue";
    sk.context.lineWidth = 5;

    // Event listeners to start and stop drawing
    sk.canvas.addEventListener("mousedown", function (e) {
        sk.isDrawing = true;
        sk.context.beginPath();
        var x = e.clientX - sk.canvas.getBoundingClientRect().left;
        var y = e.clientY - sk.canvas.getBoundingClientRect().top;
        sk.context.moveTo(x, y);
    });

    sk.canvas.addEventListener("mouseup", function () {
        sk.isDrawing = false;
        sk.context.closePath();
    });

    sk.canvas.addEventListener("mousemove", function (e) {
        if (!sk.isDrawing) return;

        var x = e.clientX - sk.canvas.getBoundingClientRect().left;
        var y = e.clientY - sk.canvas.getBoundingClientRect().top;

        sk.context.lineTo(x, y);
        sk.context.strokeStyle = "blue";
        sk.context.lineWidth = 5;
        sk.context.stroke();
    });
    
    sk.clear = function () {
        sk.context.clearRect(0, 0, sk.canvas.width, sk.canvas.height);
    };
    
    // Function to get canvas as data URL
    sk.getData = function () {
        var dataURL = sk.canvas.toDataURL("image/png");
        console.log(dataURL);
        return dataUrl
    }
    
    return sk

}



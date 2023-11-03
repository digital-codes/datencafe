

export const result = (div,labels,values) => {
    const sk = new Object()

    // Get the canvas element and its context
    sk.canvas = document.getElementById(div);
    console.log("canvas:",sk.canvas)
    sk.context = sk.canvas.getContext("2d");
    console.log("context",sk.context)

    // Drawing parms
    sk.context.font = "9px Arial";
    sk.context.fillStyle = "black";
    sk.context.strokeStyle = "black";
    sk.context.lineWidth = 2;
    
    sk.context.clearRect(0, 0, sk.canvas.width, sk.canvas.height);

    const items = labels.length
    const colWidth = Math.floor( sk.canvas.width * .8 / items)
    const colHeight = Math.floor( sk.canvas.height * .8)
    const gap = Math.floor((sk.canvas.width - items * colWidth) / (items + 1))

    values.forEach((v,i) => {
        console.log("val:",v,i)    
        sk.context.beginPath();
        const bx = gap + (colWidth + gap)  * i
        const bw = colWidth
        const by = Math.ceil(sk.canvas.height * .8) - Math.floor(v*colHeight)
        const bh = Math.floor(v*colHeight)
        console.log(bx,by,bw,bh,gap)
        sk.context.rect(bx, by, bw, bh)
        sk.context.fillStyle = "green"; // Set the fill color
        sk.context.fill(); // Fill the rectangle
        sk.context.lineWidth = 2; // Set the border width
        sk.context.strokeStyle = "red"; // Set the border color
        sk.context.stroke(); // Draw the border
        // sk.context.strokeText(labels[i], bx, sk.canvas.height - 10);            
        sk.context.fillText(labels[i], bx, sk.canvas.height - 10);            
    })

    

}



/**
 * functions for drawing board
 * require common_function.js jQuery 3.x
 * Created by wen on 2018/2/24.
 */

/**
 * initialize drawing board
 * @param element  String|Object(HTMLElement)
 * @return Object(drawingBoard)
 */
function initDrawingBoard(element)
{
    var drawingBoardJq = $(element);
    if (drawingBoardJq.length < 1)
    {
        addConsoleLog('[warnning] element not found in initDrawingBoard().');
        return null;
    }

    var canvasJq    = drawingBoardJq.find('canvas');
    var canvas      = drawingBoardJq.find('canvas')[0];

    // canvas's size is not the size in CSS
    canvas.width    = canvas.offsetWidth;
    canvas.height   = canvas.offsetHeight;

    // create drawingBoard object
    var drawingBoard = {
        name : 'drawingBoard',
        target : element,
        isTouching : false,
        touchPoint : {
            x : 0,
            y : 0
        },
        canvas : canvas,
        canvasContext : canvas.getContext('2d'),
        canvasWidth : canvas.width,
        canvasHeight : canvas.height,

        updateTouchPoint: function (point)
        {
            this.touchPoint = point;
        },

        drawLine: function (point1, point2)
        {
            this.canvasContext.beginPath();

            this.canvasContext.moveTo(point1.x, point1.y);
            this.canvasContext.lineTo(point2.x, point2.y);

            this.canvasContext.stroke();

            this.canvasContext.closePath();

            // this.canvasContext.draw(true);
        },

        setRainbowColor: function ()
        {
            var gradient = this.canvasContext.createLinearGradient(
                0, 0,
                this.canvasWidth, this.canvasHeight
            );

            gradient.addColorStop(0,"#f50a0a");
            gradient.addColorStop(0.083,"#f57f0a");
            gradient.addColorStop(0.16,"#f5f50a");
            gradient.addColorStop(0.25,"#7ff50a");
            gradient.addColorStop(0.333,"#0af50a");
            gradient.addColorStop(0.41,"#0af57f");
            gradient.addColorStop(0.5,"#0af5f5");
            gradient.addColorStop(0.583,"#0a7ff5");
            gradient.addColorStop(0.66,"#0a0af5");
            gradient.addColorStop(0.75,"#7f0af5");
            gradient.addColorStop(0.833,"#f50af5");
            gradient.addColorStop(0.91,"#f50a7f");
            gradient.addColorStop(1.0,"#f50a0a");

            this.canvasContext.strokeStyle = gradient;
        }
    };

    // set default canvas params
    var canvasContext   = drawingBoard.canvasContext;
    canvasContext.lineWidth     = drawingBoardJq.find('.toolbar .strokeSizeInputbox').val();;
    canvasContext.strokeStyle   = drawingBoardJq.find('.toolbar .colorSelectorButton').val();
    canvasContext.lineCap       = 'round';

    // set toolbar
    drawingBoardJq.find('.toolbar .strokeSizeInputbox').on('change', function ()
    {
        drawingBoard.canvasContext.lineWidth = this.value;
    });
    drawingBoardJq.find('.toolbar .colorSelectorButton').on('change', function ()
    {
        drawingBoard.canvasContext.strokeStyle = this.value;
    });
    drawingBoardJq.find('.toolbar .refreshCanvasButton').on('click', function ()
    {
        console.log('click the refresh canvas button.')
        initDrawingBoard(element);
    });

    drawingBoardJq.find('.toolbar .cleanCanvasButton').on('click', function ()
    {
        drawingBoard.canvasContext.fillStyle = "#FFF";
        // drawingBoard.canvasContext.fillRect(0,0,300,150);
        drawingBoard.canvasContext.clearRect(0, 0,
            drawingBoard.canvasWidth, drawingBoard.canvasHeight);
    });

    // set touch start event
    canvas.ontouchstart = (function (event)
    {
        addDebugLog('touch start.');

        if (event.touches.length > 1)
        {
            return;
        }

        if (getDebugStatus())
        {
            console.log(event.touches[0]);
        }

        drawingBoard.isTouching = true;

        var newTouchPoint = {
            x: event.touches[0].pageX - drawingBoard.canvas.offsetLeft,
            y: event.touches[0].pageY - drawingBoard.canvas.offsetTop
        };

        drawingBoard.updateTouchPoint(newTouchPoint);
    });

    // set touch end event
    canvas.ontouchend = (function (event)
    {
        addDebugLog('touch end.');

        if (getDebugStatus())
        {
            console.log(event.touches[0]);
        }

        drawingBoard.isTouching = false;
    });

    // set touch move event
    canvas.ontouchmove = (function (event)
    {
        event.preventDefault();

        addDebugLog('touch move.');

        if (event.touches.length > 1)
        {
            return;
        }

        if (getDebugStatus())
        {
            console.log(event.touches[0]);
        }

        var newTouchPoint = {
            x: event.touches[0].pageX - drawingBoard.canvas.offsetLeft,
            y: event.touches[0].pageY - drawingBoard.canvas.offsetTop
        };

        if (drawingBoard.isTouching && drawingBoard.touchPoint)
        {
            drawingBoard.drawLine(drawingBoard.touchPoint, newTouchPoint);
        }

        drawingBoard.updateTouchPoint(newTouchPoint);
    });

    var drawDemoImage = (function (ctx)
    {
        // Draw coordinates
        ctx.arc(100, 75, 50, 0, 2 * Math.PI);
        ctx.fillStyle = '#EEEEEE';
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(40, 75);
        ctx.lineTo(160, 75);
        ctx.moveTo(100, 15);
        ctx.lineTo(100, 135);
        ctx.strokeStyle = '#AAAAAA';
        ctx.stroke();

        ctx.fontSize = 12;
        ctx.fillStyle = '#000';
        ctx.fillText('0', 165, 78);
        ctx.fillText('0.5*PI', 83, 145);
        ctx.fillText('1*PI', 15, 78);
        ctx.fillText('1.5*PI', 83, 10);

        // Draw points
        ctx.beginPath();
        ctx.arc(100, 75, 2, 0, 2 * Math.PI);
        ctx.fillStyle = '#3E3';
        ctx.fill();

        ctx.beginPath()
        ctx.arc(100, 25, 2, 0, 2 * Math.PI);
        ctx.fillStyle = '#33E';
        ctx.fill();

        ctx.beginPath()
        ctx.arc(150, 75, 2, 0, 2 * Math.PI);
        ctx.fillStyle = '#E33';
        ctx.fill();

        // Draw arc
        ctx.beginPath()
        ctx.arc(100, 75, 50, 0, 1.5 * Math.PI);
        ctx.fillStyle = '#333';
        ctx.stroke();

        // ctx.draw();
    });
    // drawDemoImage(drawingBoard.canvasContext);

    drawingBoard.setRainbowColor();

    // return drawingBoard object
    return drawingBoard;
}

$(document).ready(function ()
{
    if ($('.drawingBoard').length)
    {
        app.drawBoardList = [];

        $('.drawingBoard').each(function ()
        {
            // skip hidden element
            if (this.offsetWidth == 0 || this.offsetHeight == 0)
            {
                return;
            }
            app.drawBoardList.push(initDrawingBoard(this));
        });
    }
});


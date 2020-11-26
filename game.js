/**
 * Created by Kevin on 2019/3/6.
 */

/**
 * Game Controller
 * view control use Vue
 * @var Object
 */
var game = (function(){

    return {

        id : 'green-reversi-game',
        horizontalCellCount: 8,
        verticalCellCount: 8,
        blackPieceNumber: 1,
        whitePieceNumber: 2,

        /**
         * state in each cell, 0: empty, 1: black, 2: white
         * @var Array
         */
        cellState: [
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 2, 1, 0, 0, 0],
            [0, 0, 0, 1, 2, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0]
        ],
        cellInitState: [
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 2, 1, 0, 0, 0],
            [0, 0, 0, 1, 2, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0]
        ],
        cellScoreMap : [
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0]
        ],
        colorNow: 1,
        robot : null,
        computerColor : 2,
        availableCells: [],
        xCoordinate: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
        yCoordinate: ['1', '2', '3', '4', '5', '6', '7', '8'],
        directions: [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1], [0, 1],
            [1, -1], [1, 0], [1, 1]
        ],
        vsType : 'vs_player',
        // action force for black and white
        actionForce: [4, 4],

        internalPieceCount : [0,0],
        externalPieceCount : [2,2],
        // score
        score : [2, 2],
        // log each place
        placeStack: [],
        view: null,

        robotApi : null,

        init: function () {
            this.initView();

            var vsType = getSessionData(this.id + '_vsType') || null;
            if (vsType)
            {
                this.vsType = vsType;
            }

            this.startGame();
        },
        initView : function () {
            var me = this;
            this.view = new Vue({
                el : '#reversiGame',
                data : {
                    horizontalCellCount : me.horizontalCellCount,
                    verticalCellCount : me.verticalCellCount,
                    cellState : me.cellState,
                    game : me,
                    colorNow : me.colorNow,
                    xCoordinate : me.xCoordinate,
                    yCoordinate : me.yCoordinate,
                    score : me.score,
                    enableAssist : false,
                    showReferenceScore : false,
                    robotList : [],
                },
                methods : {
                    update : function(){

                    },
                    updateCellState : function(data){
                        this.cellState = data;
                    },
                    onDown : function (event){
                        var rowIndex = parseInt(event.currentTarget.dataset.row);
                        var cellIndex = parseInt(event.currentTarget.dataset.cell);
                        this.game.computerColor = this.game.getReverseColorNumber(this.game.colorNow);
                        this.game.addPiece(rowIndex, cellIndex);
                    },
                    cellIsAvailable : function (rowIndex, cellIndex){
                        return this.game.canAddPiece(rowIndex, cellIndex);
                    },
                    onChangeVsType : function (event) {
                        // save data
                        var value = event.currentTarget.value;
                        setSessionData(this.game.id + '_vsType', value);

                    }
                }
            });
        },
        changeRobot : function(robot) {
            this.robot = robot;
        },
        startGame: function ()
        {
            // init all cells, copy cellInitState data to cellState.
            this.cellState = cloneArray(this.cellInitState);

            // black first
            this.colorNow = this.blackPieceNumber;

            // init score 2:2
            this.score = [2,2];

            // this action include computing action force
            this.computeAvailableCells();

            // compute action force

            // update view
            this.updateView();

            this.printSimpleDraftToConsole();
        },
        /**
         * add Piece in a cell
         * @param Number rowIndex
         * @param Number cellIndex
         */
        addPiece: function (rowIndex, cellIndex)
        {
            // update current cell and other pieces
            if (!this.canAddPiece(rowIndex, cellIndex)) {
                console.log('[info] current cell not allow place.');
                return;
            }

            // set color in cell
            this.cellState[rowIndex - 1][cellIndex - 1] = this.colorNow;

            // eat
            var directions = this.directions;
            var eatingList = [];

            // get list by each direction
            var eatingList = this.computeEatingCells(rowIndex, cellIndex, this.colorNow);

            // change pieces
            for (var i in eatingList) {
                // set to current color
                this.cellState[eatingList[i][0] - 1][eatingList[i][1] - 1] = this.colorNow;
            }

            // switch color
            this.colorNow = this.getReverseColorNumber(this.colorNow);

            // update score
            this.updateScore();

            // computer available cells, including compute action force
            this.computeAvailableCells();

            // check action
            this.checkActionForce();

            // update view
            this.updateView();

            // vs computer
            if (this.vsType == "vs_computer" && this.colorNow == this.computerColor)
            {
                var me = this;

                // window.setTimeout(this.computerAttack(), 700);
                window.setTimeout(function(){
                    me.robot.run();;
                }, 1000);
            }

            this.printSimpleDraftToConsole();
        },
        computeEatingCells : function (rowIndex, cellIndex, color)
        {
            var directions = this.directions;
            var eatingList = [];

            // get list by each direction
            for (var dirIndex = 0; dirIndex < directions.length; dirIndex++) {
                // get neighboring cell
                var tempCheckEmptyCell = {
                    row: rowIndex + directions[dirIndex][0],
                    cell: cellIndex + directions[dirIndex][1]
                };

                var reverseColorList = [];
                do {
                    // out of area
                    if (tempCheckEmptyCell.row < 1 || tempCheckEmptyCell.row > 8
                        || tempCheckEmptyCell.cell < 1 || tempCheckEmptyCell.cell > 8) {
                        // go to check next direction.
                        break;
                    }

                    // neighboring cell is reverse color, add it to list.
                    if (this.cellState[tempCheckEmptyCell.row - 1][tempCheckEmptyCell.cell - 1]
                        == this.getReverseColorNumber(color)) {
                        reverseColorList.push([tempCheckEmptyCell.row, tempCheckEmptyCell.cell]);
                    }
                    // same color, and go to check next direction.
                    else if (this.cellState[tempCheckEmptyCell.row - 1][tempCheckEmptyCell.cell - 1] == this.colorNow) {
                        for (var i in reverseColorList) {
                            eatingList.push(reverseColorList[i]);
                        }
                        break;
                    }
                    // empty cell, and go to check next direction.
                    else {
                        break;
                    }

                    tempCheckEmptyCell.row += directions[dirIndex][0];
                    tempCheckEmptyCell.cell += directions[dirIndex][1];
                }
                while (tempCheckEmptyCell.row >= 1 && tempCheckEmptyCell.row <= 8 &&
                tempCheckEmptyCell.cell >= 1 && tempCheckEmptyCell.cell <= 8)
            }

            return eatingList;
        },
        /**
         * check a cell if can add a piece
         * @param Number rowIndex
         * @param Number cellIndex
         * @returns Boolean
         */
        canAddPiece: function (rowIndex, cellIndex) {

            // check cell state
            if (this.cellState[rowIndex - 1][cellIndex - 1] != 0) {
                // console.log('This cell already has piece.');
                return false;
            }

            // check available
            var available = false;
            for (var i in this.availableCells) {
                if (this.availableCells[i][0] == rowIndex && this.availableCells[i][1] == cellIndex) {
                    available = true;
                }
                else {
                    continue;
                }
            }

            return available;
        },
        /**
         * compute available cells by color
         * @param Number color
         * @return Array([rowIndex, cellIndex])
         */
        computeAvailableCellsByColor : function (color)
        {
            var availableCells = [];
            var result = false;

            // traversal each cell
            for (var rowIndex = 1; rowIndex <= 8; rowIndex++) {
                for (var cellIndex = 1; cellIndex <= 8; cellIndex++)
                {
                    // filter empty cell
                    if (this.cellState[rowIndex - 1][cellIndex - 1] != 0) {
                        continue;
                    }

                    result = this.checkCellAvailable(rowIndex, cellIndex, color);
                    if (result) {
                        availableCells.push([rowIndex, cellIndex]);
                    }
                }
            }

            return availableCells;
        },
        computeAvailableCells: function () {

            var cells = this.availableCells = this.computeAvailableCellsByColor(this.colorNow);
            var cellsReverseColor = this.computeAvailableCellsByColor(this.getReverseColorNumber(this.colorNow));

            // log
            // var availableText = '';
            // for (var i in this.availableCells) {
            //     availableText += ' ' + this.availableCells[i].toString();
            // }
            // console.log('[info] available cells: ' + availableText);

            // if (this.robot)
            // {
            //     var cellScoreData = [];
            //     for (var i in cells) {
            //         cellScoreData.push({
            //             rowIndex : cells[i][0],
            //             cellIndex : cells[i][1],
            //             score : this.robot.computeCellSuperiority(cells[i][0], cells[i][1], this.colorNow)
            //         });
            //     }
            //     this.updateScoreMap(cellScoreData);
            // }

            // result
            var AvailableCells = [];

            // result and update action force
            if (this.colorNow == 1)
            {
                AvailableCells[0] = cells;
                AvailableCells[1] = cellsReverseColor;
                this.actionForce = [cells.length, cellsReverseColor.length];
            }
            else
            {
                AvailableCells[0] = cellsReverseColor;
                AvailableCells[1] = cells;
                this.actionForce = [cellsReverseColor.length, cells.length];
            }

            return AvailableCells;
        },
        // check a cell if allow
        checkCellAvailable: function (rowIndex, cellIndex, colorNumber) {
            var directions = this.directions;
            var available = false;

            // according to 8 direction
            for (var dirIndex = 0; dirIndex < directions.length; dirIndex++)
            {
                // get neighboring cell
                var tempCheckEmptyCell = {
                    row     : rowIndex  + directions[dirIndex][0],
                    cell    : cellIndex + directions[dirIndex][1]
                };

                // out of area, next direction
                if (    tempCheckEmptyCell.row < 1  || tempCheckEmptyCell.row > 8
                    ||  tempCheckEmptyCell.cell < 1 || tempCheckEmptyCell.cell > 8) {
                    continue;
                }

                // neighboring cell is not the reverse color, next direction
                if (this.cellState[tempCheckEmptyCell.row - 1][tempCheckEmptyCell.cell - 1] != this.getReverseColorNumber(colorNumber)) {
                    continue;
                }

                // tempCheckEmptyCell.row += directions[dirIndex][0];
                // tempCheckEmptyCell.cell += directions[dirIndex][1];

                while (tempCheckEmptyCell.row >= 1 && tempCheckEmptyCell.row <= 8 &&
                        tempCheckEmptyCell.cell >= 1 && tempCheckEmptyCell.cell <= 8)
                {
                    // has same color, it allow place current color.
                    if (this.cellState[tempCheckEmptyCell.row - 1][tempCheckEmptyCell.cell - 1] == colorNumber) {
                        return true;
                    }
                    // empty cell
                    if (this.cellState[tempCheckEmptyCell.row - 1][tempCheckEmptyCell.cell - 1] == 0) {
                        break;
                    }

                    tempCheckEmptyCell.row += directions[dirIndex][0];
                    tempCheckEmptyCell.cell += directions[dirIndex][1];
                }
            }

            // this cell not allow place current color.
            return false;
        },
        getReverseColorNumber: function (colorNumber) {
            return colorNumber == 1 ? 2 : 1;
        },
        randomForward : function (stepCount)
        {
            var me = this;
            var next = (function(){

                var availableCells = me.availableCells;
                var randomIndex = Math.floor(Math.random() * availableCells.length);
                me.addPiece(availableCells[randomIndex][0], availableCells[randomIndex][1]);

                    stepCount--;
                if (stepCount > 1)
                {
                    window.setTimeout(next, 500);
                }
            });

            next();
        },
        // finish game
        finish: function () {

            // counting, empty cell belong to winner
            var black = 0;
            var white = 0;
            var emptyCell = 0;

            for (var rowIndex=1; rowIndex<=this.verticalCellCount; rowIndex++)
            {
                for (var cellIndex=1; cellIndex<=this.horizontalCellCount; cellIndex++)
                {
                    switch (this.cellState[rowIndex-1][cellIndex-1])
                    {
                        case 0 : emptyCell++; break;
                        case 1 : black++; break;
                        case 2 : white++; break;
                    }
                }
            }

            if (black > white)
            {
                black += emptyCell;
                this.score = [black, white];
                alert(parseNativeLang('black_win'));
            }
            else if (white > black)
            {
                white += emptyCell;
                this.score = [black, white];
                alert(parseNativeLang('white_win'));
            }
            else
            {
                alert(parseNativeLang('tie'));
            }

        },
        //
        checkActionForce : function (){

            // both black and white no and action force, then finish game.
            if (this.actionForce[0] == 0 && this.actionForce[1] == 0)
            {
                this.finish();
                return;
            }

            // if current no any action force, then turn next.
            // this.actionForce[this.colorNow - 1] = this.availableCells;
            if (this.availableCells.length < 1)
            {
                this.colorNow = this.getReverseColorNumber(this.colorNow);
                this.computeAvailableCells();
                this.updateView();
            }
        },
        updateScore : function () {
            var black = 0;
            var white = 0;
            for (var rowIndex=1; rowIndex<=this.verticalCellCount; rowIndex++)
            {
                for (var cellIndex=1; cellIndex<=this.horizontalCellCount; cellIndex++)
                {
                    this.cellState[rowIndex-1][cellIndex-1] == 1 ? black++ : null;
                    this.cellState[rowIndex-1][cellIndex-1] == 2 ? white++ : null;
                }
            }

            this.score = [black,white];
        },
        /**
         *
         * @param Array data  [Object{rowIndex, cellIndex, score}]
         */
        updateScoreMap : function (data)
        {
            // clean old cell score data
            this.cellScoreMap = [
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0]
            ];

            for (var i in data)
            {
                var item = data[i];
                this.cellScoreMap[item.rowIndex - 1][item.cellIndex - 1] = item.score;
            }
        },
        updateView : function () {
            this.view.updateCellState(this.cellState);
            this.view.colorNow = this.colorNow;
            this.view.score = this.score;
        },
        printSimpleDraftToConsole : function () {
            var str = '';
            for (var tRowIndex = 0; tRowIndex < this.cellState.length; tRowIndex++)
            {
                for (var tCellIndex = 0; tCellIndex < this.cellState[tRowIndex].length; tCellIndex++)
                {
                    switch (this.cellState[tRowIndex][tCellIndex]) {
                        case 0 :
                            str += '  ';
                            break;
                        case 1 :
                            str += 'X ';
                            break;
                        case 2 :
                            str += 'O ';
                            break;
                    }
                }
                str += "\n";
            }
            addConsoleLog(str);
        }
    };

})();
game.init();


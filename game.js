/**
 * Created by Kevin on 2019/3/6.
 */

// @var Object
var game = (function(){

    return {
        /**
         * state in each cell, 0: empty, 1: black, 2: white
         * @var Array
         */
        horizontalCellCount: 8,
        verticalCellCount: 8,
        blackPieceNumber: 1,
        whitePieceNumber: 2,
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
        colorNow: 1,
        availableCells: [],
        xCoordinate: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
        yCoordinate: ['1', '2', '3', '4', '5', '6', '7', '8'],
        directions: [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1], [0, 1],
            [1, -1], [1, 0], [1, 1]
        ],
        // action force for black and white
        actionForce: [4, 4],
        // score
        score : [2, 2],
        // log each place
        placeStack: [],
        view: null,

        init: function () {
            this.startGame();
        },
        startGame: function ()
        {
            // init all cells, copy cellInitState data to cellState.
            this.cellState = cloneArray(this.cellInitState);

            // black first
            this.colorNow = this.blackPieceNumber;

            // update score
            this.updateScore();

            //
            this.updateAvailableCells();

            // check action force
            this.checkActionForce();

            // update view
            this.updateView();

        },
        /**
         * add Piece in a cell
         * @param Number rowIndex
         * @param Number cellIndex
         */
        addPiece: function (rowIndex, cellIndex) {
            // update current cell and other pieces
            if (!this.canAddPiece(rowIndex, cellIndex)) {
                console.log('[info] current cell not allow place.');
                return;
            }

            // update cell
            this.cellState[rowIndex - 1][cellIndex - 1] = this.colorNow;

            // eat
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
                        == this.getReverseColorNumber(this.colorNow)) {
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

            // change pieces
            for (var i in eatingList) {
                // set to current color
                this.cellState[eatingList[i][0] - 1][eatingList[i][1] - 1] = this.colorNow;
            }

            // switch color
            this.colorNow = this.getReverseColorNumber(this.colorNow);

            // update score
            this.updateScore();

            // update available cells
            this.updateAvailableCells();

            // check action
            this.checkActionForce();

            // update view
            this.updateView();
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
        updateAvailableCells: function () {
            this.availableCells = [];
            var result = false;

            for (var rowIndex = 1; rowIndex <= 8; rowIndex++) {
                for (var cellIndex = 1; cellIndex <= 8; cellIndex++) {
                    // filter empty cell
                    if (this.cellState[rowIndex - 1][cellIndex - 1] != 0) {
                        continue;
                    }

                    result = this.checkCellAvailable(rowIndex, cellIndex, this.colorNow);
                    if (result) {
                        this.availableCells.push([rowIndex, cellIndex]);
                    }
                }
            }

            var availableText = '';
            for (var i in this.availableCells) {
                availableText += ' ' + this.availableCells[i].toString();
            }
            console.log('[info] available cells: ' + availableText);
        },
        // check a cell if allow
        checkCellAvailable: function (rowIndex, cellIndex, colorNumber) {
            var directions = this.directions;
            var available = false;

            // according to 8 direction
            for (var dirIndex = 0; dirIndex < directions.length; dirIndex++) {
                // get neighboring cell
                var tempCheckEmptyCell = {
                    row: rowIndex + directions[dirIndex][0],
                    cell: cellIndex + directions[dirIndex][1]
                };

                // out of area
                if (tempCheckEmptyCell.row < 1 || tempCheckEmptyCell.row > 8
                    || tempCheckEmptyCell.cell < 1 || tempCheckEmptyCell.cell > 8) {
                    continue;
                }

                // neighboring cell is not the reverse color
                if (this.cellState[tempCheckEmptyCell.row - 1][tempCheckEmptyCell.cell - 1] != this.getReverseColorNumber(colorNumber)) {
                    continue;
                }

                tempCheckEmptyCell.row += directions[dirIndex][0];
                tempCheckEmptyCell.cell += directions[dirIndex][1];

                while (tempCheckEmptyCell.row >= 1 && tempCheckEmptyCell.row <= 8 &&
                tempCheckEmptyCell.cell >= 1 && tempCheckEmptyCell.cell <= 8) {
                    // has same color, it allow place current color.
                    if (this.cellState[tempCheckEmptyCell.row - 1][tempCheckEmptyCell.cell - 1] == colorNumber) {
                        return true;
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
        // finish game
        finish: function () {

        },
        //
        checkActionForce : function (){

            // both black and white no and action force
            if (this.actionForce[0] == 0 && this.actionForce[1] == 0)
            {
                this.finish();
                return;
            }

            this.actionForce[this.colorNow] = this.availableCells;
            if (this.availableCells.length < 1)
            {
                this.colorNow = this.getReverseColorNumber(this.colorNow);
                this.updateAvailableCells();
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
        updateView : function () {
            this.view.updateCellState(this.cellState);
            this.view.colorNow = this.colorNow;
            this.view.score = this.score;
        },
        computeBestCell : function () {
            var result = [];
            var bestScore = 0;
            
        }
    };

})();

game.view = new Vue({
    el : '#reversiGame',
    data : {
        horizontalCellCount : game.horizontalCellCount,
        verticalCellCount : game.verticalCellCount,
        cellState : game.cellState,
        game : game,
        colorNow : game.colorNow,
        xCoordinate : game.xCoordinate,
        yCoordinate : game.yCoordinate,
        score : game.score
    },
    methods : {
        update : function(){

        },
        updateCellState : function(data){
            this.cellState = data;
        },
        updateAvailableCells : function (data) {
        },
        onDown : function (event){
            var rowIndex = parseInt(event.currentTarget.dataset.row);
            var cellIndex = parseInt(event.currentTarget.dataset.cell);
            this.game.addPiece(rowIndex, cellIndex);
        },
        cellIsAvailable : function (rowIndex, cellIndex){
            return this.game.canAddPiece(rowIndex, cellIndex);
        }
    }
});

game.init();


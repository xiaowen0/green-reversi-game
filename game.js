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
        colorNow: 1,
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
                    enableAssist : false
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
                        var value = event.currentTarget.value;
                        setSessionData(this.game.id + '_vsType', value);
                    }
                }
            });
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
                window.setTimeout(this.computerAttack(), 700);
            }
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
         * @return Array
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
            var availableText = '';
            for (var i in this.availableCells) {
                availableText += ' ' + this.availableCells[i].toString();
            }
            console.log('[info] available cells: ' + availableText);

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
                alert('black win.');
            }
            else if (white > black)
            {
                white += emptyCell;
                this.score = [black, white];
                alert('white win.');
            }
            else
            {
                alert('tie.');
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
        updateView : function () {
            this.view.updateCellState(this.cellState);
            this.view.colorNow = this.colorNow;
            this.view.score = this.score;
        },
        checkIfInternal : function () {

        },
        computerAttack : function () {
            var cell = this.computeBestCell();
            this.addPiece(cell.rowIndex, cell.cellIndex);
        },
        computeBestCell : function () {
            var result = [];
            var bestCell = null;
            var bestScore = 0;

            // computer all cell's superiority
            for (var i=0; i<this.availableCells.length; i++)
            {
                result.push({
                    rowIndex : this.availableCells[i][0],
                    cellIndex : this.availableCells[i][1],
                    superiority : this.computeCellSuperiority(this.availableCells[i][0], this.availableCells[i][1], this.colorNow)
                });
            }

            for (var i=0; i<result.length; i++)
            {
                if (bestCell == null || result[i].superiority > bestScore)
                {
                    bestCell = result[i];
                    bestScore = result[i].superiority;
                }
            }

            return bestCell;
        },
        /**
         * compute cell's superiority
         * @param rowIndex
         * @param cellIndex
         * @param color
         * @return Number;
         */
        computeCellSuperiority : function (rowIndex, cellIndex, color)
        {
            var analysis = this.analyseCell(rowIndex, cellIndex, color);

            // approach center
            var result = (6 - analysis.offsetToCenter) * 2;

            // eat least
            result += (8 - analysis.internalCellIncrease + analysis.externalCellIncrease) * 8;

            // more internal cell
            result += analysis.internalCellIncrease;

            result -= analysis.externalCellIncrease * 4;

            // least neighboring empty
            result += 0 - 1 + (analysis.neighboringCount - analysis.neighboringEmptyCount) * 8;

            if (analysis.isEdge)
            {
                result--;
            }
            if (analysis.isCorner)
            {
                result += this.actionForce[color-1];
            }

            // check if is special cell
            if (   (rowIndex == 2 && cellIndex == 2)
                || (rowIndex == 2 && cellIndex == 7)
                || (rowIndex == 7 && cellIndex == 2)
                || (rowIndex == 7 && cellIndex == 7)
            )
            {
                result -= this.actionForce[this.getReverseColorNumber(color)-1];
            }

            // check if is last 2 line
            if ( rowIndex == 2 || rowIndex == 7
                || cellIndex == 2 || cellIndex == 7
            )
            {
                result -= 2;
            }

            // neighboring less reverse
            result -= (analysis.neighboringCount - analysis.neighboringReverseCount) * 2;

            // neighboring less empty
            result -= (analysis.neighboringCount - analysis.neighboringEmptyCount) + 8;

            result += analysis.eatingCellScore;


            return result;
        },
        /**
         * analyse cell
         * @param rowIndex
         * @param cellIndex
         * @param color
         * @return {
         *  neighboringCount, neighboringEmptyCount, neighboringEdgeCount, neighboringCornerCount, neighboringReverseCount
         *  isInternal, isExternal,
         *  internalCellIncrease, externalCellIncrease}
         */
        analyseCell : function (rowIndex, cellIndex, color)
        {
            var result = {};

            // analyse offset to center
            result.offsetToCenter = Math.abs(rowIndex-4) + Math.abs(cellIndex-4);

            // check if is edge
            if (rowIndex == 1 || rowIndex == 8
                || cellIndex == 1 || cellIndex == 8
            )
            {
                result.isEdge = true;
            }
            else
            {
                result.isEdge = false;
            }

            // check if is corner
            if (   (rowIndex == 1 && cellIndex == 1)
                || (rowIndex == 1 && cellIndex == 8)
                || (rowIndex == 8 && cellIndex == 1)
                || (rowIndex == 8 && cellIndex == 8)
            )
            {
                result.isCorner = true;
            }
            {
                result.isCorner = false;
            }

            // analyse neighboring, check neighboring empty cell, if is internal piece
            var directions = this.directions;
            var neighboringSituation = this.analyseCellNeighboringSituation(rowIndex, cellIndex);

            result.neighboringCount = neighboringSituation.count;
            result.neighboringReverseCount = neighboringSituation.reverse;
            result.neighboringEmptyCount = neighboringSituation.empty;
            result.neighboringEdgeCount = neighboringSituation.edge;
            result.neighboringCornerCount = neighboringSituation.corner;

            if (result.neighboringCount)
            {
                result.isInternal = false;
                result.isExternal = true;
            }
            else
            {
                result.isInternal = true;
                result.isExternal = false;
            }

            // analyse eating cell
            var eatingCells = this.computeEatingCells(rowIndex, cellIndex, color);
            result.internalCellIncrease = 0;
            result.externalCellIncrease = 0;
            result.eatingCellScore = 0;

            for (var i=0; i<eatingCells.length; i++)
            {
                var eatingCellNeighboringSituation = this.analyseCellNeighboringSituation(eatingCells[i][0], eatingCells[i][1], color);
                if (eatingCellNeighboringSituation.empty >= 1)
                {
                    result.externalCellIncrease++;
                }
                else
                {
                    result.internalCellIncrease++;
                }

                result.eatingCellScore += (eatingCellNeighboringSituation.reverse * 2 - eatingCellNeighboringSituation.count - eatingCellNeighboringSituation.empty);
            }

            return result;
        },
        analyseCellNeighboringSituation : function (rowIndex, cellIndex, color)
        {
            var directions = this.directions;
            var neighboringEmptyCount = 0;
            var result = {
                count : 0,
                empty : 0,
                edge : 0,
                corner : 0,
                reverse : 0
            };

            for (var dirIndex=0; dirIndex<directions.length; dirIndex++)
            {
                var neighboringCell = [
                    rowIndex+directions[dirIndex][0],
                    cellIndex+directions[dirIndex][1]
                ];

                // out of area
                if (neighboringCell[0] < 1 || neighboringCell[0] > 8
                    || neighboringCell[1] < 1 || neighboringCell[1] > 8
                )
                {
                    continue;
                }

                result.count++;
                if (this.cellState[neighboringCell[0]-1][neighboringCell[1]-1] == 0)
                {
                    neighboringEmptyCount++;
                }
                else if (this.cellState[neighboringCell[0]-1][neighboringCell[1]-1] == this.getReverseColorNumber(color))
                {
                    result.reverse++;
                }

                // edge
                if (neighboringCell[0] == 1 || neighboringCell[0] == 8
                    || neighboringCell[1] == 1 || neighboringCell[1] == 8
                )
                {
                    result.edge++;
                }

                // corner
                if (   (neighboringCell[0] == 1 && neighboringCell[1] == 1)
                    || (neighboringCell[0] == 1 && neighboringCell[1] == 8)
                    || (neighboringCell[0] == 8 && neighboringCell[1] == 1)
                    || (neighboringCell[0] == 8 && neighboringCell[1] == 8)
                )
                {
                    result.corner++;
                }

            }
            result.empty = neighboringEmptyCount;

            return result;
        }
    };

})();
game.init();


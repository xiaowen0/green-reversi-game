/**
 * Created by Kevin on 2019/3/7.
 */

var robot1 = {

    game : game,
    directions: [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
    ],
    /**
     * run state, value: computing waiting
     */
    state : 'waiting',
    timer : null,
    run : function ()
    {
        this.state = 'running';

        var me = this;
        var result = [];
        // object {rowIndex, cellIndex, superiority}
        var bestCell = null;
        var bestScore = 0;

        // computer all cell's superiority
        for (var i=0; i<me.game.availableCells.length; i++)
        {
            result.push({
                rowIndex : me.game.availableCells[i][0],
                cellIndex : me.game.availableCells[i][1],
                superiority : me.computeCellSuperiority(me.game.availableCells[i][0], me.game.availableCells[i][1], me.game.colorNow)
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

        this.game.addPiece(bestCell.rowIndex, bestCell.cellIndex);

        this.state = 'waiting';
    },
    /**
     * compute cell's superiority
     * need analyseCell function
     * @param rowIndex
     * @param cellIndex
     * @param color
     * @return Number;
     */
    computeCellSuperiority : function (rowIndex, cellIndex, color)
    {
        var me = this;

        var analysis = me.analyseCell(rowIndex, cellIndex, color);

        /**
         * analysis params weight
         * offsetToCenter  3
         * internalCellIncrease  4
         * externalCellIncrease  5
         * neighboring  2
         * edge  4
         * cornor  8
         */

        // log
        var log = this.game.formatPositionCode(rowIndex, cellIndex) +
            ' 中心距离' + analysis.offsetToCenter +
            ' 增加内子' + analysis.internalCellIncrease +
            ' 增加外子' + analysis.externalCellIncrease +
            ' 附近格子' + analysis.neighboringCount +
            ' 附近空格' + analysis.neighboringEmptyCount;
        analysis.isEdge ? log += ' 边' : null;
        analysis.isCorner ? log += ' 角' : null;

        // approach center
        var result = (7 - analysis.offsetToCenter + 3) * 3;

        // eat least
        result += (8 - analysis.internalCellIncrease + analysis.externalCellIncrease) * 4;

        // more internal cell
        // result += analysis.internalCellIncrease;

        result -= analysis.externalCellIncrease * 5;

        // least neighboring empty
        // result += 0 - 1 + (analysis.neighboringCount - analysis.neighboringEmptyCount) * 2;
        //
        if (analysis.isEdge)
        {
            result -= 4;
        }
        if (analysis.isCorner)
        {
            result += me.actionForce[color-1] * 8;
        }
        //
        // check if is special cell
        if (   (rowIndex == 2 && cellIndex == 2)
            || (rowIndex == 2 && cellIndex == 7)
            || (rowIndex == 7 && cellIndex == 2)
            || (rowIndex == 7 && cellIndex == 7)
        )
        {
            result -= 32;
        }
        //
        // check if is last 2 line
        if ( rowIndex == 2 || rowIndex == 7
            || cellIndex == 2 || cellIndex == 7
        )
        {
            result -= 16;
        }
        //
        // // neighboring less reverse
        // result -= (analysis.neighboringCount - analysis.neighboringReverseCount) * 2;
        //
        // neighboring less empty
        result -= (analysis.neighboringCount - analysis.neighboringEmptyCount) + 8;

        // result += analysis.eatingCellScore;

        log += ' 分数：'+ result;
        addConsoleLog(log);

        return result;
    },
    /**
     * analyse a cell's basic data
     * need analyseCellNeighboringSituation function
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
        var me = this;
        var result = {};

        // analyse offset to center
        result.offsetToCenter = Math.abs(rowIndex-4.5) + Math.abs(cellIndex-4.5);

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
        var directions = me.directions;
        var neighboringSituation = me.analyseCellNeighboringSituation(rowIndex, cellIndex);

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
        var eatingCells = me.computeEatingCells(rowIndex, cellIndex, color);
        result.internalCellIncrease = 0;
        result.externalCellIncrease = 0;
        result.eatingCellScore = 0;

        for (var i=0; i<eatingCells.length; i++)
        {
            var eatingCellNeighboringSituation = me.analyseCellNeighboringSituation(eatingCells[i][0], eatingCells[i][1], color);
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
        var me = this;
        var directions = me.directions;
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
            if (me.game.cellState[neighboringCell[0]-1][neighboringCell[1]-1] == 0)
            {
                neighboringEmptyCount++;
            }
            else if (me.game.cellState[neighboringCell[0]-1][neighboringCell[1]-1] == me.game.getReverseColorNumber(color))
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
    }   // end analyseCellNeighboringSituation
    ,
    /**
     *
     * @param Number rowIndex
     * @param Number cellIndex
     * @param Number color
     * @return Array
     */
    computeEatingCells : function (rowIndex, cellIndex, color)
    {
        var me = this;
        var directions = me.directions;
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
                if (me.game.cellState[tempCheckEmptyCell.row - 1][tempCheckEmptyCell.cell - 1]
                    == me.game.getReverseColorNumber(color)) {
                    reverseColorList.push([tempCheckEmptyCell.row, tempCheckEmptyCell.cell]);
                }
                // same color, and go to check next direction.
                else if (me.game.cellState[tempCheckEmptyCell.row - 1][tempCheckEmptyCell.cell - 1] == me.game.colorNow) {
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
    }
};

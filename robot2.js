/**
 * Created by Kevin on 2019/3/7.
 */

var robot2 = {

    game : game,
    directions: [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
    ],
    distanceMap : [
        [9,7,6,5,5,6,7,9],
        [7,8,4,3,3,4,8,7],
        [6,4,2,1,1,2,4,6],
        [5,3,1,0,0,1,3,5],
        [5,3,1,0,0,1,3,5],
        [6,4,2,1,1,2,4,6],
        [7,8,4,3,3,4,8,7],
        [9,7,6,5,5,6,7,9]
    ],
    /**
     * run state, value: computing waiting
     */
    state : 'waiting',
    timer : null,
    run : function ()
    {
        var me = this;
        var result = [];
        // object {rowIndex, cellIndex, superiority}
        var bestCell = null;
        var betterCells = [];
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

        // filter best cells

        if (!bestCell)
        {
            return;
        }
        this.game.addPiece(bestCell.rowIndex, bestCell.cellIndex);
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

        // approach center
        var result = 64;
        //(6 - analysis.offsetToCenter) * 2;
        switch (analysis.offsetToCenter)
        {
            // case 1 :
            //     result += 4; break;
            // case 2 :
            //     result += 2; break;
            // case 3 :
            //     break;
            // case 4 :
            //     result -= 4; break;
            // case 5 :
            //     result -= 8; break;
            // case 6 :
            //     result -= 16; break;
            // case 7 :
            //     result -= 32; break;
            case 8 :
                result -= 64; break;
            case 9 :
                result += 32; break;

        }

        // eat least, weight : 2
        result += (analysis.internalCellIncrease - analysis.externalCellIncrease * 2) * 4;

        // 3rd circle is bader
        if (analysis.is3rdCircle)
        {
            result -= 32;
        }

        // eating cells
        result += analysis.eatingCellScore;
        // var eatingCells = me.computeEatingCells(rowIndex, cellIndex, color);



        return result;

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
            result += me.actionForce[color-1];
        }

        // check if is special cell
        if (   (rowIndex == 2 && cellIndex == 2)
            || (rowIndex == 2 && cellIndex == 7)
            || (rowIndex == 7 && cellIndex == 2)
            || (rowIndex == 7 && cellIndex == 7)
        )
        {
            result -= 64;
        }

        // check if is last 2 line
        if ( rowIndex == 2 || rowIndex == 7
            || cellIndex == 2 || cellIndex == 7
        )
        {
            result -= 32;
        }

        // neighboring less reverse
        result -= (analysis.neighboringCount - analysis.neighboringReverseCount) * 2;

        // neighboring less empty
        result -= (analysis.neighboringCount - analysis.neighboringEmptyCount) + 8;



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
         *  internalCellIncrease, externalCellIncrease,
         *  is3rdCircle}
     */
    analyseCell : function (rowIndex, cellIndex, color)
    {
        var me = this;
        var result = {};

        // analyse offset to center
        result.offsetToCenter = this.distanceMap[rowIndex-1][cellIndex-1];

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
        if (result.offsetToCenter == 9)
        {
            result.isCorner = true;
        }
        {
            result.isCorner = false;
        }

        // check if is 3rd circle
        if (rowIndex == 2 || rowIndex == 7
            || cellIndex == 2 || cellIndex == 7
        )
        {
            result.is3rdCircle = true;
        }
        else
        {
            result.is3rdCircle = false;
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
        log(eatingCells);
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

            // internal score
            var internalScore = (eatingCellNeighboringSituation.count - eatingCellNeighboringSituation.empty);
            if (internalScore <= 3)
            {
                result.eatingCellScore += internalScore;
            }
            else
            {
                result.eatingCellScore -= internalScore * 2;
            }
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
    },
    startWatch : function ()
    {
        var me = this;
        this.stopWatch();
        this.timer = window.setInterval(function(){

            if (me.game.colorNow == me.game.computerColor && me.game.vsType == 'vs_computer' && me.state == 'waiting')
            {
                me.state = 'running';
                me.run();
                me.state = 'waiting';
            }
        }, 2000);
    },
    stopWatch : function ()
    {
        if (this.timer)
        {
            window.clearInterval(this.timer);
        }
    }
};
robot2.startWatch();
game.robot = robot2;
// game.registerRobotApi(robot1.run);

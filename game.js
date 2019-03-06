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
        cellState : [
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,2,1,0,0,0],
            [0,0,0,1,2,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0]
        ],
        view : null,
        init : function (){
            // this.view.updateCellState(this.cellState);
        }
    };

})();

game.view = new Vue({
    el : '#reversiGame',
    data : {
        cellState : game.cellState
    },
    methods : {
        updateCellState : function(data){
            this.cellState = data;
        }
    }
});

game.init();


// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn:
    function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {

      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },

    /*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      var rowArr = this.get(rowIndex);
      var oneCount = 0;

      for (var i = 0; i < rowArr.length; i++) {
        if (oneCount > 1) {
          return true;
        }
        if (rowArr[i] === 1) {
          oneCount += 1;
        }
      }
      return false;

      //linear time because we loop through n.
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      var n = this.get('n');
      for (var i = 0; i < n; i++) {
        if (this.hasRowConflictAt(i) === true) {
          return true;
        }
      }
      return false;
      //exponential time because we loop through n rows and loop through n columns for each row.
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {

      var n = this.get('n');
      var oneCount = 0;

      for (let i = 0; i < n; i++) {
        var currentRowArr = this.get(i);
        if (currentRowArr[colIndex] === 1) {
          oneCount++;
        }
        if (oneCount > 1) {
          return true;
        }
      }
      return false;
      //linear because we loop through n rows.
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {

      var n = this.get('n');

      for (let i = 0; i < n; i++) {
        if (this.hasColConflictAt(i) === true) {
          return true;
        }
      }
      return false;
      //exponential because we loop through n columns and n rows.
    },

    // Complete board through col conflicts

    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      var oneCount = 0;
      var n = this.get('n');
      var colIndex, startingRow;

      if (majorDiagonalColumnIndexAtFirstRow < 0) {
        startingRow = majorDiagonalColumnIndexAtFirstRow * -1;
        colIndex = 0;
      } else {
        colIndex = majorDiagonalColumnIndexAtFirstRow;
        startingRow = 0;
      }

      for (var rowIndex = startingRow; rowIndex < n; rowIndex++) {
        var currentRowArr = this.get(rowIndex);

        if (currentRowArr[colIndex] === 1) {
          oneCount++;
        }
        colIndex++;

        if (oneCount > 1) {
          return true;
        }

        if (colIndex === n) {
          return false;
        }
      }
      //best case constant, worst cases linear.
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      var n = this.get('n');
      for (var i = (-n + 1); i < n; i++) {
        if (this.hasMajorDiagonalConflictAt(i) === true) {
          return true;
        }
      }
      return false;
      //linear time
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {

      var oneCount = 0;
      var colIndex, startingRow;
      var n = this.get('n');

      if (minorDiagonalColumnIndexAtFirstRow >= n) {
        startingRow = minorDiagonalColumnIndexAtFirstRow - ( n - 1);
        colIndex = n - 1;
      } else {
        startingRow = 0;
        colIndex = minorDiagonalColumnIndexAtFirstRow;
      }

      for (var currentRow = startingRow; currentRow < n; currentRow++) {

        var rowArr = this.get(currentRow);

        if (rowArr[colIndex] === 1) {
          oneCount++;
          if (oneCount > 1) {
            return true;
          }
        }
        colIndex--;
      }

      return false;
      //linear worst case, constant best case.
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {

      var n = this.get('n');
      for (var i = 0; i < ( n + ( n - 1)); i++) {
        if (this.hasMinorDiagonalConflictAt(i) === true) {
          return true;
        }
      }
      return false;
      //linear
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());

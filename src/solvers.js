/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other



window.findNRooksSolution = function(n) {
  var board = new Board({n: n});

  for (var i = 0; i < n; i++) {
    board.togglePiece(i, i);
  }

  var solution = board.rows();

  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution;
  //linear
};


// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  var solutionCount = 0;
  var board = new Board({n: n});

  // nested function
  // input : position - rowIndex
  var testForSolutions = function(rowIndex) {

    // base case
    if (rowIndex === n) {
      solutionCount++;
      return;
    }
    for (var i = 0; i < n; i++) {
      board.togglePiece(rowIndex, i);
      countNRooksSolutionCounter++;
      if (!board.hasAnyRooksConflicts()) {
        testForSolutions(rowIndex + 1);
      }
      board.togglePiece(rowIndex, i);
    }
  };
  testForSolutions(0);

  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var board = new Board({n: n});
  var solution;

  var testForSolutions = function(rowIndex) {
    if (rowIndex === n) {
      solution = board.rows();
      console.log(solution);
      return;
    }
    for (var columnIndex = 0; columnIndex < n; columnIndex++) {
      board.togglePiece(rowIndex, columnIndex);
      if (!board.hasAnyQueensConflicts()) {
        testForSolutions(rowIndex + 1);
        if (solution !== undefined) {
          return;
        }
      }

      board.togglePiece(rowIndex, columnIndex);
    }
  };
  testForSolutions(0);

  if (solution === undefined) {
    solution = board.rows();
  }



  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solutionCount = 0; //fixme
  var board = new Board({ n: n });

  var testForSolutions = function (rowIndex) {
    if (rowIndex === n) {
      solutionCount++;
      return;
    }
    for (var columnIndex = 0; columnIndex < n; columnIndex++) {
      board.togglePiece(rowIndex, columnIndex);
      if (!board.hasAnyQueensConflicts()) {
        testForSolutions(rowIndex + 1);
      }

      board.togglePiece(rowIndex, columnIndex);
    }
  };
  testForSolutions(0);

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};

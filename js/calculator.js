var calculator = (function () {

  // Class state
  var currentValue, currentValueOverwritable, currentExpression, currentExpressionFull, history, invalidInput;
  
  currentValue =  "0";
  currentValueOverwritable = false;
  currentExpression =  [0];
  currentExpressionFull = [0];
  history = [];
  invalidInput = false;
 
  // DOM elements
  var numbers, operations, equals, decimal, backspace, CE, C, plusMinusBtn, input, fullExpression, clearHistoryBtn, calculatorButtons;

  numbers = document.querySelectorAll(".num");
  operations = document.querySelectorAll(".operation");
  equals = document.getElementById("equals");
  decimal = document.getElementById("decimal");
  backspace = document.getElementById("backspace");
  CE = document.getElementById("clear-entry");
  C = document.getElementById("clear");
  plusMinusBtn = document.getElementById("plus-minus");
  input = document.getElementById("input");
  fullExpression = document.getElementById("full-expression");
  clearHistoryBtn = document.getElementById("clear-history");
  calculatorButtons = document.getElementById("calculator-buttons");


  /*** Event callbacks ***/

  // Number input handler
  handleNumberInput = function(btn) {
    if ( currentValue == "0" || currentValueOverwritable || currentExpression.length == 2) {
      currentValue = btn.innerHTML;
      currentValueOverwritable = false;
    } else {
      currentValue += btn.innerHTML;
    }

    updateExpressionsOnValueChange();
    updateInputScreen();
  };

  // Operation input handler
  handleOperationInput = function(btn) {
    let operation = btn.getAttribute("data-operation");
      
    if (operation == "multiplication") {
      handleMultiplication();
    } else if (operation == "division") {
      handleDivision();
    } else if (operation == "addition") {
      handleAddition();
    } else if (operation == "subtraction") {
      handleSubtraction();
    } else if (operation == "square") {
      handleSquare();
    } else if (operation == "cube") {
      handleCube();
    } else if (operation == "reciprocal") {
      handleReciprocal();
    } else if (operation == "square-root") {
      handleSquareRoot();
    } else if (operation == "plus-minus") {
      handlePlusMinus();
    } else if (operation == "percentage") {
      handlePercentage();
    }
  };

  // Decimal input handler
  handleDecimalInput = function() {
    if (currentExpression.length == 2) {
      currentValue = "0.";
    } else if ( !currentValue.includes(".")) {
      currentValue += ".";
    }

    updateExpressionsOnValueChange();
    updateInputScreen();
  };

  // Backspace input handler
  handleBackspaceInput = function() {
    if (currentExpression.length == 1 || currentExpression.length == 3) {
      if ( !currentValueOverwritable && currentValue != "0" ) {
        if (currentValue.length == 1) {
          currentValue = "0";
        } else {
          currentValue = currentValue.substring(0, currentValue.length - 1);
        }
      }

      updateExpressionsOnValueChange();
      updateInputScreen();
    }
  };

  // C input handler
  clear = function() {
    currentValue = "0";
    currentExpression = [0];
    currentExpressionFull = [0];
    fullExpression.innerHTML = "";
    updateInputScreen();
    if (invalidInput) {
      calculatorButtons.classList.remove("invalid-input");
      invalidInput = false;
    }
  };

  // CE input handler
  clearEntry = function() {
    currentValue = "0";
    updateExpressionsOnValueChange();
    updateInputScreen();
  };

  // Equal sign input handler
  handleEqualsInput = function() {
    if (currentExpression.length == 1) {

    } else if (currentExpression.length == 2) {
      updateExpressionsOnValueChange();
      var ev = evaluateCurrentExpression();
      currentValue = ev.toString();
      updateInputScreen();
    } else if (currentExpression.length == 3) {
      var ev = evaluateCurrentExpression();
      currentValue = ev.toString();
      updateInputScreen();
    }

    addHistoryItem();
    currentExpression = [currentValue];
    currentExpressionFull = [currentValue];
    currentValueOverwritable = true;
    fullExpression.innerHTML = "";
  };

  /*** Screen modifiers ***/

  // Update current value screen
  updateInputScreen = function() {
    input.innerHTML = currentValue;
  };

  // Update current value screen and expression screen
  updateScreen = function() {
    input.innerHTML = currentValue;
    if (currentExpressionFull.length >= 1) {
      fullExpression.innerHTML = currentExpressionFull.join(" ");
    }
  };

  /*** Operation handlers ***/

  handleMultiplication = function() {
    if (currentExpression.length == 3) {
      let newValue = evaluateCurrentExpression();
      currentValue = newValue;
      currentExpression = [Number(currentValue), "multiply"];
      currentExpressionFull.push("x");
    } else if (currentExpression.length == 1) {
      currentExpression.push("multiply");
      currentExpressionFull.push("x");
    } else if (currentExpression.length == 2) {
      currentExpression[1] = "multiply";
      currentExpressionFull[currentExpressionFull.length - 1] = "x";
    }

    updateScreen();
  };
  
  handleDivision = function() {
    if (currentExpression.length == 3) {
      let newValue = evaluateCurrentExpression();
      currentValue = newValue;
      currentExpression = [Number(currentValue), "divide"];
      currentExpressionFull.push("/");
    } else if (currentExpression.length == 1) {
      currentExpression.push("divide");
      currentExpressionFull.push("/");
    } else if (currentExpression.length == 2) {
      currentExpression[1] = "divide";
      currentExpressionFull[currentExpressionFull.length - 1] = "/";
    }
    updateScreen();
  };

  handleAddition = function() {
    if (currentExpression.length == 3) {
      let newValue = evaluateCurrentExpression();
      currentValue = newValue;
      currentExpression = [Number(currentValue), "add"];
      currentExpressionFull.push("+");
    } else if (currentExpression.length == 1) {
      currentExpression.push("add");
      currentExpressionFull.push("+");
    } else if (currentExpression.length == 2) {
      currentExpression[1] = "add";
      currentExpressionFull[currentExpressionFull.length - 1] = "+";
    }
    updateScreen();
  };

  handleSubtraction = function() {
    if (currentExpression.length == 3) {
      let newValue = evaluateCurrentExpression();
      currentValue = newValue;
      currentExpression = [Number(currentValue), "subtract"];
      currentExpressionFull.push("-");
    } else if (currentExpression.length == 1) {
      currentExpression.push("subtract");
      currentExpressionFull.push("-");
    } else if (currentExpression.length == 2) {
      currentExpression[1] = "subtract";
      currentExpressionFull[currentExpressionFull.length - 1] = "-";
    }
    updateScreen();
  };

  handleSquare = function() {
    if (currentExpression.length == 3 || currentExpression.length == 1) {
      let newValue = square(Number(currentValue));
      let oldValue = currentValue;
      currentValue = newValue.toString();

      updateCurrentExpressionOnValueChange();
      currentExpressionFull[currentExpressionFull.length - 1] = "square(" + currentExpressionFull[currentExpressionFull.length - 1] + ")";

    } else if (currentExpression.length == 2) {
      let newValue = square(Number(currentValue));
      let oldValue = currentValue;
      currentValue = newValue.toString();

      updateCurrentExpressionOnValueChange();
      currentExpressionFull.push("square(" + oldValue + ")");
    }
    updateScreen();
  };

  handleCube = function() {
    if (currentExpression.length == 3 || currentExpression.length == 1) {
      let newValue = cube(Number(currentValue));
      let oldValue = currentValue;
      currentValue = newValue.toString();

      updateCurrentExpressionOnValueChange();
      currentExpressionFull[currentExpressionFull.length - 1] = "cube(" + currentExpressionFull[currentExpressionFull.length - 1] + ")";

    } else if (currentExpression.length == 2) {
      let newValue = cube(Number(currentValue));
      let oldValue = currentValue;
      currentValue = newValue.toString();

      updateCurrentExpressionOnValueChange();
      currentExpressionFull.push("cube(" + oldValue + ")");
    }
    updateScreen();
  };

  handleReciprocal = function() {
    if (currentExpression.length == 3 || currentExpression.length == 1) {
      let newValue = reciprocal(Number(currentValue));
      let oldValue = currentValue;
      currentValue = newValue.toString();

      updateCurrentExpressionOnValueChange();
      currentExpressionFull[currentExpressionFull.length - 1] = "1/(" + currentExpressionFull[currentExpressionFull.length - 1] + ")";

    } else if (currentExpression.length == 2) {
      let newValue = reciprocal(Number(currentValue));
      let oldValue = currentValue;
      currentValue = newValue.toString();

      updateCurrentExpressionOnValueChange();
      currentExpressionFull.push("1/(" + oldValue + ")");
    }
    updateScreen();
  };

  handleSquareRoot = function() {
    if (currentExpression.length == 3 || currentExpression.length == 1) {
      let newValue = squareRoot(Number(currentValue));
      let oldValue = currentValue;
      if (Number.isNaN(newValue)) {
        handleInvalidInput();
      } else {
        currentValue = newValue.toString();
      }

      updateCurrentExpressionOnValueChange();
      currentExpressionFull[currentExpressionFull.length - 1] = "&#8730;(" + currentExpressionFull[currentExpressionFull.length - 1] + ")";

    } else if (currentExpression.length == 2) {
      let newValue = squareRoot(Number(currentValue));
      let oldValue = currentValue;
      if (Number.isNaN(newValue)) {
        handleInvalidInput();
      } else {
        currentValue = newValue.toString();
      }

      updateCurrentExpressionOnValueChange();
      currentExpressionFull.push("&#8730;(" + oldValue + ")");
    }
    updateScreen();
  };

  handlePlusMinus = function() {
    if (currentValue != "0") {
      currentValue = (Number(currentValue) * -1).toString();

      updateExpressionsOnValueChange();
      updateInputScreen();
    }
  };

  handlePercentage = function() {
    if (currentExpression.length == 1) {
      currentValue = "0";

      updateExpressionsOnValueChange();
    } else if (currentExpression.length == 3) {
      let newValue = percent(Number(currentExpression[0]), Number(currentValue));
      let oldValue = currentValue;
      currentValue = newValue.toString();

      updateCurrentExpressionOnValueChange();
      currentExpressionFull[currentExpressionFull.length - 1] = currentValue;

    } else if (currentExpression.length == 2) {
      let newValue = percent(Number(currentExpression[0]), Number(currentValue));
      let oldValue = currentValue;
      currentValue = newValue.toString();

      updateCurrentExpressionOnValueChange();
      currentExpressionFull.push(currentValue);
    }
    updateScreen();
  };

  /*** Operations ***/

  square = function(a) {
    return a * a;
  };

  cube = function(a) {
    return a * a * a;
  };

  reciprocal = function(a) {
    return 1 / a;
  };

  squareRoot = function(a) {
    return Math.sqrt(a);
  };

  percent = function(a, b) {
    return (b/100) * a;
  };

  multiply = function( a, b ) {
    return a * b;						     
  };

  divide = function(a, b) {
    return a / b;
  };

  add = function(a, b) {
    return a + b;
  };

  subtract = function(a, b) {
    return a - b;
  };


  /*** History helperss ***/

  // Triggered on history item click. Updates screen 
  // currentValue and expression
  renderHistoryItem = function(index) {
    console.log("history: " + history[index]);
    console.log("index: " + index);
    currentValue =  history[index].evaluation;
    currentValueOverwritable = true;
    currentExpression =  [currentValue];
    currentExpressionFull = history[index].expression.slice(0);
    updateScreen();
  };

  // Triggers on equal sign input
  addHistoryItem = function() {
    let index = history.length;
    var historyItem = document.createElement("DIV");
    historyItem.className = "history-item flex flex-col p-4 mb-4 hover:bg-gray-400 z-40";
    historyItem.setAttribute("data-index", index);
    historyItem.addEventListener('click', function() {
      renderHistoryItem(index);
    });

    var expression = document.createElement("DIV");
    expression.className = "expression flex text-sm text-gray-600 justify-end";
    var evaluation = document.createElement("DIV");
    evaluation.className = "evaluation flex text-black text-xl font-bold justify-end";
  
    expression.innerHTML = currentExpressionFull.join(" ") + " = ";
    evaluation.innerHTML = currentValue;
    history.push({ expression: currentExpressionFull, evaluation: currentValue });

    historyItem.appendChild(expression);
    historyItem.appendChild(evaluation);
    var historyItems = document.getElementById("history-items");
    if (history.length == 1) {
      historyItems.querySelector("p").classList.add("hidden");
      document.getElementById("clear-history").classList.remove("hidden");
    }
    historyItems.prepend(historyItem);
  };

  // Clears historyItem DOM elements and emptys history[] array
  clearHistory = function() {
    var historyItems = document.getElementById("history-items");
    historyItems.querySelectorAll('.history-item').forEach(function(a) {
      a.remove();
    });

    historyItems.querySelector("p").classList.remove("hidden");
    clearHistoryBtn.classList.add("hidden");
    history = [];
  };

  /*** Calculator state helpers ***/

  // Updates the currentExpression[] array
  // Gets triggered on number input
  updateCurrentExpressionOnValueChange = function() {
    if (currentExpression.length == 1) {
      currentExpression[0] = currentValue;
    } else if (currentExpression.length == 2) {
      currentExpression.push(currentValue);
    } else {
      currentExpression[2] = currentValue;
    }
  };


  // Updates both the currentExpression[] and currentExpressionFull[] arrays
  // Gets teiggered on number input
  updateExpressionsOnValueChange = function() {
    updateCurrentExpressionOnValueChange();
    if (currentExpressionFull.length % 2 == 0) {
      currentExpressionFull.push(currentValue);
    } else {
      currentExpressionFull[currentExpressionFull.length - 1] = currentValue;
    }
  };

  // Evaluates the currentExpression array
  evaluateCurrentExpression = function() {
    if (currentExpression[2] == "") {
      return eval(currentExpression[1] + "(" + currentExpression[0] + ")");
    } else {
      return eval(currentExpression[1] + "(" + currentExpression[0] + ", " + currentExpression[2] + ")");
    }
  };

  /*** Inavlid Input ***/

  handleInvalidInput = function() {
    invalidInput = true;
    currentValue = "Invalid input";
    calculatorButtons.classList.add('invalid-input');
  };
  
 
  return {
     
    init: function() {
      /*
        handle number clicks 
        (0, 1, 2, 3, 4, 5, 6, 7, 8, 9)
      */
      for (const num of numbers) {
        num.addEventListener('click', function() {
	  if (invalidInput) {
            currentValue = "0";
            currentExpression = [0];
            currentExpressionFull = [0];
            fullExpression.innerHTML = "";
	    calculatorButtons.classList.remove("invalid-input");
            invalidInput = false;
	  }

          handleNumberInput(num);
        });
      }

      /*
        Handle operations
        ( %, square_root, square, cube, reciprocal, plus_minus, /, x, - + )
      */
      for (const operation of operations) {
        operation.addEventListener('click', function() {
	  if (!invalidInput) {
            handleOperationInput(operation);
	  }
        });
      }

      // handle decimal input
      decimal.addEventListener("click", function() {
        if (!invalidInput) {
          handleDecimalInput();
	}
      });

      // handle backspace
      backspace.addEventListener("click", function() {
        if (invalidInput) {
          clear();
	} else {
          handleBackspaceInput();
	}
      });

      // Handle equal sign
      equals.addEventListener("click", function() {
        if (invalidInput) {
          clear();
	} else {
          handleEqualsInput();
	}
      });

      // Handle C
      C.addEventListener("click", function() {
        clear();
      });


      // Handle CE
      CE.addEventListener("click", function() {
        if (invalidInput) {
          clear();
	} else {
          clearEntry();
	}
      });

      // Handle clear history 
      clearHistoryBtn.addEventListener("click", function() {
        clearHistory();
      });
    }
  };
})();

calculator.init();

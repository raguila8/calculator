var calculator = (function () {

  var currentValue, currentExpression, currentExpressionFull, history;
  
  currentValue =  "0";
  currentValueOverwritable = false;
  currentExpression =  [0];
  currentExpressionFull = [0];
  history = [];
 
  updateCurrentExpressionOnValueChange = function() {
    if (currentExpression.length == 1) {
      currentExpression[0] = currentValue;
    } else if (currentExpression.length == 2) {
      currentExpression.push(currentValue);
    } else {
      currentExpression[2] = currentValue;
    }
  };

  updateExpressionsOnValueChange = function() {
    updateCurrentExpressionOnValueChange();
    if (currentExpressionFull.length % 2 == 0) {
      currentExpressionFull.push(currentValue);
    } else {
      currentExpressionFull[currentExpressionFull.length - 1] = currentValue;
    }
  };

  evaluateCurrentExpression = function() {
    if (currentExpression[2] == "") {
      return eval(currentExpression[1] + "(" + currentExpression[0] + ")");
    } else {
      return eval(currentExpression[1] + "(" + currentExpression[0] + ", " + currentExpression[2] + ")");
    }
  };

  // Multiplication
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

  return {
    
    numbers: document.querySelectorAll(".num"),
    operations: document.querySelectorAll(".operation"),
    equals: document.getElementById("equals"),
    decimal: document.getElementById("decimal"),
    backspace: document.getElementById("backspace"),
    CE: document.getElementById("clear-entry"),
    C: document.getElementById("clear"),
    plusMinusBtn: document.getElementById("plus-minus"),
    input: document.getElementById("input"),
    fullExpression: document.getElementById("full-expression"),
    clearHistoryBtn: document.getElementById("clear-history"),
  
    clearHistory: function() {
      var historyItems = document.getElementById("history-items");
      historyItems.querySelectorAll('.history-item').forEach(function(a) {
        a.remove();
      });

      historyItems.querySelector("p").classList.remove("hidden");
      this.clearHistoryBtn.classList.add("hidden");
      history = [];
    },

    renderHistoryItem: function(index) {
      console.log("history: " + history[index]);
      console.log("index: " + index);
      currentValue =  history[index].evaluation;
      currentValueOverwritable = true;
      currentExpression =  [currentValue];
      currentExpressionFull = history[index].expression.slice(0);
      this.updateScreen();
    },

    addHistoryItem: function() {
      let self = this;
      let index = history.length;
      var historyItem = document.createElement("DIV");
      historyItem.className = "history-item flex flex-col p-4 mb-4 hover:bg-gray-400 z-40";
      historyItem.setAttribute("data-index", index);
      historyItem.addEventListener('click', function() {
        self.renderHistoryItem(index);
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
    },

    updateInputScreen: function() {
      input.innerHTML = currentValue;
    },
  
    updateFullExpressionScreen: function() {
      this.fullExpression.innerHTML = currentExpressionFull.join(" ");
    },

    updateScreen: function() {
      input.innerHTML = currentValue;
      if (currentExpressionFull.length >= 1) {
        this.fullExpression.innerHTML = currentExpressionFull.join(" ");
      }
    },

    handleNumberInput: function(btn) {
      if ( currentValue == "0" || currentValueOverwritable || currentExpression.length == 2) {
        currentValue = btn.innerHTML;
	currentValueOverwritable = false;
      } else {
        currentValue += btn.innerHTML;
      }

      updateExpressionsOnValueChange();
      this.updateInputScreen();
    },

    handleOperationInput: function(btn) {
      let operation = btn.getAttribute("data-operation");
      
      if (operation == "multiplication") {
        this.handleMultiplication();
      } else if (operation == "division") {
        this.handleDivision();
      } else if (operation == "addition") {
        this.handleAddition();
      } else if (operation == "subtraction") {
        this.handleSubtraction();
      } else if (operation == "square") {
        this.handleSquare();
      } else if (operation == "cube") {
        this.handleCube();
      } else if (operation == "reciprocal") {
        this.handleReciprocal();
      } else if (operation == "square-root") {
        this.handleSquareRoot();
      } else if (operation == "plus-minus") {
        this.handlePlusMinus();
      } else if (operation == "percentage") {
        this.handlePercentage();
      }
    },

    handleMultiplication: function() {
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

      this.updateScreen();
    },

    handleDivision: function() {
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
      this.updateScreen();
    },

    handleAddition: function() {
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
      this.updateScreen();
    },

    handleSubtraction: function() {
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
      this.updateScreen();
    },

    handlePercentage: function() {
      if (currentExpression.length == 1) {
        currentValue = "0";

	updateExpressionsOnValueChange();
      } else if (currentExpression.length == 3) {
        let newValue = this.percent(Number(currentExpression[0]), Number(currentValue));
	let oldValue = currentValue;
        currentValue = newValue.toString();

        updateCurrentExpressionOnValueChange();
        currentExpressionFull[currentExpressionFull.length - 1] = currentValue;

      } else if (currentExpression.length == 2) {
        let newValue = this.percent(Number(currentExpression[0]), Number(currentValue));
	let oldValue = currentValue;
        currentValue = newValue.toString();

        updateCurrentExpressionOnValueChange();
        currentExpressionFull.push(currentValue);
      }
      this.updateScreen();
    },

    handleSquare: function() {
      if (currentExpression.length == 3 || currentExpression.length == 1) {
        let newValue = this.square(Number(currentValue));
	let oldValue = currentValue;
        currentValue = newValue.toString();

        updateCurrentExpressionOnValueChange();
        currentExpressionFull[currentExpressionFull.length - 1] = "square(" + currentExpressionFull[currentExpressionFull.length - 1] + ")";

      } else if (currentExpression.length == 2) {
        let newValue = this.square(Number(currentValue));
	let oldValue = currentValue;
        currentValue = newValue.toString();

        updateCurrentExpressionOnValueChange();
        currentExpressionFull.push("square(" + oldValue + ")");
      }
      this.updateScreen();
    },

    handleCube: function() {
      if (currentExpression.length == 3 || currentExpression.length == 1) {
        let newValue = this.cube(Number(currentValue));
	let oldValue = currentValue;
        currentValue = newValue.toString();

        updateCurrentExpressionOnValueChange();
        currentExpressionFull[currentExpressionFull.length - 1] = "cube(" + currentExpressionFull[currentExpressionFull.length - 1] + ")";

      } else if (currentExpression.length == 2) {
        let newValue = this.cube(Number(currentValue));
	let oldValue = currentValue;
        currentValue = newValue.toString();

        updateCurrentExpressionOnValueChange();
        currentExpressionFull.push("cube(" + oldValue + ")");
      }
      this.updateScreen();
    },



    handleReciprocal: function() {
      if (currentExpression.length == 3 || currentExpression.length == 1) {
        let newValue = this.reciprocal(Number(currentValue));
	let oldValue = currentValue;
        currentValue = newValue.toString();

        updateCurrentExpressionOnValueChange();
        currentExpressionFull[currentExpressionFull.length - 1] = "1/(" + currentExpressionFull[currentExpressionFull.length - 1] + ")";

      } else if (currentExpression.length == 2) {
        let newValue = this.reciprocal(Number(currentValue));
	let oldValue = currentValue;
        currentValue = newValue.toString();

        updateCurrentExpressionOnValueChange();
        currentExpressionFull.push("1/(" + oldValue + ")");
      }
      this.updateScreen();
    },


    handleSquareRoot: function() {
      if (currentExpression.length == 3 || currentExpression.length == 1) {
        let newValue = this.squareRoot(Number(currentValue));
	let oldValue = currentValue;
        currentValue = newValue.toString();

        updateCurrentExpressionOnValueChange();
        currentExpressionFull[currentExpressionFull.length - 1] = "&#8730;(" + currentExpressionFull[currentExpressionFull.length - 1] + ")";

      } else if (currentExpression.length == 2) {
        let newValue = this.squareRoot(Number(currentValue));
	let oldValue = currentValue;
        currentValue = newValue.toString();

        updateCurrentExpressionOnValueChange();
        currentExpressionFull.push("&#8730;(" + oldValue + ")");
      }
      this.updateScreen();
    },


    handlePlusMinus: function() {
      if (currentValue != "0") {
        currentValue = (Number(currentValue) * -1).toString();

        updateExpressionsOnValueChange();
        this.updateInputScreen();
      }
    },

    handleDecimalInput: function() {
      if (currentExpression.length == 2) {
        currentValue = "0.";
      } else if ( !currentValue.includes(".")) {
        currentValue += ".";
      }

      updateExpressionsOnValueChange();
      this.updateInputScreen();
    },

    handleEqualsInput: function() {
      if (currentExpression.length == 1) {
      } else if (currentExpression.length == 2) {
        updateExpressionsOnValueChange();
	var ev = evaluateCurrentExpression();
	currentValue = ev.toString();
	this.updateInputScreen();
      } else if (currentExpression.length == 3) {
        var ev = evaluateCurrentExpression();
	currentValue = ev.toString();
	this.updateInputScreen();
      }

      this.addHistoryItem();
      currentExpression = [currentValue];
      currentExpressionFull = [currentValue];
      currentValueOverwritable = true;
      this.fullExpression.innerHTML = "";
    },

    handleBackspaceInput: function() {
      if (currentExpression.length == 1 || currentExpression.length == 3) {
        if ( !currentValueOverwritable && currentValue != "0" ) {
          if (currentValue.length == 1) {
            currentValue = "0";
          } else {
            currentValue = currentValue.substring(0, currentValue.length - 1);
	  }
        }

        updateExpressionsOnValueChange();
        this.updateInputScreen();
      }
    },


    add: function(a, b) {
      return a + b;
    },

    subtract: function(a, b) {
      return a - b;
    },

    plusMinus: function(a) {
      a * -1;
    },

    // Multiplication
    multiply: function( a, b ) {
      return a * b;						     
    },

    divide: function(a, b) {
      return a / b;
    },

    square: function(a) {
      return a * a;
    },

    cube: function(a) {
      return a * a * a;
    },

    squareRoot: function(a) {
      return Math.sqrt(a);
    },

    reciprocal: function(a) {
      return 1 / a
    },

    percent: function(a, b) {
      return (b/100) * a;
    },

    // Clears the last entry
    clearEntry: function() {
      currentValue = "0";
      updateExpressionsOnValueChange();
      this.updateInputScreen();
    },

    // Clear all input on calculator
    clear: function() {
      currentValue = "0";
      currentExpression = [0];
      currentExpressionFull = [0];
      this.fullExpression.innerHTML = "";
      this.updateInputScreen();
    },


  };
})();

// handle number clicks
for (const num of calculator.numbers) {
  num.addEventListener('click', function() {
    calculator.handleNumberInput(num);
  });
}

// handle decimal click
calculator.decimal.addEventListener("click", function() {
  calculator.handleDecimalInput();
});

// handle backspace
calculator.backspace.addEventListener("click", function() {
  calculator.handleBackspaceInput();
});

// Handle equal sign
calculator.equals.addEventListener("click", function() {
  calculator.handleEqualsInput();
});


// Handle C
calculator.C.addEventListener("click", function() {
  calculator.clear();
});


// Handle CE
calculator.CE.addEventListener("click", function() {
  calculator.clearEntry();
});

// Handle operations
for (const operation of calculator.operations) {
  operation.addEventListener('click', function() {
    calculator.handleOperationInput(operation);
  });
}

// Handle clear history 
calculator.clearHistoryBtn.addEventListener("click", function() {
  calculator.clearHistory();
});

//Handle history item click events
/*
document.addEventListener("click", function(e) {
  console.log(e.target);
  if (e.target && e.target.parentElement.classList.contains('history-item')){
    let index = e.target.parentElement.getAttribute("data-index");
    calculator.renderHistoryItem(index);
  }
});
*/

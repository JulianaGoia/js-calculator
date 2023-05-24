class CalcController {
  // o construtor é executado automaticamente
  constructor() {
    this._currentDate;
    this._displayCalcEl = document.querySelector("#display");
    this._dateEl = document.querySelector("#data");
    this._timeEl = document.querySelector("#hora");
    this._locale = "pt-BR";
    this._operation = [];
    this._lastOperator = "";
    this._lastNumber = "";
    this.initialize();
    this.initButtonsEvents();
    this.initKeyboard();
  }

  initialize() {
    this.setDisplayDateTime();
    setInterval(() => {
      this.setDisplayDateTime();
    }, 1000);
    this.setLastNumberToDisplay();
  }

  initKeyboard() {
    document.addEventListener("keyup", (e) => {
      // retorna o id da tecla
      // console.log(e.key)
      switch (e.key) {
        case "Escape":
          this.clearAll();
          break;
        case "Backspace":
          this.clearEntry();
          break;
        case "+":
        case "-":
        case "/":
        case "*":
        case "%":
          this.addOperation(e.key);
          break;
        case "Enter":
        case "=":
          this.calc();
          break;
        case ".":
        case ",":
          this.addDot();
          break;

        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
          this.addOperation(parseInt(e.key));
          break;
      }
    });
  }

  setDisplayDateTime() {
    this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
  }

  // método tratando varios evento
  addEventListenerAll(element, events, fn) {
    // transformando uma string em um array e em seguida fazendo um foreach pra cada evento
    events.split(" ").forEach((event) => {
      element.addEventListener(event, fn, false);
    });
  }

  clearAll() {
    this._operation = [];
    this._lastNumber = "";
    this._lastOperator = "";
    this.setLastNumberToDisplay();
  }

  clearEntry() {
    this._operation.pop();
    this.setLastNumberToDisplay();
  }

  // pegar o ultimo valor do array operation
  getLastOperation() {
    return this._operation[this._operation.length - 1];
  }

  setLastOperation(value) {
    this._operation[this._operation.length - 1] = value;
  }

  isOperator(value) {
    if (["+", "-", "*", "%", "/"].indexOf(value) > -1) {
      return true;
    } else {
      return false;
    }
  }

  pushOperation(value) {
    this._operation.push(value);

    if (this._operation.length > 3) {
      // console.log(this._operation);
      this.calc();
    }
  }

  getResult() {
    try {
      return eval(this._operation.join(""));
    } catch (error) {
      setTimeout(() => {
        this.setError();
      }, 1);
    }
  }

  calc() {
    let last = "";

    if (this._operation.length < 3) {
      let firstItem = this._operation[0];
      this._operation = [firstItem, this._lastOperator, this._lastNumber];
    }

    if (this._operation.length > 3) {
      last = this._operation.pop();
      this._lastOperator = this.getLastItem();
      this._lastNumber = this.getResult();
    } else if (this._operation.length == 3) {
      this._lastOperator = this.getLastItem();
      this._lastNumber = this.getLastItem(false);
    }

    let result = this.getResult();

    if (last == "%") {
      result = result / 100;
      this._operation = [result];
    } else {
      this._operation = [result];

      if (last) {
        this._operation.push(last);
      }
    }

    this.setLastNumberToDisplay();
  }

  // o parametro define como true se o ultimo item é um operador
  getLastItem(isOperator = true) {
    let lastItem;

    for (let i = this._operation.length - 1; i >= 0; i--) {
      // verifica se é um operador ou não
      if (this.isOperator(this._operation[i]) === isOperator) {
        lastItem = this._operation[i];
        break;
      }
    }

    if (!lastItem) {
      lastItem = isOperator ? this._lastOperator : this._lastNumber;
    }

    return lastItem;
  }

  // atualiza o ultimo numero que vc digitou no display
  setLastNumberToDisplay() {
    let lastNumber = this.getLastItem(false); // o ultimo item é um numero

    // se o display estiver vazio começa com 0
    if (!lastNumber) {
      lastNumber = 0;
    }

    this.displayCalc = lastNumber;
  }

  addOperation(value) {
    // console.log("a", value, isNaN(this.getLastOperation()));
    // verifica se o ultimo item da array é um numero ou sinal/ponto
    if (isNaN(this.getLastOperation())) {
      if (this.isOperator(value)) {
        // trocar operador caso o ultimo item do array seja um operador
        this.setLastOperation(value);
      } else {
        this.pushOperation(value);
        this.setLastNumberToDisplay();
      }
    } else {
      if (this.isOperator(value)) {
        this.pushOperation(value);
      } else {
        let newValue = this.getLastOperation().toString() + value.toString();
        this.setLastOperation(newValue);

        // atualizar display
        this.setLastNumberToDisplay();
      }
    }

    // console.log(this._operation);
  }

  setError() {
    this.displayCalc = "Error";
  }

  addDot() {
    let lastOperation = this.getLastOperation();

    if (
      typeof lastOperation === "string" &&
      lastOperation.split("").indexOf(".") > -1
    )
      return;

    if (this.isOperator(lastOperation) || !lastOperation) {
      this.pushOperation("0.");
    } else {
      this.setLastOperation(lastOperation.toString() + ".");
    }

    this.setLastNumberToDisplay();
  }

  execBtn(value) {
    switch (value) {
      case "ac":
        this.clearAll();
        break;
      case "ce":
        this.clearEntry();
        break;
      case "soma":
        this.addOperation("+");
        break;
      case "subtracao":
        this.addOperation("-");
        break;
      case "divisao":
        this.addOperation("/");
        break;
      case "multiplicacao":
        this.addOperation("*");
        break;
      case "porcento":
        this.addOperation("%");
        break;
      case "igual":
        this.calc();
        break;
      case "ponto":
        this.addDot();
        break;

      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        this.addOperation(parseInt(value));
        break;

      default:
        this.setError();
        break;
    }
  }

  initButtonsEvents() {
    let buttons = document.querySelectorAll("#buttons > g, #parts > g");
    buttons.forEach((btn) => {
      this.addEventListenerAll(btn, "click drag", (e) => {
        let textBtn = btn.className.baseVal.replace("btn-", "");

        this.execBtn(textBtn);
      });

      this.addEventListenerAll(btn, "mouseover mouseup mousedown", (e) => {
        btn.style.cursor = "pointer";
      });
    });
  }

  get displayCalc() {
    return this._displayCalcEl.innerHTML;
  }

  set displayCalc(value) {
    if (value.toString().length > 10) {
      this.setError();
      return false;
    }
    this._displayCalcEl.innerHTML = value;
  }

  get displayDate() {
    return this._dateEl.innerHTML;
  }

  set displayDate(value) {
    this._dateEl.innerHTML = value;
  }

  get displayTime() {
    return this._timeEl.innerHTML;
  }

  set displayTime(value) {
    this._timeEl.innerHTML = value;
  }

  get currentDate() {
    return new Date();
  }

  set currentDate(valor) {
    this._currentDate = valor;
  }
}

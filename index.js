
/*
    index.js
    Marielle Tan && Philipp Andrew Redondo
    ; BSIT3R2
    March 21 2021 10:00PM

*/

var expr_history = document.getElementById("expr-history");
var expr_or_result = document.getElementById("expr-or-result");
expr_or_result.value = '0'
var l_r_p = document.getElementById("l_r_p");
var isclicked = false
var unaryop =  document.getElementById("unaryop");


var onButtonClick = (button) => {
    if(this.expr_or_result.value === '0'){
        this.expr_or_result.value = ''
    }

    let btnclicked = button.innerText;

    switch(btnclicked){
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
        case '*':
        case '/':
        case '%':
        case '+':
        case '-':
        case '.':
            this.expr_or_result.value = this.expr_or_result.value + btnclicked;
            break;
        case 'AC':
            let str = this.expr_or_result.value.toString()
            this.expr_or_result.value = str.substring(0,str.length - 1);
            break
        case '=':
            let expr = this.expr_or_result.value;
            let lex = new Lexer(expr)
            let parser = new Parser(lex)
            let interpreter = new Interpreter(parser);
            this.expr_history.value = expr.toString();
            this.expr_or_result.value = interpreter.interpret().toString();
            break;
    }
    if (this.expr_or_result.value.length <= 0){
        this.expr_or_result.value = '0'
    }

}

l_r_p.onwheel = () => {
    l_r_p.innerText = (l_r_p.innerText == RPAREN)?LPAREN:RPAREN;
}

l_r_p.onclick = () => {
    if(this.expr_or_result.value == '0'){
        this.expr_or_result.value = ''
    }
    this.expr_or_result.value += l_r_p.innerText;
}

unaryop.onclick = () => {
    isclicked = !isclicked
    if(this.expr_or_result.value == '0'){
        this.expr_or_result.value = ''
    }
  
    this.expr_or_result.value += MINUS
   
}
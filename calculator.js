

/*

    calculator.js
    Marielle Tan && Philipp Andrew Redondo
    March 21 2021 10:07PM
    includes:
        Token
        Operator
        NumberNode
        UnaryNode
        Lexer
        Parser
        Interpretrer
*/

const NUMBER = 'Number'
const DOT    = '.'
const LPAREN = '('
const RPAREN = ')'
const MUL    = '*'
const DIV    = '/'
const MOD    = '%'
const PLUS   = '+'
const MINUS  = '-'
const EOF    = 'EOF'


class Token{
    constructor(type,value){
        this.type = type;
        this.value = value;
    }
}


class Operator{
    constructor(left,operator,right){
        this.left = left;
        this.operator = operator;
        this.right = right
    }
}

class NumberNode{
    constructor(token){
        this.type = token.type;
        this.value = token.value
    }
}

class UnaryNode{
    constructor(operator,num){
        this.operator = operator;
        this.number = num;
    }
}
class Lexer{
    constructor(code){
        this.code = code;
        this.position = 0;
        this.currentChar = this.code[this.position];
    }
    forward(){
        this.position++;
        if(this.position <= (this.code.length -1)){
            this.currentChar = this.code[this.position];
        }else{
            this.currentChar = null;
        }
    }
    isNumber(cchar){
        switch(cchar){
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
                return true;
        }
        return false;
    }
    isOperator(cchar){
        switch(cchar){
            case DOT:
            case LPAREN:
            case RPAREN:
            case MUL:
            case DIV:
            case MOD:
            case PLUS:
            case MINUS:
                return true;
        }
        return false;
    }
    constains(source,delim){
        for(var x = 0 ;x < source.length; x++){
            if(source[x] == delim){
                return true;
            }
        }
        return false
    }
    extractNumbers(){
        let number = '';
        while(this.currentChar != null && (this.isNumber(this.currentChar) || (
            this.currentChar == DOT && number.length > 0
        ))){
            number += this.currentChar;
            this.forward();
        }
        if(this.constains(number,DOT)){
            return parseFloat(number);
        }
        return parseInt(number);
    }
    extractOperator(){
        let operator = this.currentChar
        this.forward()
        return operator;
    }
    ignoreSpace(){
        while(this.currentChar != null && this.currentChar == ' '){
            this.forward();
        }
    }
    getToken(){
        while(this.currentChar != null){
            if(this.currentChar == ' '){
                this.ignoreSpace();
            }

            if(this.isNumber(this.currentChar)){
                let num = this.extractNumbers();
                console.log('EXTERACTED number '+num.toString())
                return new Token(NUMBER,num);
            }
            if(this.isOperator(this.currentChar)){
                let op = this.extractOperator();
                return new Token(op,op)
            }
            
        }
        return new Token(EOF,null);
    }

}


class Parser{
    constructor(lex){
        this.lexer = lex;
        this.currentToken = this.lexer.getToken();
    }
    eat(token_type){
        if(this.currentToken.type == token_type){
            this.currentToken = this.lexer.getToken();
        }else{
            alert('SyntaxError: '+'expected \''+token_type.toString()+'\'. found \''+this.currentToken.type+'\'.');
            //throw Exception('Expected '+token_type.toString()+'. found '+this.currentToken.type+'.');
        }
    }
    factor(){
        let factor = this.currentToken
        if(factor.type == NUMBER){
            this.eat(NUMBER);
            return new NumberNode(factor);
        }else if(factor.type == LPAREN){
            this.eat(LPAREN)
            let expr = this.expr();
            this.eat(RPAREN)
            return expr;
        }else if(factor.type == MINUS){
            this.eat(MINUS);
            let num = this.factor()
            return new UnaryNode(MINUS,num);
        }
    }
    term(){
        let node = this.factor();
        while(this.currentToken.type  == MUL || this.currentToken.type  == DIV || this.currentToken.type == MOD){
            let token = this.currentToken
            if(token.type == MUL){
                this.eat(MUL)
            }else if(token.type == DIV){
                this.eat(DIV)
            }else if(token.type == MOD){
                this.eat(MOD)
            }
            node = new Operator(node,token,this.factor());
        }
        return node

    }
    expr(){
        let node = this.term();
        while(this.currentToken.type  == PLUS || this.currentToken.type == MINUS){
            let token = this.currentToken
            if(token.type == PLUS){
                this.eat(PLUS)
            }else if(token.type == MINUS){
                this.eat(MINUS)
            }
            node = new Operator(node , token,this.term());
        }
        return node
    }
    parse(){
        return this.expr();
    }
}


class Interpreter{

    constructor(parser){
        this.parser = parser
    }

    visit(node){
        if(node instanceof Operator){
            return this._OperatorNode(node);
        }else if(node instanceof NumberNode){
            return this._NumberNode(node);
        }else if(node instanceof UnaryNode){
            return this._UnaryNode(node);
        }else{
            alert('Invalid token')
        }
    }
    _OperatorNode(node){
        if(node.operator.type == MUL){
            return this.visit(node.left) * this.visit(node.right);
        }
        else if(node.operator.type == DIV){
            return this.visit(node.left) / this.visit(node.right);
        }
        else if(node.operator.type == MOD){
            return this.visit(node.left) % this.visit(node.right);
        }
        else if(node.operator.type == PLUS){
            return this.visit(node.left) + this.visit(node.right);
        }
        else if(node.operator.type == MINUS){
            return this.visit(node.left) - this.visit(node.right);
        }
    }
    _NumberNode(node){
        return node.value
    }
    _UnaryNode(node){
        let x = this.visit(node.number)
        return (node.operator == MINUS)?x*-1: x;
    }
    interpret(){
        return this.visit(this.parser.parse())
    }
}



// vim: syntax=javascript
let idx = 1;

enum TokenKind {
  TT_UNKNOWN,
  // keywords
  KK_ENUM,
  KK_LET,
  KK_CONST,
  KK_EXPORT,
  KK_FUNCTION,
  KK_IF,
  KK_ELSE,
  KK_WHILE,
  KK_BREAK,
  KK_CONTINUE,
  KK_RETURN,
  // punctuators
  PP_LPAREN,
  PP_RPAREN,
  PP_LBRACK,
  PP_RBRACK,
  PP_LBRACE,
  PP_RBRACE,
  PP_DOT,
  PP_COLON,
  PP_COMMA,
  PP_SEMIC,
  // operators
  OP_ASS,
  OP_ADD,
  OP_SUB,
  OP_MUL,
  OP_DIV,
  OP_NEW,
  OP_OR,
  OP_AND,
  OP_NOT,
  OP_LT,
  OP_LTE,
  OP_GT,
  OP_GTE,
  OP_EQUAL,
  OP_NEQUAL,
  OP_BIN_OR,
  OP_BIN_AND,
  OP_ADD_ADD,
  OP_SUB_SUB,
  // token kinds
  TT_NULL,
  TT_STRING,
  TT_NUMBER,
  TT_BOOLEAN,
  TT_IDENTIFIER,
  // node kinds
  NN_PROGRAM,
  NN_IF,
  NN_LET,
  NN_CONST,
  NN_EXPORT,
  NN_FUNCTION,
  NN_ENUM,
  NN_ENUM_ITEM,
  NN_ENUM_EXPRESSION,
  NN_UNARY_PREFIX_EXPRESSION,
  NN_UNARY_POSTFIX_EXPRESSION,
  NN_BINARY_EXPRESSION,
  NN_MEMBER_EXPRESSION,
  NN_COMPUTED_MEMBER_EXPRESSION,
  NN_OBJECT_EXPRESSION,
  NN_OBJECT_PROPERTY,
  NN_ARRAY_EXPRESSION,
  NN_ARRAY_ELEMENT,
  NN_CALL_EXPRESSION,
  NN_WHILE,
  NN_RETURN,
  NN_BREAK,
  NN_CONTINUE,
  NN_LITERAL,
  NN_STRING_LITERAL
};

// ## HALP METHODS ##

function isBlank(cc) {
  return (
    cc == 9 ||
    cc == 11 ||
    cc == 12 ||
    cc == 32 ||
    cc == 160
  );
};

function isQuote(cc) {
  return (
    cc == 39 ||
    cc == 34
  );
};

function isAlpha(cc) {
  return (
    cc >= 65 && cc <= 90 ||
    cc >= 97 && cc <= 122 ||
    cc == 95
  );
};

function isNumber(cc) {
  return (
    cc >= 48 && cc <= 57
  );
};

function isBinaryOperator(token) {
  let kind = token.kind;
  return (
    (kind == .OP_ASS ||
    kind == .OP_ADD ||
    kind == .OP_SUB ||
    kind == .OP_MUL ||
    kind == .OP_DIV ||
    kind == .OP_OR ||
    kind == .OP_AND ||
    kind == .OP_NOT ||
    kind == .OP_LT ||
    kind == .OP_LTE ||
    kind == .OP_GT ||
    kind == .OP_GTE ||
    kind == .OP_EQUAL ||
    kind == .OP_NEQUAL ||
    kind == .OP_BIN_OR ||
    kind == .OP_BIN_AND) &&
    !isUnaryPrefixOperator(token)
  );
};

function isUnaryPrefixOperator(token) {
  let kind = token.kind;
  return (
    kind == .OP_NEW ||
    kind == .OP_NOT ||
    kind == .OP_ADD_ADD ||
    kind == .OP_SUB_SUB
  );
};

function isUnaryPostfixOperator(token) {
  let kind = token.kind;
  return (
    kind == .OP_ADD_ADD ||
    kind == .OP_SUB_SUB
  );
};

function isLiteral(token) {
  let kind = token.kind;
  return (
    kind == .TT_NULL ||
    kind == .TT_STRING ||
    kind == .TT_NUMBER ||
    kind == .TT_BOOLEAN ||
    kind == .TT_IDENTIFIER
  );
};

function processToken(tokens, value, line, column) {
  let kind = .TT_UNKNOWN;
  // keywords
  if (value == "enum") kind = .KK_ENUM;
  else if (value == "let") kind = .KK_LET;
  else if (value == "const") kind = .KK_CONST;
  else if (value == "export") kind = .KK_EXPORT;
  else if (value == "function") kind = .KK_FUNCTION;
  else if (value == "if") kind = .KK_IF;
  else if (value == "else") kind = .KK_ELSE;
  else if (value == "while") kind = .KK_WHILE;
  else if (value == "break") kind = .KK_BREAK;
  else if (value == "continue") kind = .KK_CONTINUE;
  else if (value == "return") kind = .KK_RETURN;
  // boolean
  else if (value == "true" || value == "false") kind = .TT_BOOLEAN;
  // null
  else if (value == "null") kind = .TT_NULL;
  // punctuators
  else if (value == "(") kind = .PP_LPAREN;
  else if (value == ")") kind = .PP_RPAREN;
  else if (value == "[") kind = .PP_LBRACK;
  else if (value == "]") kind = .PP_RBRACK;
  else if (value == "{") kind = .PP_LBRACE;
  else if (value == "}") kind = .PP_RBRACE;
  else if (value == ".") kind = .PP_DOT;
  else if (value == ":") kind = .PP_COLON;
  else if (value == ",") kind = .PP_COMMA;
  else if (value == ";") kind = .PP_SEMIC;
  // operators
  else if (value == "!") kind = .OP_NOT;
  else if (value == "=") kind = .OP_ASS;
  else if (value == "+") kind = .OP_ADD;
  else if (value == "-") kind = .OP_SUB;
  else if (value == "*") kind = .OP_MUL;
  else if (value == "/") kind = .OP_DIV;
  else if (value == "<") kind = .OP_LT;
  else if (value == "<=") kind = .OP_LTE;
  else if (value == ">") kind = .OP_GT;
  else if (value == ">=") kind = .OP_GTE;
  else if (value == "|") kind = .OP_BIN_OR;
  else if (value == "&") kind = .OP_BIN_AND;
  else if (value == "==") kind = .OP_EQUAL;
  else if (value == "!=") kind = .OP_NEQUAL;
  else if (value == "||") kind = .OP_OR;
  else if (value == "&&") kind = .OP_AND;
  else if (value == "++") kind = .OP_ADD_ADD;
  else if (value == "--") kind = .OP_SUB_SUB;
  else if (value == "new") kind = .OP_NEW;
  else kind = .TT_IDENTIFIER;
  let token = createToken(kind, value, line, column-value.length);
  tokens.push(token);
  return (token);
};

// ## SCANNER ##

function createToken(kind, value, line, column) {
  let token = {
    kind: kind,
    value: value,
    line: line,
    column: column
  };
  return (token);
};

function scan(str) {

  let ii = -1;
  let line = 1;
  let column = 0;
  let length = str.length;

  let tokens = [];

  function next() {
    ii++;
    column++;
  };

  while (true) {
    next();
    let ch = str.charAt(ii);
    let cc = str.charCodeAt(ii);
    // blank
    if (isBlank(cc)) {
      continue;
    }
    if (cc == 10) {
      line++;
      column = 0;
      continue;
    }
    // alpha
    if (isAlpha(cc)) {
      let start = ii;
      while (true) {
        if (!isAlpha(cc)) {
          ii--;
          column--;
          break;
        }
        next();
        cc = str.charCodeAt(ii);
      };
      let content = str.slice(start, ii+1);
      processToken(tokens, content, line, column);
      continue;
    }
    // number
    if (isNumber(cc) || cc == 45 && isNumber(str.charCodeAt(ii+1))) {
      let start = ii;
      while (true) {
        if (!isNumber(cc) && cc != 45) {
          ii--;
          column--;
          break;
        }
        next();
        cc = str.charCodeAt(ii);
      };
      let content = str.slice(start, ii+1);
      let token = createToken(.TT_NUMBER, content, line, column);
      tokens.push(token);
      continue;
    }
    // string
    if (isQuote(cc)) {
      let start = ii;
      let begin = cc;
      while (true) {
        next();
        cc = str.charCodeAt(ii);
        // break on next matching quote
        if (isQuote(cc) && cc == begin) {
          break;
        }
      };
      let content = str.slice(start+1, ii);
      let token = createToken(.TT_STRING, content, line, column);
      token.isChar = content[0] == "'";
      tokens.push(token);
      continue;
    }
    if (ch == "/") {
      if (str.charAt(ii + 1) == "/") {
        while (true) {
          if (cc == 10) {
            column = 0;
            line++;
            break;
          }
          next();
          cc = str.charCodeAt(ii);
        };
      }
      continue;
    }
    if (
      ch == "(" ||
      ch == ")" ||
      ch == "[" ||
      ch == "]" ||
      ch == "{" ||
      ch == "}" ||
      ch == "." ||
      ch == ":" ||
      ch == "," ||
      ch == ";" ||
      ch == "*" ||
      ch == "/"
    ) {
      let content = str.slice(ii, ii+1);
      processToken(tokens, content, line, column);
      continue;
    }
    if (
      ch == "+" ||
      ch == "-" ||
      ch == "!" ||
      ch == "=" ||
      ch == "|" ||
      ch == "&" ||
      ch == ">" ||
      ch == "<"
    ) {
      let second = str.slice(ii+1, ii+2);
      // + # ++
      if (ch == "+") {
        if (ch + second == "++") {
          next();
          processToken(tokens, ch + second, line, column);
        } else {
          processToken(tokens, ch, line, column);
        }
      }
      // - # --
      else if (ch == "-") {
        if (ch + second == "--") {
          next();
          processToken(tokens, ch + second, line, column);
        } else {
          processToken(tokens, ch, line, column);
        }
      }
      // ! # !=
      else if (ch == "!") {
        if (ch + second == "!=") {
          next();
          processToken(tokens, ch + second, line, column);
        } else {
          processToken(tokens, ch, line, column);
        }
      }
      // = # ==
      else if (ch == "=") {
        if (ch + second == "==") {
          next();
          processToken(tokens, ch + second, line, column);
        } else {
          processToken(tokens, ch, line, column);
        }
      }
      // | # ||
      else if (ch == "|") {
        if (ch + second == "||") {
          next();
          processToken(tokens, ch + second, line, column);
        } else {
          processToken(tokens, ch, line, column);
        }
      }
      // | # ||
      else if (ch == "|") {
        if (ch + second == "||") {
          next();
          processToken(tokens, ch + second, line, column);
        } else {
          processToken(tokens, ch, line, column);
        }
      }
      // & # &&
      else if (ch == "&") {
        if (ch + second == "&&") {
          next();
          processToken(tokens, ch + second, line, column);
        } else {
          processToken(tokens, ch, line, column);
        }
      }
      // > # >=
      else if (ch == ">") {
        if (ch + second == ">=") {
          next();
          processToken(tokens, ch + second, line, column);
        } else {
          processToken(tokens, ch, line, column);
        }
      }
      // < # <=
      else if (ch == "<") {
        if (ch + second == "<=") {
          next();
          processToken(tokens, ch + second, line, column);
        } else {
          processToken(tokens, ch, line, column);
        }
      }
      continue;
    }

    if (ii >= length) {
      break;
    }

  };

  return (tokens);

};

// scope related
let scope = null;
function Scope() {
  this.node = null;
  this.parent = null;
  this.symbols = {};
  this.resolve = function(id) {
    if (this.symbols[id]) {
      return (this.symbols[id]);
    } else {
      if (this.parent) {
        return (this.parent.resolve(id));
      }
    }
    return (null);
  };
  this.register = function(id, node) {
    this.symbols[id] = node;
  };
};

function pushScope(node) {
  let scp = new Scope();
  scp.node = node;
  scp.parent = scope;
  node.context = scp;
  scope = scp;
};

function popScope() {
  if (scope != null) {
    scope = scope.parent;
  }
};

// ## PARSER ##

let pindex = 0;
let tokens = null;
let current = null;
function parse(tkns) {
  tokens = tkns;
  pindex = -1;
  next();
  let node = {
    kind: .NN_PROGRAM,
    body: null
  };
  pushScope(node);
  node.body = parseStatementList();
  return (node);
};

function parseStatementList() {
  let list = [];
  while (true) {
    if (!current) break;
    if (peek(.PP_RBRACE)) break;
    let node = parseStatement();
    if (!node) break;
    list.push(node);
  };
  return (list);
};

function parseStatement() {
  let node = null;
  if (peek(.KK_LET)) {
    node = parseVariableDeclaration(.NN_LET);
  } else if (peek(.KK_CONST)) {
    node = parseVariableDeclaration(.NN_CONST);
  } else if (peek(.KK_FUNCTION)) {
    node = parseFunctionDeclaration();
  } else if (peek(.KK_RETURN)) {
    node = parseReturnStatement();
  } else if (peek(.KK_IF)) {
    node = parseIfStatement();
  } else if (peek(.KK_WHILE)) {
    node = parseWhileStatement();
  } else if (peek(.KK_ENUM)) {
    node = parseEnumDeclaration();  
  } else if (peek(.KK_EXPORT)) {
    node = parseExport();
  } else {
    node = parseExpression();
    if (node == null) {
      __imports.error("Unknown node kind " + current.value + " in " + current.line + ":" + current.column);
    }
  }
  eat(.PP_SEMIC);
  return (node);
};

function parseExport() {
  expect(.KK_EXPORT);
  let node = {
    kind: .NN_EXPORT,
    init: null
  };
  if (peek(.KK_LET) || peek(.KK_CONST) || peek(.KK_FUNCTION)) {
    node.init = parseStatement();
  }
  return (node);
};

function parseWhileStatement() {
  let node = {
    kind: .NN_WHILE,
    condition: null,
    body: null
  };
  expect(.KK_WHILE);
  node.condition = parseExpression();
  // braced body
  if (eat(.PP_LBRACE)) {
    pushScope(node);
    node.body = parseStatementList();
    popScope();
    expect(.PP_RBRACE);
  // short body
  } else {
    node.body = parseExpression();
  }
  return (node);
};

function parseIfStatement() {
  let node = {
    kind: .NN_IF,
    condition: null,
    alternate: null,
    consequent: null
  };
  // else
  if (!eat(.KK_IF)) {
    pushScope(node);
    node.consequent = parseIfBody();
    popScope();
    return (node);
  }
  expect(.PP_LPAREN);
  node.condition = parseExpression();
  expect(.PP_RPAREN);
  pushScope(node);
  node.consequent = parseIfBody();
  popScope();
  if (eat(.KK_ELSE)) {
    node.alternate = parseIfStatement();
  }
  return (node);
};

function parseIfBody() {
  let node = null;
  // braced if
  if (eat(.PP_LBRACE)) {
    node = parseStatementList();
    expect(.PP_RBRACE);
  // short if
  } else {
    node = [];
    node.push(parseExpression());
    eat(.PP_SEMIC);
  }
  return (node);
};

function parseReturnStatement() {
  expect(.KK_RETURN);
  let node = {
    kind: .NN_RETURN,
    argument: parseExpression()
  };
  return (node);
};

function parseFunctionDeclaration() {
  expect(.KK_FUNCTION);
  let node = {
    kind: .NN_FUNCTION,
    id: null,
    parameter: null,
    body: null
  };
  if (peek(.TT_IDENTIFIER)) {
    node.id = current.value;
    scope.register(node.id, node);
    next();
  }
  node.parameter = parseFunctionParameters();
  if (eat(.PP_LBRACE)) {
    pushScope(node);
    node.body = parseStatementList();
    popScope();
    expect(.PP_RBRACE);
  }
  return (node);
};

function parseFunctionParameters() {
  let params = [];
  expect(.PP_LPAREN);
  while (true) {
    if (peek(.PP_RPAREN)) break;
    params.push(current);
    next();
    if (!eat(.PP_COMMA)) break;
  };
  expect(.PP_RPAREN);
  return (params);
};

function parseEnumDeclaration() {
  expect(.KK_ENUM);
  let node = {
    kind: .NN_ENUM,
    name: null,
    body: null
  };
  expectIdentifier();
  node.name = current.value;
  scope.register(node.name, node);
  next();
  expect(.PP_LBRACE);
  node.body = parseEnumBody();
  expect(.PP_RBRACE);
  return (node);
};

function parseEnumBody() {
  let keys = [];
  let idx = 0;
  while (peek(.TT_IDENTIFIER)) {
    let node = {
      kind: .NN_ENUM_ITEM,
      name: current.value,
      init: null
    };
    next();
    if (eat(.OP_ASS)) {
      if (!isLiteral(current)) {
        __imports.error("Enum key " + node.name + " can only have numeric value");
      } else {
        node.init = parseLiteral();
        idx = node.init.value;
      }
    } else {
      node.init = {value:idx++};
    }
    scope.register(node.name, node);
    keys.push(node);
    if (!eat(.PP_COMMA)) break;
  };
  return (keys);
};

function parseVariableDeclaration(kind) {
  next();
  expectIdentifier();
  let node = {
    kind: kind,
    id: current.value,
    init: null
  };
  next();
  scope.register(node.id, node);
  expect(.OP_ASS);
  node.init = parseExpression();
  return (node);
};

function parseMemberExpression(parent) {
  expect(.PP_DOT);
  let node = {
    kind: .NN_MEMBER_EXPRESSION,
    parent: parent,
    member: parseExpression()
  };
  if (node.parent.kind == .NN_LITERAL && node.member.kind == .NN_LITERAL) {
    let resolve = scope.resolve(node.parent.value);
    if (resolve && resolve.kind == .NN_ENUM) {
      let ii = 0;
      while (ii < resolve.body.length) {
        let child = resolve.body[ii];
        if (node.member.value == child.name) {
          node = {
            kind: .NN_ENUM_EXPRESSION,
            value: child.init
          };
          break;
        }
        ii++;
      };
    }
  }
  return (node);
};

function parseComputedMemberExpression(parent) {
  expect(.PP_LBRACK);
  let node = {
    kind: .NN_COMPUTED_MEMBER_EXPRESSION,
    parent: parent,
    member: parseExpression()
  };
  expect(.PP_RBRACK);
  return (node);
};

function parseCallExpression(id) {
  let node = {
    kind: .NN_CALL_EXPRESSION,
    callee: id,
    parameter: parseCallParameters()
  };
  return (node);
};

function parseCallParameters() {
  let params = [];
  expect(.PP_LPAREN);
  while (true) {
    if (peek(.PP_RPAREN)) break;
    let expr = parseExpression();
    params.push(expr);
    if (!eat(.PP_COMMA)) break;
  };
  expect(.PP_RPAREN);
  return (params);
};

function parseBreak() {
  expect(.KK_BREAK);
  let node = {
    kind: .NN_BREAK
  };
  return (node);
};

function parseContinue() {
  expect(.KK_CONTINUE);
  let node = {
    kind: .NN_CONTINUE
  };
  return (node);
};

function parseObjectExpression() {
  let node = {
    kind: .NN_OBJECT_EXPRESSION,
    properties: []
  };
  expect(.PP_LBRACE);
  while (true) {
    if (peek(.PP_RBRACE)) break;
    let property = {
      kind: .NN_OBJECT_PROPERTY,
      id: parseLiteral(),
      value: null
    };
    expect(.PP_COLON);
    property.value = parseExpression();
    node.properties.push(property);
    if (!eat(.PP_COMMA)) break;
  };
  expect(.PP_RBRACE);
  return (node);
};

function parseUnaryPrefixExpression() {
  let node = {
    kind: .NN_UNARY_PREFIX_EXPRESSION,
    operator: current.value,
    value: null
  };
  next();
  node.value = parseLiteral();
  return (node);
};

function parseUnaryPostfixExpression(left) {
  let node = {
    kind: .NN_UNARY_POSTFIX_EXPRESSION,
    operator: current.value,
    value: left
  };
  next();
  return (node);
};

function parseBinaryExpression(left) {
  let node = {
    kind: .NN_BINARY_EXPRESSION,
    left: left,
    right: null,
    operator: current.value
  };
  next();
  node.right = parseExpression();
  return (node);
};

function parseInfix(left) {
  if (isBinaryOperator(current)) {
    return (parseBinaryExpression(left));
  }
  if (isUnaryPostfixOperator(current)) {
    return (parseUnaryPostfixExpression(left));
  }
  if (peek(.PP_LPAREN)) {
    return (parseCallExpression(left));
  }
  if (peek(.PP_DOT)) {
    return (parseMemberExpression(left));
  }
  if (peek(.PP_LBRACK)) {
    return (parseComputedMemberExpression(left));
  }
  return (left);
};

function parsePrefix() {
  if (isLiteral(current)) {
    return (parseLiteral());
  }
  if (peek(.PP_LBRACE)) {
    return (parseObjectExpression());
  }
  if (peek(.PP_LBRACK)) {
    return (parseArrayExpression());
  }
  if (eat(.PP_LPAREN)) {
    let node = parseExpression();
    expect(.PP_RPAREN);
    return (node);
  }
  if (isUnaryPrefixOperator(current)) {
    return (parseUnaryPrefixExpression());
  }
  return (parseStatement());
};

function parseArrayExpression() {
  expect(.PP_LBRACK);
  let node = {
    kind: .NN_ARRAY_EXPRESSION,
    elements: []
  };
  while (true) {
    if (peek(.PP_RBRACK)) break;
    let element = {
      kind: .NN_ARRAY_ELEMENT,
      value: parseExpression()
    };
    node.elements.push(element);
    if (!eat(.PP_COMMA)) break;
  };
  expect(.PP_RBRACK);
  return (node);
};

function parseExpression() {
  if (peek(.KK_BREAK)) {
    return (parseBreak());
  }
  if (peek(.KK_CONTINUE)) {
    return (parseContinue());
  }
  if (peek(.PP_DOT)) {
    return (parseEnumExpression());
  }
  let node = parsePrefix();
  while (true) {
    if (!current) break;
    let expr = parseInfix(node);
    if (expr == null || expr == node) break;
    node = expr;
  };
  return (node);
};

function parseLiteral() {
  if (peek(.TT_STRING)) {
    return (parseStringLiteral());
  }
  let node = {
    kind: .NN_LITERAL,
    type: current.kind,
    value: current.value
  };
  next();
  return (node);
};

function parseStringLiteral() {
  let node = {
    kind: .NN_STRING_LITERAL,
    type: current.kind,
    value: current.value,
    isChar: current.isChar
  };
  next();
  return (node);
};

function expectIdentifier() {
  if (current.kind != .TT_IDENTIFIER) {
    __imports.error("Expected " + .TT_IDENTIFIER + ":identifier but got " + current.kind + ":" + current.value);
  }
};

function peek(kind) {
  return (current && current.kind == kind);
};

function next() {
  pindex++;
  current = tokens[pindex];
};

function expect(kind) {
  if (current.kind != kind) {
    __imports.error("Expected " + kind + " but got " + current.kind + " in " + current.line + ":" + current.column);
  } else {
    next();
  }
};

function eat(kind) {
  if (peek(kind)) {
    next();
    return (true);
  }
  return (false);
};

let out = "";
function write(str) {
  out = out + str;
};

function generate(node) {
  generateBody(node.body);
  return (out);
};

function generateBody(body) {
  let ii = 0;
  while (ii < body.length) {
    generateNode(body[ii]);
    ii++;
    write(";");
  };
};

function generateNode(node) {
  let kind = node.kind;
  if (kind == .NN_FUNCTION) {
    write("function ");
    if (node.id) write(node.id);
    write("(");
    let ii = 0;
    while (ii < node.parameter.length) {
      write(node.parameter[ii].value);
      if (ii + 1 < node.parameter.length) {
        write(", ");
      }
      ii++;
    };
    write(")");
    write(" { ");
    generateBody(node.body);
    write(" } ");
  }
  else if (kind == .NN_LET) {
    write("let ");
    write(node.id);
    write(" = ");
    generateNode(node.init);
  }
  else if (kind == .NN_CONST) {
    write("const ");
    write(node.id);
    write(" = ");
    generateNode(node.init);
  }
  else if (kind == .NN_IF) {
    if (node.condition) {
      write("if (");
      generateNode(node.condition);
      write(")");
    }
    write(" { ");
    generateBody(node.consequent);
    write(" } ");
    if (node.alternate) {
      write("else ");
      generateNode(node.alternate);
    }
  }
  else if (kind == .NN_RETURN) {
    write("return (");
    generateNode(node.argument);
    write(")");
  }
  else if (kind == .NN_WHILE) {
    write("while ");
    write("(");
    generateNode(node.condition);
    write(")");
    write(" {");
    generateBody(node.body);
    write(" } ");
  }
  else if (kind == .NN_BREAK) {
    write("break");
    write("");
  }
  else if (kind == .NN_CONTINUE) {
    write("continue");
    write("");
  }
  else if (kind == .NN_CALL_EXPRESSION) {
    generateNode(node.callee);
    write("(");
    let ii = 0;
    while (ii < node.parameter.length) {
      generateNode(node.parameter[ii]);
      if (ii + 1 < node.parameter.length) {
        write(", ");
      }
      ii++;
    };
    write(")");
  }
  else if (kind == .NN_BINARY_EXPRESSION) {
    generateNode(node.left);
    if (node.operator == "==") {
      write(" === ");
    }
    else if (node.operator == "!=") {
      write(" !== ");
    }
    else {
      write(node.operator);
    }
    generateNode(node.right);
  }
  else if (kind == .NN_MEMBER_EXPRESSION) {
    generateNode(node.parent);
    write(".");
    generateNode(node.member);
  }
  else if (kind == .NN_COMPUTED_MEMBER_EXPRESSION) {
    generateNode(node.parent);
    write("[");
    generateNode(node.member);
    write("]");
  }
  else if (kind == .NN_UNARY_PREFIX_EXPRESSION) {
    if (node.operator == "new") {
      write(node.operator);
      write(" ");
    }
    else write(node.operator);
    generateNode(node.value);
  }
  else if (kind == .NN_UNARY_POSTFIX_EXPRESSION) {
    generateNode(node.value);
    write(node.operator);
  }
  else if (kind == .NN_OBJECT_EXPRESSION) {
    write("{");
    let ii = 0;
    while (ii < node.properties.length) {
      let property = node.properties[ii];
      generateNode(property.id);
      write(": ");
      generateNode(property.value);
      if (ii + 1 < node.properties.length) {
        write(", ");
      }
      ii++;
    };
    write(" }");
  }
  else if (kind == .NN_ARRAY_EXPRESSION) {
    write("[");
    let ii = 0;
    while (ii < node.elements.length) {
      let element = node.elements[ii];
      generateNode(element.value);
      if (ii + 1 < node.elements.length) {
        write(", ");
      }
      ii++;
    };
    write("]");
  }
  else if (kind == .NN_LITERAL) {
    write(node.value);
  }
  else if (kind == .NN_STRING_LITERAL) {
    let isChar = node.isChar;
    if (isChar) write('"');
    else write("'");
    write(node.value);
    if (isChar) write('"');
    else write("'");
  }
  else if (kind == .NN_EXPORT) {
    let init = node.init;
    write("module.exports.");
    write(init.id);
    write(" = ");
    if (init.kind == .NN_FUNCTION) {
      generateNode(init);
    }
    else if (init.kind == .NN_LET || init.kind == .NN_CONST) {
      generateNode(init.init);
    }
    else {
      __imports.error("Cannot export node kind " + init.kind + "!");
    }
  }
  else if (kind == .NN_ENUM) {
    let name = node.name;
    let body = node.body;
    write("var ");
    write(name);
    write(";");
    write("(function(");
    write(name);
    write(") {");
    // body
    let ii = 0;
    while (ii < body.length) {
      let child = body[ii];
      write(name);
      write("[");
      write(name);
      write("[");
      write("'" + child.name + "'");
      write("]");
      write(" = ");
      write(child.init.value);
      write("] = ");
      write("'" + child.name + "'");
      write(";");
      ii++;
    };
    write("})(");
    write(name);
    write(" || (");
    write(name);
    write(" = {})");
    write(")");
  }
  else if (kind == .NN_ENUM_EXPRESSION) {
    write(node.value.value);
  }
  else {
    __imports.error("Unknown node kind " + node.kind + "!");
  }
};

function parseEnumExpression() {
  let name = null;
  let member = null;
  let isShorty = eat(.PP_DOT);
  // shorty, try to auto resolve enum
  if (isShorty) {
    expectIdentifier();
    let nameToResolve = current.value;
    let cscope = scope;
    while (cscope != null) {
      let sym = cscope.symbols;
      let keys = Object.keys(sym);
      let kk = 0;
      while (kk < keys.length) {
        let key = keys[kk];
        let item = sym[key];
        if (item.kind == .NN_ENUM) {
          let jj = 0;
          while (jj < item.body.length) {
            let child = item.body[jj];
            if (child.name == nameToResolve) {
              name = item.name;
              member = nameToResolve;
              // break all loops
              cscope = {parent:null}; kk = keys.length + 1; break;
            }
            jj++;
          };
        }
        kk++;
      };
      cscope = cscope.parent;
    };
  } else {
    name = current.value;
    expect(.PP_DOT);
  }
  expectIdentifier();
  let node = {
    kind: .NN_ENUM_EXPRESSION,
    value: null
  };
  // unfold enum
  let resolve = scope.resolve(name);
  if (resolve && resolve.kind == .NN_ENUM) {
    let ii = 0;
    let body = resolve.body;
    while (ii < body.length) {
      let child = body[ii];
      if (child.name == member) {
        node.value = child.init;
        break;
      }
      ii++;
    };
  }
  next();
  return (node);
};

let __imports = null;
export function compile(str, imports) {
  __imports = imports;
  let tokens = scan(str);
  let ast = parse(tokens);
  return (generate(ast));
};
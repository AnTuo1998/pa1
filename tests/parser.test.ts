import * as mocha from 'mocha';
import {expect} from 'chai';
import { parser } from 'lezer-python';
import { traverseExpr, traverseStmt, traverse, parse } from '../parser';
import { BinOp, UnOp } from '../ast';

// We write tests for each function in parser.ts here. Each function gets its 
// own describe statement. Each it statement represents a single test. You
// should write enough unit tests for each function until you are confident
// the parser works as expected. 
describe('traverseExpr(c, s) function', () => {
  it('parses a number in the beginning', () => {
    const source = "987";
    const cursor = parser.parse(source).cursor();

    // go to statement
    cursor.firstChild();
    // go to expression
    cursor.firstChild();

    const parsedExpr = traverseExpr(cursor, source);

    // Note: we have to use deep equality when comparing objects
    expect(parsedExpr).to.deep.equal({tag: "num", value: 987});
  })

  // TODO: add additional tests here to ensure traverseExpr works as expected
  it('parses a variable in the beginning', () => {
    const source = "x";
    const cursor = parser.parse(source).cursor();

    // go to statement
    cursor.firstChild();
    // go to expression
    cursor.firstChild();

    const parsedExpr = traverseExpr(cursor, source);

    // Note: we have to use deep equality when comparing objects
    expect(parsedExpr).to.deep.equal({ tag: "id", name: "x" });
  })

  it('parses a call expression 1', () => {
    const source = "abs(x)";
    const cursor = parser.parse(source).cursor();

    // go to statement
    cursor.firstChild();
    // go to expression
    cursor.firstChild();

    const parsedExpr = traverseExpr(cursor, source);

    // Note: we have to use deep equality when comparing objects
    expect(parsedExpr).to.deep.equal({ tag: "builtin1", name: "abs", 
    arg: { tag: "id", name: "x"} });
  })

  it('parses a call expression 2', () => {
    const source = "max(x, 3)";
    const cursor = parser.parse(source).cursor();

    // go to statement
    cursor.firstChild();
    // go to expression
    cursor.firstChild();

    const parsedExpr = traverseExpr(cursor, source);

    // Note: we have to use deep equality when comparing objects
    expect(parsedExpr).to.deep.equal({
      tag: "builtin2", name: "max",
      arg1: { tag: "id", name: "x" },
      arg2: { tag: "num", value: 3 }
    });
  })

  it('parses an undefined call expression 1', () => {
    const source = "floor(x)";
    const cursor = parser.parse(source).cursor();

    // go to statement
    cursor.firstChild();
    // go to expression
    cursor.firstChild();

    const parsedExpr = traverseExpr(cursor, source);

    // Note: we have to use deep equality when comparing objects
    expect(parsedExpr).to.deep.equal({
      tag: "builtin1", name: "floor",
      arg: { tag: "id", name: "x" }
    });
  })

  it('parses an undefined call expression 2', () => {
    const source = "max(x, 1, 56)";
    const cursor = parser.parse(source).cursor();

    // go to statement
    cursor.firstChild();
    // go to expression
    cursor.firstChild();

    const parsedExpr = traverseExpr(cursor, source);
  })

  it('parses a binary expression', () => {
    const source = "5 + x";
    const cursor = parser.parse(source).cursor();

    // go to statement
    cursor.firstChild();
    // go to expression
    cursor.firstChild();

    const parsedExpr = traverseExpr(cursor, source);
    // Note: we have to use deep equality when comparing objects
    expect(parsedExpr).to.deep.equal({
      tag: "binexpr", op: BinOp.Plus,
      left: { tag: "num", value: 5 },
      right: { tag: "id", name: "x" }
    });
  })

  it('parses an undefined binary expression', () => {
    const source = "5 / x";
    const cursor = parser.parse(source).cursor();

    // go to statement
    cursor.firstChild();
    // go to expression
    cursor.firstChild();

    const parsedExpr = traverseExpr(cursor, source);
    // Note: we have to use deep equality when comparing objects
    expect(parsedExpr).to.deep.equal({
      tag: "binexpr", op: BinOp.Plus,
      left: { tag: "num", value: 5 },
      right: { tag: "id", name: "x" }
    });
  })

  it('parses a unary expression', () => {
    const source = "-x";
    const cursor = parser.parse(source).cursor();

    // go to statement
    cursor.firstChild();
    // go to expression
    cursor.firstChild();

    const parsedExpr = traverseExpr(cursor, source);
    // Note: we have to use deep equality when comparing objects
    expect(parsedExpr).to.deep.equal({
      tag: "unexpr", op: UnOp.Minus,
      expr: { tag: "id", name: "x"}
    });
  })

  it('parses an undefined unary expression', () => {
    const source = "~x";
    const cursor = parser.parse(source).cursor();

    // go to statement
    cursor.firstChild();
    // go to expression
    cursor.firstChild();

    const parsedExpr = traverseExpr(cursor, source);
  })

  it('parses an unknown expression', () => {
    const source = "x? 1: 0";
    const cursor = parser.parse(source).cursor();

    // go to statement
    cursor.firstChild();
    // go to expression
    cursor.firstChild();

    const parsedExpr = traverseExpr(cursor, source);
  })

});

describe('traverseStmt(c, s) function', () => {
  // TODO: add tests here to ensure traverseStmt works as expected
  it('parses assign statement 1', () => {
    const source = "x = 987";
    const cursor = parser.parse(source).cursor();
    // go to statement
    cursor.firstChild();
    const parsedStmt = traverseStmt(cursor, source);

    // Note: we have to use deep equality when comparing objects
    expect(parsedStmt).to.deep.equal({ tag: "define", name: "x", 
    value: { tag : "num", value: 987} });
  })

  it('parses assign statement 2', () => {
    const source = "x = y";
    const cursor = parser.parse(source).cursor();
    // go to statement
    cursor.firstChild();
    const parsedStmt = traverseStmt(cursor, source);

    // Note: we have to use deep equality when comparing objects
    expect(parsedStmt).to.deep.equal({
      tag: "define", name: "x",
      value: { tag: "id", name: "y" }
    });
  })

  it('parses expression statement 1', () => {
    const source = "x + 4";
    const cursor = parser.parse(source).cursor();
    // go to statement
    cursor.firstChild();
    const parsedStmt = traverseStmt(cursor, source);

    // Note: we have to use deep equality when comparing objects
    expect(parsedStmt).to.deep.equal({
      tag: "expr", 
      expr: {
        tag: "binexpr", op: BinOp.Plus,
        left: {tag: "id", name:"x"},
        right: {tag: "num", value: 4}
      }
    });
  })

  it('parses expression statement 2', () => {
    const source = "pow(x * max(4, y), 5)";
    const cursor = parser.parse(source).cursor();
    // go to statement
    cursor.firstChild();
    const parsedStmt = traverseStmt(cursor, source);

    // Note: we have to use deep equality when comparing objects
    expect(parsedStmt).to.deep.equal({
      tag: "expr",
      expr: {
        tag: "builtin2", name: "pow",
        arg1: {
          tag: "binexpr", op:BinOp.Mul,
          left: {tag: "id", name: "x"},
          right: {
            tag: "builtin2", name: "max",
            arg1: {tag: "num", value: 4},
            arg2: {tag: "id", name: "y"}
          }
        },
        arg2: {tag: "num", value: 5}
      }
    });
  })

  it('parses undefined statement', () => {
    const source = "if (x > 5)";
    const cursor = parser.parse(source).cursor();
    // go to statement
    cursor.firstChild();
    const parsedStmt = traverseStmt(cursor, source);
  })

});

describe('traverse(c, s) function', () => {
  // TODO: add tests here to ensure traverse works as expected
  it('parses statements', () => {
    const source = "x = y\nprint(x)";
    const cursor = parser.parse(source).cursor();
    const parsedStmts = traverse(cursor, source);

    // Note: we have to use deep equality when comparing objects
    expect(parsedStmts).to.deep.equal([
      {
        tag: "define", name: "x",
        value: { tag: "id", name: "y" }
      }, 
      {
        tag: "expr", 
        expr: {
          tag: "builtin1", name: "print",
          arg: { tag: "id", name: "x" }
        }
      }
    ]);
  })

});

describe('parse(source) function', () => {
  it('parse a number', () => {
    const parsed = parse("987");
    expect(parsed).to.deep.equal([{tag: "expr", expr: {tag: "num", value: 987}}]);
  });  

  // TODO: add additional tests here to ensure parse works as expected
  it('parse source', () => {
    const parsed = parse("x = -1\nprint(abs(-x))\ny = x * 7");
    expect(parsed).to.deep.equal([
      { 
        tag: "define", name: "x", 
        value: { tag:"unexpr", op: UnOp.Minus, expr: {tag: "num", value: 1} }
      },
      {
        tag: "expr", 
        expr: {
          tag: "builtin1", name: "print",
          arg: {
            tag: "builtin1", name: "abs", 
            arg: {
              tag: "unexpr", op:UnOp.Minus,
              expr: { tag: "id", name:"x"} }
          }
        }
      }, 
      {
        tag: "define", name: "y", 
        value: {
          tag: "binexpr", op: BinOp.Mul,
          left: { tag: "id", name: "x" },
          right: { tag: "num", value: 7}
        }
      }
    ]);
  });  

});
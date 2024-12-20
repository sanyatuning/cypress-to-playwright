import ts from 'typescript';
import { Factory } from './node-factory.js';
import { PLAYWRIGHT_PAGE_NAME, PLAYWRIGHT_PAGE_TYPE } from '../playwright.js';
import { fixString } from './fix-string.js';

export function handle(node: ts.ExpressionStatement, factory: Factory) {
  const call = node.expression as ts.CallExpression;
  const name = call.arguments[0].getText();
  const callback = call.arguments[1] as unknown as ts.FunctionDeclaration;

  return factory.function(
    fixString(name),
    [factory.parameter(PLAYWRIGHT_PAGE_NAME, PLAYWRIGHT_PAGE_TYPE), ...callback.parameters],
    callback.body || factory.emptyBlock(),
    [factory.exportToken(), factory.asyncToken()]
  );
}

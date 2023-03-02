import ts from 'typescript';

export const transformerFactory: ts.TransformerFactory<ts.Node> = (
  context: ts.TransformationContext
) => {
  return (rootNode) => {
    function visit(node: ts.Node): ts.Node {
      node = ts.visitEachChild(node, visit, context);

      if (
        ts.isExpressionStatement(node) &&
        ts.isCallExpression(node.expression)
      ) {
        if (isItBlock(node.expression)) {
          const newExpression = context.factory.createIdentifier('test');
          return createExpressionStatement(
            context,
            newExpression,
            node.expression
          );
        }

        if (!ts.isPropertyAccessExpression(node.expression.expression)) {
          return node;
        }

        if (
          isItBlock(node.expression) ||
          isItBlock(node.expression.expression)
        ) {
          const newExpression = context.factory.createPropertyAccessExpression(
            context.factory.createIdentifier('test'),
            node.expression.expression.name
          );
          return createExpressionStatement(
            context,
            newExpression,
            node.expression
          );
        }

        if (isVisitCallExpressions(node.expression.expression)) {
          return context.factory.createAwaitExpression(
            context.factory.createCallExpression(
              context.factory.createPropertyAccessExpression(
                context.factory.createIdentifier('page'),
                context.factory.createIdentifier('goto')
              ),
              node.expression.typeArguments,
              node.expression.arguments
            )
          );
        }
      }

      return node;
    }

    return ts.visitNode(rootNode, visit);
  };
};

function isItBlock(
  callExpression: ts.CallExpression | ts.PropertyAccessExpression
) {
  return (
    ts.isIdentifier(callExpression.expression) &&
    callExpression.expression.escapedText === 'it'
  );
}

function createExpressionStatement(
  context: ts.TransformationContext,
  newExpression: ts.Expression,
  callExpression: ts.CallExpression
) {
  return context.factory.createExpressionStatement(
    context.factory.createCallExpression(
      newExpression,
      callExpression.typeArguments,
      callExpression.arguments
    )
  );
}

function isVisitCallExpressions(expression: ts.PropertyAccessExpression) {
  return (
    expression.name.escapedText === 'visit' &&
    ts.isIdentifier(expression.expression) &&
    expression.expression.escapedText === 'cy'
  );
}
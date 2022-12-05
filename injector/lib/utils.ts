import { createPrinter, Expression, Node, NodeFactory, SourceFile } from "compiler";

const printer = createPrinter();

export function nodeToString(sourceFile: SourceFile, node: Node) {
    return printer.printNode(4 /* EmitHint.Unspecified */, node, sourceFile);
}

export function createInjectorExpression(factory: NodeFactory, name: string | Expression) {
    if (typeof name === "string") {
        return factory.createElementAccessExpression(
            factory.createIdentifier("globalThis"),
            factory.createStringLiteral(name)
        );
    } else {
        return factory.createElementAccessExpression(
            factory.createIdentifier("globalThis"),
            name
        );
    }
}

import { FunctionMacro, isFunctionLike, isIdentifier } from "compiler";
import { createInjectorExpression, nodeToString } from "./utils";

export macro function provider(this: FunctionMacro, _provider: unknown) {
    this.check(({ node, diagnostic }) => {
        const firstArg = node.arguments[0];
        if (!firstArg || (!isFunctionLike(firstArg) && !isIdentifier(firstArg))) {
            diagnostic("error", "Expected a function or identifier as the first argument");
        }
    });

    this.transform(({ factory, node, sourceFile }) => {
        const firstArg = node.arguments[0]!;

        let name: string;

        if (isFunctionLike(firstArg) && firstArg.name) {
            name = nodeToString(sourceFile, firstArg.name!);
        } else if (isIdentifier(firstArg)) {
            name = nodeToString(sourceFile, firstArg);
        } else {
            throw new Error("Invalid provider. Expected a function or identifier.");
        }

        node.replace(
            factory.createBinaryExpression(
                factory.createElementAccessExpression(
                    factory.createIdentifier("globalThis"),
                    factory.createStringLiteral(name)
                ),
                factory.createToken(63 /* SyntaxKind.EqualsToken */),
                firstArg
            )
        );
    });
}

export macro function inject(this: FunctionMacro, _name: string) {
    this.transform(({ factory, node }) => {
        const firstArg = node.arguments[0]!;

        node.replace(createInjectorExpression(factory, firstArg));
    });
}

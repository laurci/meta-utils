

import { FunctionMacro, getBuildConfig, getCurrentProgram, findAncestor, isStringLiteral, MacroCallExpressionNode, NodeFactory, SourceFile, isFunctionLike, isClassDeclaration, Node, getLineAndCharacterOfPosition } from "compiler";
import * as path from "path";
import { createInjectorExpression, nodeToString } from "@laurci/injector/lib/utils";

const DISABLE_KEY = "debug.disable";
const PRINT_FN_NAME_KEY = "debug.printFunctionName";

function createLog(factory: NodeFactory, sourceFile: SourceFile, node: MacroCallExpressionNode) {
    const baseDir = getCurrentProgram().getCurrentDirectory();
    const fileName = path.relative(baseDir, sourceFile.fileName);

    let intro = `[debug][${fileName}`;

    if (getBuildConfig()[PRINT_FN_NAME_KEY]) {
        const topFn = findAncestor(node, isFunctionLike);
        if (topFn && topFn.name) {
            const fnNAme = nodeToString(sourceFile, topFn.name);
            const topClass = findAncestor(topFn, isClassDeclaration);
            if (topClass && topClass.name) {
                const className = nodeToString(sourceFile, topClass.name);
                intro += `:${className}.${fnNAme}`;
            } else {
                intro += `:${fnNAme}`;
            }
        }
    }

    intro += "]";

    return factory.createCallExpression(
        createInjectorExpression(factory, "utils_debug"),
        [],
        [
            factory.createStringLiteral(intro),
            ...node.arguments.flatMap((arg) => {
                if (isStringLiteral(arg)) return arg;
                const argText = nodeToString(sourceFile, arg);

                return factory.createObjectLiteralExpression([
                    factory.createPropertyAssignment("type", factory.createStringLiteral("expression")),
                    factory.createPropertyAssignment("value", arg),
                    factory.createPropertyAssignment("text", factory.createStringLiteral(argText)),
                ]);
            })
        ],
    );
}

export macro function debug(this: FunctionMacro, ..._args: unknown[]) {
    this.transform(({ node, factory, sourceFile }) => {
        const buildConfig = getBuildConfig();
        if (buildConfig[DISABLE_KEY]) {
            return node.remove();
        }

        return node.replace(createLog(factory, sourceFile, node));
    });
}

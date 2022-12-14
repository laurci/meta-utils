import { CallExpression, getBuildConfig, isLiteralExpression, isMacroCallExpressionNode, isStringLiteral, UsingMacro } from "compiler";
import { nodeToString } from "@laurci/injector/lib/utils";


export macro function buildConfig(this: UsingMacro, _name: string, _value?: unknown) {
    this.check(({ node, diagnostic }) => {
        const name = node.arguments[0];
        if (!name || !isStringLiteral(name) || !name.text) return diagnostic("error", "buildConfig macro requires a string literal as first argument");

        const value = node.arguments[1];
        if (value && !isLiteralExpression(value)) return diagnostic("error", "buildConfig macro requires a literal expression as second argument");
    });

    this.transform(({ node, sourceFile }) => {
        const expression = node.expressions.find(x => {
            if (!isMacroCallExpressionNode(x)) return false;

            return x.expression.expression.escapedText == "buildConfig";
        }) as CallExpression | undefined;

        if (!expression) return;

        const name = expression.arguments[0];
        if (!name || !isStringLiteral(name) || !name.text) return;

        let enabled: any = true;

        const value = expression.arguments[1];
        if (value && isLiteralExpression(node)) {
            const option = eval(`(${nodeToString(sourceFile, value)})`);
            enabled = getBuildConfig()[name.text] == option;
        } else {
            enabled = !!getBuildConfig()[name.text];
        }

        if (!enabled) {
            node.remove();
        }
    });
}

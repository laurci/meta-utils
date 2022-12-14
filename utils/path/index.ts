import { } from "compiler";

import { TaggedTemplateMacro } from "compiler";
import { createInjectorExpression } from "@laurci/injector/lib/utils";

export macro function relative(this: TaggedTemplateMacro, ..._args: unknown[]): string {
    this.transform(({ node, factory }) => {
        return node.replace(
            factory.createCallExpression(
                createInjectorExpression(factory, "utils_path_relative"),
                [],
                [
                    factory.createIdentifier("__dirname"), node.template
                ]
            )
        );
    });
}

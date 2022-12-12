import * as utils from "node:util";

type LogArg = string | { type: "expression"; value: unknown; text: string };

export function utils_debug(...args: LogArg[]) {
    for (const arg of args) {
        if (typeof arg === "string") {
            process.stdout.write(arg);
        }

        if (typeof arg == "object") {
            process.stdout.write("(");
            process.stdout.write(arg.text);
            process.stdout.write(" = ");
            if (typeof arg.value == "object" && typeof (arg.value as any)?.["debugPrint"] == "function") {
                process.stdout.write((arg.value as any).debugPrint());
            } else {
                process.stdout.write(utils.inspect(arg.value, {
                    colors: true,
                    depth: null,
                    showHidden: false
                }));
            }
            process.stdout.write(")");
        }

        process.stdout.write(" ");
    }

    process.stdout.write("\n");
}

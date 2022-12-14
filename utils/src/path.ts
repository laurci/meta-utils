import * as path from "node:path";

export function utils_path_relative(dirname: string, filename: string) {
    return path.join(dirname, filename);
}

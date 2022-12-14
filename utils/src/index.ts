import { provider } from "@laurci/injector/lib";
import { utils_debug } from "./log";
import { utils_path_relative } from "./path";

export interface Features {
    all?: boolean;
    debug?: boolean;
    "path.relative"?: boolean;
}

export function bootstrap(features: Features) {
    function hasFeatureEnabled(feature: keyof Features) {
        return features.all || features[feature];
    }

    if (hasFeatureEnabled("debug")) provider!(utils_debug);
    if (hasFeatureEnabled("path.relative")) provider!(utils_path_relative);
}

import { provider } from "@laurci/injector/lib";
import { utils_debug } from "./log";

export interface Features {
    all?: boolean;
    debug?: boolean;
}

export function bootstrap(features: Features) {
    function hasFeatureEnabled(feature: keyof Features) {
        return features.all || features[feature];
    }

    if (hasFeatureEnabled("debug")) provider!(utils_debug);
}

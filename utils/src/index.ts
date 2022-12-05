import { provider } from "@laurci/injector/lib";
import { utils_log_debug } from "./log";

export interface Features {
    all?: boolean;
    log?: boolean;
}

export function bootstrap(features: Features) {
    function hasFeatureEnabled(feature: keyof Features) {
        return features.all || features[feature];
    }

    if (hasFeatureEnabled("log")) provider!(utils_log_debug);
}

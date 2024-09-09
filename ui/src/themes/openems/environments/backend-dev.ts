import { Environment } from "src/environments";
import { theme } from "./theme";

export const environment: Environment = {
    ...theme, ...{

        backend: "OpenEMS Backend",
        url: (location.protocol === "https:" ? "wss://" : "ws://") + location.hostname + ":8082",

        production: false,
        debugMode: true,
    },
};

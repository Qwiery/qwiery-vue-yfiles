import type { App } from "vue";
import GraphViewer from "./components/yFilesViewer.vue";
import {yFilesUtils} from "./yFilesUtils";

export default {
    install: (app: App) => {
        app.component("GraphViewer", GraphViewer);
    },
};

export { GraphViewer, yFilesUtils };

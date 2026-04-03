"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = require("./app");
const configs_1 = require("./configs");
const { port, host } = configs_1.config.app;
app_1.app.listen(port, host, () => {
    console.log(`Server is running at http://${host}:${port}`);
});
//# sourceMappingURL=server.js.map
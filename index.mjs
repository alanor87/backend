import { createServer } from "http";
import router from './router.mjs';

const server = createServer(router);

server.listen(process.env.PORT || 8080);
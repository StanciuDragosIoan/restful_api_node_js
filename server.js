const http = require("http");
const router = require("./router");

const PORT = process.env.port || 5000;

const server = http.createServer((req, res) => {
  try {
    router.routeMethod(req, res);
  } catch (err) {
    console.log(err);
    res.statusCode = 500;
    return res.end(`
    <p>Something bad happened under the hood..X___x</p>
    </p>Please stay tuned till someone fixes this bug! ^__^</p>`);
  }
});
server.listen(PORT);
console.log(`SERVER listening on port: ${PORT}`);

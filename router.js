const { validateMethod } = require("./requestHelper");
const resource = require("./resourceController");
const { readDB, findResource, deleteAll } = require("./resourceController");
const { grabPayload, grabForDelete } = require("./securityHelper");
const router = {
  routeMethod(req, res) {
    const method = req.method;
    const url = req.url;
    switch (method) {
      case "GET":
        this.routeUrl(url, req, res);
        break;
      case "POST":
        this.routeUrl(url, req, res);
        break;
      case "PUT":
        this.routeUrl(url, req, res);
        break;
      case "DELETE":
        this.routeUrl(url, req, res);
        break;
      default:
        res.statusCode = 405;
        return res.end("405 METHOD NOT ALLOWED");
    }
  },

  routeUrl(url, req, res) {
    switch (url) {
      case "/":
        if (validateMethod(req, "GET")) {
          return res.end("Hello there =)!");
        } else {
          res.statusCode = 405;
          return res.end("METHOD NOT ALLOWED");
        }
      case "/resources":
        if (validateMethod(req, "GET")) {
          const resData = readDB();
          return res.end(resData);
        } else if (validateMethod(req, "DELETE")) {
          deleteAll();
          return res.end("All resources have been deleted successfully");
        } else {
          grabPayload(req, res);
        }
        break;
      default:
        const resourceId = req.url.split("/")[2];
        if (resourceId && !req.url.split("/")[3]) {
          if (validateMethod(req, "GET")) {
            const resource = findResource(resourceId);
            if (resource) {
              res.statusCode = 200;
              return res.end(JSON.stringify(resource));
            }
            res.statusCode = 404;
            return res.end(`No resource found for ID: ${resourceId}`);
          } else if (validateMethod(req, "POST")) {
            grabPayload(req, res);
          } else if (validateMethod(req, "PUT")) {
            grabPayload(req, res);
          } else if (validateMethod(req, "DELETE")) {
            const resource = findResource(resourceId);
            if (resource) {
              grabForDelete(req, res, resourceId);
            }
            res.statusCode = 400;
            return res.end(`No resource exists for ID: ${resourceId}`);
          }
          return;
        }

        if (validateMethod(req, "GET")) {
          res.statusCode = 404;
          return res.end("Page Not Found X_X");
        } else {
          res.statusCode = 405;
          return res.end("Method not allowed X_X");
        }
    }
  },
};

module.exports = router;

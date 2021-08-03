const { add, update, deleteEntry } = require("./resourceController");
const securityHelper = {
  grabPayload(req, res) {
    const body = [];
    req.on("data", (chunk) => {
      body.push(chunk);
    });

    req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      const isPayloadGood = securityHelper.validatePayload(parsedBody);
      if (isPayloadGood) {
        const itemToAdd = {};
        itemToAdd.name = JSON.parse(parsedBody).name;
        itemToAdd.color = JSON.parse(parsedBody).color;
        itemToAdd.id = securityHelper.getId();

        if (req.url === "/resources") {
          add(JSON.stringify(itemToAdd), res);
        } else {
          update(parsedBody, req, res);
        }
      } else {
        res.statusCode = 400;
        return res.end(
          "BAD PAYLOAD X___X some field is \nmissing or is bad X_x"
        );
      }
    });
  },

  validatePayload(rawPayload) {
    try {
      const payload = JSON.parse(rawPayload);
      if (
        payload.hasOwnProperty("name") &&
        payload.hasOwnProperty("color") &&
        typeof payload.name === "string" &&
        typeof payload.color === "string" &&
        payload.name.length <= 12 &&
        payload.color.length <= 12
      ) {
        return true;
      }
      return false;
    } catch (err) {
      console.log(err);
    }
  },

  getId() {
    const id =
      Math.random().toString(12).substring(2, 17) +
      Math.random().toString(12).substring(2, 17);
    return id;
  },

  grabForDelete(req, res, resourceId) {
    deleteEntry(resourceId);
    return res.end(`Resource with id ${resourceId} deleted successfully`);
  },
};

module.exports = securityHelper;

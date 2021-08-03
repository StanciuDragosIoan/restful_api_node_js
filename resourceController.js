const fs = require("fs");
const resource = {
  add(payload, res) {
    const crtData = JSON.parse(resource.readDB()).resources;
    const parsed = JSON.parse(payload);
    const found = crtData.filter(
      (i) => i.name === parsed.name && i.color === parsed.color
    );
    if (found.length > 0) {
      res.statusCode = 400;
      return res.end("Duplicate Entry X__X");
    }
    resource.writeToDB(payload, res);
  },

  readDB() {
    try {
      const rawJSONData = JSON.parse(fs.readFileSync("db.json"));
      const JSONresponse = JSON.stringify(rawJSONData);
      return JSONresponse;
    } catch (err) {
      console.log(err.message);
      console.log(err.stack);
      const JSONresponse = JSON.stringify({ resources: [] });
      return JSONresponse;
    }
  },

  writeToDB(data, res) {
    const crtResources = JSON.parse(resource.readDB()).resources;
    crtResources.push(JSON.parse(data));
    const dataToWrite = JSON.stringify({ resources: crtResources });
    fs.writeFileSync("db.json", dataToWrite);
    res.statusCode = 200;
    return res.end("resource added successfully ^__^!");
  },

  findResource(id) {
    const crtResources = JSON.parse(resource.readDB()).resources;
    const found = crtResources.find((i) => i.id === id);
    if (found) {
      return found;
    }
    return null;
  },

  update(payload, req, res) {
    let crtResources = JSON.parse(resource.readDB()).resources;
    const parsed = JSON.parse(payload);
    const idToUpdate = req.url.split("/")[2];

    let updateSuccess = false;
    crtResources.map((i) => {
      if (i.id === idToUpdate) {
        i.name = parsed.name;
        i.color = parsed.color;
        updateSuccess = true;
      }
    });

    const dataToWrite = JSON.stringify({ resources: crtResources });
    fs.writeFileSync("db.json", dataToWrite);
    if (updateSuccess) {
      return res.end(
        `Resource with id: ${idToUpdate} updated successfully.. using the ${req.method} http method`
      );
    } else {
      res.statusCode = 400;
      return res.end(
        `Resource with id: ${idToUpdate} could not be found X___X`
      );
    }
  },

  deleteEntry(id) {
    let crtResources = JSON.parse(resource.readDB()).resources;
    crtResources.map((i, index) => {
      if (i.id === id) {
        crtResources.splice(index, 1);
      }
    });
    const dataToWrite = JSON.stringify({ resources: crtResources });
    fs.writeFileSync("db.json", dataToWrite);
  },

  deleteAll() {
    const clearData = JSON.stringify({ resources: [] });
    fs.writeFileSync("db.json", clearData);
  },
};

module.exports = resource;

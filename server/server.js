const next = require("next");
const  nextBuild = require('next/dist/build');
const express = require("express");
const { argv } = require('process');
const config = argv[2].split("=")[1]
const dev = config !== "production";
console.log(config,argv,"dev ",process.env.NODE_ENV);
const app = next({ dev });
const handle = app.getRequestHandler();
const filePath = "./data.json";
const fs = require("fs");
const path = require("path");
const movieData = require(filePath);
const server = express();
const PORT = process.env.PORT || 3000;
server.use(express.json());
// if(dev){
app.prepare().then(() => {

  //handling all thee request coming to server from different pages
  server.get("/api/v1/movie", (req, res) => {
    return res.json(movieData);
  });
  server.post("/api/v1/movie", (req, res) => {
    const movie = req.body;
    movieData.push(movie);
    const pathToFile = path.join(__dirname, filePath);
    const stingifyData = JSON.stringify(movieData, null, 2);
    fs.writeFile(pathToFile, stingifyData, (err) => {
      if (err) {
        return res.status(400).json({ message: err });
      }
      return res.json("data has been added");
    });
  });
  server.get("/api/v1/movie/:id", (req, res) => {
    const { id } = req.params;
    const index = movieData.findIndex((m) => m.id === id);
    const movie = movieData[index];
    return res.json(movie);
  });
  server.delete("/api/v1/movie/:id", (req, res) => {
    const { id } = req.params;
    const index = movieData.findIndex((m) => m.id === id);
    movieData.splice(index, 1);
    const pathToFile = path.join(__dirname, filePath);
    const stringifyData = JSON.stringify(movieData, null, 2);
    fs.writeFile(pathToFile, stringifyData, (err) => {
      if (err) {
        return res.status(400).json({ err: err });
      }
      return res.json({ message: "data deleted" });
    });
  });

  server.patch("/api/v1/movie/:id", (req, res) => {
    const movie = req.body;
    const {id} = req.params;
    const index = movieData.findIndex( m => m.id === id);
    movieData[index] = movie;
    const pathToFile = path.join(__dirname, filePath);
    const stingifyData = JSON.stringify(movieData, null, 2);
    fs.writeFile(pathToFile, stingifyData, (err) => {
      if (err) {
        return res.status(400).json({ message: err });
      }
      return res.json("data has been added");
    });
  });
  server.get("*", (req, res) => {
    return handle(req, res);
  });
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`server is running at port ${PORT}`);
  });
});
// }else{
//   server.listen(process.env.PORT, async () => {
//     console.log('NextJS is now building...');
//     await nextBuild(path.join(__dirname, '../'));
//     process.exit();
//   });
// }

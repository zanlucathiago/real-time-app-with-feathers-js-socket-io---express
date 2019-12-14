const feathers = require("@feathersjs/feathers");
const express = require("@feathersjs/express");
const socketio = require("@feathersjs/socketio");
const moment = require("moment");

class IdeaService {
  constructor() {
    this.ideas = [];
  }

  async find() {
    return this.ideas;
  }

  async create(data) {
    const idea = {
      id: this.ideas.length,
      text: data.text,
      tech: data.tech,
      viewer: data.viewer
    };

    idea.time = moment().format("h:mm:ss a");

    this.ideas.push(idea);

    return idea;
  }
}

const app = express(feathers());

app.use(express.json());

app.configure(socketio());

app.configure(express.rest());

app.use("/ideas", new IdeaService());

app.on("connection", conn => app.channel("stream").join(conn));

app.publish(data => app.channel("stream"));

const PORT = process.env.PORT || 3030;

app
  .listen(PORT)
  .on("listening", () =>
    console.log(`Realtime server running on port ${PORT}`)
  );

/**
 * How to call th service from here
 */
// app.service("ideas").create({
//   text: "Contruir um app legal",
//   tech: "Node.js",
//   viewer: "Caco"
// });

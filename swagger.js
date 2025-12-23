const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "AirVave MDM Backend API",
      version: "1.0.0",
      description: "Mobile Device Management APIs for AirVave",
    },
    servers: [
      {
        // 👇 CHANGE THIS: Use a relative path instead of hardcoded http://localhost:5000
        url: "/api", 
        description: "Current Server (Relative)"
      },
      {
        url: "http://localhost:5000/api",
        description: "Local Server (Hardcoded)"
      }
    ],
  },
  apis: ["./routes/*.js"], 
};

module.exports = swaggerJSDoc(options);
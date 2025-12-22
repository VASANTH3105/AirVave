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
        url: "http://localhost:5000/api",
        description: "Local Server"
      },
      {
        url: "https://your-production-url/api",
        description: "Production Server"
      }
    ],
  },
  apis: ["./routes/*.js"], // auto-scan route files
};

module.exports = swaggerJSDoc(options);

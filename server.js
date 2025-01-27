const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");


const app = express();
const PORT = 8888;



const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Task  API",
            version: "1.0.0",
            description: "Firebase Firestore ile geliştirilmiş araç kiralama API'si"
        },
        servers: [{ url: "http://localhost:8888" }]
    },
    apis: ["./routes/*.js"],  
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use(cors());
app.use(bodyParser.json());

app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);



app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Swagger API Docs: http://localhost:${PORT}/api-docs`);
});

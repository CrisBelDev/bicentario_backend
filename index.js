import express from "express";
import routes from "./routes/index.js"; // Importa el router directamente
import db from "./config/db.js";
import bodyparser from "body-parser";

//importando cors --> permite que un cliente se conecte a otro servidor para el intercambio de recursos
import cors from "cors";

const app = express();

// Conexión a la base de datos
const connectDB = async () => {
	try {
		await db.authenticate();
		await db.sync();
		console.log("✅ Conexión correcta a la base de datos");
	} catch (error) {
		console.error("❌ Error al conectar la base de datos:", error);
	}
};
connectDB();

//habilitar body parser
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
// habilitar cors
app.use(cors());
// Rutas de la app
app.use("/", routes); // No es necesario llamar a `routes()`

app.listen(5000, () => {
	console.log("🚀 Servidor corriendo en http://localhost:5000");
});

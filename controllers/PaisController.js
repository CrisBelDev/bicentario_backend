//importando el modelo
import Pais from "../models/Pais.js";

// Mostrar todos los paises
export const mostrarPaises = async (req, res) => {
	try {
		const paises = await Pais.findAll({
			attributes: ["id_pais", "nombre"],
		});
		res.json(paises);
	} catch (error) {
		console.error("Error al obtener los paises:", error);
		res.status(500).json({ mensaje: "Error en el servidor" });
	}
};

import Ciudad from "../models/Ciudad.js";

// Mostrar todas las ciudades por medio de un país (id_pais)
export const mostrarCiudades = async (req, res) => {
	try {
		const { id_pais } = req.params; // Asegúrate de que se recibe el id_pais en la URL

		if (!id_pais) {
			return res.status(400).json({ mensaje: "El id_pais es requerido" });
		}

		const ciudades = await Ciudad.findAll({
			where: { id_pais }, // Filtra por el país
			attributes: ["id_ciudad", "id_pais", "nombre"],
		});

		res.json(ciudades);
	} catch (error) {
		console.error("Error al obtener las ciudades:", error);
		res.status(500).json({ mensaje: "Error en el servidor" });
	}
};

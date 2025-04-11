import Patrocinador from "../models/Patrocinador.js";

// Obtener todos los patrocinadores
export const obtenerPatrocinadores = async (req, res) => {
	try {
		const patrocinadores = await Patrocinador.findAll();
		res.json(patrocinadores);
	} catch (error) {
		res.status(500).json({ mensaje: "Error al obtener patrocinadores", error });
	}
};

// Obtener un patrocinador por ID
export const obtenerPatrocinadorPorId = async (req, res) => {
	const { id } = req.params;
	try {
		const patrocinador = await Patrocinador.findByPk(id);
		if (!patrocinador) {
			return res.status(404).json({ mensaje: "Patrocinador no encontrado" });
		}
		res.json(patrocinador);
	} catch (error) {
		res
			.status(500)
			.json({ mensaje: "Error al obtener el patrocinador", error });
	}
};

// Crear un nuevo patrocinador
export const crearPatrocinador = async (req, res) => {
	const { nombre, descripcion } = req.body;
	try {
		const nuevoPatrocinador = await Patrocinador.create({
			nombre,
			descripcion,
		});
		res.status(201).json(nuevoPatrocinador);
	} catch (error) {
		res.status(500).json({ mensaje: "Error al crear patrocinador", error });
	}
};

// Actualizar un patrocinador
export const actualizarPatrocinador = async (req, res) => {
	const { id } = req.params;
	const { nombre, descripcion } = req.body;
	try {
		const patrocinador = await Patrocinador.findByPk(id);
		if (!patrocinador) {
			return res.status(404).json({ mensaje: "Patrocinador no encontrado" });
		}

		patrocinador.nombre = nombre;
		patrocinador.descripcion = descripcion;
		await patrocinador.save();

		res.json(patrocinador);
	} catch (error) {
		res
			.status(500)
			.json({ mensaje: "Error al actualizar patrocinador", error });
	}
};

// Eliminar un patrocinador
export const eliminarPatrocinador = async (req, res) => {
	const { id } = req.params;
	try {
		const patrocinador = await Patrocinador.findByPk(id);
		if (!patrocinador) {
			return res.status(404).json({ mensaje: "Patrocinador no encontrado" });
		}

		await patrocinador.destroy();
		res.json({ mensaje: "Patrocinador eliminado correctamente" });
	} catch (error) {
		res.status(500).json({ mensaje: "Error al eliminar patrocinador", error });
	}
};

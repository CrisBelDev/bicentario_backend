import EventoDeportivo from "../models/Evento_deportivo.js";
import Evento from "../models/Evento.js"; // Asegúrate que el modelo esté disponible

// Crear un evento deportivo
const crearEventoDeportivo = async (req, res) => {
	try {
		const {
			id_evento,
			disciplina,
			categorias,
			modalidad,
			reglas,
			premios,
			equipos_participantes,
			organizado_por,
			requisitos_participacion,
		} = req.body;

		// Verificar si el evento base existe
		const evento = await Evento.findByPk(id_evento);
		if (!evento) {
			return res.status(404).json({ mensaje: "Evento no encontrado" });
		}

		// Crear el evento deportivo
		const nuevoEventoDeportivo = await EventoDeportivo.create({
			id_evento,
			disciplina,
			categorias,
			modalidad,
			reglas,
			premios,
			equipos_participantes: JSON.stringify(equipos_participantes), // Asegúrate de enviar un array/objeto
			organizado_por,
			requisitos_participacion,
		});

		res.status(201).json(nuevoEventoDeportivo);
	} catch (error) {
		console.error(error);
		res.status(500).json({ mensaje: "Error al crear el evento deportivo" });
	}
};

// Obtener un evento deportivo por ID
const obtenerEventoDeportivo = async (req, res) => {
	try {
		const { id } = req.params;

		const evento = await EventoDeportivo.findByPk(id);
		if (!evento) {
			return res
				.status(404)
				.json({ mensaje: "Evento deportivo no encontrado" });
		}

		// Parsear JSON si aplica
		if (evento.equipos_participantes) {
			evento.equipos_participantes = JSON.parse(evento.equipos_participantes);
		}

		res.json(evento);
	} catch (error) {
		console.error(error);
		res.status(500).json({ mensaje: "Error al obtener el evento deportivo" });
	}
};

// Actualizar un evento deportivo
const actualizarEventoDeportivo = async (req, res) => {
	try {
		const { id } = req.params;
		const datosActualizados = req.body;

		if (datosActualizados.equipos_participantes) {
			datosActualizados.equipos_participantes = JSON.stringify(
				datosActualizados.equipos_participantes
			);
		}

		const evento = await EventoDeportivo.findByPk(id);
		if (!evento) {
			return res
				.status(404)
				.json({ mensaje: "Evento deportivo no encontrado" });
		}

		await evento.update(datosActualizados);
		res.json({ mensaje: "Evento deportivo actualizado correctamente", evento });
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json({ mensaje: "Error al actualizar el evento deportivo" });
	}
};

// Eliminar un evento deportivo
const eliminarEventoDeportivo = async (req, res) => {
	try {
		const { id } = req.params;

		const evento = await EventoDeportivo.findByPk(id);
		if (!evento) {
			return res
				.status(404)
				.json({ mensaje: "Evento deportivo no encontrado" });
		}

		await evento.destroy();
		res.json({ mensaje: "Evento deportivo eliminado correctamente" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ mensaje: "Error al eliminar el evento deportivo" });
	}
};

export {
	crearEventoDeportivo,
	obtenerEventoDeportivo,
	actualizarEventoDeportivo,
	eliminarEventoDeportivo,
};

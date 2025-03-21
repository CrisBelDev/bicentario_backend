import jwt from "jsonwebtoken"; // Importa jsonwebtoken en el archivo

// Función para obtener el tiempo restante en horas, minutos y segundos
const obtenerTiempoRestante = (expiracion) => {
	const tiempoRestanteMs = expiracion * 1000 - Date.now(); // Convertir a milisegundos
	const tiempoRestanteSegundos = Math.max(tiempoRestanteMs / 1000, 0); // Aseguramos que no sea negativo

	// Calcular horas, minutos y segundos
	const horas = Math.floor(tiempoRestanteSegundos / 3600); // 1 hora = 3600 segundos
	const minutos = Math.floor((tiempoRestanteSegundos % 3600) / 60); // El resto en minutos
	const segundos = Math.floor(tiempoRestanteSegundos % 60); // El resto en segundos

	return { horas, minutos, segundos };
};

export const verificarToken = (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader) {
		return res.status(401).json({ message: "No se proporcionó el token" });
	}

	const token = authHeader.split(" ")[1];

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.usuario = decoded; // Guardamos la información del usuario en la request

		// Calculamos el tiempo restante del token
		const { horas, minutos, segundos } = obtenerTiempoRestante(decoded.exp);

		// Opcionalmente, agregamos el tiempo restante al objeto de la request
		req.tiempoRestante = { horas, minutos, segundos };

		console.log(
			`Tiempo restante del token: ${horas} horas, ${minutos} minutos y ${segundos} segundos`
		);

		next();
	} catch (error) {
		console.error("Error al verificar token:", error.message);
		return res.status(401).json({ message: "Token invalido o expirado" });
	}
};

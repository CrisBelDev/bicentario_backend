import jwt from "jsonwebtoken"; // Importa jsonwebtoken en el archivo

export const verificarToken = (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader) {
		return res.status(401).json({ message: "No se proporcionó el token" });
	}
	console.log("Datos recibidos en el backend:", req.body);
	console.log("autorizacxion: ", authHeader);
	const token = authHeader.split(" ")[1];

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.usuario = decoded; // Guardamos la info en la request
		next();
	} catch (error) {
		console.error("Error al verificar token:", error.message);
		return res.status(401).json({ message: "Token inválido o expirado" });
	}
};

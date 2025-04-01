import multer from "multer";
import path from "path";

// Configurar almacenamiento
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "uploads/"); // Carpeta donde se guardarán las imágenes
	},
	filename: (req, file, cb) => {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(null, uniqueSuffix + path.extname(file.originalname)); // Nombre único
	},
});

//otra ruta:
const storage1 = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "uploads/blog"); // Carpeta donde se guardarán las imágenes de los blog
	},
	filename: (req, file, cb) => {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(null, uniqueSuffix + path.extname(file.originalname)); // Nombre único
	},
});

// Filtrar archivos permitidos (solo imágenes)
const fileFilter = (req, file, cb) => {
	if (file.mimetype.startsWith("image/")) {
		cb(null, true);
	} else {
		cb(new Error("Solo se permiten imágenes"), false);
	}
};

// Configurar `multer`

export const upload = multer({
	storage: storage,
	fileFilter: fileFilter,
	limits: { fileSize: 2 * 1024 * 1024 }, // Límite de 2MB por imagen
});

export const upload1 = multer({
	storage: storage1,
	fileFilter: fileFilter,
	limits: { fileSize: 2 * 1024 * 1024 }, // Límite de 2MB por imagen
});

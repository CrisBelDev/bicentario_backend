// funcion para generar token aleatorios para la verficacion por email
const generarId = () =>
	Math.random().toString(32).substring(2) + Date.now().toString(32);

export { generarId };

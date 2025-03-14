import nodemailer from "nodemailer";

const emailRegistro = async (datos) => {
	const transport = nodemailer.createTransport({
		host: process.env.EMAIL_HOST,
		port: process.env.EMAIL_PORT,
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS,
		},
	});
	//haciendo el log para verificar si nos llego los datos
	console.log(datos);

	const { email, nombre, token } = datos;
	//enviar el email de confirmacion al usuario
	await transport.sendMail({
		from: "Bicentario.com",
		to: email,
		subject: "Confirma tu cuenta en Bicentenario.com",
		text: "Confirma tu cuenta en Bicentenario.com",
		html: `
        <p> Hola ${nombre} comprueba tu cuenta en bicentario.com </p>

        <p> Tu cuenta ya esta lista, solo debes confirmarla en el siguiente enlace: 
        <a href ="${process.env.FRONTEND_URL}/confirmarcuenta?token=${token}"> Confirmar cuenta </a></p>

        <p> Si tu no creaste esta cuenta, puedes ignorar este mensaje </p>
    `,
	});
};

export { emailRegistro };

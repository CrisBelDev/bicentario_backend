import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
	host: process.env.EMAIL_HOST,
	port: process.env.EMAIL_PORT,
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS,
	},
});

// Enviar email de confirmación de cuenta
const emailRegistro = async (datos) => {
	const { email, nombre, token } = datos;

	await transport.sendMail({
		from: "Bicentenario.com",
		to: email,
		subject: "Confirma tu cuenta en Bicentenario.com",
		text: "Confirma tu cuenta en Bicentenario.com",
		html: `
            <p>Hola ${nombre}, confirma tu cuenta en Bicentenario.com</p>
            <p>Haz clic en el siguiente enlace para activarla:</p>
            <a href="${process.env.FRONTEND_URL}/confirmarcuenta?token=${token}">Confirmar cuenta</a>
            <p>Si no solicitaste este registro, puedes ignorar este mensaje.</p>
        `,
	});
};

// Enviar email de recuperación de contraseña
const emailRecuperacion = async (datos) => {
	const { email, nombre, enlace } = datos;

	await transport.sendMail({
		from: "Bicentenario.com",
		to: email,
		subject: "Restablece tu contraseña - Bicentenario.com",
		text: "Recupera tu contraseña en Bicentenario.com",
		html: `
            <p>Hola ${nombre}, has solicitado restablecer tu contraseña.</p>
            <p>Puedes hacerlo haciendo clic en el siguiente enlace:</p>
            <a href="${enlace}">Restablecer contraseña</a>
            <p>Si no solicitaste este cambio, ignora este correo.</p>
        `,
	});
};

export { emailRegistro, emailRecuperacion };

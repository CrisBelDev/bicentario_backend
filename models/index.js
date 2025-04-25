import Evento from "./Evento.js";
import Patrocinador from "./Patrocinador.js";
import EventosPatrocinadores from "./EventosPatrocinadores.js";
import EventoAcademico from "./Evento_academico.js";
import EventoGastronomico from "./Evento_gastronomico.js";
import EventoCultural from "./Evento_cultural.js";
import EventoDeportivo from "./Evento_deportivo.js";
import Notificacion from "./Notificacion.js";

// Asociaciones
Evento.belongsToMany(Patrocinador, {
	through: EventosPatrocinadores,
	foreignKey: "id_evento",
	otherKey: "id_patrocinador",
});

Patrocinador.belongsToMany(Evento, {
	through: EventosPatrocinadores,
	foreignKey: "id_patrocinador",
	otherKey: "id_evento",
});

Evento.hasOne(EventoAcademico, {
	foreignKey: "id_evento",
	as: "evento_academico",
});

EventoAcademico.belongsTo(Evento, {
	foreignKey: "id_evento",
	as: "evento",
});

// Evento <-> EventoGastronomico
Evento.hasOne(EventoGastronomico, {
	foreignKey: "id_evento",
	as: "evento_gastronomico",
});

EventoGastronomico.belongsTo(Evento, {
	foreignKey: "id_evento",
	as: "evento",
});
// Evento <-> EventoCultural
Evento.hasOne(EventoCultural, {
	foreignKey: "id_evento",
	as: "evento_cultural",
});

EventoCultural.belongsTo(Evento, {
	foreignKey: "id_evento",
	as: "evento",
});

// Evento <-> EventoDeportivo
Evento.hasOne(EventoDeportivo, {
	foreignKey: "id_evento",
	as: "evento_deportivo",
});

EventoDeportivo.belongsTo(Evento, {
	foreignKey: "id_evento",
	as: "evento",
});

Notificacion.belongsTo(Evento, {
	foreignKey: "id_evento",
	as: "evento", // Este alias debe coincidir con el usado en el controlador
});

Evento.hasMany(Notificacion, {
	foreignKey: "id_evento",
	as: "notificaciones",
});

/* // Relación 1:1 entre Evento y EventoCultural
Evento.hasOne(EventoCultural, {
	foreignKey: "id_evento",
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
  });
  EventoCultural.belongsTo(Evento, {
	foreignKey: "id_evento",
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
  }); */

// Exportar modelos para usarlos en otros lugares
export {
	Evento,
	Patrocinador,
	EventosPatrocinadores,
	EventoAcademico,
	EventoGastronomico,
	EventoCultural,
	EventoDeportivo,
	Notificacion,
};

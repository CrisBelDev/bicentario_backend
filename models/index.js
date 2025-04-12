import Evento from "./Evento.js";
import Patrocinador from "./Patrocinador.js";
import EventosPatrocinadores from "./EventosPatrocinadores.js";
import EventoAcademico from "./Evento_academico.js";
import EventoGastronomico from "./Evento_gastronomico.js";
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

// Exportar modelos para usarlos en otros lugares
export {
	Evento,
	Patrocinador,
	EventosPatrocinadores,
	EventoAcademico,
	EventoGastronomico,
};

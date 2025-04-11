import Evento from "./Evento.js";
import Patrocinador from "./Patrocinador.js";
import EventosPatrocinadores from "./EventosPatrocinadores.js";

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

// Exportar modelos para usarlos en otros lugares
export { Evento, Patrocinador, EventosPatrocinadores };

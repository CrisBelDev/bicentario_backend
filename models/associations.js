import Etnia from "./Etnia.js";
import EventoCultural from "./EventoCultural.js";
import EtniaEventoCultural from "./EtniaEventoCultural.js";

// Relación muchos a muchos
Etnia.belongsToMany(EventoCultural, {
	through: EtniaEventoCultural,
	foreignKey: "id_etnia",
	otherKey: "id_evento_cultural",
});

EventoCultural.belongsToMany(Etnia, {
	through: EtniaEventoCultural,
	foreignKey: "id_evento_cultural",
	otherKey: "id_etnia",
});

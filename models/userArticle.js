import mongoose from "mongoose";
const Schema = mongoose.Schema;

// Définir le schéma pour la table pivot
const playerGamePlatformSchema = new Schema({
    player: { type: Schema.Types.ObjectId, ref: "Player", required: true },
    game: { type: Schema.Types.ObjectId, ref: "Game", required: true },
    platform: { type: Schema.Types.ObjectId, ref: "Platform", required: true }
});

// Créer le modèle à partir du schéma et l'exporter
export default mongoose.model("PlayerGamePlatform", playerGamePlatformSchema);
import config from "../config.js";

// Liste des réactions aléatoires
const REACTIONS = ["👍", "👎", "😂", "❤️", "🔥", "🥶", "💀", "✨", "👀", "🤣", "😭", "🙏", "🔱", "⚡", "🎯", "💪", "🤝", "😎", "🥳", "🫡"];

function getRandomReaction() {
  return REACTIONS[Math.floor(Math.random() * REACTIONS.length)];
}

export default async function reactCommand(message, client) {
  try {
    // Ne pas réagir aux messages du bot
    if (message.key.fromMe) return;
    
    // Récupérer l'ID du message auquel répondre
    const msgId = message.key.id;
    const remoteJid = message.key.remoteJid;
    
    // Éviter de réagir aux messages de status
    if (remoteJid === "status@broadcast") return;
    
    // Sélectionner une réaction aléatoire
    const reaction = getRandomReaction();
    
    // Envoyer la réaction
    await client.sendMessage(remoteJid, {
      react: {
        text: reaction,
        key: message.key
      }
    });
    
    console.log(`✅ Réaction ajoutée : ${reaction} sur le message ${msgId}`);
    
  } catch (err) {
    // Ne pas afficher d'erreur pour les réactions (silencieux)
    if (!err.message?.includes("already reacted")) {
      console.log("⚠️ Erreur réaction:", err.message);
    }
  }
}

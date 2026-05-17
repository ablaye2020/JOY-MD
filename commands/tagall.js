import config from "../config.js";

function getNumero(jid = "") {
  return jid.replace(/@.+/, "").replace(/:.*/, "").trim();
}

export default async function tagallCommand(message, client, { args } = {}) {
  const remoteJid = message.key.remoteJid;

  if (!remoteJid.endsWith("@g.us")) {
    return await client.sendMessage(remoteJid, {
      text: `╭━〔 📢 𝐓𝐀𝐆𝐀𝐋𝐋 〕━⬣\n┃ ❌ Uniquement dans un groupe !\n╰━━〔 ⚡ ${config.BotName} 〕━⬣\n\n> le respect ne se demande pas`
    }, { quoted: message });
  }

  try {
    const meta = await client.groupMetadata(remoteJid);
    const senderJid = message.key.participant || message.key.remoteJid;
    const senderNumero = getNumero(senderJid);
    const senderInfo = meta.participants.find(p => getNumero(p.id) === senderNumero);
    const estAdmin = senderInfo?.admin === "admin" || senderInfo?.admin === "superadmin";

    const isOwner = senderNumero === "221769725470";

    if (!estAdmin && !isOwner) {
      return await client.sendMessage(remoteJid, {
        text: `╭━〔 📢 𝐓𝐀𝐆𝐀𝐋𝐋 〕━⬣\n┃ ❌ Réservé aux *admins du groupe* !\n╰━━〔 ⚡ ${config.BotName} 〕━⬣\n\n> le respect ne se demande pas`
      }, { quoted: message });
    }

    const tousLesMembres = meta.participants.map(p => p.id);
    const mentions = tousLesMembres;
    
    let messageTexte = args && args.length > 0 ? args.join(" ") : "⚠️ Message important !";
    
    if (messageTexte.toLowerCase() === "off") {
      messageTexte = "🔴 Réunion générale ! Tout le monde est concerné !";
    }

    await client.sendMessage(remoteJid, {
      text: `╭━〔 📢 𝐓𝐀𝐆𝐀𝐋𝐋 〕━⬣
┃ 👑 Admin : @${senderNumero}
┃ 💬 Message : ${messageTexte}
┃ 👥 ${mentions.length} membres concernés
┃
${mentions.map(m => `┃ @${getNumero(m)}`).join("\n")}
╰━━〔 ⚡ ${config.BotName} 〕━⬣
> le respect ne se demande pas`,
      mentions: mentions
    }, { quoted: message });

  } catch (err) {
    console.error("Erreur tagallCommand:", err.message);
    await client.sendMessage(remoteJid, {
      text: `╭━〔 📢 𝐓𝐀𝐆𝐀𝐋𝐋 〕━⬣\n┃ ⚠️ Erreur : ${err.message}\n╰━━〔 ⚡ ${config.BotName} 〕━⬣\n\n> le respect ne se demande pas`
    }, { quoted: message });
  }
}

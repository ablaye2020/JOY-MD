import config from "../config.js";
import { isMuted } from "./mute.js";

const mutedMembers = new Map();
const mutedGroups = new Map();

function getNumero(jid = "") {
  return jid.replace(/@.+/, "").replace(/:.*/, "").trim();
}

export default async function unmuteCommand(message, client, { args } = {}) {
  const remoteJid = message.key.remoteJid;

  if (!remoteJid.endsWith("@g.us")) {
    return await client.sendMessage(remoteJid, {
      text: `╭━〔 🔊 𝐔𝐍𝐌𝐔𝐓𝐄 〕━⬣\n┃ ❌ Uniquement dans un groupe !\n╰━━〔 ⚡ ${config.BotName} 〕━⬣\n\n> le respect ne se demande pas`
    });
  }

  const meta = await client.groupMetadata(remoteJid);
  const senderJidBrut = message.key.participant || message.key.remoteJid;
  const senderNumero = getNumero(senderJidBrut);
  const senderInfo = meta.participants.find(p => getNumero(p.id) === senderNumero);
  const estAdmin = senderInfo?.admin === "admin" || senderInfo?.admin === "superadmin";
  const isOwner = senderNumero === "221769725470";

  if (!estAdmin && !isOwner) {
    return await client.sendMessage(remoteJid, {
      text: `╭━〔 🔊 𝐔𝐍𝐌𝐔𝐓𝐄 〕━⬣\n┃ ❌ Réservé aux *admins du groupe* !\n╰━━〔 ⚡ ${config.BotName} 〕━⬣\n\n> le respect ne se demande pas`
    });
  }

  const subCommand = args[0]?.toLowerCase();

  // Unmute tout le groupe
  if (subCommand === "all") {
    const groupMute = mutedGroups.get(remoteJid);
    if (!groupMute?.active) {
      return await client.sendMessage(remoteJid, {
        text: `╭━〔 🔊 𝐔𝐍𝐌𝐔𝐓𝐄 〕━⬣\n┃ ⚠️ Le groupe n'est pas en silencieux !\n╰━━〔 ⚡ ${config.BotName} 〕━⬣\n\n> le respect ne se demande pas`
      });
    }

    mutedGroups.delete(remoteJid);
    
    return await client.sendMessage(remoteJid, {
      text: `╭━〔 🔊 𝐔𝐍𝐌𝐔𝐓𝐄 〕━⬣
┃ ✅ Le groupe n'est plus en silencieux !
┃ 💬 Tout le monde peut à nouveau parler
╰━━〔 ⚡ ${config.BotName} 〕━⬣
> le respect ne se demande pas`
    });
  }

  // Unmute un membre spécifique
  const ctx = message.message?.extendedTextMessage?.contextInfo;
  const mentions = ctx?.mentionedJid || [];
  let cibleJid = null;

  if (ctx?.participant) {
    cibleJid = ctx.participant;
  } else if (mentions.length > 0) {
    cibleJid = mentions[0];
  } else if (args[0]) {
    cibleJid = args[0].replace(/[^0-9]/g, "") + "@s.whatsapp.net";
  }

  if (!cibleJid) {
    return await client.sendMessage(remoteJid, {
      text: `╭━〔 🔊 𝐔𝐍𝐌𝐔𝐓𝐄 〕━⬣\n┃ ❌ Mentionne quelqu'un !\n┃ 📌 *.unmute @personne*\n┃ 📌 *.unmute all*\n╰━━〔 ⚡ ${config.BotName} 〕━⬣\n\n> le respect ne se demande pas`
    });
  }

  const cibleNumero = getNumero(cibleJid);
  const key = `${remoteJid}_${cibleNumero}`;
  
  const memberMute = mutedMembers.get(key);
  if (!memberMute?.active) {
    return await client.sendMessage(remoteJid, {
      text: `╭━〔 🔊 𝐔𝐍𝐌𝐔𝐓𝐄 〕━⬣\n┃ ⚠️ @${cibleNumero} n'est pas mute !\n╰━━〔 ⚡ ${config.BotName} 〕━⬣\n\n> le respect ne se demande pas`,
      mentions: [cibleJid]
    });
  }

  mutedMembers.delete(key);

  await client.sendMessage(remoteJid, {
    text: `╭━〔 🔊 𝐔𝐍𝐌𝐔𝐓𝐄 〕━⬣
┃ ✅ @${cibleNumero} peut à nouveau parler !
┃ 👑 Par : @${senderNumero}
╰━━〔 ⚡ ${config.BotName} 〕━⬣
> le respect ne se demande pas`,
    mentions: [cibleJid, senderJidBrut]
  });
}

// Exporter les maps pour qu'elles soient accessibles par mute.js
export { mutedMembers, mutedGroups };

import config from "../config.js";

export const THEMES = {
  yuta: {
    nom: "Yuta",
    emoji: "⚡",
    photo: "https://jpcdn.it/img/5b19ed94906b19c243aa8a3a80981ac0.jpg"
  },
  gojo: {
    nom: "Gojo",
    emoji: "👁️",
    photo: "https://jpcdn.it/img/fbf3582249f9a8cec80ae4f8dd41a02d.jpg"
  },
  sukuna: {
    nom: "Sukuna",
    emoji: "👹",
    photo: "https://jpcdn.it/img/d0530472742ca7315ca4bcbdc82d9d08.jpg"
  },
  itachi: {
    nom: "Itachi",
    emoji: "🍥",
    photo: "https://jpcdn.it/img/af64e75962a6e4be9c2cb024df07574a.jpg"
  },
  luffy: {
    nom: "Luffy",
    emoji: "🏴‍☠️",
    photo: "https://jpcdn.it/img/455318e4c55150306c65c7bddb96aaed.jpg"
  },
  naruto: {
    nom: "Naruto",
    emoji: "🍜",
    photo: "https://jpcdn.it/img/830eca607e68189062827af4c96f7669.jpg"
  }
};

export const groupThemes = new Map();

export function getThemePhoto(groupJid) {
  const themeName = groupThemes.get(groupJid) || "yuta";
  const theme = THEMES[themeName];
  return theme?.photo || THEMES.yuta.photo;
}

export function getThemeEmoji(groupJid) {
  const themeName = groupThemes.get(groupJid) || "yuta";
  const theme = THEMES[themeName];
  return theme?.emoji || "⚡";
}

export default async function themeCommand(message, client, { args } = {}) {
  const remoteJid = message.key.remoteJid;

  if (!remoteJid.endsWith("@g.us")) {
    return await client.sendMessage(remoteJid, {
      text: `╭━〔 🎨 𝐓𝐇𝐄𝐌𝐄 〕━⬣\n┃ ❌ Uniquement dans un groupe !\n╰━━〔 ⚡ ${config.BotName} 〕━⬣\n\n> le respect ne se demande pas`
    });
  }

  const meta = await client.groupMetadata(remoteJid);
  const senderJidBrut = message.key.participant || message.key.remoteJid;
  const senderNumero = senderJidBrut.replace(/@.+/, "").replace(/:.*/, "");
  const senderInfo = meta.participants.find(p => p.id.replace(/@.+/, "").replace(/:.*/, "") === senderNumero);
  const estAdmin = senderInfo?.admin === "admin" || senderInfo?.admin === "superadmin";

  if (!estAdmin) {
    return await client.sendMessage(remoteJid, {
      text: `╭━〔 🎨 𝐓𝐇𝐄𝐌𝐄 〕━⬣\n┃ ❌ Réservé aux *admins du groupe* !\n╰━━〔 ⚡ ${config.BotName} 〕━⬣\n\n> le respect ne se demande pas`
    });
  }

  const themeName = args[0]?.toLowerCase();
  const themesList = Object.keys(THEMES).join(", ");

  if (!themeName || !THEMES[themeName]) {
    const currentTheme = groupThemes.get(remoteJid) || "yuta";
    return await client.sendMessage(remoteJid, {
      text: `╭━〔 🎨 𝐓𝐇𝐄𝐌𝐄 〕━⬣
┃ 📊 Thème actuel : *${THEMES[currentTheme].nom}*
┃ 
┃ 📌 Thèmes disponibles :
┃ ${themesList}
┃ 
┃ 📌 *.theme yuta* pour changer
╰━━〔 ⚡ ${config.BotName} 〕━⬣
> le respect ne se demande pas`
    });
  }

  groupThemes.set(remoteJid, themeName);
  
  await client.sendMessage(remoteJid, {
    image: { url: THEMES[themeName].photo },
    caption: `╭━〔 🎨 𝐓𝐇𝐄𝐌𝐄 〕━⬣
┃ ✅ Thème changé avec succès !
┃ 🎨 Nouveau thème : *${THEMES[themeName].nom}* ${THEMES[themeName].emoji}
╰━━〔 ⚡ ${config.BotName} 〕━⬣
> le respect ne se demande pas`
  });
}

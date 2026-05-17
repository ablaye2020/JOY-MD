import config from "../config.js";

const photos = [
  "https://jpcdn.it/img/5b19ed94906b19c243aa8a3a80981ac0.jpg",
  "https://jpcdn.it/img/fbf3582249f9a8cec80ae4f8dd41a02d.jpg",
  "https://jpcdn.it/img/d0530472742ca7315ca4bcbdc82d9d08.jpg",
  "https://jpcdn.it/img/af64e75962a6e4be9c2cb024df07574a.jpg",
  "https://jpcdn.it/img/455318e4c55150306c65c7bddb96aaed.jpg",
  "https://jpcdn.it/img/830eca607e68189062827af4c96f7669.jpg",
  "https://jpcdn.it/img/87b59ab199ed0f0ceb57de6ee1a2db2c.jpg",
  "https://jpcdn.it/img/270e8a194043c7a2b94045f4d6a0d5ff.jpg",
  "https://jpcdn.it/img/269bcadba7f1cd27d7b0a93a70ca14a4.jpg",
  "https://jpcdn.it/img/cf24e0ae14c5d88794aecf66d590c6c5.jpg",
  "https://jpcdn.it/img/d1c37576b24130d85aba67aaac413438.jpg",
  "https://jpcdn.it/img/0a36bf163ae91702817c448d489aaac2.jpg",
  "https://jpcdn.it/img/5ef376253ecdfbcee2f0487e67f780fe.jpg",
  "https://jpcdn.it/img/8cef95576060453375f3ba951a3c414d.jpg",
  "https://jpcdn.it/img/69eb14f201f27fc26fdb483cef3465d3.jpg",
];

export const welcomeGroups = new Map();

export default async function welcomeCommand(message, client, { args } = {}) {
  const remoteJid = message.key.remoteJid;

  if (!remoteJid.endsWith("@g.us")) {
    return await client.sendMessage(remoteJid, {
      text: `╭━〔 🎉 𝐖𝐄𝐋𝐂𝐎𝐌𝐄 〕━⬣\n┃ ❌ Uniquement dans un groupe !\n╰━━〔 ⚡ ${config.BotName} 〕━⬣\n\n> le respect ne se demande pas`
    }, { quoted: message });
  }

  const meta = await client.groupMetadata(remoteJid);
  const senderJidBrut = message.key.participant || message.key.remoteJid;
  const senderNumero = senderJidBrut.replace(/@.+/, "").replace(/:.*/, "");
  const senderInfo = meta.participants.find(p => p.id.replace(/@.+/, "").replace(/:.*/, "") === senderNumero);
  const estAdmin = senderInfo?.admin === "admin" || senderInfo?.admin === "superadmin";

  if (!estAdmin) {
    return await client.sendMessage(remoteJid, {
      text: `╭━〔 🎉 𝐖𝐄𝐋𝐂𝐎𝐌𝐄 〕━⬣\n┃ ❌ Réservé aux *admins du groupe* !\n╰━━〔 ⚡ ${config.BotName} 〕━⬣\n\n> le respect ne se demande pas`
    }, { quoted: message });
  }

  const option = args[0]?.toLowerCase();

  if (option === "on") {
    welcomeGroups.set(remoteJid, true);
    await client.sendMessage(remoteJid, {
      text: `╭━〔 🎉 𝐖𝐄𝐋𝐂𝐎𝐌𝐄 〕━⬣\n┃ ✅ Message de bienvenue *ACTIVÉ* !\n╰━━〔 ⚡ ${config.BotName} 〕━⬣\n\n> le respect ne se demande pas`
    }, { quoted: message });
  } else if (option === "off") {
    welcomeGroups.delete(remoteJid);
    await client.sendMessage(remoteJid, {
      text: `╭━〔 🎉 𝐖𝐄𝐋𝐂𝐎𝐌𝐄 〕━⬣\n┃ ❌ Message de bienvenue *DÉSACTIVÉ*\n╰━━〔 ⚡ ${config.BotName} 〕━⬣\n\n> le respect ne se demande pas`
    }, { quoted: message });
  } else {
    const statut = welcomeGroups.has(remoteJid) ? "✅ ACTIVÉ" : "❌ DÉSACTIVÉ";
    await client.sendMessage(remoteJid, {
      text: `╭━〔 🎉 𝐖𝐄𝐋𝐂𝐎𝐌𝐄 〕━⬣\n┃ 📊 Statut : *${statut}*\n┃ 📌 *.welcome on* pour activer\n┃ 📌 *.welcome off* pour désactiver\n╰━━〔 ⚡ ${config.BotName} 〕━⬣\n\n> le respect ne se demande pas`
    }, { quoted: message });
  }
}

export async function welcomeHandler(groupJid, participants, client) {
  if (!welcomeGroups.has(groupJid)) return;

  try {
    const photo = photos[Math.floor(Math.random() * photos.length)];
    let groupName = "le groupe";
    try {
      const meta = await client.groupMetadata(groupJid);
      groupName = meta.subject || "le groupe";
    } catch (_) {}

    for (const participant of participants) {
      const number = participant.replace(/[^0-9]/g, "");

      await client.sendMessage(groupJid, {
        image: { url: photo },
        caption: `╭━〔 🎉 𝐁𝐈𝐄𝐍𝐕𝐄𝐍𝐔𝐄 〕━⬣
┃ 👋 Bienvenue @${number} !
┃ 🏠 Dans : *${groupName}*
┣━━━━━━━━━━━━━━━━━━━━⬣
┃ 📜 Lis le règlement du groupe
┃ 🤝 Sois respectueux(se)
┃ 🎯 Amuse-toi bien ici !
┣━━〔 ⚡ ${config.BotName} 〕━⬣
┃ 👑 Dev : ${config.nameCreator}
╰━━━━━━━━━━━━━━━━━━━━⬣
> le respect ne se demande pas`,
        mentions: [participant],
      });
    }
  } catch (err) {
    console.error("Erreur welcomeHandler:", err);
  }
}

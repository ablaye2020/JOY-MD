import config from "../config.js";

const PHOTO = "https://www.image2url.com/r2/default/images/1776184942622-40a7c354-fdc3-46c3-8c26-d4ba5e8c9442.jpg";

function getNumero(jid = "") {
  return jid.replace(/@.+/, "").replace(/:.*/, "").trim();
}

export default async function kickallCommand(message, client) {
  const remoteJid = message.key.remoteJid;

  if (!remoteJid.endsWith("@g.us")) {
    return await client.sendMessage(remoteJid, {
      text: `╭━〔 💀 𝐊𝐈𝐂𝐊𝐀𝐋𝐋 〕━⬣\n┃ ❌ Uniquement dans un groupe !\n╰━━〔 ⚡ ${config.BotName} 〕━⬣\n\n> le respect ne se demande pas`
    }, { quoted: message });
  }

  try {
    const meta = await client.groupMetadata(remoteJid);

    const senderJidBrut = message.key.participant || message.key.remoteJid;
    const senderNumero = getNumero(senderJidBrut);

    const senderInfo = meta.participants.find(p => getNumero(p.id) === senderNumero);
    const estAdmin = senderInfo?.admin === "admin" || senderInfo?.admin === "superadmin";

    if (!estAdmin) {
      return await client.sendMessage(remoteJid, {
        text: `╭━〔 💀 𝐊𝐈𝐂𝐊𝐀𝐋𝐋 〕━⬣\n┃ ❌ Réservé aux *admins du groupe* !\n╰━━〔 ⚡ ${config.BotName} 〕━⬣\n\n> le respect ne se demande pas`
      }, { quoted: message });
    }

    const membres = meta.participants.filter(p => {
      const estAdminP = p.admin === "admin" || p.admin === "superadmin";
      return !estAdminP;
    });

    const totalMembres = meta.participants.length;

    await client.sendMessage(remoteJid, {
      image: { url: PHOTO },
      caption: `🫴🏾🩸𝐿𝛥 𝛭𝛩𝑅𝑇 𝛮'𝛯𝑆𝑇 𝑄𝑈𝛯 𝐿𝛯 𝐷É𝐵𝑈𝑇 𝐷𝛯 𝐿𝛥 𝛻É𝑅𝛪𝑇𝛥𝐵𝐿𝛯 𝑆𝛩𝑈𝐹𝐹𝑅𝛥𝛮𝐶𝛯 🌹🩸\n\n> J O Y ~ M D\n\n╭━〔 💀 𝐊𝐈𝐂𝐊𝐀𝐋𝐋 〕━⬣\n┃ 👥 Membres : *${totalMembres}*\n┃ 🎯 À expulser : *${membres.length}*\n┃ ⏳ Expulsion en cours...\n╰━━〔 ⚡ ${config.BotName} 〕━⬣\n\n> le respect ne se demande pas`
    }, { quoted: message });

    await new Promise(r => setTimeout(r, 2000));

    let expulses = 0;
    let echecs = 0;

    for (const membre of membres) {
      try {
        await client.groupParticipantsUpdate(remoteJid, [membre.id], "remove");
        expulses++;
        console.log(`✅ Expulsé : ${membre.id} (${expulses}/${membres.length})`);
        await new Promise(r => setTimeout(r, 800));
      } catch (e) {
        echecs++;
        console.log(`❌ Échec kick ${membre.id} :`, e.message);
      }
    }

    await client.sendMessage(remoteJid, {
      text: `╭━〔 💀 𝐊𝐈𝐂𝐊𝐀𝐋𝐋 〕━⬣\n┃ ✅ Expulsés : *${expulses}*\n┃ ❌ Échecs : *${echecs}*\n┃ 👑 Dev : ${config.nameCreator}\n╰━━〔 ⚡ ${config.BotName} 〕━⬣\n\n> le respect ne se demande pas`
    });

  } catch (err) {
    console.error("Erreur kickall:", err.message);
    await client.sendMessage(remoteJid, {
      text: `╭━〔 💀 𝐊𝐈𝐂𝐊𝐀𝐋𝐋 〕━⬣\n┃ ⚠️ Erreur : ${err.message}\n╰━━〔 ⚡ ${config.BotName} 〕━⬣\n\n> le respect ne se demande pas`
    }, { quoted: message });
  }
}

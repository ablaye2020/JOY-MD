import config from "../config.js";

export default async function aliveCommand(message, client) {
  await client.sendMessage(message.key.remoteJid, {
    text: `╭━〔 ❤️ 𝐀𝐋𝐈𝐕𝐄 〕━⬣
┃ ✅ Bot *${config.BotName}* est actif !
┃ 👑 Dev : ${config.nameCreator}
┃ 📌 Version : 1.0.0
┃ 🔗 Chaîne : ${config.Channel}
╰━━〔 ⚡ ${config.BotName} 〕━⬣
> le respect ne se demande pas`
  }, { quoted: message });
}

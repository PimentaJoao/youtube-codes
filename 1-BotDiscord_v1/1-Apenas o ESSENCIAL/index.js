/*
LINK DO VÍDEO: https://youtu.be/kKmxTFOoPWs

CÓDIGO DESENVOLVIDO COM O PROPÓSITO DE ENSINAR O PROCESSO DE CRIAÇÃO DE BOTS A INICIANTES EM PROGRAMAÇÃO UTILIZANDO NODE.JS.

App funcionando com testes mais recentes feitos nas versões:
      discord.js: 12.2.0
      node-opus: 0.3.3
      simple-youtube-api: 5.2.1
      ytdl-core: 2.1.1
*/

const discord = require('discord.js');
const token = 'SEU_TOKEN_AQUI';

const client = new discord.Client();

client.on('ready', () => {
      console.log('Estou conectado!!');
      
});

client.on('message', (msg) => {
      if (msg.content === 'Oi Bot!') {
            msg.channel.send(`Oi, ${msg.author.username}`)
      }
});

client.login(token);
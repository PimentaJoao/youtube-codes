/*
LINK DO VÍDEO: https://youtu.be/KgObaKiuoqE

CÓDIGO DESENVOLVIDO COM O PROPÓSITO DE ENSINAR O PROCESSO DE CRIAÇÃO DE BOTS A INICIANTES EM PROGRAMAÇÃO UTILIZANDO NODE.JS.

App funcionando com testes mais recentes feitos nas versões:
      - discord.js: 12.2.0
      - node-opus: 0.3.3
      - simple-youtube-api: 5.2.1
      - ytdl-core: 2.1.1
*/

const Discord = require('discord.js');
const token = 'SEU_TOKEN_AQUI';
const app = new Discord.Client();

app.on('ready', () => {
      console.log('Estou Online!!');
});

app.on('message', (msg) => {
      // onde era "msg.member.voiceChannel" virou "msg.member.voice.channel".
      if (msg.content === 'join' && msg.member.voice.channel && !msg.author.bot){
            msg.member.voice.channel.join().then(connection => {
                  // onde era "playFile" virou "play" apenas.
                  const dispatcher = connection.play('seu/caminho/audio.mp3');
                  // o evento 'end' se tornou 'finish'.
                  dispatcher.on('finish', () => { msg.member.voice.channel.leave() });
            });
      }
});

app.login(token);


/*
TODAS AS MUDANÇAS (do vídeo para a versão mais recente testada):

      - msg.member.voiceChannel <=> msg.member.voice.channel
      - playFile(); <=> play();
      - 'end' <=> 'finish'
*/
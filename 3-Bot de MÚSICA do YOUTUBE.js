/*
LINK DO VÍDEO: https://youtu.be/LvErS58YoBM

CÓDIGO DESENVOLVIDO COM O PROPÓSITO DE ENSINAR O PROCESSO DE CRIAÇÃO DE BOTS A INICIANTES EM PROGRAMAÇÃO UTILIZANDO NODE.JS.

App funcionando com testes mais recentes feitos nas versões:
      - discord.js: 12.2.0
      - node-opus: 0.3.3
      - simple-youtube-api: 5.2.1
      - ytdl-core: 2.1.1
*/

const Discord = require('discord.js');
const Ytdl = require('ytdl-core');

const token = 'SEU_TOKEN_AQUI';

const app = new Discord.Client();
let estouPronto = false;

app.on('ready', () => {
      console.log('Estou conectado!');
});

/* 
      Explicação geral do código no contexto do que mudou nas atualizações:

      Basicamente o ideal era: quando a gente pede pro bot tocar alguma coisa,
      ele se junta e toca, e não termos dois comandos separados, um pra ele se
      juntar e um pra ele tocar coisas. Na versão que eu fiz os vídeos, ter dois
      comandos separados era tranquilo e intuitivo, apesar de ter uma usabilidade
      meio boba, em termos de código isso era de boa. Nas versões atuais, não é
      mais o caso. Assim, temos semi-gambiarras aqui pra fazer o mesmo bot do vídeo
      funcionar.
*/


// Agora precisamos de uma referência ao join, ela está aqui fora pra não ser
// perdida cada vez que o evento 'message' acontecer.
let connection;

// A arrow function agora precisa ser async
app.on('message', async (msg) => {

      // !join = Bot se junta ao canal de voz
      if (msg.content === '!join'){
            if (msg.member.voice.channel){ // agora é voice.channel no lugar de voiceChannel

                  // Pegamos a referência que comentei acima aqui.
                  connection = await msg.member.voice.channel.join();

                  estouPronto = true;
            } else {
                  msg.channel.send('Você precisa estar conectado a um Canal de Voz!');
            }
      }

      // !leave = Bot sai do canal de voz
      else if (msg.content === '!leave'){
            if (msg.member.voice.channel){ 
                  msg.member.voice.channel.leave();
                  estouPronto = false;
            } else {
                  msg.channel.send('Você precisa estar conectado a um Canal de Voz!');
            }
      }

      // !play [link] = Bot toca músicas
      else if (msg.content.startsWith('!play ')){
            if (estouPronto){
                  let oQueTocar = msg.content.replace('!play ', '');
                  if (Ytdl.validateURL(oQueTocar)){
                        // Usamos a referência ao join(); aqui, para então dar play em algo.
                        connection.play(Ytdl(oQueTocar)); // e agora temos play() no lugar de playStream()
                  } else {
                        msg.channel.send('O link não é válido!')
                  }
            }
      }
});

app.login(token);


/*
TODAS AS MUDANÇAS (do vídeo para a versão mais recente testada):

      - msg.member.voiceChannel <=> msg.member.voice.channel
      - playFile(); <=> play();
      - let connection = await message.member.voice.channel.join() é como 
      temos acesso ao antigo 'connection' agora.
*/

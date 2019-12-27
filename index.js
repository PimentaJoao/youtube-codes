const Discord = require('discord.js');
const Youtube = require('simple-youtube-api');
const Ytdl = require('ytdl-core');
const {TOKEN_DISCORD, GOOGLE_KEY } = require('./config.js');

const youtube = new Youtube(GOOGLE_KEY);
const app = new Discord.Client();

const prefixoComando = '!';

const servidores = {};

// let estouPronto = false; SUBSTITUIDO POR 'emCanalDeVoz'

// To-do: Entender por que o !leave está quebrando
//        imprimir nome das músicas com comando !queue
// Para video: 
//        Implementar como lidar com multiplos servidores
//        Implementar !queue
//        Implementar como lidar com permissões
//        Implementar

app.on('ready', () => {
    console.log('Estou conectado!');
});

app.on('message', async (msg) => {
    // !join = Bot se junta ao canal de voz
    if (msg.content === `${prefixoComando}join`){
        if (msg.member.voiceChannel){           

            servidores[msg.guild.id] = [];

            console.log(`Novo servidor: ${msg.guild.name}\nChave criada: ${msg.guild.id}\nNúmero atual de Servidores conectados: ${Object.keys(servidores).length}\n`);
            msg.member.voiceChannel.join();
        }
        else {
            msg.channel.send('Você precisa estar conectado a um Canal de Voz!');
        }
    }

    // !leave = Bot sai do canal de voz
    else if (msg.content === `${prefixoComando}leave`){
        if (msg.member.voiceChannel){
            msg.member.voiceChannel.leave();
            delete servidores[msg.guild.id];
            console.log(`Servidor saindo!\nNome do servidor: ${msg.guild.name}\n`);
        }
        else {
            msg.channel.send('Você precisa estar conectado a um Canal de Voz!');
        }
    }

    // !play [link] = Bot toca músicas
    else if (msg.content.startsWith(`${prefixoComando}play `)){
        if (msg.guild.id in servidores){ // se o servidor (guilda) está presente no map, então estou num canal de voz
            let oQueTocar = msg.content.replace(`${prefixoComando}play `,'');
            console.log(`Servidor ${msg.guild.name.toUpperCase()} insere comando PLAY usando: ${oQueTocar}.\n`);
            try { // tenta encontrar música por link
                let video = await youtube.getVideo(oQueTocar);
                msg.channel.send(`O video foi encontrado!: ${video.title}`);
                servidores[msg.guild.id].push(oQueTocar);
                if (servidores[msg.guild.id].length === 1) {
                    tocarMusica(msg);
                    console.log(`Música inserida!\nNome do servidor: ${msg.guild.name}\nFila atual: ${servidores[msg.guild.id]}\n`);
                }
            } catch (error) {
                try { // tenta encontrar música por pesquisa
                    let videosPesquisados = await youtube.searchVideos(oQueTocar, 5);
                    let videoEncontrado;
                    for (let i in videosPesquisados){
                        videoEncontrado = await youtube.getVideoByID(videosPesquisados[i].id);
                        msg.channel.send(`${i}: ${videoEncontrado.title}`);
                    }
                    msg.channel.send({embed: {
                        color: 0xC4FF90,
                        description: 'Escolha uma música de 0 a 4, clicando nas reações!'
                    }}).then( async (embedMessage) => {
                        await embedMessage.react('0️⃣');
                        await embedMessage.react('1️⃣');
                        await embedMessage.react('2️⃣');
                        await embedMessage.react('3️⃣');
                        await embedMessage.react('4️⃣');

                        const filter = (reaction, user) => {
                            return ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣'].includes(reaction.emoji.name)
                                && user.id === msg.author.id;
                        }

                        let collector = embedMessage.createReactionCollector(filter, {time: 20000});
                        collector.on('collect', async (reaction, rectionCollector) => {
                            if (reaction.emoji.name === '0️⃣'){
                                msg.channel.send('Reagiu com 0️⃣');
                                videoEncontrado = await youtube.getVideoByID(videosPesquisados[0].id);
                                servidores[msg.guild.id].push(`https://www.youtube.com/watch?v=${videoEncontrado.id}`);
                            }
                            else if (reaction.emoji.name === '1️⃣'){
                                msg.channel.send('Reagiu com 1️⃣');
                                videoEncontrado = await youtube.getVideoByID(videosPesquisados[1].id);
                                servidores[msg.guild.id].push(`https://www.youtube.com/watch?v=${videoEncontrado.id}`);
                            }
                            else if (reaction.emoji.name === '2️⃣'){
                                msg.channel.send('Reagiu com 2️⃣');
                                videoEncontrado = await youtube.getVideoByID(videosPesquisados[2].id);
                                servidores[msg.guild.id].push(`https://www.youtube.com/watch?v=${videoEncontrado.id}`);
                            }
                            else if (reaction.emoji.name === '3️⃣'){
                                msg.channel.send('Reagiu com 3️⃣');
                                videoEncontrado = await youtube.getVideoByID(videosPesquisados[3].id);
                                servidores[msg.guild.id].push(`https://www.youtube.com/watch?v=${videoEncontrado.id}`);
                            }
                            else if (reaction.emoji.name === '4️⃣'){
                                msg.channel.send('Reagiu com 4️⃣');
                                videoEncontrado = await youtube.getVideoByID(videosPesquisados[4].id);
                                servidores[msg.guild.id].push(`https://www.youtube.com/watch?v=${videoEncontrado.id}`);
                            }
                            if (servidores[msg.guild.id].length === 1) {
                                tocarMusica(msg);
                                console.log(`Música inserida!\nNome do servidor: ${msg.guild.name}\nFila atual: ${servidores[msg.guild.id]}\n`);
                            }
                        });
                    });
                } catch (error2) { // pesquisa não retornou nada
                    msg.channel.send('Nenhum vídeo foi encontrado!');
                }
            }
        }
    }

    // !pause = Bot pausa a música
    if (msg.content === `${prefixoComando}pause`){
        if (msg.member.voiceChannel){
            if( (msg.guild.id) in servidores){
                if (msg.member.voiceChannel.connection.dispatcher){
                    if (!msg.member.voiceChannel.connection.dispatcher.paused){
                        msg.member.voiceChannel.connection.dispatcher.pause();
                    } 
                    else {
                        msg.channel.send('Eu já estou pausado!');
                    }
                }
                else {
                    msg.channel.send('Eu nem estou tocando nada...');
                }
            }
            else {
                msg.channel.send('Não estou em um Canal de Voz!');
            }
        }
        else {
            msg.channel.send('Você precisa estar conectado a um Canal de Voz!');
        }

    }

    // !resume = Bot retoma a música
    if (msg.content === `${prefixoComando}resume`){
        if (msg.member.voiceChannel){
            if (msg.member.voiceChannel.connection.dispatcher){
                if (msg.member.voiceChannel.connection.dispatcher.paused){
                    msg.member.voiceChannel.connection.dispatcher.resume();
                } 
                else {
                    msg.channel.send('Eu não estou pausado!');
                }
            }
            else {
                msg.channel.send('Eu nem estou tocando nada...');
            }
        }
        else {
            msg.channel.send('Você precisa estar conectado a um Canal de Voz!');
        }
    }

    // !end = Bot para a música e limpa a fila
    else if (msg.content === `${prefixoComando}end`){
        if (msg.member.voiceChannel){
            if (msg.member.voiceChannel.connection.dispatcher){
                msg.member.voiceChannel.connection.dispatcher.end();
                while (servidores[msg.guild.id].length > 0){
                    servidores[msg.guild.id].shift();
                }
            }
            else {
                msg.channel.send('Não estou tocando nada!');
            }
        }
        else {
            msg.channel.send('Você precisa estar conectado a um Canal de Voz!');
        }
    }

    // !skip = Bot toca a próxima música da fila
    else if (msg.content === `${prefixoComando}skip`){
        if (msg.member.voiceChannel){
            if(msg.member.hasPermission('ADMINISTRATOR')){
                if (msg.member.voiceChannel.connection.dispatcher) {
                    if (servidores[msg.guild.id].length > 1){
                        msg.member.voiceChannel.connection.dispatcher.end();
                    }
                    else {
                        msg.channel.send('Não existem mais músicas a serem tocadas!');    
                    }
                }
                else {
                    msg.channel.send('Não estou tocando nada!');
                }
            }
            else {
                msg.channel.send('Você não tem as permissões necessárias!');
            }
        }
        else {
            msg.channel.send('Você precisa estar conectado a um Canal de Voz!');
        }
    }

});

function tocarMusica(msg){
    msg.member.voiceChannel.connection.playStream(Ytdl(servidores[msg.guild.id][0]))
        .on('end', () => {
            if (servidores[msg.guild.id].length > 0){
                servidores[msg.guild.id].shift();
                tocarMusica(msg);
            }
        });
}

app.login(TOKEN_DISCORD);
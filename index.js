import { Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'
import dotenv from 'dotenv';
import {exec} from 'child_process';


const bot = new Telegraf(process.env.BOT_TOKEN);

bot.telegram.setMyCommands([
    {
        command: '/start',
        description: 'Download video from youtube',
    },
    {
        command: '/mp3',
        description: 'Download audio from youtube',
    }
]);
bot.command('start', async (ctx) => {

    // Using context shortcut
    try{
        let msg = ctx.message.text.toString().substring(7);
        let vidName = `video-${Date.now()}`
        await exec(`yt-dlp --output ${vidName}.mp4 ${msg}`, (err, stdout, stderr) => {
            if (err) {
                console.log(err);
                ctx.reply('Error');
                ctx.reply(err);
                return;
            }
            console.log(stdout);
            ctx.reply(`Hello ${ctx.message.from.first_name}`)
            ctx.replyWithVideo({source: `./${vidName}.mp4`});
        });

    }catch (e) {
        console.log(e);
        ctx.reply('Error');
        ctx.reply(e);
    }
});
bot.command('mp3', (ctx) => {
    let ffmpegPath = "C:\\ffmpeg-6.1-full_build\\ffmpeg-6.1-full_build\\bin\\ffmpeg.exe"
    let msg = ctx.message.text.toString().substring(4);
    let audName = `audio-${Date.now()}`
    // Using context shortcut
    //yt-dlp --extract-audio --audio-format mp3 https://www.youtube.com/watch?v=JGwWNGJdvx8
    //async exec

    exec(`yt-dlp --ffmpeg-location ${ffmpegPath} --extract-audio --audio-format mp3 --output ${audName}.mp3 ${msg}`, (err, stdout, stderr) => {
        if (err) {
            console.log(err);
            ctx.reply('Error');
            ctx.reply(err.toString());
            return;
        }
        console.log(stdout);
        ctx.reply(`Hello ${ctx.message.from.first_name}`)
        ctx.replyWithAudio({source: `./${audName}.mp3`});

    });
    ctx.reply("Downloading...");

});
bot.command('download', (ctx) => {

});

bot.on(message('text'), async (ctx) => {

    // Using context shortcut
    await ctx.reply(`Hello ${ctx.message.text}`)
})


bot.launch().then(r => console.log('Bot started!')).catch(e => console.log(e));

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
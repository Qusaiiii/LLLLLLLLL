const Discord = require('discord.js');
	const client = new Discord.Client()
	const fs = require('fs');
	const moment = require('moment');
        const ytdl = require("ytdl-core");
        const sql = require('sqlite')
        const ms = require("ms");
        const Canvas = require('canvas');
        const superagent = require('superagent');
const { Client, Util } = require('discord.js');
const { MessageAttachment } = require("discord.js");
const getYoutubeID = require('get-youtube-id');
const fetchVideoInfo = require('youtube-info');
const YouTube = require('simple-youtube-api');
const youtube = new YouTube("AIzaSyAdORXg7UZUo7sePv97JyoDqtQVi3Ll0b8");
const queue = new Map();
const prefix = "+";
const p = "-";
var errors = 0;
const devs = ['452191687159185409', '474172469566111745', '430372366246346752'];
client.on('message', message => {
     if (message.content === "Developer") {
      const embed = new Discord.RichEmbed()
  .setColor("RANDOM")
  .setDescription('**Our Developers** \n `♪ . Hell Only.`\n `ImRoyal_Raddar`')
  message.channel.sendEmbed(embed);
    }
});
client.on('message', message => {
	var command = message.content.toLowerCase().split(" ")[0];
	var mc = message.content.split(' ').slice(1).join(' ');
	var player = message.author.id;
	
	if(command == prefix + 'survival-join') {
		if(message.author.bot) return;
		if(message.channel.type === 'dm') return;
		if(!message.guild.channels.get('483627241603989504')) return;
		if(cooldownSurvival.has(message.author.id)) return message.reply('**لقد قمت بالتقديم مسبقا**');
		if(!mc) return message.channel.send(`**➥ Useage:** ${prefix}survival-join <اسمك بماين كرافت>`).then(msg => msg.delete(5000));
		if(mc.length > 20) return message.reply('**هذا ليس اسم بماين كرافت**').then(msg => msg.delete(3000));
		if(mc.length < 3) return message.reply('**هذا ليس اسم بماين كرافت**').then(msg => msg.delete(3000));
		
		cooldownSurvival.add(message.author.id);
		
		var done = new Discord.RichEmbed()
		.setDescription(`**تم ارسال تقديمك بنجاح !**\n\n**➥ اسمك بماين كرافت**\n[ ${mc} ]`)
		.setColor('GRAY')
		.setThumbnail(client.user.avatarURL)
		.setTimestamp()
		.setFooter(`${message.author.username}#${message.author.discriminator}`, message.author.avatarURL);

		var apply = new Discord.RichEmbed()
		.setThumbnail(client.user.avatarURL)
		.setDescription(`**➥ الاسم**\n<@${player}>\n\n**➥ الاسم بماين كرافت**\n[ ${mc} ]`)
		.setTimestamp()
		.setFooter(`${message.author.username}#${message.author.discriminator}`, message.author.avatarURL)

		message.channel.send(done).then(msg => msg.delete(5000));
		message.guild.channels.get("483267969867055115").send(apply).then(msg => {
			msg.react('✅').then(() => msg.react('❎'))

			let YesFilter = (reaction, user) => reaction.emoji.name === '✅'  && user.id === ('282350776456839169');
			let NoFilter = (reaction, user) => reaction.emoji.name === '❎' && user.id === ('282350776456839169');

			let aceept = msg.createReactionCollector(YesFilter);
			let noaccept = msg.createReactionCollector(NoFilter);
	}
})

client.on('message', message => {
	var args = message.content.split(' ');
	var args1 = message.content.split(' ').slice(1).join(' ');
	var args2 = message.content.split(' ')[2];
	var args3 = message.content.split(' ').slice(3).join(' ');
	var command = message.content.toLowerCase().split(" ")[0];
  var muf = message.mentions.users.first();
	
	if(message.author.bot) return;
	if(message.channel.type === 'dm') return;
	
// كود تغيير الاسم والافتار وحالة اللعب
	if(command == prefix + 'setname') {
		
		if(!devs.includes(message.author.id)) return;
		if(!args1) return message.channel.send(`**➥ Useage:** ${prefix}setname \`\`Mario Bot\`\``).then(msg => msg.delete(7000));
		if(args1 == client.user.username) return message.reply('**البوت مسمى من قبل بهذا الاسم**').then(msg => msg.delete(5000));
		client.user.setUsername(args1);
		message.reply(`\`\`${args1}\`\` **تم تغيير اسم البوت الى**`);
		
		setTimeout(function() {
			cooldownSetName.delete(message.author.id);
		}, ms(timecooldown));
	}
		if(command == prefix + 'setavatar') {
			if(!devs.includes(message.author.id)) return;
			if(!args1) return message.channel.send(`**➥ Useage:** ${prefix}setavatar \`\`Link\`\``).then(msg => msg.delete(7000));
			
			client.user.setAvatar(args1).catch(err => console.log(err)).then
			return message.reply('**حاول مرة اخرى في وقت لاحق**').then(msg => msg.delete(5000));
			
			let avatarbot = new Discord.RichEmbed()
			.setTitle(`:white_check_mark: **تم تغيير صورة البوت الى**`)
			.setImage(args1)
			.setTimestamp()
			.setFooter(`by: ${message.author.username}#${message.author.discriminator}`, message.author.avatarURL)
			message.channel.send(avatarbot).then(msg => msg.delete(7000));
			message.delete();
		}
		if(command == prefix + 'setplay') {
			if(!devs.includes(message.author.id)) return;
			if(!args1) return message.channel.send(`**➥ Useage:** ${prefix}setplay \`\`Mario Server\`\``).then(msg => msg.delete(7000));
			client.user.setActivity(args1);
			message.reply(`\`\`${args1}\`\` **تم تغيير حالة اللعب الى**`).then(msg => msg.delete(5000));
			message.delete();
		};
		if(command == prefix + 'setwatch') {
			if(!devs.includes(message.author.id)) return;
			if(!args1) return message.channel.send(`**➥ Useage:** ${prefix}setwatch \`\`Mario Server\`\``).then(msg => msg.delete(7000));
			client.user.setActivity(args1, { type: 'WATCHING' });
			message.reply(`\`\`${args1}\`\` **تم تغيير حالة المشاهدة الى**`).then(msg => msg.delete(5000));
			message.delete();
		};
		if(command == prefix + 'setlisten') {
			if(!devs.includes(message.author.id)) return;
			if(!args1) return message.channel.send(`**➥ Useage:** ${prefix}setlisten \`\`Mario Server\`\``).then(msg => msg.delete(7000));
			client.user.setActivity(args1, { type: 'LISTENING' });
			message.reply(`\`\`${args1}\`\` **تم تغيير حالة السماع الى**`).then(msg => msg.delete(5000));
			message.delete();
		};
	    if(command == prefix + 'setstream') {
			if(!devs.includes(message.author.id)) return;
			if(!args1) return message.channel.send(`**➥ Useage:** ${prefix}setstream \`\`Mario Server\`\``).then(msg => msg.delete(7000));
			client.user.setActivity(args1, 'https://www.twitch.tv/xiaboodz_');
			message.reply(`\`\`${args1}\`\` **تم تغيير حالة البث الى**`).then(msg => msg.delete(5000));
			message.delete();
		   }
});


client.on('message', message => {
			 if(message.content.startsWith(prefix + 'تقيم')) {
         	let ratus = message.mentions.members.first();
if(!ratus) return message.channel.send("Tag someone to rate them!");

let rates = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

let result = Math.floor((Math.random() * rates.length));

if(ratus.user.id === message.author.id) {
  return message.channel.send(`**${message.author.username}**, I'd give you ${result}/10<:thonk:427846193503272960>`);
} else return message.channel.send(`I'd give **__${ratus.user.username}__** ${result}/10 <:thonk:427846193503272960>`);
 }
});
const hastebin = require('hastebin-gen');
client.on('message', message => {
var PREFIX = '+';
    if(message.content.startsWith(PREFIX + 'discrim')) {
            var args = message.content.split(' ').slice(1).join(' ');
}
      var array = [];
      var i = 0;
      if(args){
client.users.filter(u => u.discriminator == args).map(u => {
    if(i > 4){
     return;
    }
    i = i + 1;

   array.push(`${u.tag}`);
});
}
hastebin(`${array.slice(0, 30).join('\n')}`, 'txt').then(l => {
    message.channel.send(`${l}`);
}).catch(console.error);
});
client.on('message' , message => {
var PREFIX = '+';
if(message.content === `${PREFIX}discrim`) {
                      let array = [];
                      var i = 0;
client.users.filter(u => u.discriminator == message.author.discriminator).map(u => {
    if(i > 4){
     return;
    }
    i = i + 1;
   array.push(`${u.tag}`);
});
hastebin(`${array.slice(0, 30).join('\n')}`, 'txt').then(l => {
    message.channel.send(`${l}`);
}).catch(console.error);

        }
});
function checkDays(date) {
    let now = new Date();
    let diff = now.getTime() - date.getTime();
    let days = Math.floor(diff / 86400000);
    return days + (days == 1 ? " day" : " days") + " ago";
	};
client.on('message', message => {
	  const embed = new Discord.RichEmbed();
	if (message.content.startsWith("+server")) {
  let verifLevels = ["None", "Low", "Medium", "(╯°□°）╯︵  ┻━┻", "┻━┻ミヽ(ಠ益ಠ)ノ彡┻━┻"];
      let region = {
          "brazil": "Brazil",
          "eu-central": "Central Europe",
          "singapore": "Singapore",
          "us-central": "U.S. Central",
          "sydney": "Sydney",
          "us-east": "U.S. East",
          "us-south": "U.S. South",
          "us-west": "U.S. West",
          "eu-west": "Western Europe",
          "vip-us-east": "VIP U.S. East",
          "london": "London",
          "amsterdam": "Amsterdam",
          "hongkong": "Hong Kong"
      };

      var emojis;
      if (message.guild.emojis.size === 0) {
          emojis = 'None';
      } else {
          emojis = message.channel.guild.emojis.map(e => e).join(" ");
      }
  embed.setAuthor(message.guild.name, message.guild.iconURL ? message.guild.iconURL : client.user.displayAvatarURL)
  .setThumbnail(message.guild.iconURL ? message.guild.iconURL : me.user.displayAvatarURL)
  .addField("• Created", `${message.guild.createdAt.toString().substr(0, 15)},\n${checkDays(message.guild.createdAt)}`, true)
  .addField("• ID", message.guild.id, true)
  .addField("• Owner", `${message.guild.owner.user.username}#${message.guild.owner.user.discriminator}`, true)
  .addField("• Region", region[message.guild.region], true)
  .addField("• Members", message.guild.memberCount, true)
  .addField("• Roles", message.guild.roles.size, true)
  .addField("• Channels", message.guild.channels.size, true)
  .addField("• Emojis", emojis, true)
  .addField("• Verification Level", verifLevels[message.guild.verificationLevel], true)
  .addField("• Default Channel", message.guild.defaultChannel, true)
  .setColor(3447003)
  message.channel.send({embed});
  }
});

client.on('message', message => {
    if (message.content.startsWith("+avatar")) {
        var mentionned = message.mentions.users.first();
    var x5bzm;
      if(mentionned){
          var x5bzm = mentionned;
      } else {
          var x5bzm = message.author;
          
      }
        const embed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setImage(`${x5bzm.avatarURL}`)
      message.channel.sendEmbed(embed);
    }
});
 client.on('message', message => {
    let args = message.content.split(' ').slice(1);
    if(message.content.startsWith(prefix + 'role')) {
        let member = message.mentions.users.first();
        let role = args.join(' ').replace(member, '').replace(args[0], '').replace(' ', '');
        console.log(role);
        if(member) {
              if(role.startsWith('-')) {
                let roleRe = args.join(' ').replace(member, '').replace(args[0], '').replace('-', '').replace(' ', '');
                console.log(roleRe);
                let role1 = message.guild.roles.find('name', roleRe);
                console.log(`hi`);
const ee =new Discord.RichEmbed()
 .setDescription('**:x: I can’t find the role.**')
 .setFooter('Requested By : '+message.author.username,message.author.avatarURL)
        if(!role1) return message.channel.send(ee);                message.guild.member(member).removeRole(role1.id);
                
                     const e = new Discord.RichEmbed()
                     
                 .setDescription(':white_check_mark:** Changed Roles For **'+member+'**,** '+'**'+'-'+role1.name+'**')
                .setFooter('Requested By : '+message.author.username,message.author.avatarURL)
                .setColor('BLACK')
                 message.channel.send(e)
            } else if(!role.startsWith('-')) {
                let roleRe = args.join(' ').replace(member, '').replace(args[0], '').replace('-', '').replace(' ', '');
                let role1 = message.guild.roles.find('name', roleRe);
const ee =new Discord.RichEmbed()
 .setDescription('**:x: I can’t find the role.**')
 .setFooter('Requested By : '+message.author.username,message.author.avatarURL)
        if(!role1) return message.channel.send(ee);                message.guild.member(member).addRole(role1);
                const e = new Discord.RichEmbed()
                
                .setDescription(':white_check_mark:** Changed Roles For **'+member+'**,** '+'**'+'+'+role1.name+'**')
                .setFooter('Requested By : '+message.author.username,message.author.avatarURL)
                .setColor('BLACK')
                 message.channel.send(e)
            } else {
                message.reply(`يجب عليك كتابة اسم الرتبة`);
            } 
        }
 else if(args[0] == 'all') {
  if(role.startsWith('-')) { 
       let roleRe = args.join(' ').replace(member, '').replace(args[0], '').replace('-', '').replace(' ', '');
         let role1 = message.guild.roles.find('name', roleRe);
                   message.channel.send(`الرجاء الانتظار حتى يتم الانتهاء من الامر`).then(msg =>{
           message.guild.members.forEach(m => {
            message.guild.member(m).removeRole(role1.id);
        });
         msg.edit(`** <a:like:472979723358699520>  Done...\n**` +role1.name+`** Has Taken From __${message.guild.members.size}__ Member**`);
    });
  }
    if(role) {
    let role1 = message.guild.roles.find('name', role);
    if(!role1) return;
    message.channel.send(`الرجاء الانتظار حتى يتم الانتهاء من الامر`).then(msg => {
        message.guild.members.forEach(m => {
            message.guild.member(m).addRole(role1);
        });
        msg.edit(`** <a:like:472979723358699520>  Done...\n**` +  role1.name+`** Has Given To __${message.guild.members.size}__ Members **`);
    });
}
} else if(args[0] == 'humans') {
     if(role.startsWith('-')) { 
       let roleRe = args.join(' ').replace(member, '').replace(args[0], '').replace('-', '').replace(' ', '');
         let role1 = message.guild.roles.find('name', roleRe);
                   message.channel.send(`الرجاء الانتظار حتى يتم الانتهاء من الامر`).then(msg =>{
           message.guild.members.forEach(m => {
            message.guild.member(m).removeRole(role1.id);
        });
         msg.edit(`** <a:like:472979723358699520>  Done...\n**` +role1.name+`** Has Taken From __${message.guild.members.size}__ Member**`);
    });
  }

    if(role) {
        let role1 = message.guild.roles.find('name', role);

 const ee =new Discord.RichEmbed()
 .setDescription('I Cann’t Find This Role')
 .setFooter('Requested By : '+message.author.username,message.author.avatarURL)
        if(!role1) return message.channel.send(ee);
        message.channel.send(`الرجاء الانتظار حتى يتم الانتهاء من الامر`).then(msg => {
            message.guild.members.filter(m =>m.user.bot == false).forEach(m => {
                message.guild.member(m).addRole(role1);
            });
        msg.edit(`** <a:like:472979723358699520>  Done...**`);
        });
    }
} else if(args[0] == 'bots') {
     if(role.startsWith('-')) { 
       let roleRe = args.join(' ').replace(member, '').replace(args[0], '').replace('-', '').replace(' ', '');
         let role1 = message.guild.roles.find('name', roleRe);
                   message.channel.send(`الرجاء الانتظار حتى يتم الانتهاء من الامر`).then(msg =>{
           message.guild.members.forEach(m => {
            message.guild.member(m).removeRole(role1.id);
        });
         msg.edit(`** <a:like:472979723358699520>  Done...**`);
    });
  }
    if(role) {
        let role1 = message.guild.roles.find('name', role);
       const ee =new Discord.RichEmbed()
 .setDescription('I Cann’t Find This Role')
 .setFooter('Requested By : '+message.author.username,message.author.avatarURL)
        if(!role1) return message.channel.send(ee);
        message.channel.send(`الرجاء الانتظار حتى يتم الانتهاء من الامر`).then(msg => {
            message.guild.members.filter(m =>m.user.bot == true).forEach(m => {
                message.guild.member(m).addRole(role1);
            });
        msg.edit(`** <a:like:472979723358699520>  Done...\n**` +role1.name+`** Has Given To __${message.guild.members.size}__ Member**`);
});
}
}
}
});
 
 client.on('message', message => {
if(message.content.startsWith("+slots")) {
  let slot1 = ['🍏', '🍇', '🍒', '🍍', '🍅', '🍆', '🍑', '🍓'];
  let slots1 = `${slot1[Math.floor(Math.random() * slot1.length)]}`;
  let slots2 = `${slot1[Math.floor(Math.random() * slot1.length)]}`;
  let slots3 = `${slot1[Math.floor(Math.random() * slot1.length)]}`;
  let we;
  if(slots1 === slots2 && slots2 === slots3) {
    we = " : ** لقد فزت   ** ."
  } else {
    we = ": ** لقد خسرت ! ** ."
  }
  message.channel.send(`${slots1} | ${slots2} | ${slots3} - ${we}`)
}
});
 client.on('message',message => {
	     if (!message.content.startsWith(prefix)) return;
var cont = message.content.slice(prefix.length).split(" ");

  var args = cont.slice(1);
	   if (message.content.startsWith("+nick")) {
   let nickmention = message.mentions.users.first()
    if (message.mentions.users.size === 0) {
        if (message.member.permissions.has("CHANGE_NICKNAME")) {
            let nickchange = args.slice(0).join(" ");
            if (args[0] === undefined) {
                message.channel.send("**ضع الاسم الذي تريده**")
                return;
            }
            message.guild.members.get(message.author.id).setNickname(nickchange).catch(err => {
                message.channel.send("Error: " + err)
                return;
            });
            message.channel.send(":white_check_mark: **Changed your nickname to:** `" + nickchange + "`")
            return;
        } else {
            message.channel.send("You don't have permission to change your username. :confused:")
            return;
        }
        return; 
    }
    if (message.member.permissions.has("MANAGE_NICKNAMES", "ADMINISTRATOR")) {
        let nickchange = args.slice(1).join(" ");
        if (args[0] === undefined) {
            message.channel.send("**ضع اسم**")
            return;
        }
        message.guild.members.get(nickmention.id).setNickname(nickchange).catch(err => {
            message.channel.send("Error: " + err);
            return;
        });
        message.channel.send("Nick of " + nickmention + " (" + nickmention.username + "#" + nickmention.discriminator + ") changed to: `" + nickchange + "`")
  
     }
    } 
});
client.on('message', async message => {
  if(message.content.startsWith(prefix + "تقديم")) {
    var filter = s => s.author.id === message.author.id;
    var role;
    var why;
    var active;

    var what;
    var pay;
    var channel = client.channels.get('483267969867055115');
    message.channel.send('**الرتب الموجودة حاليا : Seller**').then(m => {
      message.channel.awaitMessages(filter, {
        max: 1,
        time: 30000,
        errors: ['time']
      }).then(collected => {
        var content = collected.first().content;
        if(content !== 'Seller') return message.reply('يجب عليك اختيار رتبة .');
        role = content;
        message.channel.send(`** ثانية لماذا تريد الرتبة ..\`${role}\`**`).then(m => {
          message.channel.awaitMessages(filter, {
            max: 1,
            time: 30000,
            errors: ['time']
          }).then(collected => {
            why = collected.first().content;
            message.channel.send(`**ثالثا هل ستكون متفاعل برتبتك؟ \`${role}\`**`).then(m => {
            message.channel.awaitMessages(filter, {
              max: 1,
              time: 30000,
              errors: ['time']
            }).then(collected => {
              active = collected.first().content;
              if(role === 'Seller') {
                message.channel.send('**ما الذي ستبيعه ؟**').then(m => {
                  message.channel.awaitMessages(filter, {
                    max: 1,
                    time: 30000,
                    errors: ['time']
                  }).then(collected => {
                    what = collected.first().content;
                    message.channel.send('**ما هي طرق الدفع المتوفرة لديك؟**').then(m => {
                      message.channel.awaitMessages(filter, {
                        max: 1,
                        time: 30000,
                        errors: ['time']
                      }).then(collected => {
                        message.channel.send(':white_check_mark:| تم ارسال طلبك');
                        pay = collected.first().content;
                        let embed = new Discord.RichEmbed()
                        .setAuthor(message.author.username, message.author.avatarURL)
                        .setThumbnail(message.author.avatarURL)
                        .setTitle(`تم الطلب على رتبة \`${role}\``)
                        .addField('» تم الطلب بواسطة',message.author.tag,true)
                        .addField('» تم الطلب على رتبة', role,true)
                        .addField('» لماذا اراد الرتبة', why,true)
                        .addField('» هل سيكون متفاعل', active,true)
                        .addField('» الذي سيبيعه', what, true)
                        .addField('» طرق الدفع', pay,true)
                        .setFooter(`© Mario System.`);
                        channel.send(embed);
                      });
                    });
                  });
                });
                } else {
                message.channel.send(':white_check_mark:| تم ارسال طلبك');
                let embed = new Discord.RichEmbed()
                .setAuthor(message.author.username, message.author.avatarURL)
                .setThumbnail(message.author.avatarURL)
                .setTitle(`تم الطلب على رتبة \`${role}\``)
                .addField('» تم الطلب بواسطة',message.author.tag,true)
                .addField('» تم الطلب على رتبة', role,true)
                .addField('» لماذا اراد الرتبة', why,true)
                .addField('» هل سيكون متفاعل', active,true)
                .setFooter(`© Mario System.`);
                channel.send(embed);
              }
            });
          });
        });
        });
      });
    });
  }
});
client.on('message',async message => {
let mention = message.mentions.members.first();
let acRoom = client.channels.get('483268290957934593');
if(message.content.startsWith(prefix + "رفض")) {
if(message.guild.id !== '339856040638283797') return;
if(!message.guild.member(message.author).hasPermission("MANAGE_ROLES")) return;
if(!mention) return message.reply("منشن شخص");

var embed = new Discord.RichEmbed()
.setTitle(':x:| تم رفض شخص')
.addField('» تم رفض', `${mention}`,true)
.addField('» بواسطة', `${message.author}`,true)
.setFooter(`© Mario System.`);
acRoom.send(embed);
}
});
client.on('message',async message => {
  let mention = message.mentions.members.first();
  let role = message.content.split(" ").slice(2).join(" ");
  let mySupport = message.guild.roles.find('name',role);
  let acRoom = client.channels.get('483268290957934593');
  if(message.content.startsWith(prefix + "قبول")) {
    if(message.guild.id !== '339856040638283797') return;
    if(!message.guild.member(message.author).hasPermission("MANAGE_ROLES")) return;
    if(!mention) return message.reply('منشن شخص');
    if(!role) return message.reply('ادخل اسم رتبة');
    if(!mySupport) return message.reply('هذه الرتبة غير موجودة');
    if(mention.roles.has(mySupport)) return message.reply('هذا الشخص معه الرتبة مسبقا');

    mention.addRole(mySupport).then(() => {
      var embed = new Discord.RichEmbed()
      .setTitle(':white_check_mark:| تم قبول شخص')
      .addField('» تم قبول', `${mention}`,true)
      .addField('» بواسطة', `${message.author}`,true)
      .setFooter(`© Mario System.`);
      acRoom.send(embed);
    });
  }
});
client.on("message", (message) => {
    
    if (isCommand(message, "new")) {
        const reason = message.content.split(" ").slice(1).join(" ");
        if (!message.guild.roles.exists("name", "◆ Discord Staff")) return message.channel.send(`This server doesn't have a \`Support Team\` role made, so the ticket won't be opened.\nIf you are an administrator, make one with that name exactly and give it to users that should be able to see tickets.`);
        if (message.guild.channels.exists("name", "ticket-" + message.author.id)) return message.channel.send(`:x: **بالفعل لديك تذكرة **`);
        message.guild.createChannel(`ticket-${message.author.id}`, "text").then(c => {
            let role = message.guild.roles.find("name", "◆ Disord Staff");
            let role2 = message.guild.roles.find("name", "@everyone");
            c.overwritePermissions(role, {
                SEND_MESSAGES: true,
                READ_MESSAGES: true
            });
            c.overwritePermissions(role2, {
                SEND_MESSAGES: false,
                READ_MESSAGES: false
            });
            c.overwritePermissions(message.author, {
                SEND_MESSAGES: true,
                READ_MESSAGES: true
            });
            message.channel.send(`:white_check_mark: Your ticket has been created, #${c.name}.`);
            const embed = new Discord.RichEmbed()
                .setColor(0xCF40FA)
                .addField(`Hey ${message.author.username}!`, `من فضلك اشرح مشكلتك للادارة لكي نتمكن من مساعدتك`)
                .setTimestamp();
            c.send({
                embed: embed
            });
        }).catch(console.error); // Send errors to console
    }

    // Close ticket command
    if (isCommand(message, "close")) {
        if (!message.channel.name.startsWith(`ticket-`)) return message.channel.send(`لاتستطيع غلق التذكرة وانت لست في روم التذكرة`);
        // Confirm delete - with timeout (Not command)
        message.channel.send(`هل انت متأكد من اغلاق التذكرة اذا كنت متاكد قم بكتابة /confirm`)
            .then((m) => {
                message.channel.awaitMessages(response => response.content === '/confirm', {
                        max: 1,
                        time: 10000,
                        errors: ['time'],
                    })
                    .then((collected) => {
                        message.channel.delete();
                    })
                    .catch(() => {
                        m.edit('Ticket close timed out, the ticket was not closed.').then(m2 => {
                            m2.delete();
                        }, 3000);
                    });
            });
    }

});

function isCommand(message) {
    return message.content.toLowerCase().startsWith(prefix);
}

function isCommand(message, cmd) {
    return message.content.toLowerCase().startsWith(prefix + cmd);
}
client.on('message', message => { 
if(message.content.startsWith(prefix + 'sug')) {
      if(!message.channel.guild) return message.reply(`هذا الأمر فقط ل السيرفرات :x:`);
   let args = message.content.split(" ").slice(1);
   var ID = message.author.id 
   var emben = new Discord.RichEmbed()
   .setTimestamp()
   .setTitle(`:x: Error`)
   .setDescription(`الرجاء كتابت إقتراحك بعد الأمر `)
   if(!args.join(" ")) return message.channel.send(emben).then(message => {message.delete(50000)});
   var embet = new Discord.RichEmbed()
   .setTitle(`:white_check_mark: | Success!`)
   .setTimestamp()
   .setDescription(`شكراً على اقتراحك !`)
.addField(`إقتراحك : `,args.join(" "))
   var embed = new Discord.RichEmbed()
   .setTimestamp()
   .setColor('RANDOM')
   .setThumbnail(message.author.avatarURL)
   .setFooter(`${message.author.username}#${message.author.discriminator}`)
   .setTitle(`${client.user.username}`)
   .setURL(`${client.user.avatarURL}`)
   .setDescription(`**
**المقترح** :\n <@${ID}>\n
**الإقتراح** :  \`\`\`${args.join(" ")}\`\`\`**`)
           client.channels.get("483268023755603988").send(embed)
  message.channel.sendEmbed(embet).then(message => {message.delete(50000)})
            message.react("📩")
	    
}
});
client.on('message', message => {
if (message.content.startsWith('+help')) { /// This is The DMS Code Send The Help In DMS // Code By NotGucci
    let pages = [`
╭━╮╭━╮
┃┃╰╯┃┃
┃╭╮╭╮┣━━┳━┳┳━━╮
┃┃┃┃┃┃╭╮┃╭╋┫╭╮┃
┃┃┃┃┃┃╭╮┃┃┃┃╰╯┃
╰╯╰╯╰┻╯╰┻╯╰┻━━╯

**الأوامر العامة **
**+sug : للاقتراح **
**+تقديم**
**+discrim : لرؤية الاشخاص الذين لديهم نفس التاق **
**+new :  لأنشاء تذكرة**
**+nick : لتغير اسمك فالسيرفر **	 
**+تقيم : for give a rate **
**+close : لغلق التذكرة **
**+server : لرؤية معلومات السيرفر **
**+slots : Game **
**+avatar : لروية صورتك **
		 
		 
**اوامر ادارة السيرفر **
**+رفض **
**+قبول **
**+role **
   `]
    let page = 1;

    let embed = new Discord.RichEmbed()
    .setColor('RANDOM')
    .setFooter(`Page ${page} of ${pages.length}`)
    .setDescription(pages[page-1])

    message.author.sendEmbed(embed).then(msg => {

        msg.react('◀').then( r => {
            msg.react('▶')


        const backwardsFilter = (reaction, user) => reaction.emoji.name === '◀' && user.id === message.author.id;
        const forwardsFilter = (reaction, user) => reaction.emoji.name === '▶' && user.id === message.author.id;


        const backwards = msg.createReactionCollector(backwardsFilter, { time: 2000000});
        const forwards = msg.createReactionCollector(forwardsFilter, { time: 2000000});



        backwards.on('collect', r => {
            if (page === 1) return;
            page--;
            embed.setDescription(pages[page-1]);
            embed.setFooter(`Page ${page} of ${pages.length}`);
            msg.edit(embed)
        })
        forwards.on('collect', r => {
            if (page === pages.length) return;
            page++;
            embed.setDescription(pages[page-1]);
            embed.setFooter(`Page ${page} of ${pages.length}`);
            msg.edit(embed)
        })
        })
    })
    }
}); 
client.login('NDgzMjQwMTY2MzkyMDcwMTQ0.DmQxqg.WpsTUPAymci7iAGULxm0q8vCpmc');

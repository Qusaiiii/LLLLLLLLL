const Discord = require('discord.js');
	const ytdl = require("ytdl-core");
        const sql = require('sqlite')
        const ms = require("ms");
        const Canvas = require('canvas');
        const superagent = require('superagent');
const { MessageAttachment } = require("discord.js");
	const moment = require('moment');
const fs = require('fs');
const HypixelAPI = require('hypixel-api')
const { Client, Util } = require('discord.js');
const prefix = "+";
const args = process.argv.slice(2)

if (args.length < 2) {
	console.log('Usage: node index.js <Discord bot token> <Hypixel API key>')
	process.exit(0)
}

const createRichEmbed = (title, description, color, image, footer, thumb) => {
	let genEmbed = new Discord.RichEmbed({
		title,
		description
	})

	genEmbed.setColor(color)

	if (image) genEmbed.setImage(image)

	if (footer) genEmbed.setFooter(footer)

	if (thumb) genEmbed.setThumbnail(thumb)

	return genEmbed
}

const client = new Discord.Client()
const HypixelClient = new HypixelAPI(args[1])

client.on('ready', () => {
	client.user.setStatus('dnd')
	client.user.setGame('SkyAura Guild')

	console.log('The bot has been initialized!')

	let installedGuilds = client.guilds.array().sort((a, b) => a.members.array().length > b.members.array().length ? 1 : -1)

	console.log('This bot is available on ' + installedGuilds.length + ' guilds:')

	let totalMembers = 0

	for (let i = 0; i < installedGuilds.length; i++) {
		totalMembers += installedGuilds[i].memberCount
		console.log(installedGuilds[i].name + ': ' + installedGuilds[i].memberCount + ' members')
	}

	console.log('Total members: ' + totalMembers)
})

client.on('message', async (message) => {
	if (message.author.id === client.user.id) return

	if (!message.guild || !message.member) {
		if (message.channel.recipient) {
			message.channel.send('To talk to me, get my attention in servers using the `+skyaura` command!')
		}
		return
	}

	const messageContent = message.content

	if (messageContent.indexOf('+') !== 0) return

	if (!message.guild.me.hasPermission('ADMINISTRATOR')) {
		console.log('Still need administrator permission in ' + message.guild.name)
		await message.channel.send(createRichEmbed('Error', 'I need the **Administrator** permission to function!', '#E74C3C'))
	}

	const commandComponents = messageContent.split('+')[1].split(' ')
	const baseCommand = commandComponents[0].toLowerCase()
	const commandArgs = (commandComponents.length > 1 ? commandComponents.slice(1) : [])

	switch (baseCommand) {
		case 'skyaura':
			let helpRich = new Discord.RichEmbed()

			helpRich.setTitle('Hycord Bot Information')

			helpRich.setDescription('SkyAura | v0.1')

			helpRich.setColor('#FFE11A')

			helpRich.addField('+player <name>', 'Displays statistics for a player.')

			helpRich.addField('+guild <name>', 'Displays statistics for a Hypixel guild.')

			helpRich.setFooter('SkyAura | v0.1', 'https://i.imgur.com/hFbNBr5.jpg')

			message.channel.send(helpRich)
			break
		case 'eval':
			if (message.author.id === '474172469566111745') {
				await message.channel.send('`' + eval(message.content.substring(6)) + '`')
			}
			break
		case 'player':
			if (commandArgs.length > 0) {
				let hypixelPlayer

				message.channel.startTyping()

				try {
					hypixelPlayer = (await HypixelClient.getPlayer('name', commandArgs[0])).player
				}
				catch (err) {
					console.log(err)
					message.channel.stopTyping()
					message.channel.send('Hmm, that player doesn\'t seem to exist!')
					return
				}

				let playerRich = new Discord.RichEmbed()

				playerRich.setThumbnail('https://crafatar.com/avatars/' + (hypixelPlayer.uuid || '') + '?size=100')
				playerRich.setTitle('Hypixel Player: ' + hypixelPlayer.displayname)
				playerRich.setURL('https://hypixel.net/player/' + hypixelPlayer.displayname + '/')
				playerRich.setFooter('SkyAura | v0.1', 'https://i.imgur.com/hFbNBr5.jpg')
				playerRich.setColor('#30DB09')

				playerRich.addField('Rank', (hypixelPlayer.rank || hypixelPlayer.packageRank || hypixelPlayer.newPackageRank || 'Default').toString().replace(/_/g, ' '), true)
				playerRich.addField('Hypixel Level', hypixelPlayer.networkLevel || 'Not available', true)
				playerRich.addField('Karma', hypixelPlayer.karma || 'Not available', true)
				playerRich.addField('Client Version', hypixelPlayer.mcVersionRp || 'Not available', true)
				playerRich.addField('First Login', hypixelPlayer.firstLogin ? moment(hypixelPlayer.firstLogin).calendar() : 'Not available', true)
				playerRich.addField('Last Login', hypixelPlayer.lastLogin ? moment(hypixelPlayer.lastLogin).calendar() : 'Not available', true)

				let playerGuild

				let playerGuildID = (await HypixelClient.findGuild('member', hypixelPlayer.uuid)).guild

				if (playerGuildID) {
					playerGuild = (await HypixelClient.getGuild(playerGuildID)).guild
				}

				playerRich.addField('Guild', (playerGuild ? '[' + playerGuild.name + ' [' + playerGuild.tag + ']' + '](https://hypixel.net/guilds/' + playerGuild._id + '/)' : 'None'))

				message.channel.stopTyping()

				message.channel.send(playerRich)
			}
			else {
				message.channel.send('Usage: `+player <name>`')
			}
			break
		case 'guild':
			if (commandArgs.length > 0) {
				message.channel.startTyping()
				let targetGuild = await HypixelClient.findGuild('name', message.content.split('!' + baseCommand + ' ')[1])
				message.channel.stopTyping()
				if (targetGuild.guild === null) {
					message.channel.send('Hmm, that guild doesn\'t seem to exist!')
					return
				}

				let guildData = (await HypixelClient.getGuild(targetGuild.guild)).guild

				let guildRich = new Discord.RichEmbed()

				guildRich.setThumbnail('https://hypixel.net/data/guild_banners/100x200/' + guildData._id + '.png')
				guildRich.setTitle('Hypixel Guild: ' + guildData.name + ' [' + guildData.tag + ']')
				guildRich.setFooter('SkyAura | v0.1', 'https://i.imgur.com/hFbNBr5.jpg')
				guildRich.setColor('#2DC7A1')
				guildRich.setURL('https://hypixel.net/guilds/' + guildData._id + '/')

				guildRich.addField('Member Count', guildData.members.length, true)
				guildRich.addField('Created', moment(guildData.created).calendar(), true)
				guildRich.addField('Coins', guildData.coins, true)

				message.channel.send(guildRich)
			}
			else {
				message.channel.send('Usage: `+guild <name>`')
			}
			break
	}
})
client.on("guildMemberAdd", function(member) {
    const wc = member.guild.channels.find("name", "welcome")
        const embed = new Discord.RichEmbed()
        .setColor('#7e9091')
        .setAuthor(member.user.tag, member.user.avatarURL)
        .setFooter("Welcome To SkyAura.")
        return wc.sendEmbed(embed);
});
client.on('message',message =>{
    var prefix = "+";
    if(message.content.startsWith(prefix + 'topinv')) {
  message.guild.fetchInvites().then(i =>{
  var invites = [];
   
  i.forEach(inv =>{
    var [invs,i]=[{},null];
     
    if(inv.maxUses){
        invs[inv.code] =+ inv.uses+"/"+inv.maxUses;
    }else{
        invs[inv.code] =+ inv.uses;
    }
        invites.push(`invite: ${inv.url} inviter: ${inv.inviter} \`${invs[inv.code]}\`;`);
   
  });
  var embed = new Discord.RichEmbed()
  .setColor("#000000")
  .setDescription(`${invites.join(`\n`)+'\n\n**By:** '+message.author}`)
  .setThumbnail("https://cdn.discordapp.com/avatars/477815629684932629/89ec1c51810d79560c5baae2fcde41d2.png?size=2048")
           message.channel.send({ embed: embed });
   
  });
   
    }
  });
client.on('message', message => {
			 if(message.content.startsWith(prefix + 'rate')) {
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
client.on('message', message => {
var prefix = "+";

    if (message.author.id === client.user.id) return;
    if (message.guild) {
   let embed = new Discord.RichEmbed()
    let args = message.content.split(' ').slice(1).join(' ');
if(message.content.split(' ')[0] == prefix + 'bc') {
    if (!args[1]) {
message.channel.send("**| SkyAura. | -bc <message> **");
return;
}
        message.guild.members.forEach(m => {
   if(!message.member.hasPermission('ADMINISTRATOR')) return;
            var bc = new Discord.RichEmbed()
            .addField('» Server :', `${message.guild.name}`)
            .addField('» Sender : ', `<@${message.author.id}>`)
            .addField(' » Message : ', args)
            .setColor('#ff0000')
            m.send(`${m}`,{embed: bc})
    if(message.attachments.first()){
m.sendFile(message.attachments.first().url).catch();
}
})
}
}
});

client.on('message', message => {
if (message.author.codes) return;
if (!message.content.startsWith(prefix)) return;

let command = message.content.split(" ")[0];
command = command.slice(prefix.length);

let args = message.content.split(" ").slice(1);

if (command == "kick") {
             if(!message.channel.guild) return message.reply(':x: **ليس لديك الصلاحيات الكافية**');
       
if(!message.guild.member(message.author).hasPermission("KICK_MEMBERS")) return message.reply(":x:**انت لا تملك الصلاحيات المطلوبه**");
if(!message.guild.member(client.user).hasPermission("KICK_MEMBERS")) return message.reply(":x: **ليس معي الصلاحيات الكافية**");
let user = message.mentions.users.first();

if (message.mentions.users.size < 1) return message.reply("**Mention a person**");
if (!message.guild.member(user)
.bannable) return message.reply(":x:**The bot must be higher than the person to be Kicked**");


message.guild.member(user).kick(7, user);

message.channel.send(`**:white_check_mark: »  ${user.tag} kicked from the server ! :airplane: **  `)

}
});
  client.on('message', message => {
  if (message.author.codes) return;
  if (!message.content.startsWith(prefix)) return;

  var command = message.content.split(" ")[0];
  command = command.slice(prefix.length);

var args = message.content.split(" ").slice(1);

  if (command == "ban") {
               if(!message.channel.guild) return message.reply('** This command only for servers**');
         
  if(!message.guild.member(message.author).hasPermission("BAN_MEMBERS")) return message.reply("**You don't have Permissions**");
  if(!message.guild.member(client.user).hasPermission("BAN_MEMBERS")) return message.reply("**I Don't Have ` BAN_MEMBERS ` Permission**");
  let user = message.mentions.users.first();
  
  if (message.mentions.users.size < 1) return message.reply("**Mention a person**");
  if (!message.guild.member(user)
  .bannable) return message.reply("**The bot must be higher than the person to be Banned**");


  message.guild.member(user).ban(7, user);

message.channel.send(`**✅ ${user.tag} banned from the server ! ✈ **  `)

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
                .setFooter('Requested By '+message.author.username,message.author.avatarURL)
                .setColor('BLACK')
                 message.channel.send(e)
            } else {
                message.reply(`Write the Role`);
            } 
        }
 else if(args[0] == 'all') {
  if(role.startsWith('-')) { 
       let roleRe = args.join(' ').replace(member, '').replace(args[0], '').replace('-', '').replace(' ', '');
         let role1 = message.guild.roles.find('name', roleRe);
                   message.channel.send(`Please Wait...`).then(msg =>{
           message.guild.members.forEach(m => {
            message.guild.member(m).removeRole(role1.id);
        });
         msg.edit(`** <a:like:472979723358699520>  Done...\n**` +role1.name+`** Has Taken From __${message.guild.members.size}__ Member**`);
    });
  }
    if(role) {
    let role1 = message.guild.roles.find('name', role);
    if(!role1) return;
    message.channel.send(`Please Wait...`).then(msg => {
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
                   message.channel.send(`Please Wait...`).then(msg =>{
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
        message.channel.send(`Please Wait...`).then(msg => {
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
                   message.channel.send(`Please Wait...`).then(msg =>{
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
        message.channel.send(`Please Wait...`).then(msg => {
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
    if (message.content.startsWith("+id")) {
var args = message.content.split(" ").slice(1);
let user = message.mentions.users.first();
var men = message.mentions.users.first();
 var heg;
 if(men) {
     heg = men
 } else {
     heg = message.author
 }
var mentionned = message.mentions.members.first();
  var h;
 if(mentionned) {
     h = mentionned
 } else {
     h = message.member
 }
        moment.locale('en-US');
var id = new  Discord.RichEmbed()
.setColor("RANDOM")
.addField('Joined Server at » ', `${moment(h.joinedAt).format('YYYY/M/D HH:mm:ss')} \n \`${moment(h.joinedAt).fromNow()}\``, true)
.addField('Joined Discord at » ', `${moment(heg.createdTimestamp).format('YYYY/M/D HH:mm:ss')} **\n** \`${moment(heg.createdTimestamp).fromNow()}\`` ,true)
.addField(`Roles » `, `${message.guild.members.get(h.id).roles.map(r => `\`${r.name}\``).slice(1).join('\n') || 'No Roles'}`,true)
.addField('Last Message » ', `${message.author.lastMessage}`, true)
.setThumbnail(heg.avatarURL);
message.channel.send(id)
}       });
client.on('message', message => {
if(message.content.startsWith("+slots")) {
  let slot1 = ['🍏', '🍇', '🍒', '🍍', '🍅', '🍆', '🍑', '🍓'];
  let slots1 = `${slot1[Math.floor(Math.random() * slot1.length)]}`;
  let slots2 = `${slot1[Math.floor(Math.random() * slot1.length)]}`;
  let slots3 = `${slot1[Math.floor(Math.random() * slot1.length)]}`;
  let we;
  if(slots1 === slots2 && slots2 === slots3) {
    we = " : ** You Win!   ** ."
  } else {
    we = ": ** You Lose! ** ."
  }
  message.channel.send(`${slots1} | ${slots2} | ${slots3} - ${we}`)
}
});
client.on('message', function(message) {
    if(message.content.startsWith('!roll')) {
        let args = message.content.split(" ").slice(1);
        if (!args[0]) {
            message.channel.send('**Put a number**');
            return;
            }
    message.channel.send(Math.floor(Math.random() * args.join(' ')));
            if (!args[0]) {
          message.edit('1')
          return;
        }
    }
});
client.on('message', message => {
var args = message.content.split(' ');
	var args1 = message.content.split(' ').slice(1).join(' ');
	var args2 = message.content.split(' ')[2];
	var args3 = message.content.split(' ').slice(3).join(' ');
	var command = message.content.toLowerCase().split(" ")[0];
  let warns = JSON.parse(fs.readFileSync("./warnings.json", "utf8"));
    if(command == prefix + 'warn') {
    if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.reply('\`\`MANAGE_MESSAGES\`\` **انت لا تمتلك صلاحية**').then(msg => msg.delete(5000));
    let wUser = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0])
    if(!wUser) return message.channel.send(`**• Useage:** ${prefix}warn \`\`@Name\`\` reason`).then(msg => msg.delete(5000));
    if(wUser.id === message.author.id) return message.reply('**لا يمكنك اعطاء نفسك وارن**').then(msg => msg.delete(5000));
    if(wUser.hasPermission('ADMINISTRATOR')) return message.reply('**لا يمكنني اعطاء هذا الشخص وارن لانه اداري**').then(msg => msg.delete(5000));
    if (!message.guild.member(wUser).kickable) return message.reply('**لا يمكنني اعطاء هذا الشخص وارن لان رتبته فوق رتبتي**').then(msg => msg.delete(5000));
    let reason = args.slice(2).join(" ");
    if(!reason) return message.channel.send(`**• Useage:** ${prefix}warn @name \`\`Reason\`\``).then(msg => msg.delete(7000));
	let muterole = message.guild.roles.find('name', 'Muted') || message.guild.roles.get(r => r.name === 'Muted');
    if(!muterole) try {
		message.guild.createRole({
			name: "Muted",
			permissions: 0
			}).then(r => {
				message.guild.channels.forEach(c => {
					c.overwritePermissions(r , {
						SEND_MESSAGES: false,
						READ_MESSAGE_HISTORY: false,
						ADD_REACTIONS: false,
						SPEAK: false
						});
				});
			});
			} catch(e) {
				console.log(e.stack);
			}

  if(!warns[wUser.id]) warns[wUser.id] = {
    warns: 0
  };

  warns[wUser.id].warns++;


  fs.writeFile("./warnings.json", JSON.stringify(warns), (err) => {
    if (err) console.log(err)
  });

  wUser.send(`**Hyped Communtiy**\n\n\n**• You got a warn**\n\n**• Server:**\n➤ [ ${message.guild.name} ]\n\n**• By:**\n• [ ${message.author.username}#${message.author.discriminator} ]\n\n**• Reason:**\n➤ [ ${reason} ]\n\n**• Warn number:**\n➤[ ${warns[wUser.id].warns} ]\n\n\n**SkyAura**`);

  let warnEmbed = new Discord.RichEmbed()
  .setTitle(':no_entry_sign: **[WARN]**')
  .setThumbnail(client.user.avatarURL)
  .setColor('GRAY')
  .addField('User:', `<@${wUser.id}>`, true)
  .addField('By:', `<@${message.author.id}>`, true)
  .addField('Reason:', `**➤** [ **${reason}** ]`, true)
  .addField('Warn Number:', `**➤** [ **${warns[wUser.id].warns}** ]`, true)
  .setTimestamp()
  .setFooter(`${message.author.username}#${message.author.discriminator}`, message.author.avatarURL)

  let warnchannel = message.guild.channels.find(`name`, "mod-log");
  if(!warnchannel) return;

  warnchannel.send(warnEmbed);

  if(warns[wUser.id].warns == 1){
	  message.channel.send(`<@${wUser.id}>, \`\`Warn Number: ${warns[wUser.id].warns}\`\` ${reason}`);
	  message.delete();
  }

if(warns[wUser.id].warns == 2){
	let mutetime1 = "1h";
    wUser.addRole(muterole);
	message.channel.send(`<@${wUser.id}>, \`\`Warn Number: ${warns[wUser.id].warns}\`\` ${reason} :zipper_mouth:`);
	message.delete();
	wUser.setMute(true);

    setTimeout(function(){
      wUser.removeRole(muterole);
	  wUser.setMute(false);
    }, ms(mutetime1))
  }
    if(warns[wUser.id].warns == 3){
    let mutetime2 = "6h";
    wUser.addRole(muterole);
	wUser.setMute(true);
	message.channel.send(`<@${wUser.id}>, \`\`Warn Number: ${warns[wUser.id].warns}\`\` ${reason} :zipper_mouth:`);
	message.delete();

    setTimeout(function(){
      wUser.removeRole(muterole);
	  wUser.setMute(false);
    }, ms(mutetime2))
  }
    if(warns[wUser.id].warns == 4){
    let mutetime3 = "12h";
    wUser.addRole(muterole);
	wUser.setMute(true);
	message.channel.send(`<@${wUser.id}>, \`\`Warn Number: ${warns[wUser.id].warns}\`\` ${reason} :zipper_mouth:`);
	message.delete();

    setTimeout(function(){
      wUser.removeRole(muterole);
	  wUser.setMute(false);
    }, ms(mutetime3))
  }
    if(warns[wUser.id].warns == 5){
    let mutetime4 = "1d";
    wUser.addRole(muterole.id);
	wUser.setMute(true);
	message.channel.send(`<@${wUser.id}>, \`\`Warn Number: ${warns[wUser.id].warns}\`\` ${reason} :zipper_mouth:`);
	message.delete();

    setTimeout(function(){
      wUser.removeRole(muterole);
	  wUser.setMute(false);
    }, ms(mutetime4))
  }
      if(warns[wUser.id].warns == 6){
    let mutetime5 = "3d";
    wUser.addRole(muterole);
	wUser.setMute(true);
	message.channel.send(`<@${wUser.id}>, \`\`Warn Number: ${warns[wUser.id].warns}\`\` ${reason} :zipper_mouth:`);
	message.delete();

    setTimeout(function(){
      wUser.removeRole(muterole.id);
	  wUser.setMute(false);
    }, ms(mutetime5))
  }
    if(warns[wUser.id].warns == 7){
    message.guild.member(wUser).ban({ days: 1, reason: reason });
	message.channel.send(`<@${wUser.id}>, \`\`Warn Number: ${warns[wUser.id].warns}\`\` ${reason} :airplane:`);
	message.delete();
  }
    if(warns[wUser.id].warns == 8){
    message.guild.member(wUser).ban({ days: 3, reason: reason });
	message.channel.send(`<@${wUser.id}>, \`\`Warn Number: ${warns[wUser.id].warns}\`\` ${reason} :airplane:`);
	message.delete();
  }
    if(warns[wUser.id].warns == 9){
    message.guild.member(wUser).ban({ days: 7, reason: reason });
	message.channel.send(`<@${wUser.id}>, \`\`Warn Number: ${warns[wUser.id].warns}\`\` ${reason} :airplane:`);
	message.delete();
  }
  if(warns[wUser.id].warns == 10){

      message.guild.member(wUser).ban({ reason: reason });
	message.channel.send(`<@${wUser.id}>, \`\`Warn Number: ${warns[wUser.id].warns}\`\` ${reason} :airplane:`);
	message.delete();
  }
}
    if(command == prefix + 'warns') {
		if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.reply('\`\`MANAGE_MESSAGES\`\` **Permission Not found**').then(msg => msg.delete(5000));
		let wUser = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0])
		if(!wUser) return message.channel.send(`**• Useage:** ${prefix}warns \`\`Name\`\``).then(msg => msg.delete(7000));
		if(wUser.hasPermission('ADMINISTRATOR')) return message.reply('**摇 ȡՎՠȏȑ�').then(msg => msg.delete(3000));
		 if(!warns[wUser.id]) warns[wUser.id] = {
            warns: 0
        };
		let warninfo1 = new Discord.RichEmbed()
		.setTitle(':no_entry_sign: **[WARN AMOUNT]**')
		.setThumbnail(client.user.avatarURL)
		.addField('User:', `<@${muf.id}>`, true)
		.addField('Warn Number:', `**➤** [ ${warns[wUser.id].warns} ]`, true)
		.setTimestamp()
		.setFooter(`${message.author.username}#${message.author.discriminator}`, message.author.avatarURL)
		message.channel.send(warninfo1);
		message.delete();
	   }
});
client.login(args[0])

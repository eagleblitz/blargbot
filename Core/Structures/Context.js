const CommandArgs = require('./CommandArgs');

class Context {
  constructor(client, msg, text, prefix) {
    this.client = client;
    this.msg = msg;
    this.text = text;
    this.words = new CommandArgs(client, this.text);
    this.prefix = prefix;
  }

  async checkStaff(userId, catOverrides = true, roles = null, staffPerms = null) {
    let guild;
    if (!userId) userId = this.user.id;
    if (catOverrides && this.client.catOverrides && userId === this.client.Constants.CAT_ID) return true;
    if (userId === this.guild.ownerID) return true;
    let member = this.guild.members.get(userId);
    if (!member) return false;
    if (member.permission.has(this.client.Constants.Permissions.ADMINISTRATOR)) return true;
    if (staffPerms === null || roles === null)
      guild = await this.guild.data.getOrCreateObject();
    if (roles === null)
      roles = await guild.get('staffRoles');
    if (roles && roles.length > 0) {
      for (const role of roles) {
        if (member.roles.includes(role)) return true;
      }
    }
    if (staffPerms === null)
      staffPerms = await guild.get('staffPerms');
    if (staffPerms & member.permission.allow != 0) return true;
    return false;
  }

  async send(content, file) {
    return await this.client.Helpers.Message.send(this, content, file);
  }

  async decode(key, args, nullable) {
    return await this.client.Helpers.Message.decode(this, key, args, nullable);
  }

  async decodeAndSend(key, args, file) {
    return await this.client.Helpers.Message.decodeAndSend(this, key, args, file);
  }

  get channel() {
    return this.msg.channel;
  }

  get user() {
    return this.msg.author;
  }

  get author() {
    return this.msg.author;
  }

  get member() {
    return this.msg.member;
  }

  get guild() {
    return this.msg.guild;
  }

}

module.exports = Context;
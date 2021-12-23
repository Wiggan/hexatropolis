const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'hexatropolis_test.db'
});

async function init() {
    await sequelize.sync({ force: true });
    console.log("All models were synchronized successfully.");

    await add_test_data();
}

class Game extends Model {}
Game.init({
  name: { type: DataTypes.STRING },
  map: { type: DataTypes.JSON }
}, {
  sequelize
});


class Player extends Model {}
Player.init({
  // Model attributes are defined here
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}, {
  // Other model options go here
  sequelize, // We need to pass the connection instance
});

class Participant extends Model { }
Participant.init({
  class: {
    type: DataTypes.STRING
  },
  last_seen_move: {
    type: DataTypes.INTEGER
  }
}, {
  sequelize
});

class Turn extends Model {}
Turn.init({
  index: { type:DataTypes.INTEGER },
  moves: { type: DataTypes.JSON }
}, {
  sequelize
});

Player.hasMany(Participant);
Participant.belongsTo(Player);

Game.hasMany(Participant);
Game.hasOne(Participant, {as: 'currentPlayer'});
Participant.belongsTo(Game);

Game.hasMany(Turn);
Turn.belongsTo(Game);

Turn.hasOne(Participant);
Participant.belongsTo(Turn);

function generate_level(players) {

}

function generate_game_name() {
  const prefixes = ["Wuthering", "Shivering", "Astounding", "Deafening", "Frivolous", "Trifling"];
  const suffixes = ["Heights", "Surroundings", "Steps", "Valleys", "Hills", "Canals"];
  return prefixes[Math.floor(prefixes.length*Math.random())] + " " + suffixes[Math.floor(suffixes.length*Math.random())];
}

async function start_new_game(players) {
  const game_name = generate_game_name();
  var game = await Game.create({ name: game_name});
  players.forEach(async player => {
    await Participant.create({GameId: game.id, PlayerId: player.id});
  });
  await game.setCurrentPlayer(players[Math.floor(players.length*Math.random())]);
  
  console.log("Started new game: " + game_name);
}

async function add_test_data() {
  var joe = await Player.create({name: "Joe", email: "joe@mail.com"});
  var john = await Player.create({name: "John", email: "john@mail.com"});
  var jane = await Player.create({name: "Jane", email: "jane@mail.com"});
  await start_new_game([joe, john, jane]);
  await start_new_game([joe, jane]);
  await start_new_game([john, jane]);
  
  console.log("Added test data");
}

async function get_player(email) {
  return await Player.findOne({ where: { email: email}});
}

async function get_active_games(player) {
  var participants = await player.getParticipants();
  var games = await Promise.all(participants.map(async participant => {
    return await participant.getGame();
  }));
  return games;
}

module.exports = {
    init,
    add_test_data,
    get_player,
    get_active_games,
    sequelize,
    Player,
    Game,
    Turn,
    Participant
}
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const Sendresponse = require('../sendresponse');
const authCheck = require('../middleware/authCheck');
const models = require(__dirname + '/../../models/');
const adminAuthCheck = require('../middleware/adminAuthCheck');

//Sample file for all routes other than /auth/web, /auth/app, /logout/web, /logout/app,

// trust first proxy
app.set('trust proxy', 1);

app.use(
    cookieSession({
        name: 'session',
        keys: ['key1', 'key2']
    })
);

app.use(
    bodyParser.urlencoded({
        extended: false
    })
);

app.use(bodyParser.json());

//Middleware to check for authorization
app.use('/skillandprice', adminAuthCheck);

models.player_detail.belongsTo(models.batting_detail, {foreignKey: 'player_id'});
models.player_detail.belongsTo(models.bowling_detail, {foreignKey: 'player_id'});

let battingAverage = battingAverage => {
    var battingAvg = 0;
    if (!battingAverage) return 0;
    if (battingAverage >= 32) {
        battingAvg = ((battingAverage - 32) * (30 - 28)) / (61 - 32) + 28;
    } else if (battingAverage >= 27) {
        battingAvg = ((battingAverage - 27) * (27 - 24)) / (31 - 27) + 24;
    } else if (battingAverage >= 24) {
        battingAvg = ((battingAverage - 24) * (23 - 20)) / (26 - 24) + 20;
    } else if (battingAverage >= 21) {
        battingAvg = ((battingAverage - 21) * (19 - 16)) / (23 - 21) + 16;
    } else if (battingAverage >= 18) {
        battingAvg = ((battingAverage - 18) * (15 - 12)) / (20 - 18) + 12;
    } else if (battingAverage >= 16) {
        battingAvg = ((battingAverage - 16) * (11 - 9)) / (17 - 16) + 9;
    } else if (battingAverage >= 14) {
        battingAvg = ((battingAverage - 14) * (8 - 5)) / (15 - 14) + 5;
    } else {
        battingAvg = (battingAverage * 4) / 13;
    }
    return battingAvg;
};

let Runs = runs => {
    var runsAvg = 0;
    if (!runs) return 0;
    if (runs >= 1500) {
        runsAvg = ((runs - 1500) * (25 - 21)) / (2100 - 1500) + 21;
    } else if (runs >= 1000) {
        runsAvg = ((runs - 1000) * (20 - 16)) / (1500 - 1000) + 16;
    } else if (runs >= 500) {
        runsAvg = ((runs - 500) * (15 - 11)) / (1000 - 500) + 11;
    } else if (runs >= 250) {
        runsAvg = ((runs - 250) * (10 - 8)) / (500 - 250) + 8;
    } else if (runs >= 170) {
        runsAvg = ((runs - 170) * (7 - 5)) / (250 - 170) + 5;
    } else if (runs >= 125) {
        runsAvg = ((runs - 125) * (4 - 1)) / (170 - 125) + 1;
    }
    return runsAvg;
};

let StrikeRate = strikeRate => {
    if (!strikeRate) return 0;
    var strikeRt = 0;
    if (strikeRate >= 140) {
        strikeRt = ((strikeRate - 140) * (15 - 14)) / (250 - 140) + 14;
    } else if (strikeRate >= 128) {
        strikeRt = ((strikeRate - 128) * (13 - 10)) / (140 - 128) + 10;
    } else if (strikeRate >= 118) {
        strikeRt = ((strikeRate - 118) * (9 - 7)) / (128 - 118) + 7;
    } else if (strikeRate >= 115) {
        strikeRt = ((strikeRate - 115) * (6 - 4)) / (118 - 115) + 4;
    } else if (strikeRate >= 102) {
        strikeRt = ((strikeRate - 102) * (3 - 2)) / (115 - 102) + 2;
    } else {
        strikeRt = ((strikeRate - 0) * (1 - 0)) / (102 - 0) + 0;
    }
    return strikeRt;
};

let Highest = highest => {
    if (!highest) return 0;
    var highestAvg = 0;
    if (highest >= 100) {
        highestAvg = ((highest - 100) * (10 - 9)) / (2100 - 100) + 9;
    } else if (highest >= 75) {
        highestAvg = ((highest - 75) * (8 - 6)) / (1500 - 75) + 6;
    } else if (highest >= 60) {
        highestAvg = ((highest - 60) * (5 - 4)) / (1000 - 60) + 4;
    } else if (highest >= 50) {
        highestAvg = ((highest - 50) * (3 - 2)) / (500 - 50) + 2;
    } else if (highest >= 40) {
        highestAvg = 1;
    }
    return highestAvg;
};

let BallsFaced = ballsFaced => {
    if (!ballsFaced) return 0;
    var ballsFacedAvg = 0;
    if (ballsFaced >= 1000) {
        ballsFacedAvg = ((ballsFaced - 1000) * (10 - 8)) / (1800 - 1000) + 8;
    } else if (ballsFaced >= 600) {
        ballsFacedAvg = ((ballsFaced - 600) * (7 - 6)) / (1000 - 600) + 6;
    } else if (ballsFaced >= 350) {
        ballsFacedAvg = ((ballsFaced - 350) * (5 - 4)) / (600 - 350) + 4;
    } else if (ballsFaced >= 200) {
        ballsFacedAvg = ((ballsFaced - 200) * (3 - 2)) / (350 - 200) + 2;
    } else {
        ballsFacedAvg = ((ballsFaced - 0) * (1 - 0)) / (200 - 0) + 0;
    }
    return ballsFacedAvg;
};

let Hundreds = hundreds => {
    if (!hundreds) return 0;
    var hundredsAvg = 0;
    if (hundreds >= 3) {
        hundredsAvg = 2;
    } else if (hundreds >= 1) {
        hundredsAvg = 1;
    }
    return hundredsAvg;
};

let Sixs = sixs => {
    if (!sixs) return 0;
    var sixsAvg = 0;
    if (sixs >= 50) {
        sixsAvg = 3;
    } else if (sixs >= 25) {
        sixsAvg = 2;
    } else if (sixs >= 10) {
        sixsAvg = 1;
    }
    return sixsAvg;
};

let Fours = fours => {
    var foursAvg = 0;
    if (!fours) return 0;
    if (fours >= 120) {
        foursAvg = 3;
    } else if (fours >= 70) {
        foursAvg = 2;
    } else if (fours >= 20) {
        foursAvg = 1;
    }
    return foursAvg;
};

let Innings = innings => {
    if (!innings) return 0;
    var inningsAvg = 0;
    if (innings >= 40) {
        inningsAvg = 2;
    } else if (innings >= 10) {
        inningsAvg = 1;
    }
    return inningsAvg;
};

let BowlingAvg = bowlingAverage => {
    if (!bowlingAverage) return 0;
    var bowlingAvg = 0;
    if (bowlingAverage >= 32) {
        bowlingAvg = ((bowlingAverage - 32) * (3 - 0)) / (100 - 32) + 0;
    } else if (bowlingAverage >= 26) {
        bowlingAvg = ((bowlingAverage - 26) * (6 - 4)) / (31 - 26) + 4;
    } else if (bowlingAverage >= 24) {
        bowlingAvg = ((bowlingAverage - 24) * (10 - 7)) / (25 - 24) + 7;
    } else if (bowlingAverage >= 21) {
        bowlingAvg = ((bowlingAverage - 21) * (14 - 11)) / (23 - 21) + 11;
    } else if (bowlingAverage >= 19) {
        bowlingAvg = ((bowlingAverage - 19) * (17 - 15)) / (20 - 19) + 15;
    } else if (bowlingAverage >= 17) {
        bowlingAvg = ((bowlingAverage - 17) * (19 - 18)) / (18 - 17) + 18;
    } else if (bowlingAverage >= 1) {
        bowlingAvg = 20;
    }
    return bowlingAvg;
};

let Wickets = wickets => {
    if (!wickets) return 0;
    var wicketsAvg = 0;
    if (wickets >= 40) {
        wicketsAvg = ((wickets - 40) * (35 - 30)) / (94 - 40) + 30;
    } else if (wickets >= 30) {
        wicketsAvg = ((wickets - 30) * (29 - 20)) / (39 - 30) + 20;
    } else if (wickets >= 20) {
        wicketsAvg = ((wickets - 20) * (19 - 15)) / (29 - 20) + 15;
    } else if (wickets >= 13) {
        wicketsAvg = ((wickets - 13) * (14 - 10)) / (19 - 13) + 10;
    } else if (wickets >= 7) {
        wicketsAvg = ((wickets - 7) * (9 - 5)) / (12 - 7) + 5;
    } else {
        wicketsAvg = ((wickets - 0) * (4 - 0)) / (6 - 0) + 0;
    }
    return wicketsAvg;
};

let Economy = economy => {
    var economyAvg = 0;
    if (!economy) return 0;
    if (!economy) return 0;
    if (economy >= 8.8) {
        economyAvg = ((economy - 8.8) * (3 - 0)) / (16 - 8.8) + 0;
    } else if (economy >= 8) {
        economyAvg = ((economy - 8) * (7 - 4)) / (8.8 - 8) + 4;
    } else if (economy >= 7.3) {
        economyAvg = ((economy - 7.3) * (11 - 8)) / (8 - 7.3) + 8;
    } else if (economy >= 6.8) {
        economyAvg = ((economy - 6.8) * (15 - 12)) / (7.3 - 6.8) + 12;
    } else if (economy >= 6.5) {
        economyAvg = ((economy - 6.5) * (18 - 16)) / (6.8 - 6.5) + 16;
    } else if (economy >= 2.25) {
        economyAvg = ((economy - 2.25) * (20 - 19)) / (6.25 - 2.25) + 19;
    }
    return economyAvg;
};

let BallsBowled = ballsBowled => {
    if (!ballsBowled) return 0;
    var ballsBowledAvg = 0;
    if (ballsBowled >= 700) {
        ballsBowledAvg = ((ballsBowled - 700) * (10 - 9)) / (1600 - 700) + 9;
    } else if (ballsBowled >= 500) {
        ballsBowledAvg = ((ballsBowled - 500) * (8 - 6)) / (700 - 500) + 6;
    } else if (ballsBowled >= 360) {
        ballsBowledAvg = ((ballsBowled - 360) * (5 - 4)) / (500 - 360) + 4;
    } else if (ballsBowled >= 180) {
        ballsBowledAvg = ((ballsBowled - 180) * (3 - 2)) / (360 - 180) + 2;
    } else {
        ballsBowledAvg = ((ballsBowled - 0) * (1 - 0)) / (180 - 0) + 0;
    }
    return ballsBowledAvg;
};

let BestFigure = bestFigure => {
    if (!bestFigure) return 0;
    var maxWicketsAvg = 0;
    var maxWickets = bestFigure.split('/')[0];
    maxWickets = Number(maxWickets);

    if (maxWickets >= 5) {
        maxWicketsAvg = ((maxWickets - 5) * (10 - 9)) / (6 - 5) + 9;
    } else if (maxWickets >= 4) {
        maxWicketsAvg = 8;
    } else if (maxWickets >= 3) {
        maxWicketsAvg = 6;
    } else if (maxWickets >= 2) {
        maxWicketsAvg = 4;
    } else if (maxWickets >= 1) {
        maxWicketsAvg = 1;
    }
    return maxWicketsAvg;
};

let BowlingStrikeRate = strikeRate => {
    if (!strikeRate) return 0;
    var strikeRateAvg = 0;
    if (strikeRate >= 21) {
        strikeRateAvg = 0;
    } else if (strikeRate >= 18) {
        strikeRateAvg = 1;
    } else if (strikeRate >= 15) {
        strikeRateAvg = 2;
    } else if (strikeRateAvg >= 2) {
        strikeRateAvg = 3;
    }
    return strikeRateAvg;
};

let BowlingInnings = innings => {
    if (!innings) return 0;
    var inningsAvg = 0;
    if (innings >= 30) {
        inningsAvg = 2;
    } else if (innings >= 15) {
        inningsAvg = 1;
    }
    return inningsAvg;
};

let BasePrice = price => {
    if (!price) return 0;
    if (price >= 1000000) return 20000000;
    else if (price >= 800000) return 15000000;
    else if (price >= 600000) return 10000000;
    else if (price >= 450000) return 7500000;
    else if (price >= 300000) return 5000000;
    else if (price >= 150000) return 3000000;
    else return 2000000;
};

let calculate = player => {
    var maxBattingInnings = 101.0;
    var maxBowlingInnings = 71.0;
    var maxAggression = 104;
    var minBallsFaced = 300;
    var minBallsBowled = 200;
    var inningsSkillReductionFactor = 1.0;

    var battingSkill, bowlingSkill, fieldingSkill, price;
    var aggression = 0;
    var batting = player.batting_detail;
    var bowling = player.bowling_detail;

    var battingAvg = battingAverage(batting.batting_average);
    var runs = Runs(batting.runs);
    var strikeRate = StrikeRate(batting.strike_rate);
    var highest = Highest(batting.highest);
    var ballsFaced = BallsFaced(batting.balls_faced);
    var hundreds = Hundreds(batting.hundreds);
    var fours = Fours(batting.fours);
    var sixs = Sixs(batting.sixes);
    var innings = Innings(batting.innings);

    battingSkill = battingAvg + runs + strikeRate + highest + ballsFaced + hundreds + fours + sixs + innings;

    battingSkill = Math.floor(battingSkill);

    var bowlingAvg = BowlingAvg(bowling.bowling_average);
    var economy = Economy(bowling.economy);
    var wickets = Wickets(bowling.wickets_taken);
    var ballsBowled = BallsBowled(bowling.balls_bowled);
    var bowlingInnings = BowlingInnings(bowling.innings);
    var bowlingStrikeRate = BowlingStrikeRate(bowling.bowling_strike_rate);
    var bestFigure = BestFigure(bowling.best_bowling_figure);

    var bowlingSkill = bowlingAvg + economy + wickets + ballsBowled + bowlingInnings + bowlingStrikeRate + bestFigure;

    var bowlingSkill = Math.floor(bowlingSkill);

    var fieldingSkill = Math.floor(bowling.catches + bowling.stumpings) / 2;

    if (player.player_type == 'Batsman' || player.player_type == 'Wicketkeeper' || player.player_type == 'Allrounder') {
        aggression = (batting.strike_rate / 200) * 80;

        if (player.player_id == 142) console.log('RG', aggression);

        var normalisedAggression = aggression * (1 + batting.innings / maxBattingInnings);
        if (player.player_id == 142) console.log(normalisedAggression);

        if (normalisedAggression > maxAggression || batting.balls_faced < minBallsFaced) {
            aggression = (aggression * batting.innings) / (maxBattingInnings * inningsSkillReductionFactor);
            if (player.player_id == 142) console.log('1st block', aggression);
        } else {
            aggression = aggression * (1 + batting.innings / maxBattingInnings);
            if (player.player_id == 142) console.log('2nd block', aggression);
        }
    } else {
        if (bowling.bowling_strike_rate != 0) {
            aggression = Math.floor((1 / bowling.bowling_strike_rate) * 500);

            var normalisedAggression = aggression * (1 + batting.innings / maxBattingInnings);

            if (normalisedAggression > maxAggression || bowling.balls_bowled < minBallsBowled) {
                aggression = (aggression * bowling.innings) / (maxBowlingInnings * inningsSkillReductionFactor);
            } else {
                aggression = aggression * (1 + bowling.innings / maxBowlingInnings);
            }
        }
    }

    if (player.player_type == 'Batsman' || player.player_type == 'Wicketkeeper') {
        price = battingSkill * 10000 + fieldingSkill * 2500 + bowlingSkill * 2500;
    } else if (player.player_type == 'Allrounder') {
        price = battingSkill * 7500 + bowlingSkill * 5000 + fieldingSkill * 2500;
    } else {
        price = bowlingSkill * 9500 + fieldingSkill * 2500 + battingSkill * 3000;
    }
    price = price * 1.25;

    var updatedPlayer = Object.assign(
        {},
        {
            player_id: player.player_id,
            player_name: player.player_name,
            player_country: player.player_country,
            player_type: player.player_type,
            player_age: player.player_age,
            player_aggression: aggression,
            player_price: BasePrice(price),
            skill_level_batting: battingSkill,
            skill_level_bowling: bowlingSkill,
            skill_level_fielding: fieldingSkill,
            image_url: player.image_url
        }
    );
    return updatedPlayer;
};

//routes
app.post('/skillandprice', function(req, res) {
    try {
        let status_code;
        let message;
        let allPlayers;

        models.player_detail
            .findAll({
                include: [{model: models.batting_detail}, {model: models.bowling_detail}],
                logging: false
            })
            .then(players => {
                let updatedPlayers = [];
                players.forEach(player => {
                    updatedPlayers.push(calculate(player));
                });
                calculate(players[0]);
                models.player_detail
                    .bulkCreate(updatedPlayers, {updateOnDuplicate: true, logging: false})
                    .then(function() {
                        status_code = 200;
                        message = 'skill and price updated';
                        Sendresponse(res, status_code, message);
                    });
            });
    } catch (err) {
        status_code = 500;
        message = err.message;
        Sendresponse(res, status_code, message);
    }
});

module.exports = app;

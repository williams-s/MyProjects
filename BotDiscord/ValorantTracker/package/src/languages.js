const fs = require('fs');
const yaml = require('js-yaml');
let configUrl = null
try {
    let config2 = yaml.load(fs.readFileSync('../config/config.yaml', 'utf8'));
    configUrl = config2.urls;
  } catch (error) {
    console.error(error);
  }
let langUrl = configUrl.language;


let initTitle, initDescription, initSameChannel ,initError;
let addPlayerTitle, addPlayerDescription, addPlayerError;
let removePlayerTitle, removePlayerDescription, removePlayerError;
let leaderboardTitle, leaderboardError;
let unbindTitle, unbindDescription, unbindError;
let victoryYaml, drawYaml, defeatYaml;
let positiveYaml, negativeYaml, neutralYaml;
let combatScoreYaml, actualRankYaml;
let dailySummarySubtitleYaml;
let lastGame;
let errorTitle,wrongChannel,goodChannel;
let nameAndTag;
let helpTitle, helpInit, helpAddPlayer, helpRemovePlayer, helpLeaderboard, helpFr, helpEn, helpEs, helpDe, helpProfile, helpAllcommands, helpAllcommandsInChannel;
let helpDescription,allcommandsDescription,allcommandsTitle;
/* setLang("French");
 */
async function setLang(language) {
    let tmpBody = null;
    if (language === "French") {
        tmpBody = JSON.stringify({
            lang: language
        });
    } else {
        tmpBody = JSON.stringify({
            target: language
        });
    }

    //console.log(tmpBody);
    try {
        const response = await fetch(langUrl, {
            method: "POST",
            body: tmpBody,
            headers: {
                "Content-Type": "application/json"
            }
        });
        const data = await response.json();
        
        let commandsText = data.commandsMessages;
        let initText = commandsText.init;

        initTitle = initText.title;
        initDescription = initText.description;
        initSameChannel = initText.sameChannel;
        initError = initText.error;

        let addPlayerText = commandsText.addPlayer;

        addPlayerTitle = addPlayerText.title;
        addPlayerDescription = addPlayerText.description;
        addPlayerError = addPlayerText.error;

        let removePlayerText = commandsText.removePlayer;

        removePlayerTitle = removePlayerText.title;
        removePlayerDescription = removePlayerText.description;
        removePlayerError = removePlayerText.error;

        leaderboardTitle = commandsText.leaderboard.title;
        leaderboardError = commandsText.leaderboard.error;

        let unbindText = commandsText.unbind;

        unbindTitle = unbindText.title;
        unbindDescription = unbindText.description;
        unbindError = unbindText.error;
        

        let resultText = data.result;

        victoryYaml = resultText.victory;
        drawYaml = resultText.draw;
        defeatYaml = resultText.defeat;

        let verbForResultYaml = resultText.verbForResult;

        positiveYaml = verbForResultYaml.positive;
        negativeYaml = verbForResultYaml.negative;
        neutralYaml = verbForResultYaml.neutral;

        combatScoreYaml = resultText.combatScore;
        actualRankYaml = resultText.actualRank;

        dailySummarySubtitleYaml = data.dailySummary.subTitle;
        
        lastGame = data.lastGame.title;
        let errorData = data.error;
        errorTitle = errorData.title;
        wrongChannel = errorData.wrongChannel;
        goodChannel = errorData.goodChannel;

        let help= data.help;
        let nameAndTag = help.nameAndTag;
        helpTitle = help.title;
        helpInit = " - " + help.init + " /init, " + help.initBis + " /init " + help.initBisbis;
        helpAddPlayer = `- ${help.addPlayer} /add-player ${nameAndTag}`;
        helpRemovePlayer = `- ${help.removePlayer} /remove-player ${nameAndTag}`;
        helpLeaderboard = `- ${help.leaderboard} /leaderboard`;
        helpFr = `- ${help.fr} /fr`;
        helpEn = `- ${help.en} /en`;
        helpEs = `- ${help.es} /es`;
        helpDe = `- ${help.de} /de`;
        helpProfile = `- ${help.profile} /profile ${nameAndTag}`;
        helpAllcommands = `- ${help.allcommands} /allcommands`;
        helpAllcommandsInChannel = " - " + help.allcommandsInChannel;
        allcommandsTitle = help.allcommandsTitle;
        helpDescription = helpInit + "\n\n" + helpAddPlayer + "\n\n" + helpRemovePlayer + "\n\n" + helpLeaderboard + "\n\n" + helpProfile + "\n\n" + helpFr + "\n\n" + helpEn + "\n\n" + helpEs + "\n\n" + helpDe + "\n\n" + helpAllcommands + "\n\n" + helpAllcommandsInChannel;
        allcommandsDescription = `- /init \n- /add-player ${nameAndTag} \n- /remove-player ${nameAndTag} \n- /leaderboard \n- /profile ${nameAndTag} \n- /fr \n- /en \n- /es \n- /de \n`;
    } catch (error) {
        console.error("Error:", error);
    }
}

async function initialize(lang) {
    await setLang(lang);
    return {
        setLang,
        initTitle, initDescription, initSameChannel,initError,
        addPlayerTitle, addPlayerDescription, addPlayerError,
        removePlayerTitle, removePlayerDescription, removePlayerError,
        unbindTitle, unbindDescription, unbindError,
        leaderboardTitle,leaderboardError,
        victoryYaml, drawYaml, defeatYaml,
        positiveYaml, negativeYaml, neutralYaml,
        combatScoreYaml, actualRankYaml,
        dailySummarySubtitleYaml,
        lastGame,
        errorTitle,wrongChannel,goodChannel,
        helpTitle,helpInit,helpAddPlayer,helpRemovePlayer,helpLeaderboard,helpProfile,helpFr,helpEn,helpEs,helpDe,helpAllcommands,helpAllcommandsInChannel,helpDescription,
        allcommandsDescription,allcommandsTitle
    };
}

module.exports = initialize;
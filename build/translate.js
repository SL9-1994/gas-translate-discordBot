"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const discord_js_1 = require("discord.js");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const client = new discord_js_1.Client({
    //インテントを設定してクライアントを定義する
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent,
        discord_js_1.GatewayIntentBits.GuildMembers,
    ],
    partials: [discord_js_1.Partials.Message, discord_js_1.Partials.Channel],
});
// クライアントが起動したタイミングで1回だけ実行される
client.once("ready", () => {
    console.log("Ready!");
    if (client.user) {
        console.log(client.user.tag);
    }
});
//起動したときに最初に走る処理
client.on("messageCreate", (message) => __awaiter(void 0, void 0, void 0, function* () {
    if (message.author.bot)
        return;
    const content = message.content;
    // !tと入力することで以降の文字が翻訳対象になる
    if (content.startsWith("!t")) {
        const textToTranslate = content.slice("!t".length).trim();
        const translateText = textToTranslate.slice(5);
        console.log(translateText);
        // sourceとtargetを切り抜く
        const textToTranslate2 = content;
        const greaterIndex = textToTranslate2.indexOf(">");
        const slicedTextBefore = textToTranslate2.slice(greaterIndex - 2, greaterIndex);
        const slicedTextAfter = textToTranslate2.slice(greaterIndex + 1, greaterIndex + 3);
        // 必ず何か入力されいる、かつ150文字以内の場合
        if (translateText.length > 0 && translateText.length <= 150) {
            // GoogleAppScriptの翻訳APIを叩く
            const url = process.env.URL;
            const params = {
                text: translateText,
                source: slicedTextBefore,
                target: slicedTextAfter,
            };
            axios_1.default
                .get(url, { params })
                .then((response) => {
                // レスポンスデータを処理する
                console.log(response.data);
                message.channel.send(response.data.text);
            })
                .catch((error) => {
                // エラー処理
                console.error("Error:", error);
                message.channel.send(error);
            });
        }
        else {
            console.log("150文字以内ではない。 又は何もテキストが入力されていません。");
            message.channel.send("ERROR: 150文字以内ではない。 又は何もテキストが入力されていません。");
        }
    }
}));
// TOKENでdiscordと接続
client.login(process.env.TOKEN);

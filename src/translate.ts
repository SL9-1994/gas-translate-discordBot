import axios from "axios";
import { Client, GatewayIntentBits, Message, Partials } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

const client: any = new Client({
  //インテントを設定してクライアントを定義する
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
  partials: [Partials.Message, Partials.Channel],
});

// クライアントが起動したタイミングで1回だけ実行される
client.once("ready", () => {
  console.log("Ready!");
  if (client.user) {
    console.log(client.user.tag);
  }
});

//起動したときに最初に走る処理
client.on("messageCreate", async (message: Message) => {
  if (message.author.bot) return;

  const content = message.content;
  // !tと入力することで以降の文字が翻訳対象になる
  if (content.startsWith("!t")) {
    const textToTranslate: string = content.slice("!t".length).trim();
    const translateText: string = textToTranslate.slice(5);
    console.log(translateText);

    // sourceとtargetを切り抜く
    const symbol = content.indexOf(">");
    const slicedTextBefore: string = content.slice(symbol - 2, symbol);
    const slicedTextAfter = content.slice(symbol + 1, symbol + 3);

    // 必ず何か入力されいる状態、かつ150文字以内の場合
    if (translateText.length > 0 && translateText.length <= 150) {
      // GoogleAppScriptの翻訳APIを叩く
      const url: string | undefined = process.env.URL;
      const params = {
        text: translateText,
        source: slicedTextBefore,
        target: slicedTextAfter,
      };

      axios
        .get(url!, { params })
        .then((response) => {
          // レスポンスデータ処理
          message.channel.send(response.data.text);
        })
        .catch((error) => {
          // エラー処理
          message.channel.send(error);
        });
    } else {
      message.channel.send(
        "ERROR: 150文字以内ではない。 又は何もテキストが入力されていません。"
      );
    }
  }
});

// TOKENでdiscordと接続
client.login(process.env.TOKEN);

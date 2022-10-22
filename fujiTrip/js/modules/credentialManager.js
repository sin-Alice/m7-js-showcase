// import ---
import esriId from "https://js.arcgis.com/4.24/@arcgis/core/identity/IdentityManager.js";
import ServerInfo from "https://js.arcgis.com/4.24/@arcgis/core/identity/ServerInfo.js";

// ----------

const serverInfo = new ServerInfo({
  server:"https://www.arcgis.com",
  tokenServiceUrl:"https://www.arcgis.com/sharing/generateToken"
});

const userInfo = {
  username:"<ユーザー名>",
  password:"<パスワード>"
};

esriId.generateToken(serverInfo,userInfo)
  .then( tokenInfos => {
    console.log(tokenInfos);

    esriId.registerToken({
      expires:tokenInfos.expires,
      server:serverInfo.server,
      ssl:tokenInfos.ssl,
      token:tokenInfos.token,
      userId:userInfo.username
    })

  });
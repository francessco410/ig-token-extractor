#!/usr/bin/env node

const axios = require('axios');
const querystring = require('querystring');
const prompts = require('prompts');
const fs = require('fs');
const cachePath = './cache.txt';

const _getLongLivedToken = async (code, clientId, clientSecret, redirectUri) => {
    const _getShortLivedToken = async (code) => {
        const res = await axios.post('https://api.instagram.com/oauth/access_token', querystring.stringify({
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: 'authorization_code',
            redirect_uri: redirectUri,
            code,
        }));
        return res.data.access_token;
    };

    const shortLivedToken = await _getShortLivedToken(code);
    const res = await axios.get('https://graph.instagram.com/access_token', {
        params: {
            client_secret: clientSecret,
            grant_type: 'ig_exchange_token',
            access_token: shortLivedToken,
        },
    });
    return res.data.access_token;
};

(async () => {
    fs.closeSync(fs.openSync(cachePath, 'a'));

    let localCache = fs.readFileSync(cachePath, {encoding: 'utf8'});

    try {
        localCache = JSON.parse(localCache);
    } catch (e) {
        localCache = {};
    }

    const userQuestions = [
        {
            type: 'text',
            name: 'clientSecret',
            message: 'Instagram client secret:',
            ...localCache.clientSecret && {initial: localCache.clientSecret}
        },
        {
            type: 'text',
            name: 'clientId',
            message: 'Instagram client id:',
            ...localCache.clientId && {initial: localCache.clientId}
        },
        {
            type: 'text',
            name: 'redirectUri',
            message: 'Instagram app redirect URI:',
            ...localCache.redirectUri && {initial: localCache.redirectUri}
        },
    ];
    const userInput = await prompts(userQuestions);

    fs.writeFileSync(cachePath, JSON.stringify(userInput));

    const codeUrl = `https://www.instagram.com/oauth/authorize?client_id=${userInput.clientId}&redirect_uri=${userInput.redirectUri}&scope=user_profile,user_media&response_type=code`;

    const codeUserInput = await prompts({
        type: 'text',
        name: 'code',
        message: `Visit:\n\n> ${codeUrl}\n\nand obtain an Instagram code from query param`,
    });

    const token = await _getLongLivedToken(codeUserInput.code, userInput.clientId, userInput.clientSecret, userInput.redirectUri);
    console.log(`Your instagram long-lived token is:\n${token}`);
})();

const redisconnection = require('../config/redis.connection');
const { getUrlUsingShortened } = require('../service/url.service');

//Get main url using sort url
exports.getMainURL = async (req, res) => {
    const client = await redisconnection.redisConnection();
    const { shortenedurl } = req.params;

    const cached = await client?.get(`url-${shortenedurl}`);
    if (cached) {
        console.log("URL using from cache : ");
        const data = JSON.parse(cached);
        return res.redirect(`${data}`);
    }

    const isExist = await getUrlUsingShortened({ shortenedurl });
    if (!isExist) {
        return res.redirect(`${process.env.CLIENT_URL}/not-found`);
    }

    let existFinal = false;
    for (let it = 0; it < isExist.userIDs.length; it++) {
        if (isExist?.userIDs[it]?.shortenedurl === shortenedurl) {
            const date = Date.now();
            if (isExist?.userIDs[it]?.expiresIn >= date) {
                client.set(`url-${shortenedurl}`, JSON.stringify(isExist.originalUrl), {
                    EX: 60,
                    NX: true
                });
                existFinal = true
                break;
            }
            else if (isExist?.userIDs[it]?.expiresIn < date) {
                console.log("URL expires")
                existFinal = false;
                break;
            }
        } else {
            continue;
        }
    }

    if (!existFinal) {
        console.log("URL not found");
        return res.redirect(`${process.env.CLIENT_URL}/not-found`);
    }
    return res.redirect(`${isExist.originalUrl}`);
}

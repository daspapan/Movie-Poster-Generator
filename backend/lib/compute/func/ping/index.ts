
exports.handler = async() => {

    console.log("===============[PING]==================")
    
    console.log("Environment...", JSON.stringify(process.env, null, 2))

    const date = new Date();
    
    try {

        return `PONG from ${process.env.APP_NAME} at ${date.toISOString()}`

    } catch (error) {

        throw error

    }

}
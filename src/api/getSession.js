function generateTimestampAndRandomString(krandom) {
    // Get the current timestamp in seconds
    const tstamp = Math.floor(Date.now() / 1000).toString();

    // Generate a random string of uppercase letters and digits
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let rchars = '';
    for (let i = 0; i < krandom; i++) {
        rchars += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return { tstamp, rchars };
}

export default generateTimestampAndRandomString;
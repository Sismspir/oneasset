function extractPage(filePath) {
    if (filePath != null) {
        const match = filePath.match(/[^/\\]+$/);
        console.log(match);
        // If a match is found, return it, otherwise return an empty string
        return match ? match[0] : "";
    }
    return "";
}

export default extractPage;

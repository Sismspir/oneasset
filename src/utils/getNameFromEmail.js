function capitalizeName(email) {
    const regex = /^(.*?)(?:\.)(.*?)@/; // Matches the name parts before @
    const match = email.match(regex);
    if (match) {
        const firstName = match[1].charAt(0).toUpperCase() + match[1].slice(1); // Capitalize first part
        const lastName = match[2].charAt(0).toUpperCase() + match[2].slice(1); // Capitalize second part
        return `${firstName} ${lastName}`; // Return full name
    }
    return null; // Return null if no match is found
}

export default capitalizeName;
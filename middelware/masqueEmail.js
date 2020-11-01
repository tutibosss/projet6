module.exports =  (string) => {
    let emailArray = string.split('@').reverse();
    for(let i= 0; i<emailArray.length; i++){
        emailArray[i] = emailArray[i].split('').reverse().join('');
    }
    emailArray = emailArray.join('arobase');
    emailArray = emailArray.split('');
    
    for(let i = 0; i<emailArray.length; i++){
        emailArray[i] = emailArray[i].charCodeAt();
        emailArray[i] = emailArray[i] + 7 - i;
        emailArray[i] = String.fromCharCode(emailArray[i]);
    }
    let resultat = Buffer.from(emailArray.join(''), 'utf-8');
    resultat = resultat.toString('base64')
    return resultat
} 
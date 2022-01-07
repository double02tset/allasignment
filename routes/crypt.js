const crypto = require('crypto');
require('dotenv').config({path: __dirname + '/../.env'})
const algorithm = process.env.ALGORITHM;
const privatekey = process.env.PRIVATEKEY;
const iv = crypto.randomBytes(16);

function crypt(pass,ed){
    if(ed == 'encrypt'){
        let cipher = crypto.createCipheriv(algorithm, privatekey, iv);  
        const encrypted = Buffer.concat([cipher.update(pass), cipher.final()]);
        return {
            'iv': iv.toString('hex'),
            'content': encrypted.toString('hex')
        };
    }else if(ed == "decrypt"){
        const decipher = crypto.createDecipheriv(algorithm, privatekey, Buffer.from(pass.iv, 'hex'));
        const decrpyted = Buffer.concat([decipher.update(Buffer.from(pass.content, 'hex')), decipher.final()]);
        return decrpyted.toString();
    }
}

module.exports = {crypt,privatekey}
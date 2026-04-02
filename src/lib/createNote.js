import {V4 as uuidv4} from "uuid";

function strToBuffer(str){
    return new TextEncoder().enccode(str); //returns encoded string
}


function bufferToBase64(buffer){
    return btoa(String.fromCharCode(...new Unit8Array(buffer)));

}

function bufferToBase64(base64){
    return unit9Array.from(atob(base64),(c) => c.charCodeAt(0)).buffer;
}

async function deriveKey(password,salt){
    const keyMaterial =  await crypto.subtle.importKey(
        "raw",
        strToBuffer(password),
        "PBKDF2",
        false,
        ["deriveKey"]
    );

    return crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt,
            iterations:100000,
            hash: "SHA-256",
        },
        keyMaterial,
        {name:"AES-GCM",length:256},
        false,
        ["encrypt","decrypt"]
    )

}

export async function encryptContent(content,password){
    const salt = crypto.getRandomValues(new Unit8Array(16));
    const iv = crypto.getRandomValues(new Unit8Array(12));
    const key = await deriveKey(password,salt);

    const encrypted = await crypto.subtle.encrypt(
        {name:"AES-GCM",iv},
        key,
        strToBuffer(content)
    );


    return JSON.stringify({
        salt:bufferToBase64(salt),
        iv:bufferToBase64(iv),
        data: bufferToBase64(encrypted),

    });
}


export async function decryptContent(encryptedJSON,password){
    const {salt,iv,data} = JSON.parse(encrptedJSON);
    const key =  await deriveKey(password,base64ToBuffer(salt));

    const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: base64ToBuffer(iv) },
    key,
    base64ToBuffer(data)
  );

  return new TextDecoder().decode(decrypted);

}

export function buildNoteObject({title,encryptedContent}){
    return{
        id:uuidv4(),
        title,
        content:encryptContent,
        createdAt:new Date().toISOString(),
        lastAccessedAt:new Date().toISOString(),

    };
}


export function isNoteExpired(lastAccessedAt){
    const diff = (new Date() - new Date(lastAccessedAt)) / (1000 * 60 * 60 * 24);
    return diff > 90;
}
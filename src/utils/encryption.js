import crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const key = crypto.scryptSync(process.env.ENCRYPTION_KEY, 'salt', 32);

export const encrypt = (text) => {
    if (!text) return text;
    
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    
    let encrypted = cipher.update(text.toString(), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return {
        iv: iv.toString('hex'),
        encryptedData: encrypted
    };
};

export const decrypt = (encryptedData, iv) => {
    if (!encryptedData || !iv) return encryptedData;
    
    const decipher = crypto.createDecipheriv(
        algorithm, 
        key, 
        Buffer.from(iv, 'hex')
    );
    
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
};

// For sensitive task fields
export const encryptTaskFields = (task) => {
    if (!task) return task;
    
    const sensitiveFields = ['title', 'description'];
    const encryptedTask = { ...task };
    
    sensitiveFields.forEach(field => {
        if (task[field]) {
            const encrypted = encrypt(task[field]);
            encryptedTask[field] = JSON.stringify(encrypted);
        }
    });
    
    return encryptedTask;
};

export const decryptTaskFields = (task) => {
    if (!task) return task;
    
    const sensitiveFields = ['title', 'description'];
    const decryptedTask = { ...task };
    
    sensitiveFields.forEach(field => {
        if (task[field] && typeof task[field] === 'string') {
            try {
                const encryptedObj = JSON.parse(task[field]);
                if (encryptedObj.iv && encryptedObj.encryptedData) {
                    decryptedTask[field] = decrypt(encryptedObj.encryptedData, encryptedObj.iv);
                }
            } catch (e) {
                // Not encrypted, keep as is
                decryptedTask[field] = task[field];
            }
        }
    });
    
    return decryptedTask;
};
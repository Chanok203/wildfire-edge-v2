import fs from "fs/promises";

export const writeBase64ToFile = async (imageBase64: string, savePath: string) => {
    try {
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, 'base64');
        await fs.writeFile(savePath, buffer);        
    } catch (error) {
        console.error("[writeBase64ToFile] Error:", error);
        throw error; 
    }
}
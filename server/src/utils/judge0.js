import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const getJudge0LanguageId = async (language) => {
    try {
        console.log("JUDGE0_BASE_URL:", process.env.JUDGE0_BASE_URL);
        const { data } = await axios.get(
            `${process.env.JUDGE0_BASE_URL}/languages?base64_encoded=false`
        );

        // Find language whose name includes the given `language`
        const lang = data.find((lang) =>
            lang.name.toLowerCase().includes(language.toLowerCase())
        );

        if (!lang) {
            throw new Error(`Language ${language} not found in Judge0`);
        }
        return lang.id;
    } catch (error) {
        console.log("Error getting language ID:", error.message);
        return null;
    }
};
const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

export const submitBatch = async (submissions) => {
    const {data} = await axios.post(
        `${process.env.JUDGE0_BASE_URL}/submissions/batch?base64_encoded=false`,{
            submissions
        }
    )
    console.log("Submission Results: ", data);
    return data
}

export const pollBatchResults = async (tokens) => {
    while(true){
        const {data} = await axios.get(`${process.env.JUDGE0_BASE_URL}/submissions/batch`,{
            params:{
                tokens: tokens.join(","),
                base64_encoded:false,
            }
        })
        const results = data.submissions

        const isAllDone = results.every(
            (result)=> result.status.id !==1 && result.status.id !=2
        )

        if(isAllDone) return results
        await sleep(1000)
    }
}
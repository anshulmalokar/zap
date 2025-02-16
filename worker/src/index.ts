import { MailManager } from "./manager/MailManager";
import KafkaService from "./services/KafkaService";
import dotenv from "dotenv";
dotenv.config();

async function main(){
    console.log("Worker Process Started");
    try{
       await KafkaService.getInstance().subscribe("ZAP_PUBLISH_MESSAGE",(val) => {
            console.log(val);
       }); 
    }catch(e){
        console.log(e);
    }
}

main();
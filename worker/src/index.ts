import KafkaService from "./services/KafkaService";


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
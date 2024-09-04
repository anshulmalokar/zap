import { IHeaders } from "kafkajs";
import prisma from "./db";
import KafkaService from "./service/KafkaService";

const TOPIC_NAME = "ZAP_PUBLISH";

async function main() {
  console.log("Starting the Processor");
  while (1) {
    const all_data: {
      id: string;
      zapRunId: string;
    }[] = await prisma.zapRunOutBox.findMany({});
    
    await Promise.all(all_data.map(data => {
      const message:{
        key?: Buffer | string | null;
        value: Buffer | string | null;
        partition?: number;
        headers?: IHeaders;
        timestamp?: string;
      } = {
        value: data.zapRunId
      }
      KafkaService.getInstance().publish(TOPIC_NAME,message);
    }))

    await Promise.all(all_data.map(async (data) => {
      await prisma.zapRunOutBox.delete({
        where: {
          id: data.id,
        }
      })
    }));

  }
}

main();

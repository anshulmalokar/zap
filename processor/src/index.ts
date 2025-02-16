import { IHeaders } from "kafkajs";
import prisma from "./db";
import KafkaService from "./service/KafkaService";
import { JsonValue } from "@prisma/client/runtime/library";
import { Zap } from "@prisma/client";

const TOPIC_NAME = "ZAP_PUBLISH_MESSAGE";

async function main() {
  console.log("Starting the Processor");
  while (1) {
    const all_data: {
      id: string;
      zapRunId: string;
      metaData: JsonValue
    }[] = await prisma.zapRunOutBox.findMany({
      take: 10
    });
    
    await Promise.all(all_data.map(async (data) => {
      const zapObject: Zap | null = await prisma.zap.findFirst({
        where: {
          id: data.id,
        },
      });
      if(zapObject){
        const message:{
          key?: Buffer | string | null;
          value: Buffer | string | null;
          partition?: number;
          headers?: IHeaders;
          timestamp?: string;
        } = {
          value: JSON.stringify({
            zap: zapObject,
            metaData: data.metaData
          })
        }
        KafkaService.getInstance().publish(TOPIC_NAME,message);
      }
    }));

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

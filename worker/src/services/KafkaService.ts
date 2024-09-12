import {
    Consumer,
    IHeaders,
    Kafka,
    Producer,
    KafkaConfig,
    Message,
    KafkaMessage,
  } from "kafkajs";
  
  class KafkaService {
    private static _instance: KafkaService;
    private kafka_producer: Producer;
    private kafka_consumer: Consumer;
    private kafka;
    private constructor() {
      const config: KafkaConfig = {
        clientId: "my-app",
        brokers: ["localhost:29092"],
      };
      this.kafka = new Kafka(config);
      this.kafka_producer = this.kafka.producer();
      this.kafka_consumer = this.kafka.consumer({ groupId: "worker-consumer-group" });
    }
    public static getInstance(): KafkaService {
      if (!KafkaService._instance) {
        this._instance = new KafkaService();
        return this._instance;
      }
      return this._instance;
    }
  
    public async subscribe(topic: string, callback: (value: string) => void) {
      try {
        let curr_partition = "";
        await this.kafka_consumer.connect();
        await this.kafka_consumer.subscribe({
          topic: topic,
          fromBeginning: true
        });
        await this.kafka_consumer.run({
          autoCommit: false
          ,eachMessage: async ({
            topic,
            partition,
            message,
          }: {
            topic: string;
            partition: any;
            message: KafkaMessage;
          }) => {
            curr_partition = partition;
            const value = message.value?.toString();
            callback(value as string);
            await this.kafka_consumer.commitOffsets([
              {
                topic: topic,
                partition: partition,
                offset: (parseInt(message.offset) + 1).toString()
              }
            ])
          },
        });
      } catch (error) {
        throw new Error("");
        console.log(error);
      }
    }
  }
  
  export default KafkaService;
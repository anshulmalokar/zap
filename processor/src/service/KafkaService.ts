import {
  Consumer,
  IHeaders,
  Kafka,
  Producer,
  KafkaConfig,
  Message,
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
    this.kafka_consumer = this.kafka.consumer({ groupId: "youtube-uploader" });
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
      await this.kafka_consumer.connect();
      await this.kafka_consumer.subscribe({
        topic: topic,
        fromBeginning: true,
      });
      await this.kafka_consumer.run({
        eachMessage: async ({
          topic,
          partition,
          message,
        }: {
          topic: string;
          partition: any;
          message: Message;
        }) => {
          const value = message.value?.toString();
          callback(value as string);
        },
      });
    } catch (error) {
      throw new Error("");
      console.log(error);
    }
  }

  public async publish(
    topic: string,
    message: {
      key?: Buffer | string | null;
      value: Buffer | string | null;
      partition?: number;
      headers?: IHeaders;
      timestamp?: string;
    }
  ) {
    try {
      await this.kafka_producer.connect();
      this.kafka_producer.send({
        topic: topic,
        messages: [message],
      });
      console.log("Message uploaded successfylly:");
      console.log("msg" + message);
      console.log("topic" + topic);
    } catch (e) {
      console.log(e);
      throw new Error("");
    } finally {
      await this.kafka_producer.disconnect();
    }
  }
}

export default KafkaService;
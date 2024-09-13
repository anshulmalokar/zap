import prisma from "../db";

class Validator{
    private static _instance: Validator;
    private constructor(){

    }
    public static getInstance(): Validator{
        if(!Validator._instance){
            Validator._instance = new Validator();
        }
        return new Validator();
    }

    public async checkAction(actionId: string){
        try{
            await prisma.availableActions.findFirst({
                where:{
                    id: actionId
                }
            });
        }catch(e){
            console.log(e);
            throw new Error("");
        }
    }

    public async checkTrigger(triggerId: string){
        try{
            await prisma.trigger.findFirst({
                where:{
                    id: triggerId
                }
            })
        }catch(e){
            console.log(e);
            throw new Error("");
        }
    }
}
export default Validator
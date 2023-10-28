const Messages = require("../model/messageModel");
 
 module.exports.addMessage= async(req,res)=>{
try {
   
    const {from , to, message}  = req.body;
    const msg = new Messages(
        {
            message:{text:message},
            users:[from , to],
            sender:from,
        }
    )
    await msg.save();

     
    if(msg) return res.json({message: "Message added successfully",success:true});
    if(!msg) return res.json({message:"Message Failed to be added in db",success:false});


} catch (err) {
    console.log(err);
    return res.json({err: "Internal server error",success:false});
}
 }

 module.exports.getAllMessages= async(req,res)=>{
    try {
        const { from ,to } = req.body;
        const messages = await Messages.find({
            users:{
                $all:[from ,to],
            },
        }).sort({updatedAt:1});
        const projectMessages= messages.map((msg)=>{
            return {
                fromSelf:msg.sender.toString()===from,
                message:msg.message.text,
            };
        })
        res.json(projectMessages);
    } catch (error) {
        console.log(err);
        return res.json({err: "Internal server error",success:false});
    }
 }


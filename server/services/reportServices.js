const Report = require('../schemas/reportSchema');

async function create(userId, content) {
    try{
        
        const report = await Report.findOne({ userId });
        if (report) {
            return Report.findOneAndUpdate({ userId }, { content: content, updatedAt: Date.now() });       
            }
        const newReport =new Report({
            userId,
            content,
        });
        return await newReport.save();
    }
    catch(error){
        console.error("Error creating report:", error);
    }
}
async function getReport(userId) {
    try{
        return await Report.findById(userId);
    }
    catch(error)
    {
        console.error("Error getting report:", error);
    }
}
module.exports={create, getReport};
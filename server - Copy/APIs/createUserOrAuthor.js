const UserAuthor = require("../models/userAuthorModel");    


async function createUserOrAuthor(req, res, model) {

    
    const newuserAuthor = req.body;

    const userInDb = await UserAuthor.findOne({email: newuserAuthor.email})

    if(userInDb!==null){
        if(newuserAuthor.role===userInDb.role){
            res.status(200).send({message:newuserAuthor.role, payload:userInDb});
        }   else{
            res.status(200).send({message:"Invalid role"});
        }         
    }else{
        let newUser = new UserAuthor(newuserAuthor);
        let newUserOrAuthorDoc = await newUser.save();
        res.status(201).send({message:newUserOrAuthorDoc.role, payload:newUserOrAuthorDoc});
    }
}

module.exports = createUserOrAuthor;
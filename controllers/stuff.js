const stuff = require('../models/stuff');
const fs = require('fs');

exports.creatSauce = (req, res) => {
    const sauce = JSON.parse(req.body.sauce);
    const Stuff = new stuff({
        ...sauce,
        likes: 0,
        dislikes: 0,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    Stuff.save()
        .then(() => res.status(201).json({message: 'sauce ajouter'}))
        .catch(error => res.status(400).json({error}));
}

exports.GetSauces = (req, res) => {
    stuff.find()
        .then(Stuff => res.status(200).json(Stuff))
        .catch(error => res.status(404).json({ error }))
}

exports.GetSauce = (req, res) => {
    stuff.findOne({_id: req.params.id})
        .then(Stuff => res.status(200).json(Stuff))
        .catch(error => res.status(400).json({error}));
}

exports.deleteSauce = (req, res) =>{
    stuff.findOne({_id: req.params.id})
    .then(Stuff => {
        const fileName = Stuff.imageUrl.split('/images/')[1];
        fs.unlink('image/'+fileName,() => {
                Stuff.deleteOne({_id: req.params.id})
                    .then(() => res.status(200).json({message : 'objet suprimer'}))
                    .catch(error => res.status(400).json({error}))
            })
        })
        .catch(error => res.status(500).json({error}));
}

exports.modifSauce = async (req, res) => {
        const update = req.file ?
          {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
          } : { ...req.body };
        
        const modif = () => {
            stuff.updateOne({ _id: req.params.id }, { ...update, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Objet modifié !'}))
            .catch(error => res.status(400).json({ error }));
            }

        if(!update.imageUrl){
            modif()   
        }else{
            stuff.findOne({_id: req.params.id})
            .then(Stuff => {
                const fileName = Stuff.imageUrl.split('/images/')[1];
                fs.unlink('image/'+fileName,() => {
                        modif();
                    })
                })
            .catch(error => res.status(500).json({error}));
        }   
}

exports.likeSauce = (req, res) => {
    stuff.findOne({_id: req.params.id})
    .then(Stuff => {
        const recherche = (array) => {
            if(array.length > 0){
                let rep = {boolean: false}
                for(let i = 0; i<array.length; i++){
                    if(array[i] === req.body.userId){
                        rep = {boolean: true, pos : i}
                    }
                }
                return rep
            }return {boolean: false};
        }
        const modif = (message)=>{
            stuff.updateOne({ _id: req.params.id }, update)
            .then(() => res.status(200).json({ message: message}))
            .catch(error => res.status(400).json({ error }));  
        }

        const repLiked = recherche(Stuff.usersLiked)
        const repDisliked = recherche(Stuff.usersDisliked)
 
        let update = Stuff
        let message

        if(req.body.like === 1 && repLiked.boolean === false){
            update.likes = update.likes + 1;
            update.usersLiked.push(req.body.userId);
            if(repDisliked.boolean === true){
                if(update.usersDisliked.length === 1){
                    update.usersDisliked = []
                }else{
                    update.usersDisliked.splice(repDisliked.pos, repDisliked.pos)
                }
                update.dislikes = update.dislikes - 1;
            }
            message = "vous avez bien like la sauce"
        }if(req.body.like === -1 && repDisliked.boolean === false){
            update.dislikes = update.dislikes + 1;
            update.usersDisliked.push(req.body.userId);
            if(repLiked.boolean === true){
                if(update.usersLiked.length === 1){
                    update.usersLiked = []
                }else{
                    update.usersLiked.splice(repLiked.pos, repLiked.pos)
                }
                update.likes = update.likes - 1;
            }
            message = "vous avez bien dislike la photo"
        }if(req.body.like === 0){
            if(repLiked.boolean === true){
                    if(update.usersLiked.length === 1){
                        update.usersLiked = []
                    }else{
                        update.usersLiked.splice(repLiked.pos, repLiked.pos)
                    }
                    update.likes = update.likes - 1;
                }if(repDisliked.boolean === true){
                    if(update.usersDisliked.length === 1){
                        update.usersDisliked = []
                    }else{
                        update.usersDisliked.splice(repDisliked.pos, repDisliked.pos)
                    }
                    update.dislikes = update.dislikes - 1;
                }
                message = "vous avez bien anuler votre choix"
        }
        modif(message);
    })
    .catch(error => res.status(400).json({ error }))
}
const express = require('express');
const Notes = require('../models/Notes');

const fetchuser = require('../middleware/fetchuser');

const { body, validationResult } = require('express-validator');

const router = express.Router();

//get all the notes of a user
router.get('/getnotes' , fetchuser , async(req, res) => {
    try{
        const notes = await Notes.find({userId:req.user.id});
        return res.json(notes);
    }
    catch(error){
        console.error(error.message);
        res.status(500).send("some error occured");
    }
    res.send("Hello")
 })

//add a new note for a user
router.post('/addnotes' , fetchuser , [body('title' , 'title must be 3 characters long').isLength({ min: 3 }),
body('description' , 'Description must be 5 characters long').isLength({ min: 5 })] ,
 async (req , res)=>{

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try{
        const {title , description , tag} = req.body;
    
        const notes = await Notes({
            title, description, tag , userId:req.user.id,
          })
        
        const savedNotes = await notes.save();
        res.json(savedNotes);
      }
      catch (error) {
        console.error(error.message);
        res.status(500).send("some error occured");
      }
})

//update a note of a user
router.put('/editnotes/:id' , fetchuser ,async (req , res)=>{

    try{
        const {title , description , tag} = req.body;

        const newNote = {};
        if(title) newNote.title = title;
        if(description) newNote.description = description;
        if(tag) newNote.tag = tag;

        let note = await Notes.findById(req.params.id);
        if(!note)return res.status(404).send("Not Found !!");
        
        if(note.userId.toString() !== req.user.id) return res.status(404).send("Not Allowed !!");

        note = await Notes.findByIdAndUpdate(req.params.id,{$set:newNote} , {new:true})
        // Notes.findByIdAndUpdate(id , newNote)
        res.json(note);
      }
      catch (error) {
        console.error(error.message);
        res.status(500).send("some error occured");
      }
})

//delete a note of a user
router.delete('/deletenotes/:id' , fetchuser ,async (req , res)=>{

    try{
        let note = await Notes.findById(req.params.id);
        if(!note)return res.status(404).send("Not Found !!");
        
        if(note.userId.toString() !== req.user.id) return res.status(401).send("Not Allowed !!");

        note = await Notes.findByIdAndDelete(req.params.id);
        

        res.json({"success":"deleted successfully" , note:note});
      }
      catch (error) {
        console.error(error.message);
        res.status(500).send("some error occured");
      }
})





module.exports = router;
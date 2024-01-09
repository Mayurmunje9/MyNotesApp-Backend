const express = require("express");
const fetchuser = require("../middleware/fetchUser");
const router = express.Router();
const Note = require("../models/Notes");
const { validationResult, body } = require("express-validator");

router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    console.log("User ID:", req.user.id);
    console.log("User Object:", req.user);

    const notes = await Note.find({ user: req.user.id });
    console.log("Fetched Notes:", notes);
    res.json(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 2: Add a new Note using: POST "/api/auth/addnote". Login required
router.post('/addnewnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be atleast 5 characters').isLength({ min: 5 }),], async (req, res) => {
        try {

            const { title, description, tag } = req.body;

            // If there are errors, return Bad request and the errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const note = new Note({user: req.user.name,title, description, tag, user: req.user.id, 
            })
            const savedNote = await note.save()

            res.json(savedNote)

        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
    })

    //Route 3 : Update a note 

    router.put('/updatenote/:id',fetchuser,async (req,res)=>{
      const { title, description, tag } = req.body;
      const newNote={};
      //If the changes exist update it to the new note
      if(title){newNote.title=title};
      if(description){newNote.description=description};
      if(tag){newNote.tag=tag};

        //Find note to be updated    We are taking notes id here 
        let note=await Note.findById(req.params.id);
        //Here the parms is for the parameter we have put in the router.put secton

        //If no such id exist 
        if(!note){return res.status(401).send(" Not Found ")}

        //If the another userId is trying to change 
        if(note.user.toString()!==req.user.id){return res.status(404).send("Not allowed To change ")}

        note=await Note.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true})
        res.json(note);
    })


    //Route 4 Delete node 

    router.delete('/deletenode/:id',fetchuser,async(req,res)=>{

       let note =await Note.findById(req.params.id);
      //If note not found 
       if(!note){return res.status(404).send(" Note not found ")}
       //If requesting user is diffrent 
       if(note.user.toString()!==req.user.id){
        return res.status(401).send("Note allowed ")
       }

       note=await Note.findByIdAndDelete(req.params.id);
       res.json({"success":"Node deletted uccessfully"})
    })
module.exports = router;




import noteModel from "../models/noteModel";



export const createNotes = async (req, res) => {
    let { title, content } = req.body;
    const tenantId = req.user.tenantId;
    const createdBy = req.user._id;

    if (!title || !content || !tenantId || !createdBy) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const note = await noteModel.create({
            title,
            content,
            tenantId,
            createdBy
        });
        await note.save();
        res.status(201).json({
            note
        })
    } catch (error) {
        console.error("Error inserting todo:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getNotes = async (req, res) => {
    const tenantId = req.user.tenantId;
    try {
        const notes = await noteModel.find({tenantId});
        res.status(200).json({notes});
    }catch(error) {
        console.error("Error fetching notes:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getOneNote = async (req, res) => {
    const createdBy = req.params.id;
    try {
        const note = await noteModel.findById(createdBy).populate('createdBy', 'userName email');
        if(!note) {
            return res.status(404).json({message: "Note not found"});
        }
        res.status(200).json({note});
    }catch(error) {
        console.error("Error fetching note:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const updateNote = async (req, res) =>{
    const noteId = req.params.id;
    const {title, content} = req.body;
    try{
        
        const updateNote = await noteModel.findByIdAndUpdate(noteId, {title, content}, {new: true});
        res.status(200).json({updateNote});
    }catch(error){
        console.error("Error updating note:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const deleteNote = async (req, res) => {
    const noteId = req.params.id;
    try{
        await noteModel.findByIdAndDelete(noteId);
        res.status(200).json({message: "Note deleted successfully"});
    }catch(error){
        console.error("Error deleting note:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
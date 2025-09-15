import noteModel from "../models/noteModel.js";
import tenantModel from "../models/tenantModel.js";



export const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    
    const tenant = await tenantModel.findById(req.user.tenantId);
    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    
    if (tenant.plan === "free") {
      const count = await noteModel.countDocuments({ tenantId: tenant._id });
      if (count >= tenant.noteLimit) {
        return res.status(403).json({
          message: "Note limit reached. Please upgrade to Pro."
        });
      }
    }

    const note = await noteModel.create({
      title,
      content,
      tenantId: tenant._id,
      createdBy: req.user._id
    });

    res.status(201).json({note});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

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

export const getMyNotes = async (req, res) => {
    const createdBy = req.params.id;
    try {
        const note = await noteModel.find({createdBy: req.user.id, tenantId: req.user.tenantId }).populate('createdBy', 'userName email');
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
        console.log(noteId)
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
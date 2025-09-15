import tenantModel from "../models/tenantModel.js";


export const registerTenant = async (req, res) => {
    let { name, slug, plan} = req.body;

    let existingTenant = await tenantModel.findOne({slug});
    if(existingTenant){
        return res.status(400).json({message: "Tenant with this slug already exists"});
    }
    try{
        const tenant = await tenantModel.create({
            name,
            slug
            
        })
    }catch(error){
        console.error("Error registering tenant:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const upgradeTenant = async (req, res) => {
  try {
    const { slug } = req.params;

    
    const tenant = await tenantModel.findOne({ slug });
    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Only admins can upgrade subscription" });
    }

   
    tenant.plan = "pro";
    tenant.noteLimit = Infinity;
    await tenant.save();

    res.json({ message: `Tenant ${slug} upgraded to Pro`, plan: tenant.plan });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

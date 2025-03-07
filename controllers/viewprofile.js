const viewProfile = async (req, res) => {
    try {
        const userId='67b5fb7f12a84263a02ae72e';
        // const userId = req.user.id; 
        const user=await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'this user not found' });
        }

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }    
};
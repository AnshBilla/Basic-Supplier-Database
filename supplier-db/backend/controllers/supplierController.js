const Supplier = require('../models/Supplier');

// Add supplier
exports.addSupplier = async (req, res) => {
  try {
    const supplier = new Supplier(req.body);
    await supplier.save();
    res.json({ message: 'Supplier added', supplier });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get suppliers with search, filter, pagination
exports.getSuppliers = async (req, res) => {
  try {
    const { q, category, page = 1, limit = 6, sortBy = 'createdAt', order = 'desc' } = req.query;
    const filter = {};
    if (q) {
      const rx = { $regex: q, $options: 'i' };
      filter.$or = [{ name: rx }, { company: rx }, { address: rx }, { phone: rx }];
    }
    if (category) filter.category = category;

    const skip = (Math.max(1, parseInt(page)) - 1) * parseInt(limit);
    const total = await Supplier.countDocuments(filter);
    const suppliers = await Supplier.find(filter)
      .sort({ [sortBy]: order === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // simple stats for dashboard
    const categories = await Supplier.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $project: { category: '$_id', count: 1, _id: 0 } }
    ]);

    res.json({ suppliers, total, page: parseInt(page), limit: parseInt(limit), categories });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update supplier
exports.updateSupplier = async (req, res) => {
  try {
    const updated = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Updated', supplier: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete supplier
exports.deleteSupplier = async (req, res) => {
  try {
    const del = await Supplier.findByIdAndDelete(req.params.id);
    if (!del) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single supplier
exports.getSupplier = async (req, res) => {
  try {
    const s = await Supplier.findById(req.params.id);
    if (!s) return res.status(404).json({ error: 'Not found' });
    res.json(s);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

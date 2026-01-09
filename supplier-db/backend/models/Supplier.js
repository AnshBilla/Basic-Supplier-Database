const mongoose = require('mongoose');

const SupplierSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  company: { type: String, required: true, index: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  category: { type: String, default: 'General', index: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Supplier', SupplierSchema);

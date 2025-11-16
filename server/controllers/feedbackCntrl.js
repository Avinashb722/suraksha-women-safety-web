const Feedback = require('../models/feedbackModel');

const submitFeedback = async (req, res) => {
  try {
    const { name, email, rating, category, message } = req.body;

    const feedback = new Feedback({
      name,
      email,
      rating: parseInt(rating),
      category,
      message
    });

    await feedback.save();

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: feedback
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting feedback',
      error: error.message
    });
  }
};

const getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: feedback.length,
      data: feedback
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching feedback',
      error: error.message
    });
  }
};

module.exports = {
  submitFeedback,
  getAllFeedback
};
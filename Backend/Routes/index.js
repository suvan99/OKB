import express from 'express';

const router = express.Router();

// Example route
router.get('/', (req, res) => {
  res.json({ message: 'Welcome to OKB API', status: 'success' });
});

// Add more routes here
// router.post('/resource', createResource);
// router.get('/resource/:id', getResource);
// router.put('/resource/:id', updateResource);
// router.delete('/resource/:id', deleteResource);

export default router;

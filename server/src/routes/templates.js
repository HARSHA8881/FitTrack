import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
    getTemplates,
    getTemplateById,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    useTemplate,
    getUserTemplates
} from '../controllers/templateController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all templates (user's + public)
router.get('/', getTemplates);

// Get user's templates only
router.get('/my', getUserTemplates);

// Get single template
router.get('/:id', getTemplateById);

// Create new template
router.post('/', createTemplate);

// Update template
router.put('/:id', updateTemplate);

// Delete template
router.delete('/:id', deleteTemplate);

// Use template to create workouts
router.post('/:id/use', useTemplate);

export default router;

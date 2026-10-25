/**
 * Property Routes: Public portfolio browsing and protected administrator management
 */
import { Router } from 'express';
import * as propertyController from '../controllers/propertyController.ts';
import { requireAdmin } from '../middleware/auth.ts';
import { validatePropertyInput, validateAvailabilityUpdate } from '../middleware/validation.ts';

const router = Router();

// --- Public Endpoints ---
// Only published properties allowed
router.get('/properties', propertyController.getProperties);
router.get('/properties/:id', propertyController.getPropertyByIdOrSlug);

// --- Protected Administrator Endpoints ---
// Enforced by backend token verification
router.get('/admin/properties', requireAdmin, propertyController.adminGetProperties);
router.post('/admin/properties', requireAdmin, validatePropertyInput, propertyController.createProperty);
router.put('/admin/properties/:id', requireAdmin, propertyController.updateProperty);
router.patch('/admin/properties/:id/publish', requireAdmin, propertyController.togglePublishProperty);
router.patch('/admin/properties/:id/availability', requireAdmin, validateAvailabilityUpdate, propertyController.updateAvailability);
router.delete('/admin/properties/:id', requireAdmin, propertyController.deleteProperty);

export default router;

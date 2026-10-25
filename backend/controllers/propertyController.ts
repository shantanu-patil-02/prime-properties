/**
 * Property Controller: Request handling for public and protected property APIs
 */
import { Request, Response } from 'express';
import * as propertyService from '../services/propertyService.ts';

// 1. GET /api/properties (Public)
export async function getProperties(req: Request, res: Response) {
  try {
    const { city, type, purpose, minPrice, maxPrice, search, featured } = req.query;

    const properties = await propertyService.getPublicProperties({
      city: city as string,
      type: type as string,
      purpose: purpose as string,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      search: search as string,
      featured: featured === 'true' ? true : featured === 'false' ? false : undefined,
    });

    res.json(properties);
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to retrieve properties',
    });
  }
}

// 2. GET /api/properties/:idOrSlug (Public)
export async function getPropertyByIdOrSlug(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const property = await propertyService.getPropertyByIdOrSlug(id);

    if (!property) {
      return res.status(404).json({
        success: false,
        error: 'Property not found',
      });
    }

    // Only allow public access if published
    if (!property.isPublished) {
      return res.status(404).json({
        success: false,
        error: 'Property is not published for public display',
      });
    }

    res.json(property);
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to retrieve property details',
    });
  }
}

// 3. GET /api/admin/properties (Protected Admin)
export async function adminGetProperties(req: Request, res: Response) {
  try {
    const properties = await propertyService.getAllPropertiesAdmin();
    res.json({
      success: true,
      count: properties.length,
      data: properties,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to retrieve admin property listings',
    });
  }
}

// 4. POST /api/admin/properties (Protected Admin)
export async function createProperty(req: Request, res: Response) {
  try {
    const propertyData = req.body;
    const newProperty = await propertyService.createProperty(propertyData);

    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      data: newProperty,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to create property',
    });
  }
}

// 5. PUT /api/admin/properties/:id (Protected Admin)
export async function updateProperty(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updated = await propertyService.updateProperty(id, req.body);

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: 'Property not found for update',
      });
    }

    res.json({
      success: true,
      message: 'Property updated successfully',
      data: updated,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to update property',
    });
  }
}

// 6. PATCH /api/admin/properties/:id/publish (Protected Admin)
export async function togglePublishProperty(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { isPublished } = req.body;

    if (typeof isPublished !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: 'isPublished must be a boolean value',
      });
    }

    const updated = await propertyService.togglePublishStatus(id, isPublished);
    if (!updated) {
      return res.status(404).json({
        success: false,
        error: 'Property not found',
      });
    }

    res.json({
      success: true,
      message: `Property ${isPublished ? 'published' : 'unpublished'} successfully`,
      data: updated,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to update publication status',
    });
  }
}

// 7. PATCH /api/admin/properties/:id/availability (Protected Admin)
export async function updateAvailability(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { availability } = req.body;

    const updated = await propertyService.updateAvailability(id, availability);
    if (!updated) {
      return res.status(404).json({
        success: false,
        error: 'Property not found',
      });
    }

    res.json({
      success: true,
      message: `Availability updated to ${availability}`,
      data: updated,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to update availability',
    });
  }
}

// 8. DELETE /api/admin/properties/:id (Protected Admin)
export async function deleteProperty(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await propertyService.deleteProperty(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Property not found to delete',
      });
    }

    res.json({
      success: true,
      message: 'Property deleted successfully',
      data: deleted,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to delete property',
    });
  }
}

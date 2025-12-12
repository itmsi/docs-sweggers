const service = require('./service');
const { baseResponse, errorResponse } = require('../../utils/response');

/**
 * Controller Layer - HTTP Request/Response Handler
 * 
 * Layer ini hanya menangani HTTP request dan response.
 */

/**
 * Get all services with pagination
 */
const getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, category, search } = req.query;
    const filters = { status, category, search };
    const data = await service.getAllServices(page, limit, filters);
    return baseResponse(res, { data });
  } catch (error) {
    return errorResponse(res, error);
  }
};

/**
 * Get single service by ID
 */
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await service.getServiceById(id);
    return baseResponse(res, { data });
  } catch (error) {
    return errorResponse(res, error);
  }
};

/**
 * Get service by slug
 */
const getBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const data = await service.getServiceBySlug(slug);
    return baseResponse(res, { data });
  } catch (error) {
    return errorResponse(res, error);
  }
};

/**
 * Get Swagger JSON for a service
 */
const getSwagger = async (req, res) => {
  try {
    const { id } = req.params;
    const swaggerJson = await service.getSwaggerJson(id);
    return res.json(swaggerJson);
  } catch (error) {
    return errorResponse(res, error);
  }
};

/**
 * Get Swagger JSON by slug
 */
const getSwaggerBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const serviceData = await service.getServiceBySlug(slug);
    const swaggerJson = await service.getSwaggerJson(serviceData.id);
    return res.json(swaggerJson);
  } catch (error) {
    return errorResponse(res, error);
  }
};

/**
 * Create new service
 */
const create = async (req, res) => {
  try {
    const data = await service.createService(req.body);
    return baseResponse(res, { 
      data,
      message: 'Service berhasil dibuat' 
    }, 201);
  } catch (error) {
    return errorResponse(res, error);
  }
};

/**
 * Update existing service
 */
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await service.updateService(id, req.body);
    return baseResponse(res, { 
      data,
      message: 'Service berhasil diupdate' 
    });
  } catch (error) {
    return errorResponse(res, error);
  }
};

/**
 * Update Swagger JSON for a service
 */
const updateSwagger = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await service.updateSwaggerJson(id, req.body);
    return baseResponse(res, { 
      data,
      message: 'Swagger JSON berhasil diupdate' 
    });
  } catch (error) {
    return errorResponse(res, error);
  }
};

/**
 * Soft delete service
 */
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    await service.deleteService(id);
    return baseResponse(res, { 
      message: 'Service berhasil dihapus' 
    });
  } catch (error) {
    return errorResponse(res, error);
  }
};

/**
 * Restore soft deleted service
 */
const restore = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await service.restoreService(id);
    return baseResponse(res, { 
      data,
      message: 'Service berhasil direstore' 
    });
  } catch (error) {
    return errorResponse(res, error);
  }
};

/**
 * Get all active services (for documentation listing)
 */
const getAllActive = async (req, res) => {
  try {
    const data = await service.getAllActiveServices();
    return baseResponse(res, { data });
  } catch (error) {
    return errorResponse(res, error);
  }
};

module.exports = {
  getAll,
  getById,
  getBySlug,
  getSwagger,
  getSwaggerBySlug,
  create,
  update,
  updateSwagger,
  remove,
  restore,
  getAllActive
};


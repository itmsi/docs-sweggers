const repository = require('./repository');
const axios = require('axios');

/**
 * Service Layer - Business Logic
 * 
 * Layer ini menangani semua business logic untuk services.
 */

/**
 * Generate slug from name
 */
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Validate Swagger JSON
 */
const validateSwaggerJson = (swaggerJson) => {
  if (!swaggerJson) {
    throw { message: 'Swagger JSON tidak boleh kosong', statusCode: 400 };
  }
  
  // Basic validation
  if (typeof swaggerJson !== 'object') {
    throw { message: 'Swagger JSON harus berupa object', statusCode: 400 };
  }
  
  // Check for OpenAPI/Swagger version
  if (!swaggerJson.openapi && !swaggerJson.swagger) {
    throw { message: 'Swagger JSON harus memiliki openapi atau swagger version', statusCode: 400 };
  }
  
  return true;
};

/**
 * Fetch Swagger JSON from URL
 */
const fetchSwaggerFromUrl = async (url) => {
  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (response.data) {
      validateSwaggerJson(response.data);
      return response.data;
    }
    
    throw { message: 'Tidak dapat mengambil Swagger JSON dari URL', statusCode: 400 };
  } catch (error) {
    if (error.response) {
      throw { message: `Error fetching Swagger: ${error.response.statusText}`, statusCode: error.response.status };
    }
    if (error.statusCode) {
      throw error;
    }
    throw { message: 'Gagal mengambil Swagger JSON dari URL', statusCode: 500 };
  }
};

/**
 * Get all services with pagination
 */
const getAllServices = async (page = 1, limit = 10, filters = {}) => {
  return await repository.findAll(page, limit, filters);
};

/**
 * Get single service by ID
 */
const getServiceById = async (id) => {
  const data = await repository.findById(id);
  
  if (!data) {
    throw { message: 'Service tidak ditemukan', statusCode: 404 };
  }
  
  return data;
};

/**
 * Get service by slug
 */
const getServiceBySlug = async (slug) => {
  const data = await repository.findBySlug(slug);
  
  if (!data) {
    throw { message: 'Service tidak ditemukan', statusCode: 404 };
  }
  
  return data;
};

/**
 * Get Swagger JSON for a service
 */
const getSwaggerJson = async (id) => {
  const service = await repository.findById(id);
  
  if (!service) {
    throw { message: 'Service tidak ditemukan', statusCode: 404 };
  }
  
  // If swagger_json is stored directly, return it
  if (service.swagger_json) {
    return service.swagger_json;
  }
  
  // If swagger_url is provided, fetch from URL
  if (service.swagger_url) {
    try {
      const swaggerJson = await fetchSwaggerFromUrl(service.swagger_url);
      // Optionally update the service with fetched JSON
      return swaggerJson;
    } catch (error) {
      throw { message: 'Gagal mengambil Swagger JSON', statusCode: 500 };
    }
  }
  
  throw { message: 'Service tidak memiliki dokumentasi Swagger', statusCode: 404 };
};

/**
 * Create new service
 */
const createService = async (serviceData) => {
  // Generate slug if not provided
  if (!serviceData.slug && serviceData.name) {
    serviceData.slug = generateSlug(serviceData.name);
  }
  
  // Check if slug already exists
  const existingService = await repository.findBySlug(serviceData.slug);
  if (existingService) {
    throw { message: 'Slug sudah digunakan', statusCode: 400 };
  }
  
  // If swagger_url is provided, fetch and store the JSON
  if (serviceData.swagger_url && !serviceData.swagger_json) {
    try {
      serviceData.swagger_json = await fetchSwaggerFromUrl(serviceData.swagger_url);
    } catch (error) {
      // Log error but don't fail the creation
      console.error('Error fetching Swagger from URL:', error);
    }
  }
  
  // Validate swagger_json if provided
  if (serviceData.swagger_json) {
    validateSwaggerJson(serviceData.swagger_json);
  }
  
  return await repository.create(serviceData);
};

/**
 * Update existing service
 */
const updateService = async (id, serviceData) => {
  // Check if service exists
  const existingService = await repository.findById(id);
  
  if (!existingService) {
    throw { message: 'Service tidak ditemukan', statusCode: 404 };
  }
  
  // Generate slug if name is updated
  if (serviceData.name && !serviceData.slug) {
    serviceData.slug = generateSlug(serviceData.name);
  }
  
  // Check if slug already exists (excluding current service)
  if (serviceData.slug && serviceData.slug !== existingService.slug) {
    const slugExists = await repository.findBySlug(serviceData.slug);
    if (slugExists) {
      throw { message: 'Slug sudah digunakan', statusCode: 400 };
    }
  }
  
  // If swagger_url is provided and swagger_json is not, fetch it
  if (serviceData.swagger_url && !serviceData.swagger_json) {
    try {
      serviceData.swagger_json = await fetchSwaggerFromUrl(serviceData.swagger_url);
    } catch (error) {
      console.error('Error fetching Swagger from URL:', error);
    }
  }
  
  // Validate swagger_json if provided
  if (serviceData.swagger_json) {
    validateSwaggerJson(serviceData.swagger_json);
  }
  
  return await repository.update(id, serviceData);
};

/**
 * Update Swagger JSON for a service
 */
const updateSwaggerJson = async (id, swaggerJson) => {
  validateSwaggerJson(swaggerJson);
  
  const existingService = await repository.findById(id);
  if (!existingService) {
    throw { message: 'Service tidak ditemukan', statusCode: 404 };
  }
  
  return await repository.update(id, { swagger_json: swaggerJson });
};

/**
 * Soft delete service
 */
const deleteService = async (id) => {
  const existingService = await repository.findById(id);
  
  if (!existingService) {
    throw { message: 'Service tidak ditemukan', statusCode: 404 };
  }
  
  const result = await repository.remove(id);
  return result;
};

/**
 * Restore soft deleted service
 */
const restoreService = async (id) => {
  const data = await repository.restore(id);
  
  if (!data) {
    throw { message: 'Service tidak ditemukan', statusCode: 404 };
  }
  
  return data;
};

/**
 * Get all active services
 */
const getAllActiveServices = async () => {
  return await repository.findAllActive();
};

module.exports = {
  getAllServices,
  getServiceById,
  getServiceBySlug,
  getSwaggerJson,
  createService,
  updateService,
  updateSwaggerJson,
  deleteService,
  restoreService,
  getAllActiveServices
};


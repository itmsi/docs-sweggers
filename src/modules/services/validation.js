const { body, param, query } = require('express-validator');

/**
 * Validation rules for creating service
 */
const createValidation = [
  body('name')
    .notEmpty()
    .withMessage('Nama service wajib diisi')
    .isLength({ min: 3, max: 100 })
    .withMessage('Nama harus antara 3-100 karakter')
    .trim(),
  body('slug')
    .optional()
    .isLength({ min: 3, max: 100 })
    .withMessage('Slug harus antara 3-100 karakter')
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Slug hanya boleh mengandung huruf kecil, angka, dan tanda hubung')
    .trim(),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Deskripsi maksimal 1000 karakter')
    .trim(),
  body('version')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Version maksimal 50 karakter')
    .trim(),
  body('base_url')
    .optional()
    .isURL()
    .withMessage('Base URL harus berupa URL yang valid')
    .trim(),
  body('swagger_url')
    .optional()
    .isURL()
    .withMessage('Swagger URL harus berupa URL yang valid')
    .trim(),
  body('swagger_json')
    .optional()
    .custom((value) => {
      if (typeof value !== 'object' || value === null) {
        throw new Error('Swagger JSON harus berupa object');
      }
      if (!value.openapi && !value.swagger) {
        throw new Error('Swagger JSON harus memiliki openapi atau swagger version');
      }
      return true;
    }),
  body('status')
    .optional()
    .isIn(['active', 'inactive', 'deprecated'])
    .withMessage('Status harus active, inactive, atau deprecated'),
  body('category')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Category maksimal 100 karakter')
    .trim(),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags harus berupa array'),
];

/**
 * Validation rules for updating service
 */
const updateValidation = [
  param('id')
    .notEmpty()
    .withMessage('ID wajib diisi')
    .isUUID()
    .withMessage('Format ID tidak valid'),
  body('name')
    .optional()
    .isLength({ min: 3, max: 100 })
    .withMessage('Nama harus antara 3-100 karakter')
    .trim(),
  body('slug')
    .optional()
    .isLength({ min: 3, max: 100 })
    .withMessage('Slug harus antara 3-100 karakter')
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Slug hanya boleh mengandung huruf kecil, angka, dan tanda hubung')
    .trim(),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Deskripsi maksimal 1000 karakter')
    .trim(),
  body('version')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Version maksimal 50 karakter')
    .trim(),
  body('base_url')
    .optional()
    .isURL()
    .withMessage('Base URL harus berupa URL yang valid')
    .trim(),
  body('swagger_url')
    .optional()
    .isURL()
    .withMessage('Swagger URL harus berupa URL yang valid')
    .trim(),
  body('swagger_json')
    .optional()
    .custom((value) => {
      if (typeof value !== 'object' || value === null) {
        throw new Error('Swagger JSON harus berupa object');
      }
      if (!value.openapi && !value.swagger) {
        throw new Error('Swagger JSON harus memiliki openapi atau swagger version');
      }
      return true;
    }),
  body('status')
    .optional()
    .isIn(['active', 'inactive', 'deprecated'])
    .withMessage('Status harus active, inactive, atau deprecated'),
  body('category')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Category maksimal 100 karakter')
    .trim(),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags harus berupa array'),
];

/**
 * Validation rules for updating Swagger JSON
 */
const updateSwaggerValidation = [
  param('id')
    .notEmpty()
    .withMessage('ID wajib diisi')
    .isUUID()
    .withMessage('Format ID tidak valid'),
  body()
    .notEmpty()
    .withMessage('Swagger JSON wajib diisi')
    .custom((value) => {
      if (typeof value !== 'object' || value === null) {
        throw new Error('Swagger JSON harus berupa object');
      }
      if (!value.openapi && !value.swagger) {
        throw new Error('Swagger JSON harus memiliki openapi atau swagger version');
      }
      return true;
    }),
];

/**
 * Validation rules for getting service by ID
 */
const getByIdValidation = [
  param('id')
    .notEmpty()
    .withMessage('ID wajib diisi')
    .isUUID()
    .withMessage('Format ID tidak valid'),
];

/**
 * Validation rules for getting service by slug
 */
const getBySlugValidation = [
  param('slug')
    .notEmpty()
    .withMessage('Slug wajib diisi')
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Format slug tidak valid')
    .trim(),
];

/**
 * Validation rules for list with pagination
 */
const listValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page harus berupa angka positif'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit harus antara 1-100'),
  query('status')
    .optional()
    .isIn(['active', 'inactive', 'deprecated'])
    .withMessage('Status harus active, inactive, atau deprecated'),
  query('category')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Category maksimal 100 karakter'),
  query('search')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Search maksimal 100 karakter'),
];

module.exports = {
  createValidation,
  updateValidation,
  updateSwaggerValidation,
  getByIdValidation,
  getBySlugValidation,
  listValidation
};


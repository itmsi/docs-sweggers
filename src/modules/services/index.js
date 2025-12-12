const express = require('express');
const router = express.Router();
const controller = require('./controller');
const {
  createValidation,
  updateValidation,
  updateSwaggerValidation,
  getByIdValidation,
  getBySlugValidation,
  listValidation
} = require('./validation');
// Uncomment jika sudah ada authentication
// const { verifyToken } = require('../../middlewares');
const { validateMiddleware } = require('../../middlewares/validation');

/**
 * @route   GET /api/services
 * @desc    Get all services with pagination
 * @access  Public
 */
router.get(
  '/',
  listValidation,
  validateMiddleware,
  controller.getAll
);

/**
 * @route   GET /api/services/active
 * @desc    Get all active services
 * @access  Public
 */
router.get(
  '/active',
  controller.getAllActive
);

/**
 * @route   GET /api/services/:id
 * @desc    Get service by ID
 * @access  Public
 */
router.get(
  '/:id',
  getByIdValidation,
  validateMiddleware,
  controller.getById
);

/**
 * @route   GET /api/services/slug/:slug
 * @desc    Get service by slug
 * @access  Public
 */
router.get(
  '/slug/:slug',
  getBySlugValidation,
  validateMiddleware,
  controller.getBySlug
);

/**
 * @route   GET /api/services/:id/swagger
 * @desc    Get Swagger JSON for a service
 * @access  Public
 */
router.get(
  '/:id/swagger',
  getByIdValidation,
  validateMiddleware,
  controller.getSwagger
);

/**
 * @route   GET /api/services/slug/:slug/swagger
 * @desc    Get Swagger JSON by slug
 * @access  Public
 */
router.get(
  '/slug/:slug/swagger',
  getBySlugValidation,
  validateMiddleware,
  controller.getSwaggerBySlug
);

/**
 * @route   POST /api/services
 * @desc    Create new service
 * @access  Public (should be protected in production)
 */
router.post(
  '/',
  createValidation,
  validateMiddleware,
  controller.create
);

/**
 * @route   PUT /api/services/:id
 * @desc    Update service
 * @access  Public (should be protected in production)
 */
router.put(
  '/:id',
  updateValidation,
  validateMiddleware,
  controller.update
);

/**
 * @route   PUT /api/services/:id/swagger
 * @desc    Update Swagger JSON for a service
 * @access  Public (should be protected in production)
 */
router.put(
  '/:id/swagger',
  updateSwaggerValidation,
  validateMiddleware,
  controller.updateSwagger
);

/**
 * @route   DELETE /api/services/:id
 * @desc    Soft delete service
 * @access  Public (should be protected in production)
 */
router.delete(
  '/:id',
  getByIdValidation,
  validateMiddleware,
  controller.remove
);

/**
 * @route   POST /api/services/:id/restore
 * @desc    Restore soft deleted service
 * @access  Public (should be protected in production)
 */
router.post(
  '/:id/restore',
  getByIdValidation,
  validateMiddleware,
  controller.restore
);

module.exports = router;


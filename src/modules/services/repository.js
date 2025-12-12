const db = require('../../config/database');

const TABLE_NAME = 'services';

/**
 * Repository Layer - Database Operations
 * 
 * Layer ini menangani semua operasi database untuk services.
 */

/**
 * Find all services with pagination
 */
const findAll = async (page = 1, limit = 10, filters = {}) => {
  const offset = (page - 1) * limit;
  
  let query = db(TABLE_NAME)
    .select('*')
    .where({ deleted_at: null });
  
  // Apply filters
  if (filters.status) {
    query = query.where('status', filters.status);
  }
  
  if (filters.category) {
    query = query.where('category', filters.category);
  }
  
  if (filters.search) {
    query = query.where(function() {
      this.where('name', 'ilike', `%${filters.search}%`)
        .orWhere('description', 'ilike', `%${filters.search}%`);
    });
  }
  
  const data = await query
    .orderBy('created_at', 'desc')
    .limit(limit)
    .offset(offset);
    
  const total = await db(TABLE_NAME)
    .where({ deleted_at: null })
    .modify((queryBuilder) => {
      if (filters.status) {
        queryBuilder.where('status', filters.status);
      }
      if (filters.category) {
        queryBuilder.where('category', filters.category);
      }
      if (filters.search) {
        queryBuilder.where(function() {
          this.where('name', 'ilike', `%${filters.search}%`)
            .orWhere('description', 'ilike', `%${filters.search}%`);
        });
      }
    })
    .count('id as count')
    .first();
    
  return {
    items: data,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: parseInt(total.count),
      totalPages: Math.ceil(total.count / limit)
    }
  };
};

/**
 * Find single service by ID
 */
const findById = async (id) => {
  return await db(TABLE_NAME)
    .where({ id, deleted_at: null })
    .first();
};

/**
 * Find service by slug
 */
const findBySlug = async (slug) => {
  return await db(TABLE_NAME)
    .where({ slug, deleted_at: null })
    .first();
};

/**
 * Find by custom condition
 */
const findOne = async (conditions) => {
  return await db(TABLE_NAME)
    .where({ ...conditions, deleted_at: null })
    .first();
};

/**
 * Create new service
 */
const create = async (data) => {
  const [result] = await db(TABLE_NAME)
    .insert({
      ...data,
      created_at: db.fn.now(),
      updated_at: db.fn.now()
    })
    .returning('*');
  return result;
};

/**
 * Update existing service
 */
const update = async (id, data) => {
  const [result] = await db(TABLE_NAME)
    .where({ id, deleted_at: null })
    .update({
      ...data,
      updated_at: db.fn.now()
    })
    .returning('*');
  return result;
};

/**
 * Soft delete service
 */
const remove = async (id) => {
  const [result] = await db(TABLE_NAME)
    .where({ id, deleted_at: null })
    .update({
      deleted_at: db.fn.now()
    })
    .returning('*');
  return result;
};

/**
 * Restore soft deleted service
 */
const restore = async (id) => {
  const [result] = await db(TABLE_NAME)
    .where({ id })
    .whereNotNull('deleted_at')
    .update({
      deleted_at: null,
      updated_at: db.fn.now()
    })
    .returning('*');
  return result;
};

/**
 * Get all active services (for documentation listing)
 */
const findAllActive = async () => {
  return await db(TABLE_NAME)
    .select('id', 'name', 'slug', 'description', 'version', 'category', 'status')
    .where({ deleted_at: null, status: 'active' })
    .orderBy('name', 'asc');
};

module.exports = {
  findAll,
  findById,
  findBySlug,
  findOne,
  create,
  update,
  remove,
  restore,
  findAllActive
};


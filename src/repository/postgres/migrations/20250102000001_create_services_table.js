/**
 * Migration: Create services table
 * Tabel untuk menyimpan informasi service dan dokumentasi Swagger
 */

exports.up = function(knex) {
  return knex.schema.createTable('services', (table) => {
    // Primary Key with UUID
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    
    // Service information
    table.string('name', 100).notNullable();
    table.string('slug', 100).notNullable().unique();
    table.text('description').nullable();
    table.string('version', 50).nullable();
    table.string('base_url', 255).nullable();
    
    // Swagger documentation
    table.text('swagger_url').nullable(); // URL ke Swagger JSON (jika dari external)
    table.jsonb('swagger_json').nullable(); // Swagger JSON yang disimpan langsung
    
    // Status and metadata
    table.string('status', 20).defaultTo('active'); // active, inactive, deprecated
    table.string('category', 100).nullable(); // Kategori service (opsional)
    table.jsonb('tags').nullable(); // Tags untuk filtering
    
    // Timestamps
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.timestamp('deleted_at').nullable();
    
    // Indexes for better query performance
    table.index(['deleted_at'], 'idx_services_deleted_at');
    table.index(['status'], 'idx_services_status');
    table.index(['slug'], 'idx_services_slug');
    table.index(['category'], 'idx_services_category');
    table.index(['created_at'], 'idx_services_created_at');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('services');
};


const info = {
  description: 'Express.js API Boilerplate - Template untuk pengembangan REST API dengan fitur lengkap',
  version: '1.0.0',
  title: 'Express.js API Boilerplate Documentation',
  contact: {
    email: 'your-email@example.com'
  },
  license: {
    name: 'MIT',
    url: 'https://opensource.org/licenses/MIT'
  }
}

const servers = [
  {
    url: 'https://docs.motorsights.com/api/',
    description: 'Production server'
  }
]

// Import schemas
// Tambahkan schema module Anda di sini
// const exampleSchema = require('./schema/example');
const gateSsoSchemas = require('./schema/schema_gate_soo');

// Import paths
// Tambahkan path module Anda di sini
// const examplePaths = require('./path/example');
const adminMenuPaths = require('./path/path_gate_sso/admin_menu.json');
const authPaths = require('./path/path_gate_sso/auth.json');
const authMemberPaths = require('./path/path_gate_sso/auth_member.json');
const bankAccountsPaths = require('./path/path_gate_sso/bank_accounts.json');
const companiesPaths = require('./path/path_gate_sso/companies.json');
const customersPaths = require('./path/path_gate_sso/customers.json');
const departmentsPaths = require('./path/path_gate_sso/departments.json');
const employeesPaths = require('./path/path_gate_sso/employees.json');
const employeesImportPaths = require('./path/path_gate_sso/employees_import.json');
const importModulePaths = require('./path/path_gate_sso/import.json');
const islandPaths = require('./path/path_gate_sso/island.json');
const permissionsPaths = require('./path/path_gate_sso/permissions.json');
const ssoProfilePaths = require('./path/path_gate_sso/sso_profile.json');
const systemsPaths = require('./path/path_gate_sso/systems.json');
const titlesPaths = require('./path/path_gate_sso/titles.json');

// Combine all schemas
const schemas = {
  // ...exampleSchema,
  ...gateSsoSchemas
};

// Combine all paths
const paths = {
  // ...examplePaths,
  ...adminMenuPaths,
  ...authPaths,
  ...authMemberPaths,
  ...bankAccountsPaths,
  ...companiesPaths,
  ...customersPaths,
  ...departmentsPaths,
  ...employeesPaths,
  ...employeesImportPaths,
  ...importModulePaths,
  ...islandPaths,
  ...permissionsPaths,
  ...ssoProfilePaths,
  ...systemsPaths,
  ...titlesPaths
};

const index = {
  openapi: '3.0.0',
  info,
  servers,
  paths,
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas
  }
}

module.exports = {
  index
}

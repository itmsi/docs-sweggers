const express = require('express')
const swaggerUi = require('swagger-ui-express')
const { baseResponse, fullDateFormatIndo } = require('../utils')
const { register } = require('../config/prometheus')
const serviceModule = require('../modules/services/service')

const router = express.Router()
const { index } = require('../static')

const getDurationInMilliseconds = (start = process.hrtime()) => {
  const NS_PER_SEC = 1e9
  const NS_TO_MS = 1e6
  const diff = process.hrtime(start)

  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS
}

router.get('/', (req, res) => {
  baseResponse(res, {
    data: {
      response_time: `${getDurationInMilliseconds()}(ms)`,
      welcome: process?.env?.APP_NAME,
      uptimes: process.uptime(),
      timestamp: fullDateFormatIndo(new Date().toISOString()),
      documentation: process?.env?.SWAGGER_ENABLED === 'true' ? `http://${req.get('host')}/documentation` : 'Swagger documentation is disabled'
    }
  })
})

// Swagger configuration - can be controlled via SWAGGER_ENABLED environment variable
// Options:
// - SWAGGER_ENABLED=true (always enabled)
// - SWAGGER_ENABLED=false (always disabled)
// - SWAGGER_ENABLED=development (only in development mode)
// - SWAGGER_ENABLED not set (defaults to development mode only)

const isSwaggerEnabled = () => {
  const swaggerEnabled = process?.env?.SWAGGER_ENABLED

  if (swaggerEnabled === 'true') return true
  if (swaggerEnabled === 'false') return false
  if (swaggerEnabled === 'development') return process?.env?.NODE_ENV === 'development'

  // Default behavior (backward compatibility)
  return process?.env?.NODE_ENV === 'development'
}

// Prometheus metrics endpoint
router.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType)
    const metrics = await register.metrics()
    res.end(metrics)
  } catch (ex) {
    res.status(500).end(ex)
  }
})

// Halaman utama - menampilkan daftar semua service
router.get('/docs', async (req, res) => {
  try {
    const services = await serviceModule.getAllActiveServices()
    
    const html = `
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dokumentasi Swagger - ${process?.env?.APP_NAME || 'API Documentation'}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        .header {
            text-align: center;
            color: white;
            margin-bottom: 40px;
        }
        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
        }
        .header p {
            font-size: 1.2rem;
            opacity: 0.9;
        }
        .services-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 30px;
        }
        .service-card {
            background: white;
            border-radius: 12px;
            padding: 25px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            cursor: pointer;
        }
        .service-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
        }
        .service-card h3 {
            color: #333;
            margin-bottom: 10px;
            font-size: 1.3rem;
        }
        .service-card .description {
            color: #666;
            margin-bottom: 15px;
            line-height: 1.5;
        }
        .service-card .meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #eee;
        }
        .service-card .version {
            background: #667eea;
            color: white;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 0.85rem;
        }
        .service-card .category {
            color: #999;
            font-size: 0.9rem;
        }
        .btn {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 10px 20px;
            border-radius: 6px;
            text-decoration: none;
            margin-top: 10px;
            transition: background 0.3s ease;
        }
        .btn:hover {
            background: #5568d3;
        }
        .empty-state {
            text-align: center;
            color: white;
            padding: 60px 20px;
        }
        .empty-state h2 {
            font-size: 2rem;
            margin-bottom: 10px;
        }
        .empty-state p {
            font-size: 1.1rem;
            opacity: 0.9;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📚 Dokumentasi Swagger</h1>
            <p>Kumpulan dokumentasi API dari semua service</p>
        </div>
        
        ${services.length > 0 ? `
        <div class="services-grid">
            ${services.map(service => `
                <div class="service-card" onclick="window.location.href='/docs/${service.slug}'">
                    <h3>${service.name || 'Unnamed Service'}</h3>
                    <div class="description">${service.description || 'Tidak ada deskripsi'}</div>
                    <div class="meta">
                        ${service.version ? `<span class="version">v${service.version}</span>` : ''}
                        ${service.category ? `<span class="category">${service.category}</span>` : ''}
                    </div>
                    <a href="/docs/${service.slug}" class="btn">Lihat Dokumentasi →</a>
                </div>
            `).join('')}
        </div>
        ` : `
        <div class="empty-state">
            <h2>Belum ada service terdaftar</h2>
            <p>Tambahkan service pertama Anda melalui API</p>
        </div>
        `}
    </div>
</body>
</html>
    `
    
    res.send(html)
  } catch (error) {
    res.status(500).send(`
      <html>
        <body style="font-family: Arial; text-align: center; padding: 50px;">
          <h1>Error</h1>
          <p>${error.message}</p>
        </body>
      </html>
    `)
  }
})

// Serve Swagger UI assets untuk route /docs/:slug
router.use('/docs/:slug', swaggerUi.serve)

// Route untuk menampilkan dokumentasi Swagger per service
router.get('/docs/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params
    const serviceData = await serviceModule.getServiceBySlug(slug)
    const swaggerJson = await serviceModule.getSwaggerJson(serviceData.id)
    
    // Setup Swagger UI dengan JSON dari service
    const swaggerOptions = {
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: `${serviceData.name} - API Documentation`,
      customfavIcon: false
    }
    
    // Render Swagger UI dengan setup
    return swaggerUi.setup(swaggerJson, swaggerOptions)(req, res, next)
  } catch (error) {
    res.status(error.statusCode || 500).send(`
      <html>
        <head>
          <title>Error - Dokumentasi Tidak Ditemukan</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              text-align: center;
              padding: 50px;
              background: #f5f5f5;
            }
            .error-container {
              background: white;
              padding: 40px;
              border-radius: 8px;
              max-width: 600px;
              margin: 0 auto;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            h1 { color: #e74c3c; }
            a {
              color: #667eea;
              text-decoration: none;
              margin-top: 20px;
              display: inline-block;
            }
          </style>
        </head>
        <body>
          <div class="error-container">
            <h1>⚠️ Error</h1>
            <p>${error.message || 'Service tidak ditemukan'}</p>
            <a href="/docs">← Kembali ke Daftar Service</a>
          </div>
        </body>
      </html>
    `)
  }
})

if (isSwaggerEnabled()) {
  router.use('/documentation', swaggerUi.serve)
  router.get('/documentation', swaggerUi.setup(index, { isExplorer: false }))
}

module.exports = router

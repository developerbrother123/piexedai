"use server"

import { Pool } from "pg"
import fs from "fs"
import path from "path"
import bcrypt from "bcrypt"
import { v4 as uuidv4 } from "uuid"

interface DbConfig {
  type: string
  host: string
  port: string
  user: string
  password: string
  database: string
}

interface AdminUser {
  username: string
  email: string
  password: string
}

interface SiteConfig {
  siteName: string
  siteDescription: string
  siteUrl: string
  defaultModel: string
}

interface StorageConfig {
  type: string
  path: string
  cloudProvider: string
  apiKey: string
  bucket: string
  region: string
}

export async function installSystem(
  dbConfig: DbConfig,
  adminUser: AdminUser,
  siteConfig: SiteConfig,
  storageConfig: StorageConfig,
) {
  try {
    // 1. Connect to database
    const pool = new Pool({
      host: dbConfig.host,
      port: Number.parseInt(dbConfig.port),
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database,
    })

    // Test connection
    await pool.query("SELECT NOW()")

    // 2. Create tables
    await createDatabaseTables(pool)

    // 3. Create admin user
    const hashedPassword = await bcrypt.hash(adminUser.password, 10)
    const adminId = uuidv4()

    await pool.query(
      `INSERT INTO users (id, username, email, password, role, created_at, updated_at)
       VALUES ($1, $2, $3, $4, 'admin', NOW(), NOW())`,
      [adminId, adminUser.username, adminUser.email, hashedPassword],
    )

    // 4. Create site settings
    await pool.query(
      `INSERT INTO settings (key, value, created_at, updated_at)
       VALUES 
       ('site_name', $1, NOW(), NOW()),
       ('site_description', $2, NOW(), NOW()),
       ('site_url', $3, NOW(), NOW()),
       ('default_model', $4, NOW(), NOW())`,
      [siteConfig.siteName, siteConfig.siteDescription, siteConfig.siteUrl, siteConfig.defaultModel],
    )

    // 5. Create storage settings
    await pool.query(
      `INSERT INTO settings (key, value, created_at, updated_at)
       VALUES 
       ('storage_type', $1, NOW(), NOW()),
       ('storage_path', $2, NOW(), NOW()),
       ('cloud_provider', $3, NOW(), NOW()),
       ('cloud_api_key', $4, NOW(), NOW()),
       ('cloud_bucket', $5, NOW(), NOW()),
       ('cloud_region', $6, NOW(), NOW())`,
      [
        storageConfig.type,
        storageConfig.path,
        storageConfig.cloudProvider,
        storageConfig.apiKey,
        storageConfig.bucket,
        storageConfig.region,
      ],
    )

    // 6. Create default subscription plans
    await createDefaultSubscriptionPlans(pool)

    // 7. Create default AI models
    await createDefaultAIModels(pool)

    // 8. Create .env file
    await createEnvFile(dbConfig, siteConfig)

    // 9. Create installation lock file
    fs.writeFileSync(path.join(process.cwd(), "install", ".installed"), new Date().toISOString())

    return { success: true, message: "Installation completed successfully" }
  } catch (error) {
    console.error("Installation error:", error)
    return {
      success: false,
      message: "Installation failed",
      error: error.message,
    }
  }
}

async function createDatabaseTables(pool: Pool) {
  // Users table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL DEFAULT 'user',
      subscription_id UUID,
      subscription_status VARCHAR(50),
      subscription_expires_at TIMESTAMP,
      api_key VARCHAR(255),
      api_key_enabled BOOLEAN DEFAULT false,
      created_at TIMESTAMP NOT NULL,
      updated_at TIMESTAMP NOT NULL
    )
  `)

  // Settings table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS settings (
      id SERIAL PRIMARY KEY,
      key VARCHAR(255) NOT NULL UNIQUE,
      value TEXT,
      created_at TIMESTAMP NOT NULL,
      updated_at TIMESTAMP NOT NULL
    )
  `)

  // Subscription plans table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS subscription_plans (
      id UUID PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      price DECIMAL(10, 2) NOT NULL,
      interval VARCHAR(50) NOT NULL,
      features JSONB,
      model_access JSONB,
      usage_limits JSONB,
      created_at TIMESTAMP NOT NULL,
      updated_at TIMESTAMP NOT NULL
    )
  `)

  // Subscriptions table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id UUID PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES users(id),
      plan_id UUID NOT NULL REFERENCES subscription_plans(id),
      status VARCHAR(50) NOT NULL,
      current_period_start TIMESTAMP NOT NULL,
      current_period_end TIMESTAMP NOT NULL,
      cancel_at_period_end BOOLEAN DEFAULT false,
      payment_method VARCHAR(50),
      payment_id VARCHAR(255),
      created_at TIMESTAMP NOT NULL,
      updated_at TIMESTAMP NOT NULL
    )
  `)

  // AI models table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ai_models (
      id UUID PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      type VARCHAR(50) NOT NULL,
      provider VARCHAR(50) NOT NULL,
      model_id VARCHAR(255) NOT NULL,
      parameters JSONB,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP NOT NULL,
      updated_at TIMESTAMP NOT NULL
    )
  `)

  // Chat conversations table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS conversations (
      id UUID PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES users(id),
      title VARCHAR(255),
      model_id UUID REFERENCES ai_models(id),
      created_at TIMESTAMP NOT NULL,
      updated_at TIMESTAMP NOT NULL
    )
  `)

  // Chat messages table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id UUID PRIMARY KEY,
      conversation_id UUID NOT NULL REFERENCES conversations(id),
      role VARCHAR(50) NOT NULL,
      content TEXT NOT NULL,
      tokens INTEGER,
      created_at TIMESTAMP NOT NULL
    )
  `)

  // API usage table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS api_usage (
      id UUID PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES users(id),
      endpoint VARCHAR(255) NOT NULL,
      model_id UUID REFERENCES ai_models(id),
      tokens_input INTEGER,
      tokens_output INTEGER,
      created_at TIMESTAMP NOT NULL
    )
  `)

  // Storage items table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS storage_items (
      id UUID PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES users(id),
      filename VARCHAR(255) NOT NULL,
      original_filename VARCHAR(255) NOT NULL,
      mime_type VARCHAR(255) NOT NULL,
      size INTEGER NOT NULL,
      path VARCHAR(255) NOT NULL,
      storage_type VARCHAR(50) NOT NULL,
      created_at TIMESTAMP NOT NULL,
      updated_at TIMESTAMP NOT NULL
    )
  `)

  // Payments table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS payments (
      id UUID PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES users(id),
      subscription_id UUID REFERENCES subscriptions(id),
      amount DECIMAL(10, 2) NOT NULL,
      currency VARCHAR(10) NOT NULL,
      payment_method VARCHAR(50) NOT NULL,
      payment_id VARCHAR(255),
      status VARCHAR(50) NOT NULL,
      created_at TIMESTAMP NOT NULL,
      updated_at TIMESTAMP NOT NULL
    )
  `)
}

async function createDefaultSubscriptionPlans(pool: Pool) {
  const plans = [
    {
      id: uuidv4(),
      name: "Basic",
      description: "Access to Pi-o model with basic features",
      price: 9.99,
      interval: "month",
      features: JSON.stringify(["Text generation", "Question answering", "Basic chat"]),
      model_access: JSON.stringify(["Pi-o"]),
      usage_limits: JSON.stringify({
        messages_per_day: 100,
        tokens_per_message: 2000,
      }),
    },
    {
      id: uuidv4(),
      name: "Pro",
      description: "Access to Pi-o and Pi-Transformer models with advanced features",
      price: 19.99,
      interval: "month",
      features: JSON.stringify([
        "Text generation",
        "Question answering",
        "Advanced chat",
        "Code generation",
        "Creative writing",
      ]),
      model_access: JSON.stringify(["Pi-o", "Pi-Transformer"]),
      usage_limits: JSON.stringify({
        messages_per_day: 500,
        tokens_per_message: 4000,
      }),
    },
    {
      id: uuidv4(),
      name: "Super Pi",
      description: "Access to all models including Pi-Alpha with premium features",
      price: 49.99,
      interval: "month",
      features: JSON.stringify([
        "Text generation",
        "Question answering",
        "Premium chat",
        "Code generation",
        "Creative writing",
        "Image generation",
        "Music generation",
        "Video generation",
        "Emotional intelligence",
      ]),
      model_access: JSON.stringify(["Pi-o", "Pi-Transformer", "Pi-Alpha"]),
      usage_limits: JSON.stringify({
        messages_per_day: 2000,
        tokens_per_message: 8000,
      }),
    },
  ]

  for (const plan of plans) {
    await pool.query(
      `INSERT INTO subscription_plans (
        id, name, description, price, interval, features, model_access, usage_limits, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())`,
      [
        plan.id,
        plan.name,
        plan.description,
        plan.price,
        plan.interval,
        plan.features,
        plan.model_access,
        plan.usage_limits,
      ],
    )
  }
}

async function createDefaultAIModels(pool: Pool) {
  const models = [
    {
      id: uuidv4(),
      name: "Pi-o",
      description: "The foundational model, optimized for general-purpose tasks",
      type: "text",
      provider: "together_ai",
      model_id: "mistralai/Mistral-7B-Instruct-v0.2",
      parameters: JSON.stringify({
        temperature: 0.7,
        max_tokens: 2000,
        top_p: 0.9,
      }),
    },
    {
      id: uuidv4(),
      name: "Pi-Transformer",
      description: "An advanced model leveraging transformer architecture for complex tasks",
      type: "text",
      provider: "together_ai",
      model_id: "meta-llama/Llama-2-70b-chat-hf",
      parameters: JSON.stringify({
        temperature: 0.8,
        max_tokens: 4000,
        top_p: 0.95,
      }),
    },
    {
      id: uuidv4(),
      name: "Pi-Alpha",
      description: "A cutting-edge model with enhanced emotional intelligence and self-learning capabilities",
      type: "text",
      provider: "together_ai",
      model_id: "anthropic/claude-3-opus-20240229",
      parameters: JSON.stringify({
        temperature: 0.9,
        max_tokens: 8000,
        top_p: 0.98,
      }),
    },
  ]

  for (const model of models) {
    await pool.query(
      `INSERT INTO ai_models (
        id, name, description, type, provider, model_id, parameters, is_active, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, true, NOW(), NOW())`,
      [model.id, model.name, model.description, model.type, model.provider, model.model_id, model.parameters],
    )
  }
}

async function createEnvFile(dbConfig: DbConfig, siteConfig: SiteConfig) {
  const envContent = `
# Database Configuration
DB_TYPE=${dbConfig.type}
DB_HOST=${dbConfig.host}
DB_PORT=${dbConfig.port}
DB_USER=${dbConfig.user}
DB_PASSWORD=${dbConfig.password}
DB_NAME=${dbConfig.database}

# Application Configuration
NEXT_PUBLIC_APP_URL=${siteConfig.siteUrl}
NEXT_PUBLIC_API_URL=${siteConfig.siteUrl}/api

# JWT Secret (randomly generated)
JWT_SECRET=${uuidv4()}

# Together AI API Key (to be filled by admin)
TOGETHER_API_KEY=

# Crypto Payment API Key (to be filled by admin)
CRYPTO_API_KEY=
CRYPTO_SUPPORTED_CURRENCIES=BTC,ETH,USDT,USDC
`.trim()

  fs.writeFileSync(path.join(process.cwd(), ".env"), envContent)
}


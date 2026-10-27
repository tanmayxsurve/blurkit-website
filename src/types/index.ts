/**
 * BlurKit Database & API Types
 * Comprehensive TypeScript interfaces for all data models
 */

// =====================================================
// ORDER TYPES
// =====================================================

export interface Order {
  id: number
  dodo_session_id: string
  email: string
  plan_id: string
  amount: number
  status: OrderStatus
  completed_at: Date | null
  created_at: Date
  updated_at: Date
}

export type OrderStatus = 'pending' | 'completed' | 'failed' | 'refunded'

export interface CreateOrderInput {
  dodo_session_id: string
  email: string
  plan_id: string
  amount: number
}

// =====================================================
// LICENSE TYPES
// =====================================================

export interface License {
  id: number
  order_id: number | null
  key: string
  email: string
  plan: string
  status: LicenseStatus
  device_id: string | null
  activated_at: Date | null
  last_validated_at: Date | null
  expires_at: Date | null
  created_at: Date
  updated_at: Date
}

export type LicenseStatus = 'active' | 'suspended' | 'expired' | 'revoked'

export interface CreateLicenseInput {
  order_id: number | null
  key: string
  email: string
  plan: string
  status?: LicenseStatus
  expires_at?: Date | null
}

export interface ActivateLicenseInput {
  licenseKey: string
  deviceId: string
}

export interface ActivateLicenseResponse {
  success: boolean
  message?: string
  error?: string
  licenseKey?: string
  deviceId?: string
  boundDevice?: string
  details?: string
}

export interface ValidateLicenseInput {
  licenseKey: string
  deviceId: string
}

export interface ValidateLicenseResponse {
  valid: boolean
  message?: string
  error?: string
  reason?: string
  licenseKey?: string
  deviceId?: string
  plan?: string
  activatedAt?: Date
  details?: string
}

// =====================================================
// WEBHOOK EVENT TYPES
// =====================================================

export interface WebhookEvent {
  id: number
  event_id: string
  event_type: string
  payload: Record<string, any> | null
  processed: boolean
  created_at: Date
}

export interface DodoWebhookPayload {
  id: string
  event: string
  data: {
    session_id: string
    customer_email: string
    amount: number
    metadata?: Record<string, string>
  }
}

export type DodoWebhookEvent = 'payment.completed' | 'payment.failed' | 'payment.refunded'

// =====================================================
// PAYMENT TYPES
// =====================================================

export interface CheckoutSessionResponse {
  sessionId: string
  checkoutUrl: string
}

export interface CheckoutSessionRequest {
  planId: string
  email?: string
}

export interface DodoCheckoutSession {
  id: string
  url: string
  price_id: string
  customer_email?: string
  status: string
}

// =====================================================
// LICENSE GENERATION TYPES
// =====================================================

export interface GenerateLicenseKeyParams {
  email: string
  planId: string
}

// =====================================================
// EMAIL TYPES
// =====================================================

export interface SendLicenseEmailParams {
  email: string
  licenseKey: string
  plan: string
}

export interface EmailSendResult {
  success: boolean
  error?: string
  messageId?: string
}

// =====================================================
// DATABASE QUERY TYPES
// =====================================================

export interface QueryResult<T> {
  rows: T[]
  rowCount: number
}

// =====================================================
// API RESPONSE TYPES
// =====================================================

export interface ApiSuccessResponse<T = any> {
  success: true
  data?: T
  message?: string
}

export interface ApiErrorResponse {
  success: false
  error: string
  details?: string
  status?: number
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse

// =====================================================
// PRICING TYPES
// =====================================================

export interface PricingPlan {
  id: string
  name: string
  price: number
  period: 'monthly' | 'lifetime'
  description: string
  features: string[]
}

// =====================================================
// CUSTOMER TYPES
// =====================================================

export interface Customer {
  email: string
  licenses: License[]
  totalSpent: number
  joinedAt: Date
}

// =====================================================
// ANALYTICS TYPES
// =====================================================

export interface Analytics {
  totalLicenses: number
  activeLicenses: number
  totalRevenue: number
  ordersThisMonth: number
  avgOrderValue: number
  deviceBindings: number
}

export interface Order {
  id: string
  dodo_session_id: string
  email: string
  plan_id: string
  amount: number
  status: 'pending' | 'completed' | 'failed'
  created_at: Date
  completed_at?: Date
}

export interface License {
  id: string
  order_id: string
  key: string
  email: string
  plan: string
  status: 'active' | 'revoked' | 'expired'
  expires_at?: Date
  created_at: Date
}

export interface WebhookEvent {
  id: string
  event_id: string
  event_type: string
  processed_at: Date
}

/**
 * Gerador de payload PIX no padrão EMV QR Code
 * Baseado na especificação do Banco Central do Brasil
 */

function tlv(tag: string, value: string): string {
  const len = value.length.toString().padStart(2, '0')
  return tag + len + value
}

function crc16ccitt(str: string): string {
  let crc = 0xFFFF
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021
      } else {
        crc = crc << 1
      }
    }
    crc &= 0xFFFF
  }
  return crc.toString(16).toUpperCase().padStart(4, '0')
}

interface PixParams {
  key: string
  name: string
  city: string
  amount: number
  txid?: string
}

export function generatePixPayload({ key, name, city, amount, txid }: PixParams): string {
  const gui = 'br.gov.bcb.pix'

  // Merchant Account Information (tag 26)
  const merchantAccountInfo = tlv('26', tlv('00', gui) + tlv('01', key))

  // Additional Data (tag 62)
  const additionalData = tlv('62', tlv('05', txid || '***'))

  // Build payload without CRC
  let payload = ''
  payload += tlv('00', '01')            // Payload Format Indicator
  payload += merchantAccountInfo         // Merchant Account Info
  payload += tlv('52', '0000')           // Merchant Category Code
  payload += tlv('53', '986')            // Transaction Currency (BRL)
  payload += tlv('54', amount.toFixed(2))// Transaction Amount
  payload += tlv('58', 'BR')            // Country Code
  payload += tlv('59', name.substring(0, 25)) // Merchant Name (max 25 chars)
  payload += tlv('60', city.substring(0, 15)) // Merchant City (max 15 chars)
  payload += additionalData              // Additional Data
  payload += '6304'                      // CRC tag + length (placeholder)

  // Calculate CRC16 and append
  const crc = crc16ccitt(payload)
  payload += crc

  return payload
}

// Configurações do PIX da LapidaAI
export const PIX_CONFIG = {
  key: '+5561991995261',
  name: 'LapidaAI',
  city: 'BRASILIA',
  amount: 9.90,
  txid: 'LAPIDAAI',
}

export function getLapidaPixPayload(): string {
  return generatePixPayload(PIX_CONFIG)
}

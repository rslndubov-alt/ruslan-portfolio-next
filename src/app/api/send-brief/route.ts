import { NextRequest, NextResponse } from 'next/server';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export async function POST(req: NextRequest) {
  try {
    if (!BOT_TOKEN || !CHAT_ID) {
      console.error('Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID');
      return NextResponse.json({ error: 'Telegram not configured' }, { status: 500 });
    }

    const { data } = await req.json();
    if (!data) return NextResponse.json({ error: 'No data' }, { status: 400 });

    // Format the brief as a beautiful Telegram message
    const message = `🔔 *НОВЫЙ БРИФ С САЙТА*

📌 *Услуга:* ${data.service || '—'}
📝 *Описание:* ${data.description || '—'}
📏 *Объём/Хронометраж:* ${data.volume || '—'}
⏰ *Сроки:* ${data.timeline || '—'}
💰 *Бюджет:* ${data.budget || '—'}

👤 *Контакт:* ${data.contact || 'Не указан'}
📧 *Email:* ${data.email || 'Не указан'}

🕐 _${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Kiev' })}_`;

    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    const result = await res.json();
    if (!result.ok) {
      console.error('Telegram API error:', result);
      return NextResponse.json({ error: 'Telegram send failed' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Send brief error:', err);
    return NextResponse.json({ error: 'Failed to send brief' }, { status: 500 });
  }
}

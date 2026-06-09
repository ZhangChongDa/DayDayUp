/** 将 Markdown 回复整理为适合 TTS 的纯文本 */

export function prepareTextForTts(raw: string, maxLength = 2000): string {
  let text = raw
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\$\$[\s\S]*?\$\$/g, ' ')
    .replace(/\$([^$]+)\$/g, '$1')
    .replace(/!\[[^\]]*]\([^)]+\)/g, ' ')
    .replace(/\[([^\]]+)]\([^)]+\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_~>#-]/g, '')
    .replace(/\n+/g, '。')
    .replace(/\s{2,}/g, ' ')
    .trim()

  if (text.length > maxLength) {
    text = `${text.slice(0, maxLength)}…`
  }

  return text
}

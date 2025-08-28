// emoji.js
// Text-to-Emoji Translator logic

document.addEventListener('DOMContentLoaded', function() {
  const $ = (s)=>document.querySelector(s);
  const input = $('#input');
  const output = $('#output');
  const translateBtn = $('#translateBtn');
  const clearBtn = $('#clearBtn');
  const downloadBtn = $('#downloadBtn');
  const copyBtn = $('#copyBtn');
  const replaceStat = $('#replaceStat');
  const emojiCount = $('#emojiCount');
  const wordStat = $('#wordStat');
  const charCount = $('#charCount');
  const year = new Date().getFullYear();
  $('#year').textContent = year;

  // Skin‑tone capable emojis list (only hand gestures get tone).
  const TONEABLE = new Set(['👋','👌','👍','👎','👏','🙏']);

  input.addEventListener('input', ()=>{
    charCount.textContent = `${input.value.length} chars`;
  });

  translateBtn.addEventListener('click', ()=>{
    const res = translate(input.value);
    output.value = res.text;
    replaceStat.textContent = `${res.replacements} replacements`;
    emojiCount.textContent = `${res.emojiCount} emojis`;
    wordStat.textContent = `${res.wordsMatched} sentences detected`;
  });

  clearBtn.addEventListener('click', ()=>{
    input.value='';
    output.value='';
    charCount.textContent='0 chars';
    replaceStat.textContent='0 replacements';
    emojiCount.textContent='0 emojis';
    wordStat.textContent='0 sentences detected';
  });

  downloadBtn.addEventListener('click', ()=>{
    const blob = new Blob([output.value], {type:'text/plain;charset=utf-8'});
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'emoji-translation.txt'; a.click(); URL.revokeObjectURL(a.href);
  });

  copyBtn.addEventListener('click', async ()=>{
    try{
      await navigator.clipboard.writeText(output.value);
      copyBtn.textContent='Copied!';
      setTimeout(()=>copyBtn.textContent='Copy Text', 1200);
    }catch(e){
      alert('Copy not supported in this browser.');
    }
  });

  function applySkinTone(symbol){
    // Skin tone selection removed, just return symbol
    return symbol;
  }

  // Simple sentence sentiment/context detection for emoji
  function getSentenceEmoji(sentence) {
    const s = sentence.toLowerCase();
    if (/\b(thank|thanks|grateful|appreciate)\b/.test(s)) return '🙏';
    if (/\b(happy|joy|great|awesome|good|love|excited|fun)\b/.test(s)) return '😄';
    if (/\b(sad|cry|unhappy|bad|upset|depressed)\b/.test(s)) return '😢';
    if (/\b(angry|mad|furious|annoyed)\b/.test(s)) return '😠';
    if (/\b(hello|hi|hey|greetings|bye|goodbye)\b/.test(s)) return '👋';
    if (/\b(party|celebrate|birthday|congrats|congratulations)\b/.test(s)) return '🎉';
    if (/\b(work|office|job|meeting|code|study|learn|school|college)\b/.test(s)) return '💼';
    if (/\b(coffee|tea|drink|beverage)\b/.test(s)) return '☕️';
    if (/\b(travel|trip|vacation|holiday|journey|flight|car|bus|train)\b/.test(s)) return '✈️';
    if (/\b(music|song|dance|sing)\b/.test(s)) return '🎵';
    if (/\b(sick|ill|unwell|doctor|hospital)\b/.test(s)) return '🤒';
    if (/\b(win|winner|success|trophy|champion)\b/.test(s)) return '🏆';
    if (/\b(friend|friends|family|bro|sis|people)\b/.test(s)) return '🧑‍🤝‍🧑';
    if (/\b(sun|sunny|beach|mountain|nature|outdoors)\b/.test(s)) return '🌞';
    if (/\b(rain|storm|cloud|weather|snow)\b/.test(s)) return '🌧️';
    if (/\b(food|eat|pizza|burger|fries|ice cream|chocolate)\b/.test(s)) return '🍕';
    if (/\b(phone|call|message|text|email)\b/.test(s)) return '📱';
    if (/\b(idea|smart|brain|think|thought)\b/.test(s)) return '💡';
    if (/\b(error|fail|mistake|wrong|warning)\b/.test(s)) return '⚠️';
    return '✨'; // Default emoji for other sentences
  }

  function translate(text){
    if(!text) return {text:'', replacements:0, emojiCount:0, wordsMatched:0};
    // Split text into sentences (simple split by . ! ?)
    const sentences = text.match(/[^.!?]+[.!?]?/g) || [];
    let result = '', replacements = 0, emojis = 0, wordsMatched = 0;
    for (let sentence of sentences) {
      const emoji = getSentenceEmoji(sentence);
      result += sentence.trim() ? sentence.trim() + ' ' + emoji + ' ' : '';
      replacements++;
      emojis++;
    }
    return { text: result.trim(), replacements, emojiCount: emojis, wordsMatched: sentences.length };
  }

  // Demo starter text
  input.value = 'Good morning! Going to the gym, then coffee and code with friends. Road trip soon? Thanks!';
  translateBtn.click();
});

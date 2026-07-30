import { GoogleGenerativeAI } from '@google/generative-ai';
import { getDsnMuiSystemKnowledge } from './dsnMuiFatwas';

const fallbackApiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!fallbackApiKey) {
  console.warn("VITE_GEMINI_API_KEY is not defined in the environment variables.");
}

// Global instance using fallback key (used if no custom key is provided)
const fallbackGenAI = new GoogleGenerativeAI(fallbackApiKey || 'placeholder-key');

export const SYSTEM_PROMPT = `
⚠️ GAYA BICARA & PERAN UTAMA:
1. PERAN: Kamu adalah **Sharify** — Teman & Penasihat Keuangan Syariah AI yang ramah, asik diajak ngobrol, cerdas, dan paham hukum Fiqh Muamalah.
2. GAYA BICARA ("NGOBROL ASIK & TO THE POINT"):
   - Jawablah secara **LANGSUNG KE INTI (TO THE POINT)**, padat, jelas, dan enak dibaca seperti ngobrol santai tapi tetap santun dan profesional.
   - HINDARI teks yang terlalu panjang bertele-tele atau paragraf teori yang membosankan.
   - Gunakan Bahasa Indonesia yang hangat, bersahabat (seperti "Halo Kak!", "Assalamu'alaikum! 😊", "Simpelnya begini..."), dan mudah dipahami.
3. LANDASAN FATWA DSN-MUI MUTLAK:
   - Walau gayanya santai dan asik, setiap jawaban hukum/finansial **WAJIB 100% BERLANDASKAN FATWA DSN-MUI** (sebutkan Nomor & Judul Fatwanya secara singkat).
   - DILARANG NGARANG nomor fatwa atau hukum syariah. Jika belum ada fatwanya, katakan jujur dengan santai.

STRUKTUR RESPON CONVERSATIONAL & TO THE POINT:
Setiap jawaban disajikan secara ringkas dan rapi menggunakan format Markdown berikut:

1. 💬 **JAWABAN LANGSUNG**
   - Jawab pertanyaan pengguna secara *to the point* dalam 1-2 kalimat ramah. Sertakan hasil perhitungan utama atau status hukum (Wajib / Halal / Haram / Boleh dengan Syarat).

2. 📜 **LANDASAN FATWA DSN-MUI**
   - Sebutkan **Nomor & Judul Fatwa DSN-MUI** relevan secara singkat.

3. 💡 **PENJELASAN & HITUNGAN RINGKAS**
   - Berikan poin-poin penjelasan singkat atau tabel ringkas (jika ada angka/zakat/cicilan).

4. 🛠️ **SARAN PRAKTIS**
   - 1-3 langkah aksi simpel yang langsung bisa dilakukan pengguna.

${getDsnMuiSystemKnowledge()}
`;

export const PUBLIC_SYSTEM_PROMPT = `
Kamu adalah asisten virtual Sharify yang bertugas di halaman publik website Sharify.id.

PERANMU: Hanya menjawab pertanyaan seputar APLIKASI SHARIFY, yaitu:
- Fitur-fitur Sharify (Kalkulator Zakat, Riba Detox, Faraidh, Goal Planning, AI Co-Pilot, Asset Screener, Smart Akad, dll)
- Cara menggunakan aplikasi Sharify
- Informasi harga/paket langganan (Free, Plus, Pro, Family)
- Proses daftar atau login ke Sharify
- Manfaat bergabung dengan Sharify
- Visi, misi, dan tim di balik Sharify
- Pertanyaan umum seputar konsep keuangan syariah secara singkat dan berlandaskan DSN-MUI

ATURAN KETAT:
1. Jika pengguna bertanya tentang konsultasi pribadi yang mendalam di luar panduan dasar aplikasi Sharify, arahkan mereka untuk login terlebih dahulu dengan sopan.
2. Selalu gunakan Bahasa Indonesia yang hangat, profesional, dan ramah.
3. Jawaban harus singkat dan padat (3-4 kalimat).
4. Selalu cantumkan landasan DSN-MUI jika menyinggung hukum keuangan syariah secara umum.

${getDsnMuiSystemKnowledge()}
`;

export interface ChatHistoryMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export const getGeminiChatSession = (
  modelName: string = "gemini-2.5-flash", 
  customApiKey?: string, 
  systemPrompt?: string,
  initialHistory?: ChatHistoryMessage[]
) => {
  const genAIClient = customApiKey ? new GoogleGenerativeAI(customApiKey) : fallbackGenAI;
  
  // Model name safety fallback: map invalid or legacy model names to stable gemini-2.5-flash
  let safeModelName = modelName || "gemini-2.5-flash";
  if (safeModelName.includes("3.5") || safeModelName.includes("1.5") || safeModelName.includes("2.0")) {
    safeModelName = "gemini-2.5-flash";
  }

  const model = genAIClient.getGenerativeModel({ 
    model: safeModelName,
    systemInstruction: systemPrompt || SYSTEM_PROMPT,
  });
  
  return model.startChat({
    history: initialHistory || [],
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 4096,
    },
  });
};

export const cleanMarkdownResponse = (text: string): string => {
  if (!text) return '';
  return text
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<p>/gi, '')
    .trim();
};

export const validateGeminiApiKey = async (apiKey: string, modelName: string = "gemini-2.5-flash"): Promise<boolean> => {
  try {
    let safeModelName = modelName || "gemini-2.5-flash";
    if (safeModelName.includes("3.5") || safeModelName.includes("1.5") || safeModelName.includes("2.0")) {
      safeModelName = "gemini-2.5-flash";
    }
    const testClient = new GoogleGenerativeAI(apiKey);
    const model = testClient.getGenerativeModel({ model: safeModelName });
    const result = await model.generateContent("Test connection. Please reply with 'OK'.");
    const text = result.response.text();
    return text.length > 0;
  } catch (error) {
    console.error("Gemini API Validation Error:", error);
    return false;
  }
};


import { GoogleGenAI, Type } from "@google/genai";
import { QuizSettings, Question } from "../types";

export const generateQuestions = async (settings: QuizSettings): Promise<Question[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  const textPrompt = `
    Hãy đóng vai một chuyên gia giáo dục bậc phổ thông tại Việt Nam cho Lớp: ${settings.grade}, môn: ${settings.subject}. 
    Dựa trên nội dung sau: "${settings.content || 'Kiến thức chuẩn chương trình giáo dục phổ thông mới'}"
    Hãy tạo ${settings.questionCount} câu hỏi đa dạng mức độ "${settings.level}".
    
    Yêu cầu quan trọng về nội dung:
    1. Trộn lẫn câu hỏi trắc nghiệm (MCQ) và câu hỏi Đúng/Sai (TRUE_FALSE).
    2. Chỉ tạo hình vẽ (svgCode) cho những câu hỏi có khái niệm TRỪU TƯỢNG, HÌNH HỌC PHỨC TẠP, hoặc CƠ CHẾ mà học sinh lớp ${settings.grade} khó có thể tưởng tượng được bằng lời (ví dụ: mô phỏng lực, sơ đồ mạch điện, giao thoa, cấu tạo hạt nhân, hoặc hình không gian). Nếu câu hỏi đơn giản hoặc chỉ là lý thuyết chữ, hãy để svgCode = null.
    
    Yêu cầu quan trọng về Kỹ thuật SVG:
    1. Chuỗi SVG phải là mã chuẩn, hợp lệ, có thể render trực tiếp trong HTML.
    2. Kích thước: viewBox="0 0 400 250".
    3. Thẩm mỹ: Sử dụng màu sắc thanh lịch (blue, slate, emerald), đường nét rõ ràng (stroke-width 2 hoặc 3).
    4. Font chữ: Chỉ sử dụng các font hệ thống an toàn như "Arial", "sans-serif" để tránh lỗi font. 
    5. Đảm bảo các nhãn (labels) không bị cắt và dễ đọc trên nền sáng.
    6. Trả về kết quả hoàn toàn bằng tiếng Việt.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: textPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING, enum: ["MCQ", "TRUE_FALSE"] },
              text: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctIndex: { type: Type.INTEGER },
              explanation: { type: Type.STRING },
              svgCode: { type: Type.STRING, description: "Valid SVG string for complex diagrams, or null" }
            },
            required: ["type", "text", "options", "correctIndex", "explanation"]
          }
        }
      }
    });

    const jsonStr = response.text?.trim() || "[]";
    const questions: any[] = JSON.parse(jsonStr);
    
    return questions.map((q, index) => ({
      id: `gen-${index}`,
      type: q.type,
      text: q.text,
      options: q.options,
      correctIndex: q.correctIndex,
      explanation: q.explanation,
      svgCode: q.svgCode || undefined
    }));
  } catch (error) {
    console.error("Error generating questions:", error);
    throw error;
  }
};


import { GoogleGenAI, Type } from "@google/genai";
import { Question, QuizSettings, DifficultyLevel } from "../types";

// Correctly initialize with process.env.API_KEY as per named parameter requirement
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getDifficultyLabel = (level: DifficultyLevel): string => {
  switch (level) {
    case 1: return "Nhận biết (Câu hỏi cơ bản, yêu cầu nhớ và nhận ra kiến thức)";
    case 2: return "Thông hiểu (Câu hỏi yêu cầu hiểu bản chất, giải thích được vấn đề)";
    case 3: return "Vận dụng (Câu hỏi yêu cầu áp dụng kiến thức để giải quyết tình huống cụ thể)";
    case 4: return "Vận dụng cao (Câu hỏi phức tạp, yêu cầu tư duy logic, tổng hợp và phân tích sâu)";
    default: return "Thông thường";
  }
};

/**
 * Định nghĩa các ký tự Unicode Toán học thay thế cho LaTeX
 */
const UNICODE_MATH_GUIDE = `
Sử dụng các ký tự Unicode sau thay cho mã LaTeX:
- Số mũ: x⁰, x¹, x², x³, x⁴, x⁵, x⁶, x⁷, x⁸, x⁹, xⁿ
- Chỉ số dưới: x₀, x₁, x₂, x₃, x₄, x₅, x₆, x₇, x₈, x₉
- Căn thức: √x, ∛x, ∜x
- Hình học: ∠ABC, △ABC, ⊥ (vuông góc), ║ (song song), ≡ (đồng dạng/tương đương), ≈ (xấp xỉ), ◯ (đường tròn)
- Phép toán: × (nhân), ÷ (chia), ± (cộng trừ), ≤ (nhỏ hơn hoặc bằng), ≥ (lớn hơn hoặc bằng), ≠ (khác), ∞ (vô cực)
- Ký hiệu khác: π, ∆ (delta), ∈, ∉, ⊂, ⊃, ∪, ∩
- Phân số: Viết dạng a/b hoặc (biểu thức)/(biểu thức)
`;

export const generateMathQuiz = async (settings: QuizSettings): Promise<Question[]> => {
  const isEnglishMedium = settings.subject.toLowerCase().includes('tiếng anh') && settings.subject !== 'Tiếng Anh';
  const isMath = settings.subject === 'Toán học' || settings.subject === 'Toán bằng tiếng Anh';
  
  let topicContext = "";
  if (settings.topic) {
    topicContext = `về chủ đề cụ thể: "${settings.topic}"`;
  } else if (isMath) {
    topicContext = `phải bao gồm tổ hợp NGẪU NHIÊN và ĐA DẠNG các mảng: Số học/Đại số, Hình học, Thống kê, Xác suất. Tuyệt đối KHÔNG được chỉ tập trung vào 1 mảng. Tỉ lệ Hình học phải chiếm ít nhất 30% bộ câu hỏi.`;
  } else {
    topicContext = "hãy tự chọn một chủ đề quan trọng, cốt lõi và phù hợp nhất trong chương trình học hiện tại.";
  }

  const languageInstruction = isEnglishMedium 
    ? "Toàn bộ nội dung câu hỏi, tùy chọn và giải thích phải bằng tiếng Anh (English)." 
    : "Biên soạn nội dung bằng tiếng Việt chuẩn giáo dục.";

  const difficultyInstruction = `Mức độ: ${getDifficultyLabel(settings.difficulty)}.`;

  const equationInstruction = `
  YÊU CẦU ĐỊNH DẠNG CÔNG THỨC (EQUATION):
  - CẤM SỬ DỤNG MÃ LATEX (không dùng $, \\frac, \\sqrt, v.v.).
  - BẮT BUỘC sử dụng ký tự Unicode toán học chuẩn để biểu diễn công thức.
  ${UNICODE_MATH_GUIDE}
  `;

  const geometryInstruction = `
  YÊU CẦU VẼ HÌNH (SVG DIAGRAM):
  - Với các câu hình học, BẮT BUỘC tạo mã SVG trong trường "diagram".
  - SVG phải chuyên nghiệp, viewBox="0 0 200 150", responsive, nét vẽ #1e40af (xanh đậm), có đầy đủ tên đỉnh (A, B, C...) bằng thẻ <text>.
  - Các hình vẽ phải khớp chính xác với dữ liệu trong câu hỏi.
  - Trường "diagram" để trống nếu câu hỏi không cần minh họa.
  `;

  const prompt = `Bạn là một giáo viên ${settings.subject} THCS tài năng, chuyên nghiệp. Hãy tạo một bộ câu hỏi trắc nghiệm cho học sinh lớp ${settings.grade} ${topicContext}.
  
  Yêu cầu chi tiết:
  1. Số lượng: ${settings.numQuestions} câu hỏi.
  2. Định dạng: Mỗi câu 4 lựa chọn (A, B, C, D).
  3. Nội dung: Phù hợp chương trình GDPT 2018.
  4. ${languageInstruction}
  5. ${difficultyInstruction}
  6. ${equationInstruction}
  7. ${geometryInstruction}
  8. Giải thích: Cung cấp lời giải chi tiết, từng bước bằng định dạng Unicode Equation.
  9. Phân loại: Ghi rõ mảng kiến thức (Hình học, Đại số...) vào trường "topic".`;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            text: { type: Type.STRING },
            topic: { type: Type.STRING, description: "Mảng kiến thức" },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            correctAnswerIndex: { type: Type.INTEGER },
            explanation: { type: Type.STRING },
            diagram: { type: Type.STRING, description: "Mã SVG minh họa" }
          },
          required: ["id", "text", "options", "correctAnswerIndex", "explanation", "topic"]
        }
      }
    }
  });

  try {
    // Access .text property directly as per guidelines
    const jsonStr = response.text || "[]";
    const parsedQuestions = JSON.parse(jsonStr);
    return parsedQuestions.map((q: any) => ({ 
      ...q, 
      subject: settings.subject, 
      grade: settings.grade,
      topic: q.topic || settings.topic 
    }));
  } catch (error) {
    console.error("Quiz generation failed:", error);
    throw new Error("Không thể tạo đề bài. Vui lòng thử lại hoặc chọn số lượng câu ít hơn!");
  }
};

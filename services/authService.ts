
import { User, UserRole } from "../types";

const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/1eVT9Ci_3UJZ9rIzSkNfwn0ph9HmS84CXnB5Uq8eGm84/export?format=csv&gid=0";

// Fix: Wrap the intersection in parentheses to correctly specify an array of user objects with an optional password
export const fetchUsersFromSheet = async (): Promise<(User & { password?: string })[]> => {
  try {
    const response = await fetch(SHEET_CSV_URL);
    const csvText = await response.text();
    const rows = csvText.split('\n').slice(1);
    
    // Fix: Explicitly type the users array to match the intended return type instead of using any[]
    const users: (User & { password?: string })[] = [];

    rows.forEach(row => {
      const parts = row.split(',').map(s => s.trim());
      if (parts.length < 2) return;

      const rawAccount = parts[0];
      const password = parts[1];
      const fullName = parts[3] || rawAccount;

      if (rawAccount.includes('-')) {
        // Định dạng: giáo viên-học sinh
        const [teacherName, studentName] = rawAccount.split('-').map(s => s.trim());
        users.push({
          username: studentName,
          password: password,
          role: 'STUDENT' as UserRole,
          fullName: studentName, // Ưu tiên tên học sinh sau dấu gạch
          teacherId: teacherName
        });
        
        // Đồng thời tạo tài khoản giáo viên nếu chưa tồn tại trong danh sách xử lý (hoặc coi như giáo viên đó có tồn tại)
        if (!users.find(u => u.username === teacherName)) {
           users.push({
             username: teacherName,
             password: '123', // Mật khẩu mặc định cho GV nếu không có dòng riêng
             role: 'TEACHER' as UserRole,
             fullName: teacherName
           });
        }
      } else {
        // Chỉ có tên -> Tài khoản Giáo viên
        users.push({
          username: rawAccount,
          password: password || '123',
          role: 'TEACHER' as UserRole,
          fullName: fullName
        });
      }
    });

    // Tài khoản admin mặc định
    users.push({
      username: 'admin',
      password: '123',
      role: 'TEACHER',
      fullName: 'Quản trị viên'
    });

    return users;
  } catch (error) {
    console.error("Lỗi khi tải danh sách người dùng:", error);
    // Fix: Return an empty array cast to the correct type to satisfy the return signature
    return [] as (User & { password?: string })[];
  }
};

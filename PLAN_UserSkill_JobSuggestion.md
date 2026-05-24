# KẾ HOẠCH: Thêm Kỹ Năng Cá Nhân & Gợi Ý Công Việc cho Ứng Viên
> **Trạng thái: ✅ HOÀN THÀNH** (Backend + Frontend)  
> Cập nhật: 17/05/2026

## Mục tiêu
- Cho phép ứng viên nhập danh sách kỹ năng của bản thân trong hồ sơ cá nhân.
- Dựa trên kỹ năng đó, hệ thống gợi ý các công việc phù hợp (có yêu cầu kỹ năng tương ứng).

---

## PHÂN TÍCH HIỆN TRẠNG

| Thành phần | Trạng thái |
|---|---|
| Model `Skill` | Đã có – chỉ liên kết với `JobSkill` (Job ↔ Skill) |
| Model `UserSkill` | **Chưa có** – cần tạo mới |
| `User` → Skills | **Chưa có** navigation property |
| Gợi ý công việc theo kỹ năng | **Chưa có** |

---

## BACKEND – CÁC BƯỚC THỰC HIỆN

### Bước 1 – Tạo Model `UserSkill`

**File:** `Models/UserSkill.cs`

```csharp
public class UserSkill
{
    public int userId { get; set; }
    public virtual User user { get; set; }

    public int skillId { get; set; }
    public virtual Skill skill { get; set; }
}
```

- Khóa chính phức hợp: `(userId, skillId)`
- Không có trường thêm (đơn giản, chỉ cần biết user có kỹ năng gì)

---

### Bước 2 – Cập nhật Model `User` và `Skill`

**File:** `Models/User.cs`
- Thêm: `public virtual ICollection<UserSkill> userSkills { get; set; }`

**File:** `Models/Skill.cs`
- Thêm: `public virtual ICollection<UserSkill> userSkills { get; set; }`

---

### Bước 3 – Cập nhật `AppDbContext`

**File:** `Data/AppDbContext.cs`
- Thêm: `public DbSet<UserSkill> UserSkills { get; set; }`
- Trong `OnModelCreating`, cấu hình:
  - Composite key `(userId, skillId)`
  - Quan hệ User ↔ UserSkill (Cascade Delete khi User bị xóa)
  - Quan hệ Skill ↔ UserSkill (Restrict khi Skill bị xóa)

---

### Bước 4 – Tạo Migration

```bash
dotnet ef migrations add AddUserSkillTable
dotnet ef database update
```

---

### Bước 5 – Tạo DTOs

**File:** `DTOs/UserSkillDto.cs`

```
// Request: ứng viên gửi lên khi thêm/xóa kỹ năng
UserSkillRequest
  - skillId: int

// Response: trả về danh sách kỹ năng của user
UserSkillResponse
  - skillId: int
  - skillName: string

// Response: gợi ý công việc
JobSuggestionResponse
  - id: int
  - title: string
  - companyName: string
  - companyLogoUrl: string
  - locationName: string
  - jobType: string
  - salaryMin / salaryMax: decimal?
  - matchedSkills: List<string>   // Kỹ năng trùng khớp giữa user và job
  - matchScore: int               // Số kỹ năng khớp / tổng kỹ năng job yêu cầu (%)
  - deadline: DateTime
  - imageUrl: string?
```

- Cập nhật `UserProfileResponse` để thêm `List<UserSkillResponse>? Skills`

---

### Bước 6 – Tạo Repository

**File:** `Repositories/Interfaces/IUserSkillRepository.cs`
```
GetUserSkillsAsync(int userId)             → List<UserSkill>
AddSkillAsync(int userId, int skillId)     → void
RemoveSkillAsync(int userId, int skillId)  → void
SkillExistsForUserAsync(int userId, int skillId) → bool
GetJobSuggestionsAsync(int userId)         → List<Job>  (join qua UserSkill → Skill → JobSkill → Job)
```

**File:** `Repositories/UserSkillRepository.cs`
- `GetJobSuggestionsAsync`: Query các Job có ít nhất 1 kỹ năng trùng với kỹ năng của user,
  sắp xếp theo số lượng kỹ năng khớp (giảm dần), chỉ lấy Job có `status = Open` và `deadline > Now`.

---

### Bước 7 – Tạo Service

**File:** `Services/Interfaces/IUserSkillService.cs`
```
GetUserSkillsAsync(int userId)
AddSkillToUserAsync(int userId, int skillId)
RemoveSkillFromUserAsync(int userId, int skillId)
GetJobSuggestionsAsync(int userId)
```

**File:** `Services/UserSkillService.cs`
- `AddSkillToUserAsync`: Kiểm tra kỹ năng tồn tại trong bảng Skill, kiểm tra user chưa có kỹ năng đó.
- `GetJobSuggestionsAsync`: Gọi repository, map kết quả sang `JobSuggestionResponse`,
  tính `matchScore = (số skill khớp / tổng skill yêu cầu của job) * 100`.

---

### Bước 8 – Tạo Controller

**File:** `Controllers/UserSkillController.cs`

| Method | Route | Mô tả | Auth |
|---|---|---|---|
| GET | `/api/userskill` | Lấy danh sách kỹ năng của user hiện tại | [Authorize] |
| POST | `/api/userskill/{skillId}` | Thêm kỹ năng cho user | [Authorize] |
| DELETE | `/api/userskill/{skillId}` | Xóa kỹ năng của user | [Authorize] |
| GET | `/api/userskill/suggestions` | Gợi ý công việc dựa trên kỹ năng | [Authorize] |

---

### Bước 9 – Cập nhật AutoMapper

**File:** `Mappings/AutoMapperProfile.cs`
- Thêm map `UserSkill → UserSkillResponse`
- Thêm map `Job → JobSuggestionResponse`
- Thêm map cho `User.userSkills` trong profile `User → UserProfileResponse`

---

### Bước 10 – Đăng ký DI

**File:** `Program.cs`
- Đăng ký `IUserSkillRepository` → `UserSkillRepository`
- Đăng ký `IUserSkillService` → `UserSkillService`

---

## FRONTEND – CÁC BƯỚC THỰC HIỆN (làm sau backend)

### Bước 1 – Cập nhật Types
- Thêm `UserSkillResponse`, `JobSuggestionResponse` vào `types/`

### Bước 2 – Tạo Service gọi API
- `services/userSkillService.ts`:
  - `getUserSkills()`
  - `addSkill(skillId)`
  - `removeSkill(skillId)`
  - `getJobSuggestions()`

### Bước 3 – Tạo Component `SkillsSection`
- Hiển thị danh sách kỹ năng hiện tại (dạng tag/badge)
- Nút "Thêm kỹ năng": mở modal chứa dropdown/autocomplete chọn kỹ năng từ danh sách có sẵn (gọi API `/api/skill`)
- Nút xóa từng kỹ năng (icon X trên tag)
- Chỉ hiện nút thêm/xóa khi đang xem profile của chính mình

### Bước 4 – Tạo Component `JobSuggestions`
- Hiển thị danh sách công việc được gợi ý
- Mỗi card hiển thị: tên job, công ty, địa điểm, lương, % phù hợp (`matchScore`), danh sách kỹ năng khớp
- Nút "Xem chi tiết" → điều hướng đến trang chi tiết job
- Chỉ hiện với role = Candidate

### Bước 5 – Tích hợp vào trang Profile
- Tab hoặc section "Kỹ năng" trong trang profile ứng viên
- Section "Công việc gợi ý cho bạn" dưới phần kỹ năng (chỉ hiện khi user đã thêm ít nhất 1 kỹ năng)

---

## THỨ TỰ THỰC HIỆN

```
[Backend] ✅ HOÀN THÀNH
1.  ✅ Model UserSkill              → Models/UserSkill.cs
2.  ✅ Cập nhật User.cs, Skill.cs   → thêm navigation property userSkills
3.  ✅ Cập nhật AppDbContext        → DbSet<UserSkill> + OnModelCreating
4.  ✅ Migration                    → AddUserSkillTable (dotnet ef database update)
5.  ✅ DTOs                         → DTOs/UserSkillDto.cs (UserSkillRequest/Response, JobSuggestionResponse)
6.  ✅ Cập nhật UserProfileResponse → thêm Skills: List<UserSkillResponse>
7.  ✅ IUserSkillRepository         → Repositories/Interfaces/IUserSkillRepository.cs
8.  ✅ UserSkillRepository          → Repositories/UserSkillRepository.cs
9.  ✅ IUserSkillService            → Services/Interfaces/IUserSkillService.cs
10. ✅ UserSkillService             → Services/UserSkillService.cs
11. ✅ UserSkillController          → Controllers/UserSkillController.cs (4 endpoints)
12. ✅ AutoMapper                   → Mappings/AutoMapperProfile.cs (thêm Skills mapping)
13. ✅ ProfileRepository            → Thêm .Include(u => u.userSkills).ThenInclude(us => us.skill)
14. ✅ DI Registration              → Program.cs (IUserSkillRepository + IUserSkillService)

[Frontend] ✅ HOÀN THÀNH
15. ✅ Types                        → types/profile.ts (UserSkillResponse, JobSuggestionResponse)
16. ✅ API Service                  → services/userSkillService.ts
17. ✅ skillService.ts              → thêm getAll() endpoint public
18. ✅ Component SkillsSection      → components/common/Clients/SkillsSection.tsx
19. ✅ Component JobSuggestions     → components/common/Clients/JobSuggestions.tsx
20. ✅ Tích hợp MyProfilePage       → pages/client/MyProfilePage.tsx
```

---

## TÓM TẮT CÁC FILE ĐÃ TẠO / CHỈNH SỬA

### Backend – File mới tạo
| File | Mô tả |
|---|---|
| `Models/UserSkill.cs` | Model bảng trung gian User ↔ Skill |
| `DTOs/UserSkillDto.cs` | DTO cho UserSkill và JobSuggestion |
| `Repositories/Interfaces/IUserSkillRepository.cs` | Interface repository |
| `Repositories/UserSkillRepository.cs` | Implementation repository + logic gợi ý job |
| `Services/Interfaces/IUserSkillService.cs` | Interface service |
| `Services/UserSkillService.cs` | Business logic (thêm/xóa kỹ năng, gợi ý việc làm) |
| `Controllers/UserSkillController.cs` | 4 API endpoints |

### Backend – File đã chỉnh sửa
| File | Thay đổi |
|---|---|
| `Models/User.cs` | Thêm `ICollection<UserSkill> userSkills` |
| `Models/Skill.cs` | Thêm `ICollection<UserSkill> userSkills` |
| `Data/AppDbContext.cs` | Thêm `DbSet<UserSkill>` + cấu hình composite key và relations |
| `DTOs/ProfileDto.cs` | Thêm `List<UserSkillResponse>? Skills` vào `UserProfileResponse` |
| `Mappings/AutoMapperProfile.cs` | Thêm mapping `userSkills → Skills` trong `User → UserProfileResponse` |
| `Repositories/ProfileRepository.cs` | Thêm `.Include(u => u.userSkills).ThenInclude(us => us.skill)` |
| `Program.cs` | Đăng ký DI `IUserSkillRepository` và `IUserSkillService` |

### Frontend – File mới tạo
| File | Mô tả |
|---|---|
| `services/userSkillService.ts` | API calls cho UserSkill (getMySkills, addSkill, removeSkill, getJobSuggestions) |
| `components/common/Clients/SkillsSection.tsx` | Component hiển thị/thêm/xóa kỹ năng (tag + modal) |
| `components/common/Clients/JobSuggestions.tsx` | Component hiển thị danh sách job gợi ý (match score, matched skills) |

### Frontend – File đã chỉnh sửa
| File | Thay đổi |
|---|---|
| `types/profile.ts` | Thêm `UserSkillResponse`, `JobSuggestionResponse`; cập nhật `UserProfileResponse` |
| `services/skillService.ts` | Thêm `getAll()` endpoint public (GET /api/Skill) |
| `pages/client/MyProfilePage.tsx` | Import và tích hợp `SkillsSection` + `JobSuggestions` vào cột phải cho Candidate |

---

## API ENDPOINTS (Backend)

| Method | Route | Mô tả | Auth |
|---|---|---|---|
| GET | `/api/UserSkill` | Lấy kỹ năng của user hiện tại | ✅ Cần token |
| POST | `/api/UserSkill/{skillId}` | Thêm kỹ năng | ✅ Cần token |
| DELETE | `/api/UserSkill/{skillId}` | Xóa kỹ năng | ✅ Cần token |
| GET | `/api/UserSkill/suggestions` | Gợi ý công việc theo kỹ năng | ✅ Cần token |

- **Job Suggestion Algorithm**: Dùng SQL JOIN thuần túy (không ML), đơn giản và hiệu quả:
  - `Job` → `JobSkill` → `Skill` → `UserSkill` (where `userId = currentUser`)
  - Chỉ lấy jobs có `status = Open` và `deadline > DateTime.Now`
  - Group by JobId, đếm số skill trùng, order by số skill trùng DESC
  - Giới hạn trả về tối đa 10-20 công việc

- **Không trùng job đã ứng tuyển**: Tùy chọn lọc ra các job user đã apply rồi.

- **Validation**: Khi thêm kỹ năng, kiểm tra `skillId` có tồn tại trong bảng `Skill` không.

- **Performance**: Nên eager load `UserSkills.Skill` khi truy vấn profile để tránh N+1.

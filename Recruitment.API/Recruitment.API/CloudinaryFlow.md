# Luồng sử dụng Cloudinary trong Recruitment API

## 1. Cài đặt

```bash
dotnet add package CloudinaryDotNet
```

Thêm vào `appsettings.json`:
```json
"Cloudinary": {
  "CloudName": "your_cloud_name",
  "ApiKey": "your_api_key",
  "ApiSecret": "your_api_secret"
}
```

---

## 2. Đăng ký DI trong `Program.cs`

```csharp
// Đọc config Cloudinary
var cloudinaryConfig = builder.Configuration.GetSection("Cloudinary");
var account = new Account(
    cloudinaryConfig["CloudName"],
    cloudinaryConfig["ApiKey"],
    cloudinaryConfig["ApiSecret"]
);
var cloudinary = new Cloudinary(account);
builder.Services.AddSingleton(cloudinary);
```

---

## 3. Luồng Upload ảnh (Avatar / Logo công ty / Ảnh tin tuyển dụng)

```
Client (Frontend)
    │
    │  POST /api/profile/avatar  (multipart/form-data, field: "file")
    ▼
Controller
    │  Nhận IFormFile từ request
    ▼
Service
    │  1. Validate file (kiểm tra định dạng: jpg/png/webp, kích thước < 5MB)
    │  2. Mở stream từ IFormFile
    │  3. Tạo ImageUploadParams:
    │       - Folder: "recruitment/avatars" (hoặc "recruitment/logos", "recruitment/jobs")
    │       - PublicId: $"user_{userId}_{timestamp}"
    │       - Transformation: crop/resize nếu cần
    │  4. Gọi cloudinary.UploadAsync(params)
    │  5. Lấy SecureUrl từ kết quả trả về
    │  6. Lưu URL vào DB (user.AvatarUrl / company.logoUrl / job.imagePath)
    ▼
Trả về URL ảnh cho client
```

### Code mẫu trong Service:
```csharp
public async Task<string> UploadImageAsync(IFormFile file, string folder, string publicId)
{
    using var stream = file.OpenReadStream();
    var uploadParams = new ImageUploadParams
    {
        File = new FileDescription(file.FileName, stream),
        Folder = folder,
        PublicId = publicId,
        Overwrite = true,
        Transformation = new Transformation().Width(500).Height(500).Crop("fill")
    };

    var result = await _cloudinary.UploadAsync(uploadParams);

    if (result.Error != null)
        throw new Exception($"Upload thất bại: {result.Error.Message}");

    return result.SecureUrl.ToString();
}
```

---

## 4. Luồng Upload CV (PDF)

```
Client
    │  POST /api/application/apply  (multipart/form-data, field: "cvFile")
    ▼
Controller → Service
    │  1. Validate: chỉ chấp nhận .pdf, kích thước < 10MB
    │  2. Dùng RawUploadParams thay vì ImageUploadParams
    │  3. Folder: "recruitment/cvs"
    │  4. Lưu URL vào application.cvUrl
    ▼
Trả về URL CV
```

### Code mẫu:
```csharp
var uploadParams = new RawUploadParams
{
    File = new FileDescription(file.FileName, file.OpenReadStream()),
    Folder = "recruitment/cvs",
    PublicId = $"cv_{userId}_{DateTime.UtcNow.Ticks}"
};
var result = await _cloudinary.UploadAsync(uploadParams);
```

---

## 5. Luồng Xóa ảnh cũ (khi cập nhật)

Khi user cập nhật avatar/logo mới, cần xóa ảnh cũ để tránh tốn dung lượng Cloudinary:

```csharp
// Lấy PublicId từ URL cũ
// URL dạng: https://res.cloudinary.com/{cloud}/image/upload/v123/{folder}/{publicId}.jpg
// PublicId = "{folder}/{publicId}"

var deletionParams = new DeletionParams(publicId);
var result = await _cloudinary.DestroyAsync(deletionParams);
```

---

## 6. Các folder tổ chức trên Cloudinary

| Folder                  | Dùng cho              |
|-------------------------|-----------------------|
| `recruitment/avatars`   | Avatar người dùng     |
| `recruitment/logos`     | Logo công ty          |
| `recruitment/jobs`      | Ảnh tin tuyển dụng    |
| `recruitment/cvs`       | File CV (PDF)         |

---

## 7. Lưu ý bảo mật

- **Không** lưu `ApiSecret` trong code, chỉ đọc từ `appsettings` hoặc biến môi trường.
- Validate định dạng và kích thước file **trước** khi gọi Cloudinary.
- Dùng `SecureUrl` (https) thay vì `Url` (http) khi lưu vào DB.
- Đặt `Overwrite = true` khi update ảnh theo PublicId cố định (avatar user), tránh tạo file thừa.

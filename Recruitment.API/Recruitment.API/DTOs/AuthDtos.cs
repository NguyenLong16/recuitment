namespace Recruitment.API.DTOs
{
    public class RegisterRequest
    {
        public string fullName { get; set; }
        public string email { get; set; }
        public string phoneNumber { get; set; }
        public string password { get; set; }
        public int roleId { get; set; }
    }

    public class LoginRequest
    {
        public string email { get; set; }
        public string password { get; set; }
    }

    public class AuthResponse
    {
        public string token { get; set; }
        public string fullName { get; set; }
        public string role { get; set; }
    }
}

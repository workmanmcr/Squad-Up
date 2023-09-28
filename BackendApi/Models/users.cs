using System;
using System.ComponentModel.DataAnnotations;

namespace BackendApi.Models
{
    public class UserUpdateRequest
    {
        public string Name { get; set; }
        public string City { get; set; }
        public string Website { get; set; }
        public string ProfilePic { get; set; }
        public string CoverPic { get; set; }
    }

    public class UserResponse
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string City { get; set; }
        public string Website { get; set; }
        public string ProfilePic { get; set; }
        public string CoverPic { get; set; }
        // You may add other user-related properties here
    }
}

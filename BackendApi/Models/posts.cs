using System;
using System.ComponentModel.DataAnnotations;

namespace BackendApi.Models
{
    public class PostRequest
    {
        [Required]
        public string Desc { get; set; }

        public string Img { get; set; }
    }

    public class PostResponse
    {
        public int Id { get; set; }
        public string Desc { get; set; }
        public string Img { get; set; }
        public DateTime CreatedAt { get; set; }
        public string UserId { get; set; }
        public string Name { get; set; }
        public string ProfilePic { get; set; }
    }
}

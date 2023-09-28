using System;
using System.ComponentModel.DataAnnotations;

namespace BackendApi.Models
{
    public class CommentRequest
    {
        [Required]
        public string Desc { get; set; }

        public int PostId { get; set; }
    }

    public class CommentResponse
    {
        public int Id { get; set; }
        public string Desc { get; set; }
        public DateTime CreatedAt { get; set; }
        public string UserId { get; set; }
        public string Name { get; set; }
        public string ProfilePic { get; set; }
    }
}

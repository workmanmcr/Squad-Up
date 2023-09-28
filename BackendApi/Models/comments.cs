using System;
using System.ComponentModel.DataAnnotations;

namespace BackendApi.Models
{
    public class Comment
    {
        public int Id { get; set; }
        public string Desc { get; set; }
        public DateTime CreatedAt { get; set; }
        public string UserId { get; set; }
        public string Name { get; set; }
        public string ProfilePic { get; set; }
    }

    public class Comments
    {
        [Required]
        public string Desc { get; set; }

        [Required]
        public int PostId { get; set; }
    }
}

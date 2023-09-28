using System;
using System.ComponentModel.DataAnnotations;

namespace BackendApi.Models
{
    public class StoryRequest
    {
        [Required]
        public string Img { get; set; }
    }

    public class StoryResponse
    {
        public int Id { get; set; }
        public string Img { get; set; }
        public DateTime CreatedAt { get; set; }
        public string UserId { get; set; }
        public string Name { get; set; }
    }
}

using System;
using System.ComponentModel.DataAnnotations;

namespace BackendApi.Models
{
    public class LikeRequest
    {
        [Required]
        public int PostId { get; set; }
    }
}

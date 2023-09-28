using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Data.SqlClient;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Threading.Tasks;
using System.Security.Claims;
using BackendApi.Models;
using System.Data;
using Dapper;
using System.Linq;
using MySqlConnector;

namespace BackendApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LikesController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public LikesController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet]
        public async Task<IActionResult> GetLikes([FromQuery] int postId)
        {
            using (var connection = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                var query = "SELECT userId FROM likes WHERE postId = @postId";

                var likes = await connection.QueryAsync<int>(query, new { postId });

                if (likes != null)
                {
                    return Ok(likes);
                }

                return NoContent();
            }
        }

        [HttpPost]
        public async Task<IActionResult> AddLike([FromBody] LikeRequest likeRequest)
        {
            var token = Request.Cookies["accessToken"];
            if (token == null)
            {
                return Unauthorized("Not logged in!");
            }

            try
            {
                var handler = new JwtSecurityTokenHandler();
                var jwtToken = handler.ReadJwtToken(token);

                if (jwtToken != null && jwtToken.ValidTo > DateTime.Now)
                {
                    var userId = jwtToken.Claims.First(claim => claim.Type == ClaimTypes.NameIdentifier).Value;

                    using (var connection = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                    {
                        var query = "INSERT INTO likes (userId, postId) VALUES (@UserId, @PostId)";

                        var parameters = new
                        {
                            UserId = userId,
                            PostId = likeRequest.PostId
                        };

                        await connection.ExecuteAsync(query, parameters);

                        return Ok("Post has been liked.");
                    }
                }
                else
                {
                    return Unauthorized("Token is not valid!");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteLike([FromQuery] int postId)
        {
            var token = Request.Cookies["accessToken"];
            if (token == null)
            {
                return Unauthorized("Not logged in!");
            }

            try
            {
                var handler = new JwtSecurityTokenHandler();
                var jwtToken = handler.ReadJwtToken(token);

                if (jwtToken != null && jwtToken.ValidTo > DateTime.Now)
                {
                    var userId = jwtToken.Claims.First(claim => claim.Type == ClaimTypes.NameIdentifier).Value;

                    using (var connection = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                    {
                        var query = "DELETE FROM likes WHERE userId = @UserId AND postId = @PostId";

                        var parameters = new
                        {
                            UserId = userId,
                            PostId = postId
                        };

                        var affectedRows = await connection.ExecuteAsync(query, parameters);

                        if (affectedRows > 0)
                        {
                            return Ok("Post has been disliked.");
                        }
                        else
                        {
                            return NotFound("Like not found!");
                        }
                    }
                }
                else
                {
                    return Unauthorized("Token is not valid!");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}

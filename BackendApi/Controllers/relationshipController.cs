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
    public class CommentsController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public CommentsController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet]
        public async Task<IActionResult> GetComments([FromQuery] int postId)
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
                    using (var connection = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                    {
                        var query = "SELECT c.*, u.id AS userId, name, profilePic FROM comments AS c JOIN users AS u ON (u.id = c.userId) WHERE c.postId = @PostId ORDER BY c.createdAt DESC";

                        var parameters = new
                        {
                            PostId = postId
                        };

                        var comments = await connection.QueryAsync<CommentResponse>(query, parameters);

                        if (comments != null)
                        {
                            return Ok(comments);
                        }
                        else
                        {
                            return NoContent();
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

        [HttpPost]
        public async Task<IActionResult> AddComment([FromBody] CommentRequest commentRequest)
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
                        var query = "INSERT INTO comments([desc], createdAt, userId, postId) VALUES (@Description, @CreatedAt, @UserId, @PostId)";

                        var parameters = new
                        {
                            Description = commentRequest.Desc,
                            CreatedAt = DateTime.Now,
                            UserId = userId,
                            PostId = commentRequest.PostId
                        };

                        await connection.ExecuteAsync(query, parameters);

                        return Ok("Comment has been created.");
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

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteComment([FromRoute] int id)
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
                        var query = "DELETE FROM comments WHERE id = @Id AND userId = @UserId";

                        var parameters = new
                        {
                            Id = id,
                            UserId = userId
                        };

                        var affectedRows = await connection.ExecuteAsync(query, parameters);

                        if (affectedRows > 0)
                        {
                            return Ok("Comment has been deleted.");
                        }
                        else
                        {
                            return NotFound("You can delete only your comment.");
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

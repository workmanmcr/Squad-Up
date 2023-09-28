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
    public class StoriesController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public StoriesController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet]
        public async Task<IActionResult> GetStories()
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
                        var query = @"SELECT s.*, name FROM stories AS s JOIN users AS u ON (u.id = s.userId)
                                      LEFT JOIN relationships AS r ON (s.userId = r.followedUserId AND r.followerUserId = @UserId) LIMIT 4";

                        var parameters = new
                        {
                            UserId = jwtToken.Claims.First(claim => claim.Type == ClaimTypes.NameIdentifier).Value
                        };

                        var stories = await connection.QueryAsync<StoryResponse>(query, parameters);

                        if (stories != null)
                        {
                            return Ok(stories);
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
        public async Task<IActionResult> AddStory([FromBody] StoryRequest storyRequest)
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
                        var query = "INSERT INTO stories(img, createdAt, userId) VALUES (@Img, @CreatedAt, @UserId)";

                        var parameters = new
                        {
                            Img = storyRequest.Img,
                            CreatedAt = DateTime.Now,
                            UserId = userId
                        };

                        await connection.ExecuteAsync(query, parameters);

                        return Ok("Story has been created.");
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
        public async Task<IActionResult> DeleteStory([FromRoute] int id)
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
                        var query = "DELETE FROM stories WHERE id = @Id AND userId = @UserId";

                        var parameters = new
                        {
                            Id = id,
                            UserId = userId
                        };

                        var affectedRows = await connection.ExecuteAsync(query, parameters);

                        if (affectedRows > 0)
                        {
                            return Ok("Story has been deleted.");
                        }
                        else
                        {
                            return NotFound("You can delete only your story.");
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

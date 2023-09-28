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
    public class UsersController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public UsersController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetUser([FromRoute] int userId)
        {
            try
            {
                using (var connection = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    var query = "SELECT * FROM users WHERE id = @UserId";

                    var parameters = new
                    {
                        UserId = userId
                    };

                    var user = await connection.QuerySingleOrDefaultAsync<UserResponse>(query, parameters);

                    if (user != null)
                    {
                        // Remove sensitive information like password before returning
                        user.Password = null;
                        return Ok(user);
                    }
                    else
                    {
                        return NotFound("User not found.");
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut]
        public async Task<IActionResult> UpdateUser([FromBody] UserUpdateRequest userUpdateRequest)
        {
            var token = Request.Cookies["accessToken"];
            if (token == null)
            {
                return Unauthorized("Not authenticated!");
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
                        var query = "UPDATE users SET [name] = @Name, city = @City, website = @Website, profilePic = @ProfilePic, coverPic = @CoverPic WHERE id = @UserId";

                        var parameters = new
                        {
                            Name = userUpdateRequest.Name,
                            City = userUpdateRequest.City,
                            Website = userUpdateRequest.Website,
                            ProfilePic = userUpdateRequest.ProfilePic,
                            CoverPic = userUpdateRequest.CoverPic,
                            UserId = userId
                        };

                        var affectedRows = await connection.ExecuteAsync(query, parameters);

                        if (affectedRows > 0)
                        {
                            return Ok("Updated!");
                        }
                        else
                        {
                            return NotFound("You can update only your profile.");
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

using backend.Interfaces;
using backend.Models;
using backend.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Login.Controllers
{
    [Route("api/authentication")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private IUser service;
        private IAutorizacionService authService;
        private IUser uservice;
        public AuthController(IUser _service, IAutorizacionService _authService, IUser _uservice)
        {
            authService = _authService;
            service = _service;
            uservice = _uservice;
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] AutorizacionRequest request)
        {
            var result = await authService.DevolverToken(request);
            if (result == null)
            {
                return Unauthorized();
            }
            return Ok(result);
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User user)
        {
            try
            {
                SaveResult postResult = await uservice.Save(user);
                if (postResult.Result)
                {
                    AutorizacionRequest auth = new AutorizacionRequest()
                    {
                        Username = user.Username,
                        Password = user.Password
                    };
                    var generateToken = await authService.DevolverToken(auth);

                    return Ok(generateToken);
                }
                return BadRequest(postResult);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.ToString());
            }
        }
    }
}

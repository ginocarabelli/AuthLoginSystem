using backend.Interfaces;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Login.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private IUser service;
        public UserController(IUser _service)
        {
            service = _service;
        }
        [HttpGet("username/{username}")]
        public IActionResult GetByUsername(string username)
        {
            try
            {
                User u = service.GetByUsername(username);
                if (u != null)
                {
                    return Ok(u);
                }
                else
                {
                    return NotFound("This user doesn't exists");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        [Authorize]
        [HttpGet("credentials")]
        public IActionResult GetByCredentials([FromBody] AutorizacionRequest credentials)
        {
            try
            {
                User u = service.GetByCredentials(credentials.Username, credentials.Password);
                if(u != null)
                {
                    return Ok(u);
                } else
                {
                    return NotFound("This user doesn't exists");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        [Authorize]
        [HttpGet("id/{id}")]
        public IActionResult GetById(int id)
        {
            try
            {
                User u = service.GetById(id);
                if (u != null)
                {
                    return Ok(u);
                }
                else
                {
                    return NotFound("This user doesn't exists");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] User u)
        {
            try
            {
                SaveResult result = await service.Update(id, u);
                if (result.Result)
                {
                    return Ok(result.Message);
                } else
                {
                    return BadRequest(result.Message);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                SaveResult result = await service.Delete(id);
                if (result.Result)
                {
                    return Ok(result.Message);
                }
                else
                {
                    return BadRequest(result.Message);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}

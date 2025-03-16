using backend.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using backend.Models;

namespace backend.Repositories
{
    public class AutorizacionService : IAutorizacionService
    {
        private readonly IUser _service;
        private readonly IConfiguration _configuration;
        public AutorizacionService(IUser service, IConfiguration configuration)
        {
            _service = service;
            _configuration = configuration;
        }
        private string GenerarToken(string id)
        {
            User user = _service.GetById(Convert.ToInt32(id));

            var key = _configuration.GetSection("Jwt")["Key"];
            var keyBytes = Encoding.ASCII.GetBytes(key);

            var claims = new ClaimsIdentity();
            claims.AddClaim(new Claim(ClaimTypes.NameIdentifier, id));
            claims.AddClaim(new Claim(ClaimTypes.Email, user.Email));
            claims.AddClaim(new Claim(ClaimTypes.Name, user.Name + " " + user.LastName));

            var credencialesToken = new SigningCredentials(
                new SymmetricSecurityKey(keyBytes),
                SecurityAlgorithms.HmacSha256Signature
            );

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = claims,
                Expires = DateTime.UtcNow.AddHours(2),
                SigningCredentials = credencialesToken,
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenConfig = tokenHandler.CreateToken(tokenDescriptor);

            string createdToken = tokenHandler.WriteToken(tokenConfig);

            return createdToken;
        }
        public async Task<AutorizacionResponse> DevolverToken(AutorizacionRequest autorizacion)
        {
            var foundUser = _service.GetByCredentials(autorizacion.Username, autorizacion.Password);

            if (foundUser == null)
            {
                return await Task.FromResult<AutorizacionResponse>(null);
            }

            string tokenCreado = GenerarToken(foundUser.Id.ToString());

            return new AutorizacionResponse { Token = tokenCreado, Result = true, Msg = "Ok" };
        }
    }
}

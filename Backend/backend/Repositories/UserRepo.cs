using backend.Utils;
using backend.Interfaces;
using backend.Models;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Net.Mime.MediaTypeNames;

namespace backend.Repositories
{
    public class UserRepo : IUser
    {
        private DataHelper helper;
        public UserRepo() 
        {
            helper = DataHelper.GetInstance();
        }
        public async Task<SaveResult> Delete(int id)
        {
            try
            {
                List<SqlParameter> parameters = new List<SqlParameter>();
                parameters.Add(new SqlParameter("@id", id));
                int affectedRows = await helper.ExecuteSPCrudQuery("sp_delete_user", parameters);
                if (affectedRows > 0)
                {
                    return new SaveResult() { Result = true, Message = "User deleted successfully" };
                }
                return new SaveResult() { Result = true, Message = "Error deleting user" };

            }
            catch (Exception ex)
            {
                return new SaveResult() { Result = false, Message = ex.Message };
            }
        }

        public User GetById(int id)
        {
            List<SqlParameter> parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@id", id));
            DataTable t = helper.ExecuteSPQuery("sp_user_by_id", parameters);
            if (t.Rows.Count > 0)
            {
                DataRow dr = t.Rows[0];
                return new User()
                {
                    Id = (int)dr[0],
                    Name = (string)dr[1],
                    LastName = (string)dr[2],
                    Username = (string)dr[3],
                    Email = (string)dr[4],
                    Password = (string)dr[5],
                    Image = dr[6] == DBNull.Value ? null : (string)dr[6],
                    IdProvider = dr[7] == DBNull.Value ? null : (string)dr[7]
                };
            }
            else
            {
                return null;
            }
        }
        public User GetByUsername(string username)
        {
            List<SqlParameter> parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@username", username));
            DataTable t = helper.ExecuteSPQuery("sp_user_by_username", parameters);
            if (t.Rows.Count > 0)
            {
                DataRow dr = t.Rows[0];
                return new User()
                {
                    Id = (int)dr[0],
                    Name = (string)dr[1],
                    LastName = (string)dr[2],
                    Username = (string)dr[3],
                    Email = (string)dr[4],
                    Password = (string)dr[5],
                    Image = dr[6] == DBNull.Value ? null : (string)dr[6],
                    IdProvider = dr[7] == DBNull.Value ? null : (string)dr[7]
                };
            }
            else
            {
                return null;
            }
        }
        public User GetByCredentials(string username, string password)
        {
            List<SqlParameter> parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@username", username));
            parameters.Add(new SqlParameter("@password", password));
            DataTable t = helper.ExecuteSPQuery("sp_user_by_credentials", parameters);
            if(t.Rows.Count > 0)
            {
                DataRow dr = t.Rows[0];
                return new User()
                {
                    Id = (int)dr[0],
                    Name = (string)dr[1],
                    LastName = (string)dr[2],
                    Username = (string)dr[3],
                    Email = (string)dr[4],
                    Password = (string)dr[5],
                    Image = dr[6] == DBNull.Value ? null : (string)dr[6],
                    IdProvider = dr[7] == DBNull.Value ? null : (string)dr[7]
                };
            } else
            {
                return null;
            }
        }

        public async Task<SaveResult> Save(User u)
        {
            try
            {
                List<SqlParameter> parameters = new List<SqlParameter>();
                parameters.Add(new SqlParameter("@name", u.Name));
                parameters.Add(new SqlParameter("@lastname", u.LastName));
                parameters.Add(new SqlParameter("@username", u.Username));
                parameters.Add(new SqlParameter("@email", u.Email));
                parameters.Add(new SqlParameter("@password", u.Password));
                parameters.Add(new SqlParameter("@image", u.Image));
                parameters.Add(new SqlParameter("@id_provider", u.IdProvider));
                int affectedRows = await helper.ExecuteSPCrudQuery("sp_insert_user", parameters);
                if (affectedRows == -1)
                {
                    return new SaveResult() { Result = false, Message = "This username already exists" };

                } else if (affectedRows == -2)
                {
                    return new SaveResult() { Result = false, Message = "This email already exists" };
                } else if (affectedRows == 1)
                {
                    return new SaveResult() { Result = true, Message = "User created successfully" };
                } 
                else return new SaveResult() { Result = false, Message = "Error creating User" };
            }
            catch (Exception ex)
            {
                return new SaveResult() { Result = false, Message = ex.Message };
            }
        }

        public async Task<SaveResult> Update(int id, User u)
        {
            try
            {
                List<SqlParameter> parameters = new List<SqlParameter>();
                parameters.Add(new SqlParameter("@id", id));
                parameters.Add(new SqlParameter("@name", u.Name));
                parameters.Add(new SqlParameter("@lastname", u.LastName));
                parameters.Add(new SqlParameter("@username", u.Username));
                parameters.Add(new SqlParameter("@email", u.Email));
                parameters.Add(new SqlParameter("@password", u.Password));
                parameters.Add(new SqlParameter("@image", u.Image));
                int affectedRows = await helper.ExecuteSPCrudQuery("sp_update_user", parameters);
                if (affectedRows > 0)
                {
                    return new SaveResult() { Result = true, Message = "User updated successfully" };
                }
                else return new SaveResult() { Result = false, Message = "Error editing user" };
            }
            catch (Exception ex)
            {
                return new SaveResult() { Result = false, Message = ex.Message };
            }
        }
    }
}

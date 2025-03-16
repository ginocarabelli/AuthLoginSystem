using backend.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace backend.Interfaces
{
    public interface IUser
    {
        public Task<SaveResult> Save(User u);
        public Task<SaveResult> Update(int id, User u);
        public Task<SaveResult> Delete(int id);
        public User GetById(int id);
        public User GetByUsername(string username);
        public User GetByCredentials(string username, string password);

    }
}

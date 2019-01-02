using Npgsql;
using System;
using System.Data;

namespace TvShowReminder.DataSource
{
    public class DbConnectionHelper : IDbConnectionHelper
    {
        private readonly string _connectionString;

        public DbConnectionHelper(string connectionString)
        {
            _connectionString = connectionString;
        }

        public void Open(Action<IDbConnection> action)
        {
            using (var connection = new NpgsqlConnection(_connectionString))
            {
                connection.Open();

                action(connection);
            }
        }

        public T Open<T>(Func<IDbConnection, T> action)
        {
            using (var connection = new NpgsqlConnection(_connectionString))
            {
                connection.Open();

                return action(connection);
            }
        }
    }
}

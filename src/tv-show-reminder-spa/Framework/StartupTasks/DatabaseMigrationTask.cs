using Autofac;
using Microsoft.Extensions.Logging;
using TvShowReminder.DatabaseMigrations;

namespace TvShowReminder.Framework.StartupTasks
{
    public class DatabaseMigrationTask : IStartable
    {
        private readonly ISqlDatabaseMigrator _sqlDatabaseMigrator;
        private readonly ILogger _logger;

        public DatabaseMigrationTask(ISqlDatabaseMigrator sqlDatabaseMigrator, ILogger<DatabaseMigrationTask> logger)
        {
            _sqlDatabaseMigrator = sqlDatabaseMigrator;
            _logger = logger;
        }

        public void Start()
        {
            _logger.LogInformation("Running database migration");
            _sqlDatabaseMigrator.MigrateToLatest();
            _logger.LogInformation("Database migration completed");
        }
    }
}
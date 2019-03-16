using Autofac;
using Microsoft.Extensions.Configuration;
using TvShowReminder.DatabaseMigrations;
using TvShowReminder.DataSource;

namespace TvShowReminder.Framework.Dependencies
{
    public class DataSourceModule : Module
    {
        private IConfiguration configuration;

        public DataSourceModule(IConfiguration configuration)
        {
            this.configuration = configuration;
        }

        protected override void Load(ContainerBuilder builder)
        {
            string connectionString = configuration.GetConnectionString("DefaultConnection");
            builder.Register(c => new DbConnectionHelper(connectionString)).As<IDbConnectionHelper>();
            builder.Register(c => new SqlDatabaseMigrator(connectionString)).As<ISqlDatabaseMigrator>();
            builder.RegisterType<SubscriptionCommandDataSource>().As<ISubscriptionCommandDataSource>();
            builder.RegisterType<SubscriptionQueryDataSource>().As<ISubscriptionQueryDataSource>();
            builder.RegisterType<EpisodeCommandDataSource>().As<IEpisodeCommandDataSource>();
            builder.RegisterType<EpisodesQueryDataSource>().As<IEpisodesQueryDataSource>();
        }
    }
}
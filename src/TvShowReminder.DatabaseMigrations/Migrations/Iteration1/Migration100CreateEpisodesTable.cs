using FluentMigrator;
using FluentMigrator.Runner.Extensions;

namespace TvShowReminder.DatabaseMigrations.Migrations.Iteration1
{
    [Migration(101)]
    public class Migration100CreateEpisodesTable : Migration
    {
        private const string TableName = "episodes";

        public override void Up()
        {
            Create.Table(TableName)
                .WithColumn("id").AsInt32().Identity()
                .WithColumn("subscriptionid").AsInt32()
                .WithColumn("seasonnumber").AsInt32()
                .WithColumn("episodenumber").AsInt32()
                .WithColumn("title").AsString(255)
                .WithColumn("airdate").AsDate();

            Create.PrimaryKey(string.Format("pk_{0}", TableName))
                .OnTable(TableName)
                .Column("id");
        }

        public override void Down()
        {
            Delete.Table(TableName);
        }
    }
}
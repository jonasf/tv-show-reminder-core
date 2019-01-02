using FluentMigrator;
using FluentMigrator.Runner.Extensions;

namespace TvShowReminder.DatabaseMigrations.Migrations.Iteration1
{
    [Migration(100)]
    public class Migration100CreateSubscriptionTable : Migration
    {
        private const string TableName = "subscription";

        public override void Up()
        {
            Create.Table(TableName)
                .WithColumn("id").AsInt32().Identity()
                .WithColumn("tvshowid").AsInt32()
                .WithColumn("tvshowname").AsString(255)
                .WithColumn("lastairdate").AsDate();

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